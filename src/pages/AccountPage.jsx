import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [themePreference, setThemePreference] = useState("Dark");
  const [emailReports, setEmailReports] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setMessage(error.message);
        return;
      }

      const currentUser = data.user;
      setUser(currentUser);

      setFullName(currentUser.user_metadata?.full_name || "");
      setThemePreference(currentUser.user_metadata?.theme_preference || "Dark");
      setEmailReports(currentUser.user_metadata?.email_reports ?? true);
    }

    loadUser();
  }, []);

  async function handleSaveProfile() {
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
    setMessage("Account settings saved successfully.");
    setSaving(false);
  }

  async function handlePasswordChange() {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
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
    setMessage("Password updated successfully.");
    setSaving(false);
  }

  if (!user) {
    return <p className="text-slate-300">Loading account...</p>;
  }

  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Account</h1>

      <p className="mb-8 max-w-2xl text-slate-300">
        Manage your Corpo profile, preferences, and login settings.
      </p>

      {message && (
        <p className="mb-6 rounded-xl bg-slate-900 p-4 text-slate-300">
          {message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-bold">Profile</h2>

          <label className="mb-2 block text-sm text-slate-400">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="Enter your full name"
          />

          <label className="mb-2 block text-sm text-slate-400">Email</label>
          <input
            value={user.email}
            disabled
            className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
          />

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-bold">Preferences</h2>

          <label className="mb-2 block text-sm text-slate-400">
            Theme Preference
          </label>
          <select
            value={themePreference}
            onChange={(event) => setThemePreference(event.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option>Dark</option>
            <option>Light</option>
            <option>System</option>
          </select>

          <label className="flex items-center gap-3 text-slate-300">
            <input
              type="checkbox"
              checked={emailReports}
              onChange={(event) => setEmailReports(event.target.checked)}
              className="h-5 w-5"
            />
            Email me when reports are finished
          </label>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
          <h2 className="mb-5 text-2xl font-bold">Change Password</h2>

          <label className="mb-2 block text-sm text-slate-400">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="Enter a new password"
          />

          <button
            onClick={handlePasswordChange}
            disabled={saving}
            className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-500 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </section>
  );
}