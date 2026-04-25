import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-blue-600 px-4 py-2 rounded-lg"
      : "text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg";

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-2xl font-bold tracking-tight">
          Corpo
          {/* logo here  */}
        </NavLink>

        <div className="flex items-center gap-2">
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
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
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