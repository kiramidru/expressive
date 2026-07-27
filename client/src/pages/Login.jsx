import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, clearAuth } from "../api.js";

export default function Login({ onAuthenticated }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = isSignup
      ? form
      : { email: form.email, password: form.password };

    try {
      const response = await fetch(
        `${API_URL}/api/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || "Unable to sign in");
      }

      if (!["CUSTOMER", "SELLER"].includes(data.role)) {
        clearAuth();
        throw new Error("No frontend dashboard is configured for this account role.");
      }

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.role);
      window.dispatchEvent(new Event("auth-change"));
      onAuthenticated(data.role);

      if (data.role === "SELLER") navigate("/seller/home");
      else navigate("/home");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsSignup((current) => !current);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-amber-300 p-12 text-slate-950 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[48px] border-slate-950/10" />
          <p className="relative text-sm font-bold uppercase tracking-[0.25em]">
            Express Store
          </p>
          <div className="relative max-w-md">
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest">
              One account, every aisle
            </p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight">
              Shop and sell without the detour.
            </h1>
          </div>
          <p className="relative max-w-sm text-sm font-medium text-slate-800">
            Secure email authentication for customers and independent sellers.
          </p>
        </section>

        <section className="flex items-center p-7 sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-300 lg:hidden">
              Express Store
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isSignup
                ? "Start shopping or open your seller workspace."
                : "Enter your credentials to continue."}
            </p>

            <form className="mt-8 space-y-5" onSubmit={submit}>
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm font-medium text-slate-300">
                    First name
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                      name="firstName"
                      onChange={updateField}
                      required
                      value={form.firstName}
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-300">
                    Last name
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                      name="lastName"
                      onChange={updateField}
                      value={form.lastName}
                    />
                  </label>
                </div>
              )}

              <label className="block text-sm font-medium text-slate-300">
                Email
                <input
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                  name="email"
                  onChange={updateField}
                  required
                  type="email"
                  value={form.email}
                />
              </label>

              <label className="block text-sm font-medium text-slate-300">
                Password
                <input
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                  minLength={6}
                  name="password"
                  onChange={updateField}
                  required
                  type="password"
                  value={form.password}
                />
              </label>

              {isSignup && (
                <label className="block text-sm font-medium text-slate-300">
                  Account type
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-300"
                    name="role"
                    onChange={updateField}
                    value={form.role}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </label>
              )}

              {error && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}

              <button
                className="w-full rounded-xl bg-amber-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <button
              className="mt-6 w-full text-sm text-slate-400 transition hover:text-white"
              onClick={switchMode}
              type="button"
            >
              {isSignup
                ? "Already have an account? Sign in"
                : "New to Express Store? Create an account"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
