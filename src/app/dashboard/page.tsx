"use client";

import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Student Dashboard</h1>
      <p className="mt-2 text-slate-600">Track your bookings, profile, and learning progress.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/bookings" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">My Bookings</h2>
          <p className="mt-2 text-sm text-slate-500">View upcoming and past sessions.</p>
        </Link>
        <Link href="/dashboard/profile" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-500">Edit personal info and preferences.</p>
        </Link>
        <Link href="/tutors" className="rounded-xl border bg-white p-5 shadow hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-xl font-semibold">Find Tutors</h2>
          <p className="mt-2 text-sm text-slate-500">Search by subject, rating, and price.</p>
        </Link>
      </div>

      <section className="mt-8 rounded-xl border bg-blue-50 p-5 dark:bg-blue-950/20">
        <h3 className="font-semibold">Student flow</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>Search tutors</li>
          <li>View profile and availability</li>
          <li>Book session and track in bookings page</li>
          <li>Leave review after completion</li>
        </ol>
      </section>
    </main>
  );
}
