/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { getDashboardPath, loginUser, saveCurrentUser } from "@/lib/authClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const result = await loginUser({ email, password });
      if (!result.ok) {
        setError(result.error || "Could not login");
        setStatus("error");
        return;
      }

      if (result.data) {
        saveCurrentUser(result.data.user);
        const user = result.data.user as { role?: string };
        window.location.href = getDashboardPath(user.role);
        return;
      }

      setStatus("success");
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
      setStatus("error");
    }
  };

  return (
    <main className="sb-page max-w-xl">
      <h1 className="sb-title">Welcome back</h1>
      <p className="sb-subtitle">Sign in to continue managing bookings and profiles.</p>

      <form onSubmit={handleSubmit} className="sb-card mt-6 space-y-4 p-6">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sb-input mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sb-input mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="sb-btn sb-btn-primary w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "success" && <p className="text-sm text-green-600">Logged in successfully!</p>}
      </form>

      <section className="sb-panel mt-6 p-4 text-sm text-muted">
        <h2 className="font-semibold">Need a quick test account?</h2>
        <p className="mt-2">Use this admin account for testing admin pages:</p>
        <p className="mt-2">Admin Email: <strong>admin@skillbridge.com</strong></p>
        <p>Admin Password: <strong>admin123</strong></p>
        <p className="mt-3">After login, you should be redirected to the admin dashboard.</p>
      </section>
    </main>
  );
}
