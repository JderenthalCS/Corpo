import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-blue-600 px-4 py-2 rounded-lg"
      : "text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg";

  return (
    <nav className="border-b border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-2xl font-bold tracking-tight">
          Corpo
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
        </div>
      </div>
    </nav>
  );
}