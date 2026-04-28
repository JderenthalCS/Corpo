import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Account created. You can now log in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        navigate("/upload");
      }
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:px-8">
      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
        <div className="rounded-2xl bg-[var(--surface-strong)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Secure Access
          </p>

          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {isSignUp
              ? "Create your Corpo account to save reports and monitor risk over time."
              : "Log in to upload documents and review financial impact instantly."}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-muted)]">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="mt-6 w-full text-center text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)] sm:w-auto sm:text-left"
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </section>
  );
}