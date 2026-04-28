export default function CreditsPage() {
  return (
    <section className="w-full min-h-full px-4 py-6 sm:px-6 md:px-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Acknowledgements
      </p>

      <h1 className="mb-3 text-3xl font-black sm:text-4xl">Credits</h1>

      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
        Corpo is built on the shoulders of great open source tools and services.
      </p>

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        <CreditGroup title="Core Stack">
          <CreditItem name="React" description="UI component framework" url="https://react.dev" />
          <CreditItem name="Vite" description="Frontend build tool" url="https://vitejs.dev" />
          <CreditItem name="Tailwind CSS" description="Utility-first CSS framework" url="https://tailwindcss.com" />
        </CreditGroup>

        <CreditGroup title="Backend & Data">
          <CreditItem name="Supabase" description="Database, auth, and storage" url="https://supabase.com" />
          <CreditItem name="FastAPI" description="Python API framework" url="https://fastapi.tiangolo.com" />
          <CreditItem name="Gemini" description="AI document analysis" url="https://gemini.google.com/app" />
        </CreditGroup>

        <CreditGroup title="UI & Visualization">
          <CreditItem name="Recharts" description="Chart and graph components" url="https://recharts.org" />
        </CreditGroup>

        <CreditGroup title="Team">
          <CreditItem name="Ryan Cuccurullo" description="Frontend" />
          <CreditItem name="Justin Derenthal" description="Backend" />
        </CreditGroup>
      </div>
    </section>
  );
}

function CreditGroup({ title, children }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function CreditItem({ name, description, url }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] sm:w-auto"
        >
          Visit ↗
        </a>
      )}
    </div>
  );
}