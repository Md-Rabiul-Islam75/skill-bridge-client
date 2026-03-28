"use client";

import Link from "next/link";

export default function TutorDashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Tutor Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage availability, sessions, and tutor profile in one place.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/tutor/availability" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="mt-2 text-sm text-slate-500">Set your available time slots.</p>
        </Link>
        <Link href="/tutor/profile" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-500">Update teaching subjects and experience.</p>
        </Link>
        <Link href="/dashboard/bookings" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="mt-2 text-sm text-slate-500">Check student booking requests and status.</p>
        </Link>
      </div>

      <section className="mt-8 rounded-xl border bg-emerald-50 p-5 dark:bg-emerald-950/20">
        <h3 className="font-semibold">Tutor flow</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Register as tutor and set up your profile.</li>
          <li>Define availability slots to accept bookings.</li>
          <li>Review student session orders, mark complete.</li>
          <li>Collect ratings and reviews.</li>
        </ol>
      </section>
    </main>
  );
}

