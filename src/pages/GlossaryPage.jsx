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
    <section className="w-full px-4 py-6 sm:px-6 md:px-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Corpo Reference
      </p>

      <h1 className="mb-2 text-3xl font-black sm:text-4xl">Glossary</h1>

      <p className="mb-6 max-w-3xl text-sm text-[var(--text-muted)] sm:mb-8">
        Definitions for terms used throughout your loan analysis reports.
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search terms..."
        className="mb-6 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] sm:max-w-md"
      />

      {/* ✅ SCROLL CONTAINER */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-[600px] w-full text-left">
          <thead className="bg-[var(--surface-strong)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 sm:px-5 sm:py-4 font-semibold">Term</th>
              <th className="px-4 py-3 sm:px-5 sm:py-4 font-semibold">Definition</th>
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
                <td className="w-[180px] px-4 py-3 sm:w-[220px] sm:px-5 sm:py-4 align-top font-semibold text-[var(--text)] whitespace-nowrap">
                  {term}
                </td>

                <td className="px-4 py-3 sm:px-5 sm:py-4 text-sm leading-6 sm:leading-7 text-[var(--text-muted)]">
                  {definition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && (
        <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
          No glossary terms found.
        </p>
      )}
    </section>
  );
}