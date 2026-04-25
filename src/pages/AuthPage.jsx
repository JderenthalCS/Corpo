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
    <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="mb-2 text-3xl font-bold">
        {isSignUp ? "Create Account" : "Log In"}
      </h1>

      <p className="mb-6 text-slate-400">
        {isSignUp
          ? "Create your Corpo account to save reports."
          : "Log in to upload and analyze documents."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>

      {message && (
        <p className="mt-4 rounded-xl bg-slate-950 p-3 text-sm text-slate-300">
          {message}
        </p>
      )}

      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage("");
        }}
        className="mt-6 text-sm text-blue-400 hover:text-blue-300"
      >
        {isSignUp
          ? "Already have an account? Log in"
          : "Need an account? Sign up"}
      </button>
    </section>
  );
}