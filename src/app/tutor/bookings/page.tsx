/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookings, updateBookingStatus } from "@/lib/apiClient";

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBookings = async () => {
    const res = await getBookings();
    if (!res.ok) {
      throw new Error(res.error || "Unable to fetch bookings");
    }

    const tutorBookings = res.data?.bookings || [];
    setBookings(tutorBookings);
  };

  useEffect(() => {
    setLoading(true);
    loadBookings()
      .catch((e) => setError((e as any).message || "Failed to fetch bookings"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (bookingId: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    setUpdatingId(bookingId);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateBookingStatus(bookingId, status);
      if (!res.ok) throw new Error(res.error || "Unable to update status");
      setSuccess(`Booking marked as ${status.toLowerCase()}.`);
      await loadBookings();
    } catch (e: any) {
      setError(e.message || "Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="sb-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="sb-title">Tutor Bookings</h1>
          <p className="sb-subtitle">Review incoming student bookings and update session status.</p>
        </div>
        <Link href="/tutor/dashboard" className="sb-btn sb-btn-primary">
          Back to dashboard
        </Link>
      </div>

      {loading && <p className="mt-5 text-sm text-muted">Loading bookings...</p>}
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-5 text-sm text-green-600">{success}</p>}

      {!loading && !error && bookings.length === 0 && (
        <section className="sb-card mt-6 p-6">
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-sm text-muted">When students book your available slots, they will appear here.</p>
        </section>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 space-y-3">
          {bookings.map((booking) => {
            const status = String(booking.status || "CONFIRMED").toUpperCase();
            const statusClasses =
              status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800"
                : status === "CANCELLED"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800";

            return (
              <article key={booking.id} className="sb-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{booking.student?.name || "Student"}</p>
                    <p className="mt-1 text-sm text-muted">{new Date(booking.date).toLocaleString()}</p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses}`}>
                    {status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded border border-border bg-background/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted">Notes</p>
                    <p className="mt-1 text-sm">{booking.notes || "—"}</p>
                  </div>

                  <div className="rounded border border-border bg-background/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted">Student</p>
                    <p className="mt-1 text-sm">{booking.student?.email || "No student email available"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                    className="sb-btn sb-btn-ghost"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                    className="sb-btn sb-btn-primary"
                  >
                    Mark completed
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                    className="sb-btn sb-btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}