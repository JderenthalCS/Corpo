import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, ShieldCheck, Sparkles, Clock } from "lucide-react";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleFile(file) {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please choose a file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setStep("Checking account...");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must be logged in to upload a document.");
      setUploading(false);
      setStep("");
      return;
    }

    const documentId = crypto.randomUUID();
    const filePath = `${user.id}/${documentId}/${selectedFile.name}`;

    setStep("Uploading document...");

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, selectedFile);

    if (storageError) {
      setMessage(storageError.message);
      setUploading(false);
      setStep("");
      return;
    }

    setStep("Creating report...");

    const { error: dbError } = await supabase
      .from("documents")
      .insert({
        id: documentId,
        user_id: user.id,
        file_name: selectedFile.name,
        file_path: filePath,
        file_type: selectedFile.type,
      });

    if (dbError) {
      setMessage(dbError.message);
      setUploading(false);
      setStep("");
      return;
    }

    const { data: insertedReport, error: reportError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        document_id: documentId,
        title: selectedFile.name,
        summary: "Analyzing document...",
        predatory_score: 0,
        risk_level: "Low",
        green_flags: [],
        yellow_flags: ["AI analysis in progress."],
        red_flags: [],
        financial_impact: {
          base_cost: 0,
          monthly_payment: 0,
          term_months: 0,
          total_paid: 0,
          total_interest: 0,
          fees: 0,
          penalties: 0,
          risk_exposure: 0,
        },
      })
      .select()
      .single();

    if (reportError) {
      setMessage(reportError.message);
      setUploading(false);
      setStep("");
      return;
    }

    setStep("Analyzing with AI...");

    const analyzeResponse = await fetch(
      `http://localhost:8000/analyze/${insertedReport.id}`,
      { method: "POST" }
    );

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json();
      setMessage(errorData.detail || "Document uploaded, but AI analysis failed.");
      setUploading(false);
      setStep("");
      return;
    }

    setStep("Analysis complete. Redirecting...");
    setSelectedFile(null);

    setTimeout(() => {
      navigate("/reports");
    }, 600);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Workspace Intake
        </p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Upload a document.
              <br />
              Get the real story.
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-[var(--text-muted)]">
              Add a lease, contract, agreement, or disclosure. Corpo will extract
              the text, analyze the risk, and build a plain-English report with
              financial insights.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--text-muted)]">
            <p className="font-semibold text-[var(--text)]">Supported files</p>
            <p className="mt-1">PDF, DOC, DOCX, TXT</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current.click()}
          className={`relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition ${
            isDragging
              ? "scale-[1.01] border-[var(--accent)] bg-[var(--surface-strong)]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent-hover)] hover:bg-[var(--surface-strong)]"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(event) => handleFile(event.target.files[0])}
          />

          <div className="mb-5 rounded-2xl bg-[var(--bg)] p-5 text-[var(--accent)]">
            {uploading ? (
              <Sparkles className="h-10 w-10 animate-pulse" />
            ) : (
              <UploadCloud className="h-10 w-10" />
            )}
          </div>

          <h2 className="text-2xl font-bold">
            {uploading ? "Working on your report..." : "Drop your file here"}
          </h2>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {uploading ? step : "or click to browse from your computer"}
          </p>

          {selectedFile && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-left">
              <FileText className="h-5 w-5 text-[var(--accent)]" />
              <div>
                <p className="font-semibold text-[var(--text)]">{selectedFile.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {uploading && (
            <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-[var(--surface-strong)]">
              <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] bg-[var(--accent)]" />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Private workflow"
            text="Reports are tied to your account and stored for later review."
          />
          <InfoCard
            icon={<Sparkles className="h-5 w-5" />}
            title="AI analysis"
            text="Corpo checks risk flags, plain-English meaning, and financial impact."
          />
          <InfoCard
            icon={<Clock className="h-5 w-5" />}
            title="Short wait"
            text="Analysis usually takes a moment. The report unlocks when complete."
          />
        </aside>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--bg)] hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Analyzing..." : "Analyze Document"}
        </button>

        {message && (
          <p className="rounded-xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-3 inline-flex rounded-xl bg-[var(--bg)] p-3 text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}