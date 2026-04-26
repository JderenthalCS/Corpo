import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import logoDark from "../img/logoBlack.png";
import logoLight from "../img/logoWhite.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] shadow-sm"
      : "rounded-xl px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]";

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)]/70 bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <NavLink to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight">
          <img
            src={isDark ? logoLight : logoDark}
            alt="Corpo"
            className="h-8 w-auto"
          />
          <span>Corpo</span>
        </NavLink>
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
          <NavLink to="/upload" className={linkClass}>
            Upload
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            Reports
          </NavLink>
          <NavLink to="/account" className={linkClass}>
            Account
          </NavLink>
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-xl border border-[var(--border)]/80 px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              Log Out
            </button>
          ) : (
            <NavLink to="/auth" className={linkClass}>
              Log In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}