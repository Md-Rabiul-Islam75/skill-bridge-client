"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">User, booking and category management for admins.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/admin/users" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <p className="mt-2 text-sm text-slate-500">Ban/unban and edit roles.</p>
        </Link>
        <Link href="/admin/bookings" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Manage Bookings</h2>
          <p className="mt-2 text-sm text-slate-500">Review all sessions booking statuses.</p>
        </Link>
        <Link href="/admin/categories" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="mt-2 text-sm text-slate-500">Add/Edit subject categories for tutors.</p>
        </Link>
      </div>
    </main>
  );
}
