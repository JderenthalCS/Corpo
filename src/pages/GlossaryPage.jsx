import { FINANCE_GLOSSARY, glossaryTermId } from "../lib/financeGlossary";

export default function GlossaryPage() {
  const entries = Object.entries(FINANCE_GLOSSARY).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Corpo Reference
      </p>

      <h1 className="mb-2 text-4xl font-black">Glossary</h1>

      <p className="mb-8 max-w-3xl text-sm text-[var(--text-muted)]">
        Definitions for terms used throughout your loan analysis reports.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([term, definition]) => (
          <article
            key={term}
            id={glossaryTermId(term)}
            className="scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <h2 className="mb-2 text-lg font-bold text-[var(--text)]">{term}</h2>
            <p className="text-sm leading-7 text-[var(--text-muted)]">{definition}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
