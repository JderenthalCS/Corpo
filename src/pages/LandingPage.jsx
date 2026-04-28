import { Link } from "react-router-dom";
import logoAccent from "../img/logoAccent.png";

function Landing() {
  return (
    <div className="text-[var(--text)]">
      <main className="space-y-12 pb-10 sm:space-y-14">
        
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 md:p-10">
          <img
            src={logoAccent}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-15%] top-[-15%] h-[140%] w-auto opacity-10 sm:opacity-15"
          />

          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Contract Clarity Platform
            </p>

            <h1 className="max-w-[18ch] text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Know the real cost before you sign.
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base text-[var(--text-muted)]">
              Most people overpay because contracts hide risk behind confusing
              legal language. Corpo turns dense documents into plain-English
              summaries, risk flags, and visual financial breakdowns.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/upload"
                className="w-full rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] active:scale-[0.98] sm:w-auto"
              >
                Check Your Contract
              </Link>

              <Link
                to="/reports"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-6 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface-strong)] active:scale-[0.98] sm:w-auto"
              >
                View Reports
              </Link>
            </div>
          </div>
        </section>

        {/* WHY IT MATTERS */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Why It Matters
          </p>

          <h2 className="max-w-3xl text-2xl font-black sm:text-3xl">
            A “normal” contract can still hide expensive traps.
          </h2>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-[var(--text-muted)]">
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

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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

            <h2 className="text-2xl font-black sm:text-3xl">
              Corpo looks for the fine print people usually miss.
            </h2>
          </div>

          <ul className="mt-2 grid gap-3 sm:grid-cols-2 text-sm sm:text-base text-[var(--text-muted)]">
            {[
              "Hidden Fees",
              "Early Payoff Penalties",
              "Auto-Renewal Clauses",
              "Repossession or Liability Risk",
              "Mandatory Arbitration",
              "Changing Payment Terms",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* TRUST */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Built For Trust
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <TrustItem title="Private by default" text="Your reports belong to your account." />
            <TrustItem title="Plain-English output" text="No legal jargon overload." />
            <TrustItem title="Financial clarity" text="See the actual cost over time." />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="rounded-3xl bg-[var(--accent)] p-6 text-[var(--bg)] sm:p-8 md:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">
            Before you sign, let Corpo read it.
          </h2>

          <p className="mt-3 max-w-2xl text-sm sm:text-base opacity-90">
            Upload a contract and get a clearer view of the risks, costs, and
            obligations hidden inside.
          </p>

          <Link
            to="/upload"
            className="mt-5 inline-block w-full rounded-xl bg-[var(--bg)] px-6 py-3 text-center text-sm font-bold text-[var(--accent)] transition hover:opacity-90 active:scale-[0.98] sm:w-auto"
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
      <h3 className="mt-3 text-lg sm:text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}

function TrustItem({ title, text }) {
  return (
    <article className="rounded-2xl bg-[var(--surface-strong)] p-5">
      <h3 className="text-base sm:text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}

export default Landing;