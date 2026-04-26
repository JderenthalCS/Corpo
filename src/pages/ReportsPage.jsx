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
    return <p className="text-slate-300">Loading reports...</p>;
  }

  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Reports</h1>

      <p className="mb-8 text-slate-300">
        View your uploaded documents and analysis reports.
      </p>

      {message && (
        <p className="mb-6 rounded-xl bg-slate-900 p-4 text-slate-300">
          {message}
        </p>
      )}

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="mb-2 text-2xl font-bold">No reports yet</h2>
          <p className="mb-5 text-slate-400">
            Upload your first document to create a Corpo report.
          </p>

          <Link
            to="/upload"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:bg-slate-800"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">{report.title}</h2>
                  <p className="mt-2 text-slate-400">
                    Created: {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-lg font-bold">
                    Risk Level: {report.risk_level}
                  </p>
                  <p className="text-slate-400">
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