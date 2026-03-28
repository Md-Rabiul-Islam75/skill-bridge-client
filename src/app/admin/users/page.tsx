/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/apiClient";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to fetch users");
        setUsers(res.data?.users || []);
      })
      .catch((e) => setError((e as any).message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Manage Users</h1>
      {loading && <p className="mt-4">Loading users...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="mt-5 grid gap-3">
        {users.map((user) => (
          <article key={user.id} className="rounded-xl border p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <p className="font-semibold">{user.name || user.email}</p>
            <p className="text-sm">Role: {user.role}</p>
            <p className="text-sm">Status: {user.banned ? "Banned" : "Active"}</p>
          </article>
        ))}
        {!loading && users.length === 0 && <p className="text-slate-600">No users found.</p>}
      </div>
    </main>
  );
}
