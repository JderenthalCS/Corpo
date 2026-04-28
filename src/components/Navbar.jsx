import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import logoDark from "../img/logoBlack.png";
import logoLight from "../img/logoWhite.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.hasAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme");

      setIsDark(
        theme === "dark" ||
          (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] shadow-sm"
      : "rounded-xl px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-5 md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-3 text-2xl font-semibold tracking-wide"
          >
            <img
              src={isDark ? logoLight : logoDark}
              alt="Corpo"
              className="h-8 w-auto shrink-0"
            />
            <span className="truncate">Corpo</span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1 md:flex">
            <NavLink to="/upload" className={linkClass}>
              Upload
            </NavLink>
            <NavLink to="/reports" className={linkClass}>
              Reports
            </NavLink>
            <NavLink to="/account" className={linkClass}>
              Account
            </NavLink>
            {!user && (
              <NavLink to="/auth" className={linkClass}>
                Log In
              </NavLink>
            )}
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-semibold text-[var(--text)] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-2 md:hidden">
            <NavLink to="/upload" onClick={closeMenu} className={linkClass}>
              Upload
            </NavLink>
            <NavLink to="/reports" onClick={closeMenu} className={linkClass}>
              Reports
            </NavLink>
            <NavLink to="/account" onClick={closeMenu} className={linkClass}>
              Account
            </NavLink>
            {!user && (
              <NavLink to="/auth" onClick={closeMenu} className={linkClass}>
                Log In
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}