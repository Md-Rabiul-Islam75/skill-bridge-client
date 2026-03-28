/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/lib/apiClient";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getBookings()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to fetch bookings");
        setBookings(res.data?.bookings || []);
      })
      .catch((e) => setError((e as any).message || "Failed to fetch bookings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">My Bookings</h1>
      {loading && <p className="mt-4">Loading bookings...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {!loading && !error && bookings.length === 0 && <p className="mt-4 text-slate-600">No bookings yet.</p>}

      <div className="mt-5 space-y-4">
        {bookings.map((b) => (
          <article key={b.id} className="rounded-xl border p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-lg font-semibold">{b.tutorName || "Tutor"}</p>
            <p className="text-sm text-slate-500">Date: {new Date(b.date).toLocaleString()}</p>
            <p className="text-sm">Status: {b.status || "pending"}</p>
            <p className="text-sm">Notes: {b.notes || "—"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
