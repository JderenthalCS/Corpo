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
          <CreditItem
            name="Ryan Cuccurullo"
            description="Frontend"
            icons={[
              { icon: "/src/img/githubLogo.svg", url: "https://github.com/ryguy0601", alt: "GitHub" },
              { icon: "/src/img/LinkedInLogo.svg", url: "https://www.linkedin.com/in/ryan-cuccurullo-48b242261/", alt: "LinkedIn" },
            ]}
          />
          <CreditItem
            name="Justin Derenthal"
            description="Backend"
            icons={[
              { icon: "/src/img/githubLogo.svg", url: "https://github.com/JderenthalCS", alt: "GitHub" },
              { icon: "/src/img/LinkedInLogo.svg", url: "https://www.linkedin.com/in/jderenthalcs/", alt: "LinkedIn" },
            ]}
          />
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

function CreditItem({ name, description, url, icon, icons, iconAlt = `${name} icon` }) {
  // `icons` can be an array of either strings (src) or objects { icon, url, alt }
  const hasIconsArray = Array.isArray(icons) && icons.length > 0;
  const singleIcon = icon && url;
  let iconNodes = null;
  if (hasIconsArray) {
    iconNodes = [];
    for (let i = 0; i < icons.length; i++) {
      const it = icons[i];
      const src = typeof it === "string" ? it : it.icon || it.src;
      const link = typeof it === "string" ? url : it.url || url;
      const alt = (typeof it === "string" ? iconAlt : it.alt || iconAlt) + (i > 0 ? ` ${i + 1}` : "");

      iconNodes.push(
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] p-0.5 transition hover:border-[var(--accent)]"
          aria-label={`${name} website ${i + 1}`}
        >
          <img src={src} alt={alt} className="h-4 w-4 object-cover block" />
        </a>
      );
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-semibold">{name}</p>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>

      {hasIconsArray ? (
        <div className="flex flex-row items-center gap-2">{iconNodes}</div>
      ) : singleIcon ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] p-0.5 transition hover:border-[var(--accent)]"
          aria-label={`${name} website`}
        >
          <img src={icon} alt={iconAlt} className="h-4 w-4 object-cover block" />
        </a>
      ) : url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] sm:w-auto"
        >
          Visit ↗
        </a>
      ) : null}
    </div>
  );
}