import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { applyTheme, initTheme } from "../theme";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Shield, Bell, Lock, Palette } from "lucide-react";

initTheme();

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [themePreference, setThemePreference] = useState("Dark");
  const [emailReports, setEmailReports] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwStrength, setPwStrength] = useState({
    pct: 0,
    color: "#ef4444",
    label: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setMessage(error.message);
        return;
      }

      const currentUser = data.user;
      const savedTheme = currentUser.user_metadata?.theme_preference || "System";

      setUser(currentUser);
      setFullName(currentUser.user_metadata?.full_name || "");
      setThemePreference(savedTheme);
      setEmailReports(currentUser.user_metadata?.email_reports ?? true);
      applyTheme(savedTheme);
    }

    loadUser();
  }, []);

  function getInitials(name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || "?").toUpperCase();
  }

  function checkPwStrength(value) {
    const len = value.length;

    if (len === 0) {
      return setPwStrength({ pct: 0, color: "#ef4444", label: "" });
    }

    if (len >= 12 && /[^a-zA-Z0-9]/.test(value)) {
      return setPwStrength({ pct: 100, color: "#16a34a", label: "Strong" });
    }

    if (len >= 8) {
      return setPwStrength({ pct: 65, color: "#ca8a04", label: "Moderate" });
    }

    if (len >= 6) {
      return setPwStrength({ pct: 35, color: "#f97316", label: "Weak" });
    }

    setPwStrength({ pct: 15, color: "#ef4444", label: "Too short" });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        theme_preference: themePreference,
        email_reports: emailReports,
      },
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setUser(data.user);
    applyTheme(themePreference);
    setMessage("Settings saved successfully.");
    setSaving(false);
  }

  async function handlePasswordChange() {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPwStrength({ pct: 0, color: "#ef4444", label: "" });
    setMessage("Password updated successfully.");
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  if (!user) {
    return <p className="text-[var(--text-muted)]">Loading account...</p>;
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Personal Settings
        </p>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">Account</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)]">
              Manage your profile, preferences, security, and account access.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-500/40 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
          {message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-xl font-black text-[var(--accent)]">
                {getInitials(fullName || user.email)}
              </div>

              <div>
                <p className="text-xl font-bold">{fullName || "Your Name"}</p>
                <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
              </div>
            </div>
          </div>

          <InfoCard
            icon={<Shield size={18} />}
            title="Account protected"
            text="Your settings are tied to your Supabase authenticated account."
          />

          <InfoCard
            icon={<Bell size={18} />}
            title="Report preferences"
            text="Control whether Corpo should notify you when reports finish."
          />
        </aside>

        <div className="space-y-6">
          <Panel icon={<User size={18} />} title="Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="input-style"
                />
              </Field>

              <Field label="Email address">
                <input value={user.email} disabled className="input-style opacity-60" />
              </Field>
            </div>
          </Panel>

          <Panel icon={<Palette size={18} />} title="Preferences">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Theme
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {["Dark", "Light", "System"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setThemePreference(theme);
                        applyTheme(theme);
                      }}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        themePreference === theme
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-hover)]"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <div>
                  <p className="font-semibold">Email reports</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Notify me when analysis completes.
                  </p>
                </div>

                <ToggleSwitch checked={emailReports} onChange={setEmailReports} />
              </div>
            </div>
          </Panel>

          <Panel icon={<Lock size={18} />} title="Security">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    checkPwStrength(event.target.value);
                  }}
                  placeholder="Enter a new password"
                  className="input-style"
                />

                {newPassword && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pwStrength.pct}%`,
                          background: pwStrength.color,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs" style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </p>
                  </div>
                )}
              </Field>

              <Field label="Confirm password">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="input-style"
                />
              </Field>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="mt-5 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent-hover)] hover:text-[var(--text)] disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update password"}
            </button>
          </Panel>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ icon, title, children }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[var(--surface-strong)] p-3 text-[var(--accent)]">
          {icon}
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-3 inline-flex rounded-xl bg-[var(--surface-strong)] p-3 text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
    </article>
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