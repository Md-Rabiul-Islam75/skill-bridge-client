/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBookings } from "@/lib/apiClient";
import { getCurrentUser } from "@/lib/authClient";

type CurrentUser = {
  id?: string;
  role?: string;
  name?: string;
};

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useMemo(() => getCurrentUser() as CurrentUser | null, []);
  const isTutor = currentUser?.role === "TUTOR";

  const now = Date.now();
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const upcomingBookings = sortedBookings.filter((booking) => new Date(booking.date).getTime() >= now);
  const pastBookings = sortedBookings.filter((booking) => new Date(booking.date).getTime() < now);

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
    <main className="sb-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="sb-title">{isTutor ? "Tutor Bookings" : "My Bookings"}</h1>
          <p className="sb-subtitle">
            {isTutor
              ? "Track student bookings received for your sessions."
              : "Track upcoming sessions and review past bookings in one place."}
          </p>
        </div>
        {isTutor ? (
          <Link href="/tutor/bookings" className="sb-btn sb-btn-primary">
            Open tutor bookings
          </Link>
        ) : (
          <Link href="/tutors" className="sb-btn sb-btn-primary">
            Book a tutor
          </Link>
        )}
      </div>

      {loading && <p className="mt-5 text-sm text-muted">Loading bookings...</p>}
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <section className="sb-card mt-6 p-6">
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-sm text-muted">
            {isTutor
              ? "When students book your available slots, they will appear here."
              : "Pick a tutor, choose an available slot, and your sessions will appear here."}
          </p>
          {isTutor ? (
            <Link href="/tutor/bookings" className="sb-btn sb-btn-ghost mt-4 w-fit">
              Open tutor bookings
            </Link>
          ) : (
            <Link href="/tutors" className="sb-btn sb-btn-ghost mt-4 w-fit">
              Browse tutors
            </Link>
          )}
        </section>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 space-y-8">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{isTutor ? "Incoming" : "Upcoming"}</h2>
              <span className="text-sm text-muted">{upcomingBookings.length} sessions</span>
            </div>
            <div className="space-y-3">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <p className="text-sm text-muted">No upcoming sessions.</p>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Past</h2>
              <span className="text-sm text-muted">{pastBookings.length} sessions</span>
            </div>
            <div className="space-y-3">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <p className="text-sm text-muted">No past sessions yet.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const status = String(booking.status || "CONFIRMED").toUpperCase();
  const statusClasses =
    status === "COMPLETED"
      ? "bg-emerald-100 text-emerald-800"
      : status === "CANCELLED"
        ? "bg-rose-100 text-rose-800"
        : "bg-amber-100 text-amber-800";

  return (
    <article className="sb-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{booking.tutor?.name || booking.tutorName || "Tutor"}</p>
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
          <p className="text-xs uppercase tracking-wide text-muted">Tutor</p>
          <p className="mt-1 text-sm">{booking.tutor?.email || "No tutor email available"}</p>
        </div>
      </div>
    </article>
  );
}
