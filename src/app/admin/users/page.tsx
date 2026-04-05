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
        setUsers(res.data || []);
      })
      .catch((e) => setError((e as any).message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="sb-page">
      <h1 className="sb-title">Manage Users</h1>
      {loading && <p className="mt-4">Loading users...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="mt-5 grid gap-3">
        {users.map((user) => (
          <article key={user.id} className="sb-card p-4">
            <p className="font-semibold">{user.name || user.email}</p>
            <p className="text-sm">Role: {user.role}</p>
            <p className="text-sm">Status: {user.banned ? "Banned" : "Active"}</p>
          </article>
        ))}
        {!loading && users.length === 0 && <p className="text-muted">No users found.</p>}
      </div>
    </main>
  );
}
