"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="sb-page">
      <h1 className="sb-title">Admin Dashboard</h1>
      <p className="sb-subtitle">User, booking and category management for admins.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/admin/users" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <p className="mt-2 text-sm text-muted">Ban/unban and edit roles.</p>
        </Link>
        <Link href="/admin/bookings" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Manage Bookings</h2>
          <p className="mt-2 text-sm text-muted">Review all sessions booking statuses.</p>
        </Link>
        <Link href="/admin/categories" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="mt-2 text-sm text-muted">Add/Edit subject categories for tutors.</p>
        </Link>
      </div>
    </main>
  );
}
