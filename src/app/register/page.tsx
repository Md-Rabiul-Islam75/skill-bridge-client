/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { getDashboardPath, registerUser, saveCurrentUser } from "@/lib/authClient";

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
      <h1 className="sb-title">Create your account</h1>
      <p className="sb-subtitle">Choose your role and start your SkillBridge journey.</p>

      <form onSubmit={handleSubmit} className="sb-card mt-6 space-y-4 p-6">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="sb-input mt-1"
            required
          />
        </label>

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

        <label className="block">
          <span className="text-sm font-medium">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "STUDENT" | "TUTOR")}
            className="sb-select mt-1"
          >
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </label>

        <button
          type="submit"
          className="sb-btn sb-btn-primary w-full"
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

