export const FINANCE_GLOSSARY = {
  "Predatory Score": "A score from 0-100 estimating how harmful loan terms may be. Higher scores indicate riskier terms.",
  "Risk Level": "A label that summarizes overall concern based on detected loan signals.",
  borrower: "The person responsible for repaying the loan.",
  "Original Loan": "The starting principal amount borrowed before interest, fees, or penalties.",
  principal: "The base amount borrowed, not including interest or fees.",
  interest: "The cost of borrowing money over time, paid in addition to principal.",
  "Total Paid": "The estimated full amount repaid over the term, including principal, interest, and other charges.",
  fees: "Additional charges such as origination, processing, or servicing costs.",
  penalties: "Extra charges triggered by specific conditions, such as late payment terms.",
  term: "The total duration of the loan agreement.",
  "Red Flags": "Severe warning signs that may indicate harmful or high-risk loan terms.",
  "Yellow Flags": "Moderate warning signs that deserve closer review.",
  "Green Flags": "Positive indicators suggesting fairer or safer terms.",
};

export function glossaryTermId(term) {
  return String(term)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
