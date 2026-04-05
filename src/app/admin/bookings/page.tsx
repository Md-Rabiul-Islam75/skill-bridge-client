/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getAdminBookings } from "@/lib/apiClient";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAdminBookings()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to fetch bookings");
        setBookings(res.data?.bookings || []);
      })
      .catch((e) => setError((e as any).message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="sb-page">
      <h1 className="sb-title">Manage Bookings</h1>
      {loading && <p className="mt-4">Loading bookings...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-5 space-y-3">
        {bookings.map((b) => (
          <article key={b.id} className="sb-card p-4">
            <p className="font-semibold">{b.tutor?.name || b.tutorName || "Tutor"} with {b.student?.name || b.studentName || "Student"}</p>
            <p className="text-sm text-muted">{new Date(b.date).toLocaleString()}</p>
            <p className="text-sm">Status: {b.status}</p>
          </article>
        ))}
        {!loading && bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
      </div>
    </main>
  );
}
