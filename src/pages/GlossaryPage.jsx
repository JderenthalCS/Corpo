import { useState } from "react";
import { FINANCE_GLOSSARY, glossaryTermId } from "../lib/financeGlossary";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const entries = Object.entries(FINANCE_GLOSSARY)
    .filter(
      ([term, def]) =>
        term.toLowerCase().includes(search.toLowerCase()) ||
        def.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Corpo Reference
      </p>

      <h1 className="mb-2 text-4xl font-black">Glossary</h1>

      <p className="mb-8 max-w-3xl text-sm text-[var(--text-muted)]">
        Definitions for terms used throughout your loan analysis reports.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search terms..."
        className="mb-6 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-[var(--surface-strong)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <tr>
              <th className="px-5 py-4 font-semibold">Term</th>
              <th className="px-5 py-4 font-semibold">Definition</th>
            </tr>
          </thead>

          <tbody>
            {entries.map(([term, definition], index) => (
              <tr
                key={term}
                id={glossaryTermId(term)}
                className={`border-t border-[var(--border)] ${
                  index % 2 === 0
                    ? "bg-[var(--surface)]"
                    : "bg-[var(--surface-strong)]/40"
                } transition hover:bg-[var(--surface-strong)]`}
              >
                <td className="w-[220px] px-5 py-4 align-top font-semibold text-[var(--text)]">
                  {term}
                </td>
                <td className="px-5 py-4 text-sm leading-7 text-[var(--text-muted)]">
                  {definition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}