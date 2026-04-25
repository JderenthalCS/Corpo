import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const financialData = [
  { name: "Base Cost", amount: 1800 },
  { name: "Fees", amount: 350 },
  { name: "Penalties", amount: 700 },
  { name: "Potential Risk", amount: 1200 },
];

export default function ReportDetailPage() {
  const { id } = useParams();

  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-widest text-blue-400">
          Report ID: {id}
        </p>
        <h1 className="text-4xl font-bold">Document Risk Report</h1>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <ScoreCard title="Predatory Score" value="72/100" color="text-yellow-400" />
        <ScoreCard title="Risk Level" value="Medium" color="text-yellow-400" />
        <ScoreCard title="Estimated Extra Cost" value="$2,250" color="text-red-400" />
      </div>

      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">Plain-English Summary</h2>
        <p className="leading-8 text-slate-300">
          This document appears to contain several standard terms, but there are
          also clauses that may increase your financial responsibility. Pay close
          attention to late fees, automatic renewal language, cancellation
          limits, and penalties that may apply even after the agreement ends.
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <FlagColumn
          title="Green Flags"
          color="border-green-500"
          items={[
            "Payment schedule is clearly listed.",
            "Contact information is provided.",
            "Core agreement length is easy to identify.",
          ]}
        />

        <FlagColumn
          title="Yellow Flags"
          color="border-yellow-500"
          items={[
            "Some fee language may be vague.",
            "Renewal terms should be reviewed carefully.",
            "Several obligations continue after signing.",
          ]}
        />

        <FlagColumn
          title="Red Flags"
          color="border-red-500"
          items={[
            "High penalty fees may apply.",
            "Cancellation terms appear restrictive.",
            "User may be responsible for extra costs.",
          ]}
        />
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-2xl font-bold">Financial Impact</h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function ScoreCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="mb-2 text-slate-400">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function FlagColumn({ title, color, items }) {
  return (
    <div className={`rounded-2xl border-t-4 ${color} bg-slate-900 p-6`}>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-950 p-3 text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}