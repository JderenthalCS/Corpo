import { useEffect, useState } from "react";
import { useParams,  useNavigate } from "react-router-dom";
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
import { Trash2 } from "lucide-react";

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openFlag, setOpenFlag] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

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

  async function handleSaveTitle() {
  if (!titleInput.trim()) {
    setMessage("Report title cannot be empty.");
    return;
  }

  const { data, error } = await supabase
    .from("reports")
    .update({ title: titleInput.trim() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    setMessage(error.message);
    return;
  }

  setReport(data);
  setEditingTitle(false);
}

async function handleDeleteReport(event, report) {
  event.preventDefault();

  const confirmDelete = window.confirm(
    `Delete "${report.title}"? This cannot be undone.`
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", report.id);

  if (error) {
    setMessage(error.message);
    return;
  }

  setTimeout(() => {
  navigate("/reports");
}, 200);
}

  if (loading) {
    return <p className="text-[var(--text-muted)]">Loading report...</p>;
  }

  if (message) {
    return <p className="rounded-xl bg-[var(--surface)] p-4">{message}</p>;
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
  const totalYears = termMonths / 12;


  const costBreakdownData = [
    { name: "Original Loan", amount: baseCost, color: "#22c55e" },
    { name: "Interest", amount: interestCost, color: "#ef4444" },
    { name: "Fees", amount: fees, color: "#f97316" },
    { name: "Penalties", amount: penalties, color: "#a855f7" },
  ];

  const tooltipStyle = {
    backgroundColor: "var(--surface-strong)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--text)",
  };


  const paymentTimelineData = Array.from({ length: termMonths + 1 }, (_, month) => {
    const progress = month / termMonths;

    const interestCurve = Math.pow(progress, 1.4);
    const cumulativeInterest = interestCost * interestCurve;

    const cumulativeTotal = baseCost * progress + cumulativeInterest;

    return {
      month,
      year: month / 12,
      originalLoan: baseCost,
      totalPaid: Math.round(cumulativeTotal),
    };
  });

  const yearTicks = [
    ...Array.from({ length: Math.floor(totalYears) + 1 }, (_, index) => index),
    ...(Number.isInteger(totalYears) ? [] : [Number(totalYears.toFixed(1))]),
  ];

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Corpo Analysis
      </p>

{editingTitle ? (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
    <input
      value={titleInput}
      onChange={(event) => setTitleInput(event.target.value)}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xl font-bold text-[var(--text)] outline-none focus:border-[var(--accent)]"
    />

    <button
      onClick={handleSaveTitle}
      className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--bg)] hover:bg-[var(--accent-hover)]"
    >
      Save
    </button>

    <button
      onClick={() => setEditingTitle(false)}
      className="rounded-xl border border-[var(--border)] px-5 py-3 font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)]"
    >
      Cancel
    </button>
  </div>
) : (
  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-4xl font-black">{report.title}</h1>

  <div className="flex items-center gap-3">

    {/* Rename */}
    <button
      onClick={() => {
        setTitleInput(report.title);
        setEditingTitle(true);
      }}
      className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
    >
      Rename Report
    </button>

    {/* Delete */}
    <button
      onClick={(event) => handleDeleteReport(event, report)}
className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition duration-150"    >
      <Trash2 size={18} />
    </button>

  </div>
</div>
)}
      <p className="mb-8 text-sm text-[var(--text-muted)]">
        Created: {new Date(report.created_at).toLocaleString()}
      </p>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
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

      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-2xl font-bold">Plain-English Summary</h2>
        <p className="leading-8 text-[var(--text-muted)]">{report.summary}</p>
      </div>

      <div className="mb-8 grid items-start gap-6 lg:grid-cols-3">
        <FlagColumn
          title="Green Flags"
          color="border-green-500"
          items={report.green_flags || []}
          isOpen={openFlag === "green"}
          onToggle={() =>
            setOpenFlag((prev) => (prev === "green" ? null : "green"))
          }
        />

        <FlagColumn
          title="Yellow Flags"
          color="border-yellow-500"
          items={report.yellow_flags || []}
          isOpen={openFlag === "yellow"}
          onToggle={() =>
            setOpenFlag((prev) => (prev === "yellow" ? null : "yellow"))
          }
        />

        <FlagColumn
          title="Red Flags"
          color="border-red-500"
          items={report.red_flags || []}
          isOpen={openFlag === "red"}
          onToggle={() =>
            setOpenFlag((prev) => (prev === "red" ? null : "red"))
          }
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-2 text-2xl font-bold">Financial Impact</h2>

        <p className="mb-6 text-[var(--text-muted)]">
          This shows how much the borrower pays beyond the original loan amount.
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <MetricCard title="Original Loan" value={formatCurrency(baseCost)} />
          <MetricCard title="Estimated Interest" value={formatCurrency(interestCost)} />
          <MetricCard title="Estimated Total Paid" value={formatCurrency(totalPaid)} />
        </div>

        <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
          <h3 className="mb-4 text-xl font-bold">Total Cost Over Time</h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="year"
                  domain={[0, totalYears]}
                  ticks={yearTicks}
                  stroke="#94a3b8"
                  tickFormatter={(value) => `${value}`}
                  label={{
                    value: "Years",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipStyle}/>
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

          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text-muted)]">
            You borrowed {formatCurrency(baseCost)}, but will pay{" "}
            <span className="font-bold text-[var(--text)]">
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
          <div className="rounded-2xl bg-[var(--surface-strong)] p-5">
            <h3 className="mb-4 text-xl font-bold">Cost Breakdown</h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdownData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipStyle}/>
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {costBreakdownData.map((item, index) => (
                      <Cell key={index} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--surface-strong)] p-5">
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
                    {costBreakdownData.map((item, index) => (
                      <Cell key={index} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipStyle} />
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function FlagColumn({ title, color, items, isOpen, onToggle }) {
  return (
    <div className={`rounded-2xl border-t-4 ${color} bg-[var(--surface)] p-6`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left text-xl font-bold"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-sm text-[var(--text-muted)]">
            {items.length}
          </span>
          <span
            className={`text-base text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : "rotate-0"
              }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "mt-4 opacity-100" : "mt-0 opacity-0"
          }`}
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {items.length === 0 ? (
            <p className="text-[var(--text-muted)]">No items found.</p>
          ) : (
            <ul className="list-disc space-y-3 pl-5">
              {items.map((item, index) => (
                <li
                  key={index}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--text)]">{value}</p>
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