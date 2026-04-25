import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ReportDetailPage() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchReport() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setMessage(error.message);
      } else {
        setReport(data);
      }

      setLoading(false);
    }

    fetchReport();
  }, [id]);

  if (loading) {
    return <p className="text-slate-300">Loading report...</p>;
  }

  if (message) {
    return <p className="rounded-xl bg-slate-900 p-4">{message}</p>;
  }

  const financialImpact = report.financial_impact || {};

  const financialData = [
    { name: "Base Cost", amount: financialImpact.base_cost || 0 },
    { name: "Fees", amount: financialImpact.fees || 0 },
    { name: "Penalties", amount: financialImpact.penalties || 0 },
    { name: "Risk Exposure", amount: financialImpact.risk_exposure || 0 },
  ];

  return (
    <section>
      <p className="mb-2 text-sm uppercase tracking-widest text-blue-400">
        Corpo Analysis
      </p>

      <h1 className="mb-2 text-4xl font-bold">{report.title}</h1>

      <p className="mb-8 text-slate-400">
        Created: {new Date(report.created_at).toLocaleString()}
      </p>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <ScoreCard
          title="Predatory Score"
          value={`${report.predatory_score}/100`}
          color={getScoreColor(report.predatory_score)}
        />

        <ScoreCard
          title="Risk Level"
          value={report.risk_level}
          color={getRiskColor(report.risk_level)}
        />

        <ScoreCard
          title="Estimated Risk Exposure"
          value={`$${financialData[3].amount}`}
          color="text-red-400"
        />
      </div>

      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">Plain-English Summary</h2>
        <p className="leading-8 text-slate-300">{report.summary}</p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <FlagColumn
          title="Green Flags"
          color="border-green-500"
          items={report.green_flags || []}
        />

        <FlagColumn
          title="Yellow Flags"
          color="border-yellow-500"
          items={report.yellow_flags || []}
        />

        <FlagColumn
          title="Red Flags"
          color="border-red-500"
          items={report.red_flags || []}
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

      {items.length === 0 ? (
        <p className="text-slate-500">No items found.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-xl bg-slate-950 p-3 text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 70) return "text-red-400";
  if (score >= 40) return "text-yellow-400";
  return "text-green-400";
}

function getRiskColor(riskLevel) {
  if (riskLevel === "High") return "text-red-400";
  if (riskLevel === "Medium") return "text-yellow-400";
  return "text-green-400";
}