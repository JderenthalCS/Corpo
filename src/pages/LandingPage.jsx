import { Link } from "react-router-dom";
import logoAccent from "../img/logoAccent.png";

function Landing() {
  return (
    <div className="text-[var(--text)]">
      <main className="space-y-14 pb-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10">
          <img
            src={logoAccent}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-8%] top-[-10%] h-[120%] w-auto opacity-15 select-none"
          />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Contract Clarity Platform
            </p>

            <h1 className="max-w-[16ch] text-4xl font-black leading-tight md:text-6xl">
              Know the real cost before you sign.
            </h1>

            <p className="mt-5 max-w-2xl text-base text-[var(--text-muted)]">
              Most people overpay because contracts hide risk behind confusing
              legal language. Corpo turns dense documents into plain-English
              summaries, risk flags, and visual financial breakdowns.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/upload"
                className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--bg)] hover:bg-[var(--accent-hover)]"
              >
                Check Your Contract
              </Link>

              <Link
                to="/reports"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-6 py-3 text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-strong)]"
              >
                View Reports
              </Link>
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Why It Matters
          </p>

          <h2 className="text-3xl font-black">
            A “normal” contract can still hide expensive traps.
          </h2>

          <p className="mt-4 max-w-3xl text-[var(--text-muted)]">
            Corpo helps users catch things like hidden fees, early payoff
            penalties, automatic renewals, arbitration clauses, and long-term
            payment costs before they become real problems.
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            How It Works
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <StepCard number="01" title="Upload" text="Add a PDF, DOCX, or TXT agreement." />
            <StepCard number="02" title="Analyze" text="Corpo reviews terms, risk, costs, and obligations." />
            <StepCard number="03" title="Understand" text="Get a plain-English report with charts and flags." />
          </div>
        </section>

        {/* COMMON TRAPS */}
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Common Traps
            </p>

            <h2 className="text-3xl font-black">
              Corpo looks for the fine print people usually miss.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrapCard title="Hidden Fees" />
            <TrapCard title="Early Payoff Penalties" />
            <TrapCard title="Auto-Renewal Clauses" />
            <TrapCard title="Repossession or Liability Risk" />
            <TrapCard title="Mandatory Arbitration" />
            <TrapCard title="Changing Payment Terms" />
          </div>
        </section>

        {/* TRUST */}
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Built For Trust
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <TrustItem title="Private by default" text="Your reports belong to your account." />
            <TrustItem title="Plain-English output" text="No legal jargon overload." />
            <TrustItem title="Financial clarity" text="See the actual cost over time." />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="rounded-3xl bg-[var(--accent)] p-8 text-[var(--bg)] md:p-10">
          <h2 className="text-3xl font-black">Before you sign, let Corpo read it.</h2>

          <p className="mt-3 max-w-2xl opacity-90">
            Upload a contract and get a clearer view of the risks, costs, and
            obligations hidden inside.
          </p>

          <Link
            to="/upload"
            className="mt-6 inline-block rounded-xl bg-[var(--bg)] px-6 py-3 text-sm font-bold text-[var(--accent)] hover:opacity-90"
          >
            Start Analysis
          </Link>
        </section>
      </main>
    </div>
  );
}

function StepCard({ number, title, text }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-sm font-bold text-[var(--accent)]">{number}</p>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}

function TrapCard({ title }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="font-semibold">{title}</p>
    </article>
  );
}

function TrustItem({ title, text }) {
  return (
    <article className="rounded-2xl bg-[var(--surface-strong)] p-5">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}

export default Landing;