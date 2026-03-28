/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { registerUser, saveCurrentUser } from "@/lib/authClient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      const result = await registerUser({ name, email, password, role });
      if (!result.ok) {
        setError(result.error || "Could not register");
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
      <h1 className="text-3xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border p-6">
        <label className="block">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </label>

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

        <label className="block">
          <span>Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "STUDENT" | "TUTOR")}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "success" && <p className="text-sm text-green-600">Registered successfully!</p>}
      </form>
    </main>
  );
}

