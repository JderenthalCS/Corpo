import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI-powered corporate translator
        </p>

        <h1 className="mb-6 text-5xl font-bold leading-tight">
          Understand contracts before you sign them.
        </h1>

        <p className="mb-8 text-lg leading-8 text-slate-300">
          Corpo helps everyday users understand complex documents like leases,
          contracts, and agreements. Upload a file and receive a plain-English
          summary, green/yellow/red flags, a predatory risk score, and a clear
          breakdown of the real financial impact.
        </p>

        <div className="flex gap-4">
          <Link
            to="/upload"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Analyze a Document
          </Link>

          <Link
            to="/reports"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
          >
            View Reports
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold">What Corpo Finds</h2>

        <div className="space-y-4">
          <Feature color="bg-green-500" title="Green Flags" text="Fair terms, clear pricing, and standard clauses." />
          <Feature color="bg-yellow-500" title="Yellow Flags" text="Unclear wording, possible fees, and terms worth reviewing." />
          <Feature color="bg-red-500" title="Red Flags" text="Predatory terms, hidden costs, risky obligations, and unfair penalties." />
        </div>
      </div>
    </section>
  );
}

function Feature({ color, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-slate-950 p-5">
      <div className={`mt-1 h-4 w-4 rounded-full ${color}`} />
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-slate-400">{text}</p>
      </div>
    </div>
  );
}