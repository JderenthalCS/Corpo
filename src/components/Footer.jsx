import { Link } from "react-router-dom";
import logoAccent from "../img/logoAccent.png";

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:px-8">
        
        {/* Top Row */}
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 text-2xl font-black tracking-tight"
          >
            <img
              src={logoAccent}
              alt="Corpo"
              className="h-7 w-auto opacity-80"
            />
            <span className="text-xl font-black tracking-tight">Corpo</span>
          </Link>

          {/* Links */}
          <nav className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[var(--text-muted)] md:w-auto">
            <Link to="/upload" className="hover:text-[var(--text)]">
              Upload
            </Link>
            <Link to="/reports" className="hover:text-[var(--text)]">
              Reports
            </Link>
            <Link to="/account" className="hover:text-[var(--text)]">
              Account
            </Link>
            <Link to="/credits" className="hover:text-[var(--text)]">
              Credits
            </Link>
            <Link to="/glossary" className="hover:text-[var(--text)]">
              Glossary
            </Link>
          </nav>

          {/* Copyright */}
          <p className="shrink-0 text-sm text-[var(--text-muted)]">
            © 2026 Corpo. All rights reserved.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-5 border-t border-[var(--border)]" />

        {/* Disclaimer */}
        <p className="mx-auto mt-4 max-w-7xl text-center text-xs leading-relaxed text-[var(--text-muted)] opacity-80">
          Corpo provides AI-generated insights for informational purposes only
          and does not constitute legal, financial, or professional advice.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Results may be incomplete or incorrect. Always consult a qualified
          professional before making decisions.
        </p>
      </div>
    </footer>
  );
}