import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { applyTheme } from "../theme";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [themePreference, setThemePreference] = useState("Dark");
  const [emailReports, setEmailReports] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwStrength, setPwStrength] = useState({ pct: 0, color: "#ef4444", label: "" });

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) { setMessage(error.message); return; }
      const currentUser = data.user;
      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || "");
      setThemePreference(currentUser.user_metadata?.theme_preference || "Dark");
      const savedTheme = currentUser.user_metadata?.theme_preference || "System";
      setThemePreference(savedTheme);
      applyTheme(savedTheme); // add this line
      setEmailReports(currentUser.user_metadata?.email_reports ?? true);
    }
    loadUser();
  }, []);

  function getInitials(name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0]?.[0] || "?").toUpperCase();
  }

  function checkPwStrength(val) {
    const len = val.length;
    if (len === 0) return setPwStrength({ pct: 0, color: "#ef4444", label: "" });
    if (len >= 12 && /[^a-zA-Z0-9]/.test(val)) return setPwStrength({ pct: 100, color: "#16a34a", label: "Strong" });
    if (len >= 8) return setPwStrength({ pct: 65, color: "#ca8a04", label: "Moderate" });
    if (len >= 6) return setPwStrength({ pct: 35, color: "#f97316", label: "Weak" });
    setPwStrength({ pct: 15, color: "#ef4444", label: "Too short" });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName, theme_preference: themePreference, email_reports: emailReports },
    });
    if (error) { setMessage(error.message); setSaving(false); return; }
    setUser(data.user);
    applyTheme(themePreference);
    setMessage("Settings saved.");
    setSaving(false);
  }

  async function handlePasswordChange() {
    if (newPassword.length < 6) return setMessage("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setMessage("Passwords do not match.");
    setSaving(true);
    setMessage("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setMessage(error.message); setSaving(false); return; }
    setNewPassword("");
    setConfirmPassword("");
    setPwStrength({ pct: 0, color: "#ef4444", label: "" });
    setMessage("Password updated.");
    setSaving(false);
  }

  if (!user) return <p className="text-[var(--text-muted)]">Loading account...</p>;

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Personal Settings
      </p>
      <h1 className="mb-1 text-4xl font-black">Account</h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">
        Manage your Corpo profile, preferences, and login settings.
      </p>

      {message && (
        <p className="mb-6 rounded-xl bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
          {message}
        </p>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">

        {/* Profile header */}
        <div className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-lg font-bold text-blue-400">
            {getInitials(fullName || user.email)}
          </div>
          <div>
            <p className="text-lg font-bold">{fullName || "Your Name"}</p>
            <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* Full name + email */}
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-[var(--text-muted)]">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs text-[var(--text-muted)]">Email address</label>
            <input
              value={user.email}
              disabled
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-muted)] opacity-60"
            />
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* Theme + email reports */}
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-[var(--text-muted)]">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {["Dark", "Light", "System"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setThemePreference(t); applyTheme(t); }}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                    themePreference === t
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email reports</span>
              <ToggleSwitch checked={emailReports} onChange={setEmailReports} />
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* Password */}
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-[var(--text-muted)]">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); checkPwStrength(e.target.value); }}
              placeholder="Enter a new password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
            {newPassword && (
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pwStrength.pct}%`, background: pwStrength.color }}
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs text-[var(--text-muted)]">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-6">
          <button
            onClick={handlePasswordChange}
            disabled={saving}
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--text-muted)] disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update password"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </div>
    </section>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[var(--accent)]" : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}