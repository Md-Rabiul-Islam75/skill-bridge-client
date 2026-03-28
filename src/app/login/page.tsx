/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { loginUser, saveCurrentUser } from "@/lib/authClient";

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
      }

      setStatus("success");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
      setStatus("error");
    }
  };

  return (
    <main className="p-8 mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border p-6">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "success" && <p className="text-sm text-green-600">Logged in successfully!</p>}
      </form>
    </main>
  );
}
