import { Link } from "react-router-dom";

const reports = [
  {
    id: "lease-001",
    title: "Apartment Lease Agreement",
    date: "April 25, 2026",
    score: 72,
    risk: "Medium Risk",
  },
  {
    id: "contract-002",
    title: "Freelance Service Contract",
    date: "April 23, 2026",
    score: 31,
    risk: "Low Risk",
  },
];

export default function ReportsPage() {
  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Previous Reports</h1>
      <p className="mb-8 text-slate-300">
        View your previously analyzed documents and open detailed risk reports.
      </p>

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
                <p className="text-slate-400">{report.date}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">{report.risk}</p>
                <p className="text-slate-400">Predatory Score: {report.score}/100</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}