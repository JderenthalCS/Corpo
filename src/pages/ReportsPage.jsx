import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchReports() {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setReports(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <p className="px-4 py-6 text-sm text-[var(--text-muted)] sm:px-6 md:px-8">
        Loading reports...
      </p>
    );
  }

  return (
    <section className="w-full px-4 py-6 sm:px-6 md:px-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Report Library
      </p>

      <h1 className="mb-3 text-3xl font-black sm:text-4xl">Reports</h1>

      <p className="mb-8 text-sm leading-relaxed text-[var(--text-muted)]">
        View your uploaded documents and analysis reports.
      </p>

      {message && (
        <p className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
          {message}
        </p>
      )}

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="mb-2 text-xl font-bold sm:text-2xl">No reports yet</h2>

          <p className="mb-5 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            Upload your first document to create a Corpo report.
          </p>

          <Link
            to="/upload"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] active:scale-[0.98] sm:w-auto"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => {
            const isAnalyzing =
              report.summary === "Analyzing document..." ||
              report.yellow_flags?.includes("AI analysis in progress.");

            return (
              <Link
                key={report.id}
                to={isAnalyzing ? "#" : `/reports/${report.id}`}
                onClick={(event) => {
                  if (isAnalyzing) event.preventDefault();
                }}
                className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition sm:p-6 ${
                  isAnalyzing
                    ? "pointer-events-none opacity-50"
                    : "hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[var(--accent-hover)] hover:bg-[var(--surface-strong)] active:scale-[0.99]"
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-bold sm:text-xl md:text-2xl">
                      {report.title}
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
                      Created: {new Date(report.created_at).toLocaleString()}
                    </p>

                    {isAnalyzing && (
                      <p className="mt-3 w-fit rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--accent)]">
                        Analyzing with AI...
                      </p>
                    )}
                  </div>

                  <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left lg:w-auto lg:min-w-[230px] lg:text-right">
                    <p
                      className={`text-base font-bold md:text-lg ${getRiskBadgeColor(
                        report.risk_level
                      )}`}
                    >
                      Risk Level: {report.risk_level}
                    </p>

                    <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-base">
                      Predatory Score: {report.predatory_score}/100
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getRiskBadgeColor(riskLevel) {
  if (riskLevel === "High") return "text-red-500";
  if (riskLevel === "Medium") return "text-yellow-500";
  return "text-green-500";
}