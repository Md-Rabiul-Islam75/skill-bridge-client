"use client";

import Link from "next/link";

export default function TutorDashboardPage() {
  return (
    <main className="sb-page">
      <h1 className="sb-title">Tutor Dashboard</h1>
      <p className="sb-subtitle">Manage availability, sessions, and tutor profile in one place.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/tutor/availability" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="mt-2 text-sm text-muted">Set your available time slots.</p>
        </Link>
        <Link href="/tutor/profile" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-muted">Update teaching subjects and experience.</p>
        </Link>
        <Link href="/tutor/bookings" className="sb-card p-5 transition hover:border-brand">
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="mt-2 text-sm text-muted">Check student booking requests and status.</p>
        </Link>
      </div>

      <section className="sb-panel mt-8 p-5">
        <h3 className="font-semibold">Tutor flow</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-muted">
          <li>Register as tutor and set up your profile.</li>
          <li>Define availability slots to accept bookings.</li>
          <li>Review student session orders, mark complete.</li>
          <li>Collect ratings and reviews.</li>
        </ol>
      </section>
    </main>
  );
}

