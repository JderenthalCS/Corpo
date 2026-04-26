import { Link } from "react-router-dom";
import logoAccent from "../img/logoAccent.png";
import { useEffect, useState } from "react";

function Landing() {

  return (
    <div className="text-[var(--text)]">
      <main className="space-y-10 pb-6">
        <section className="relative grid gap-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 lg:grid-cols-[1.25fr_0.75fr]">

          {/* Background logo */}
          <img
            src={logoAccent}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-20 select-none "
          />

          {/* Foreground content */}
          <div className="relative z-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Contract Clarity Platform
            </p>
            <h1 className="max-w-[18ch] text-4xl font-black leading-tight md:text-5xl">
              Read the real cost before you sign.
            </h1>
            <p className="mt-4 max-w-[52ch] text-[var(--text-muted)]">
              Corpo turns dense agreements into plain-English summaries, risk
              flags, and visual money breakdowns so decisions are easier and
              safer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/upload"
                className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--bg)] hover:bg-[var(--accent-hover)]"
              >
                Analyze Document
              </Link>
              <Link
                to="/reports"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-sm font-bold text-[var(--text)] hover:bg-[var(--surface-strong)]"
              >
                View Reports
              </Link>
            </div>
          </div>

          <div className="relative z-10 grid gap-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Typical Result
              </p>
              <p className="mt-2 text-3xl font-black">3.4 min</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">to first clear summary</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Active Insights
              </p>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Hidden fee alerts</span>
                  <strong>12</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>High-risk clauses</span>
                  <strong>5</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Safe terms found</span>
                  <strong>18</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            title="Risk Flagging"
            text="Catch hidden penalties and unfair obligations immediately."
          />
          <FeatureCard
            title="Cost Timeline"
            text="Visualize what you pay over time, not just monthly numbers."
          />
          <FeatureCard
            title="Report Archive"
            text="Store and revisit every analysis in one searchable place."
          />
          <FeatureCard
            title="Action Focus"
            text="Get plain next steps instead of legal jargon overload."
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent-hover)] hover:bg-[var(--surface-strong)] hover:scale-[1.02]">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
  );
}

export default Landing;