import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function createDemoReports(userId) {
    const demoReports = [
      {
        user_id: userId,
        title: "Demo: Predatory Auto Loan",
        summary:
          "This auto loan contains several highly unfavorable terms, including a very high APR, short late-payment window, early payoff penalty, discretionary fees, automatic loan extension, and repossession without prior notice.",
        predatory_score: 95,
        risk_level: "High",
        green_flags: [],
        yellow_flags: [
          "The monthly payment and loan term are clearly stated.",
          "Some fees are disclosed directly in the agreement.",
        ],
        red_flags: [
          "APR is extremely high at 21.99%.",
          "Late fee applies after only 2 days.",
          "Early payoff penalty punishes the borrower for paying off the loan early.",
          "The lender may increase the interest rate based on borrower risk profile.",
          "The loan can automatically extend after missed payments.",
          "Vehicle may be repossessed without prior notice.",
          "Borrower may still owe money after repossession.",
        ],
        financial_impact: {
          base_cost: 18500,
          monthly_payment: 485,
          term_months: 84,
          total_paid: 40740,
          total_interest: 22240,
          fees: 1450,
          penalties: 95,
          risk_exposure: 3000,
        },
      },
      {
        user_id: userId,
        title: "Demo: Mortgage Closing Disclosure",
        summary:
          "This is a legitimate but complex mortgage disclosure. The loan has a fixed interest rate and clear payment terms, but the borrower should carefully review total interest, closing costs, escrow requirements, prepayment penalty, and foreclosure-related disclosures.",
        predatory_score: 38,
        risk_level: "Medium",
        green_flags: [
          "Fixed interest rate.",
          "Loan amount and monthly payment are clearly disclosed.",
          "Total payments and finance charge are shown.",
          "Escrow information is explained.",
        ],
        yellow_flags: [
          "The borrower will pay significant interest over the life of the loan.",
          "Closing costs are substantial.",
          "There is a prepayment penalty during the first 2 years.",
          "Property costs and escrow payments may change over time.",
        ],
        red_flags: [],
        financial_impact: {
          base_cost: 162000,
          monthly_payment: 1050.26,
          term_months: 360,
          total_paid: 285803,
          total_interest: 118830,
          fees: 9712,
          penalties: 3240,
          risk_exposure: 3240,
        },
      },
    ];

    const { error } = await supabase.from("reports").insert(demoReports);

    if (error) {
      console.error("Demo report insert error:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        const userId = data.user?.id;

if (userId) {
  await createDemoReports(userId);
} else {
  console.warn("User created but no user ID returned yet.");
}

        setMessage("Account created with demo reports. You can now log in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        navigate("/upload");
      }
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8">
      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
        <div className="rounded-2xl bg-[var(--surface-strong)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Secure Access
          </p>

          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {isSignUp
              ? "Create your Corpo account to save reports and monitor risk over time."
              : "Log in to upload documents and review financial impact instantly."}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-muted)]">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="mt-6 w-full text-center text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)] sm:w-auto sm:text-left"
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </section>
  );
}