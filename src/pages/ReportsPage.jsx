import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
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

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-[var(--text-muted)]">Loading reports...</p>;
  }

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Report Library
      </p>
      <h1 className="mb-3 text-4xl font-black">Reports</h1>

      <p className="mb-8 text-sm text-[var(--text-muted)]">
        View your uploaded documents and analysis reports.
      </p>

      {message && (
        <p className="mb-6 rounded-xl bg-[var(--surface)] p-4 text-[var(--text-muted)]">
          {message}
        </p>
      )}

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="mb-2 text-2xl font-bold">No reports yet</h2>
          <p className="mb-5 text-[var(--text-muted)]">
            Upload your first document to create a Corpo report.
          </p>

          <Link
            to="/upload"
            className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--bg)] hover:bg-[var(--accent-hover)]"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent-hover)] hover:bg-[var(--surface-strong)] hover:scale-[1.02]"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold md:text-2xl">{report.title}</h2>
                  <p className="mt-2 text-[var(--text-muted)]">
                    Created: {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left md:text-right">
                  <p className="text-base font-bold md:text-lg">
                    Risk Level: {report.risk_level}
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Predatory Score: {report.predatory_score}/100
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}