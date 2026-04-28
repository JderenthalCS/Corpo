import { Link } from "react-router-dom";
import logoAccent from "../img/logoAccent.png";

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-[var(--border)] bg-[var(--surface)]">
  <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
    
    {/* Top Row */}
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight">
          <img src={logoAccent} alt="Corpo" className="h-7 w-auto opacity-80" />
          <span className="text-xl font-black tracking-tight">Corpo</span>
        </Link>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
        <Link to="/upload" className="hover:text-[var(--text)]">Upload</Link>
        <Link to="/reports" className="hover:text-[var(--text)]">Reports</Link>
        <Link to="/account" className="hover:text-[var(--text)]">Account</Link>
        <Link to="/credits" className="hover:text-[var(--text)]">Credits</Link>
        <Link to="/glossary" className="hover:text-[var(--text)]">Glossary</Link>
      </div>

      {/* Copyright */}
      <p className="text-sm text-[var(--text-muted)]">
        © 2026 Corpo. All rights reserved.
      </p>
    </div>

    {/* Divider */}
    <div className="mt-4 border-t border-[var(--border)]"></div>

    {/* Disclaimer */}
    <p className="mt-4 w-full text-center text-xs text-[var(--text-muted)] opacity-80 leading-relaxed">
  Corpo provides AI-generated insights for informational purposes only and does not constitute legal, financial, or professional advice.
  <br />
  Results may be incomplete or incorrect. Always consult a qualified professional before making decisions.
</p>

  </div>
</footer>
  );
}