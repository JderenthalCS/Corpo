import { Link } from "react-router-dom";

export default function CreditsPage() {
  return (
    <section className="min-h-full">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Acknowledgements
      </p>
      <h1 className="mb-3 text-4xl font-black">Credits</h1>
      <p className="mb-8 max-w-2xl text-sm text-[var(--text-muted)]">
        Corpo is built on the shoulders of great open source tools and services.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">

        <CreditGroup title="Core Stack">
          <CreditItem
            name="React"
            description="UI component framework"
            url="https://react.dev"
          />
          <CreditItem
            name="Vite"
            description="Frontend build tool"
            url="https://vitejs.dev"
          />
          <CreditItem
            name="Tailwind CSS"
            description="Utility-first CSS framework"
            url="https://tailwindcss.com"
          />
        </CreditGroup>

        <CreditGroup title="Backend & Data">
          <CreditItem
            name="Supabase"
            description="Database, auth, and storage"
            url="https://supabase.com"
          />
          <CreditItem
            name="FastAPI"
            description="Python API framework"
            url="https://fastapi.tiangolo.com"
          />
          <CreditItem
            name="Gemini"
            description="AI document analysis"
            url="https://gemini.google.com/app"
          />
        </CreditGroup>

        <CreditGroup title="UI & Visualization">
          <CreditItem
            name="Recharts"
            description="Chart and graph components"
            url="https://recharts.org"
          />
        </CreditGroup>

        <CreditGroup title="Team">
          <CreditItem
            name="Ryan Cuccurullo"
            description="Frontend"
            url=""
          />
          <CreditItem
            name="Justin Derenthal"
            description="Backend"
            url=""
          />
        </CreditGroup>

      </div>
    </section>
  );
}

function CreditGroup({ title, children }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function CreditItem({ name, description, url }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Visit ↗
        </a>
      )}
    </div>
  );
}