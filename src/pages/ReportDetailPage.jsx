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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
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


const baseCost = Number(financialImpact.base_cost || 18500);
const monthlyPayment = Number(financialImpact.monthly_payment || 485);
const termMonths = Number(financialImpact.term_months || 84);


const totalPaid = Number(
  financialImpact.total_paid || monthlyPayment * termMonths
);


const interestCost = Number(
  financialImpact.total_interest || Math.max(totalPaid - baseCost, 0)
);


const fees = Number(financialImpact.fees || 1450);
const penalties = Number(financialImpact.penalties || 0);


const costBreakdownData = [
  { name: "Original Loan", amount: baseCost },
  { name: "Interest", amount: interestCost },
  { name: "Fees", amount: fees },
  { name: "Penalties", amount: penalties },
];


const paymentTimelineData = Array.from({ length: termMonths + 1 }, (_, month) => {
  const progress = month / termMonths;

  const interestCurve = Math.pow(progress, 1.4);
  const cumulativeInterest = interestCost * interestCurve;

  const cumulativeTotal = baseCost * progress + cumulativeInterest;

  return {
    month,
    originalLoan: baseCost,
    totalPaid: Math.round(cumulativeTotal),
  };
});

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
          title="Total Interest Paid"
          value={formatCurrency(interestCost)}
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
  <h2 className="mb-2 text-2xl font-bold">Financial Impact</h2>

  <p className="mb-6 text-slate-400">
    This shows how much the borrower pays beyond the original loan amount.
  </p>

  <div className="mb-8 grid gap-4 md:grid-cols-3">
    <MetricCard title="Original Loan" value={formatCurrency(baseCost)} />
    <MetricCard title="Estimated Interest" value={formatCurrency(interestCost)} />
    <MetricCard title="Estimated Total Paid" value={formatCurrency(totalPaid)} />
  </div>

  <div className="mb-10 rounded-2xl bg-slate-950 p-5">
    <h3 className="mb-4 text-xl font-bold">Total Cost Over Time</h3>

    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={paymentTimelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            label={{
              value: "Months",
              position: "insideBottom",
              offset: -5,
              fill: "#94a3b8",
            }}
          />
          <YAxis
            stroke="#94a3b8"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />

          <Line
            type="monotone"
            dataKey="originalLoan"
            name="Original Loan Amount"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="totalPaid"
            name="Total Paid Over Time"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

      <div className="mt-4 rounded-xl bg-red-950/40 p-4 text-red-300">
  You borrowed {formatCurrency(baseCost)}, but will pay{" "}
  <span className="font-bold text-white">
    {formatCurrency(totalPaid)}
  </span>.
  <br />
  That means you are paying{" "}
  <span className="font-bold">
    {Math.round((interestCost / baseCost) * 100)}%
  </span>{" "}
  of the loan amount in interest alone.
</div>
  </div>


  <div className="grid gap-6 lg:grid-cols-2">
    <div className="rounded-2xl bg-slate-950 p-5">
      <h3 className="mb-4 text-xl font-bold">Cost Breakdown</h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costBreakdownData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis
              stroke="#94a3b8"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-2xl bg-slate-950 p-5">
      <h3 className="mb-4 text-xl font-bold">Where the Money Goes</h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={costBreakdownData.filter((item) => item.amount > 0)}
              dataKey="amount"
              nameKey="name"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {costBreakdownData.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
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

function MetricCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}