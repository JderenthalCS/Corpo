import os
import json
import re
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from supabase import create_client, Client
import fitz  # PyMuPDF
import tempfile


from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.get("/test-gemini")
def test_gemini():
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello in one sentence"
    )
    return {"response": response.text}

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)


@app.get("/")
def root():
    return {"message": "Corpo backend running"}

def extract_money_after_label(label: str, text: str):
    pattern = rf"{label}.*?\$([\d,]+\.\d+)"
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)

    if match:
        return float(match.group(1).replace(",", ""))

    return None

@app.post("/analyze/{report_id}")
def analyze_report(report_id: str):
    report_response = (
        supabase.table("reports")
        .select("*, documents(*)")
        .eq("id", report_id)
        .single()
        .execute()
    )

    report = report_response.data

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    document = report.get("documents")

    if not document:
        raise HTTPException(status_code=404, detail="Linked document not found")

    file_path = document["file_path"]

    file_response = supabase.storage.from_("documents").download(file_path)

    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_response)
        tmp_path = tmp.name

    # Extract text from PDF
    doc = fitz.open(tmp_path)
    file_text = ""

    for page in doc:
        file_text += page.get_text()

    doc.close()

    prompt = f"""
You are Corpo, an AI corporate translator.

Analyze this document for a normal everyday user before they sign it.

Return ONLY valid JSON in this exact shape:

{{
  "summary": "plain English summary",
  "predatory_score": 0,
  "risk_level": "Low",
  "green_flags": ["item"],
  "yellow_flags": ["item"],
  "red_flags": ["item"],
  "financial_impact": {{
    "base_cost": 0,
    "monthly_payment": 0,
    "term_months": 0,
    "total_paid": 0,
    "total_interest": 0,
    "fees": 0,
    "penalties": 0,
    "risk_exposure": 0
  }}
}}

Rules:
- predatory_score must be 0 to 100
- risk_level must be Low, Medium, or High
- Explain risks simply.
- Focus on hidden fees, penalties, cancellation terms, renewal clauses, liability, and unfair obligations.
- For loans, base_cost MUST be the original loan amount/principal only.
- monthly_payment MUST be the stated monthly payment.
- term_months MUST be the loan term in months.
- total_paid MUST equal monthly_payment * term_months when both are available.
- total_interest MUST equal total_paid - base_cost.
- fees should include known upfront/discretionary fees.
- penalties should include stated penalty amounts when calculable.
- risk_exposure should estimate additional possible risk beyond normal repayment, not replace interest.
- Do NOT put total_paid into base_cost.
- Do NOT put risk_exposure into total_interest.
- If a number is unclear, use 0.
- For mortgages, total_interest MUST come from:
  "Finance Charge" if present in the document.

- total_paid MUST come from:
  "Total of Payments" if present.

- Do NOT calculate using monthly payment if escrow, taxes, or insurance are included.

Document:
{file_text[:30000]}
"""

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()

    if raw_text.startswith("```json"):
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
    elif raw_text.startswith("```"):
        raw_text = raw_text.replace("```", "").strip()

    try:
        analysis = json.loads(raw_text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini returned invalid JSON: {raw_text}",
        )
        
    total_paid_from_doc = extract_money_after_label("Total of Payments", file_text)
    finance_charge_from_doc = extract_money_after_label("Finance Charge", file_text)
    amount_financed_from_doc = extract_money_after_label("Amount Financed", file_text)

    if "financial_impact" not in analysis:
        analysis["financial_impact"] = {}

    if amount_financed_from_doc is not None:
        analysis["financial_impact"]["base_cost"] = amount_financed_from_doc

    if total_paid_from_doc is not None:
        analysis["financial_impact"]["total_paid"] = total_paid_from_doc

    if finance_charge_from_doc is not None:
        analysis["financial_impact"]["total_interest"] = finance_charge_from_doc    

    supabase.table("reports").update(
        {
            "summary": analysis["summary"],
            "predatory_score": analysis["predatory_score"],
            "risk_level": analysis["risk_level"],
            "green_flags": analysis["green_flags"],
            "yellow_flags": analysis["yellow_flags"],
            "red_flags": analysis["red_flags"],
            "financial_impact": analysis["financial_impact"],
        }
    ).eq("id", report_id).execute()

    return analysis