"use client";

import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <main className="sb-page">
      <h1 className="sb-title">Student Dashboard</h1>
      <p className="sb-subtitle">Track your bookings, profile, and learning progress.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/bookings" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <p className="mt-2 text-sm text-muted">View upcoming and past sessions.</p>
        </Link>
        <Link href="/dashboard/profile" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-muted">Edit personal info and preferences.</p>
        </Link>
        <Link href="/tutors" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Find Tutors</h2>
          <p className="mt-2 text-sm text-muted">Search by subject, rating, and price.</p>
        </Link>
      </div>

      <section className="sb-panel mt-8 p-5">
        <h3 className="font-semibold">Student flow</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-muted">
          <li>Search tutors</li>
          <li>View profile and availability</li>
          <li>Book session and track in bookings page</li>
          <li>Leave review after completion</li>
        </ol>
      </section>
    </main>
  );
}
