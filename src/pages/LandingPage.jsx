import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
//       <div>
//         <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
//           AI-powered corporate translator
//         </p>

//         <h1 className="mb-6 text-5xl font-bold leading-tight">
//           Understand contracts before you sign them.
//         </h1>

//         <p className="mb-8 text-lg leading-8 text-slate-300">
//           Corpo helps everyday users understand complex documents like leases,
//           contracts, and agreements. Upload a file and receive a plain-English
//           summary, green/yellow/red flags, a predatory risk score, and a clear
//           breakdown of the real financial impact.
//         </p>

//         <div className="flex gap-4">
//           <Link
//             to="/upload"
//             className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
//           >
//             Analyze a Document
//           </Link>

//           <Link
//             to="/reports"
//             className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
//           >
//             View Reports
//           </Link>
//         </div>
//       </div>

//       <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//         <h2 className="mb-6 text-2xl font-bold">What Corpo Finds</h2>

//         <div className="space-y-4">
//           <Feature color="bg-green-500" title="Green Flags" text="Fair terms, clear pricing, and standard clauses." />
//           <Feature color="bg-yellow-500" title="Yellow Flags" text="Unclear wording, possible fees, and terms worth reviewing." />
//           <Feature color="bg-red-500" title="Red Flags" text="Predatory terms, hidden costs, risky obligations, and unfair penalties." />
//         </div>
//       </div>
//     </section>
//   );
// }

// function Feature({ color, title, text }) {
//   return (
//     <div className="flex gap-4 rounded-2xl bg-slate-950 p-5">
//       <div className={`mt-1 h-4 w-4 rounded-full ${color}`} />
//       <div>
//         <h3 className="font-bold">{title}</h3>
//         <p className="text-slate-400">{text}</p>
//       </div>
//     </div>
//   );
// }

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      <main>
        <section
          id="home"
          className="bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(245,158,11,0.18),transparent_30%),linear-gradient(180deg,#0f172a_0%,#111f3a_100%)] py-16"
        >
          <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.08em] text-cyan-300">
                Risk and Finance Intelligence
              </p>
              <h1 className="mb-4 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
                Make better decisions with one clear dashboard
              </h1>
              <p className="mb-6 max-w-[52ch] text-slate-300">
                Monitor document status, key flags, finance insights, and risk
                scoring in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/auth"
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-slate-900"
                  type="button"
                >
                  Start free
                </Link>
              </div>
            </div>
            <div
              className="rounded-2xl border border-slate-200/15 bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-5"
              aria-label="Preview card"
            >
              <h2 className="mb-3 text-base font-semibold">Live Snapshot</h2>
              <div className="flex items-center justify-between gap-4 border-b border-slate-200/15 py-2">
                <span className="text-slate-400">Document</span>
                <strong>Q2-Compliance.pdf</strong>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-200/15 py-2">
                <span className="text-slate-400">Flags</span>
                <strong>3 active</strong>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-200/15 py-2">
                <span className="text-slate-400">Finance</span>
                <strong>$1.2M reviewed</strong>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-cyan-300/10 px-4 py-3">
                <span>Preditory Score</span>
                <strong>8.5 / 10</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-10">
          <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200/15 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-semibold">Document Tracking</h3>
              <p className="text-slate-300">
                Keep every file organized with instant status visibility and
                audit trails.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200/15 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-semibold">Flag Management</h3>
              <p className="text-slate-300">
                Surface critical risks early with configurable rules and smart
                alerts.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200/15 bg-white/5 p-4">
              <h3 className="mb-2 text-lg font-semibold">Finance Overview</h3>
              <p className="text-slate-300">
                Compare revenue, spend, and risk impact side by side in real
                time.
              </p>
            </article>
          </div>
        </section>

        <section id="pricing" className="py-12 text-center">
          <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
            <h2 className="text-3xl font-semibold">Ready to simplify your workflow?</h2>
            <p className="mb-4 mt-2 text-slate-300">Launch in minutes and scale with your team.</p>
            <Link
              to="/upload"
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-slate-900"
            >
              Get started
            </Link>
            
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200/15 py-5 text-sm text-slate-400">
        <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
          <p>© 2026 Corpo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
