/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/authClient";
import { createBooking, getBookings, getTutorById } from "@/lib/apiClient";

type CurrentUser = {
  id?: string;
  role?: string;
};

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tutorId } = use(params);
  const [tutor, setTutor] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const currentUser = getCurrentUser() as CurrentUser | null;
  const isStudent = currentUser?.role === "STUDENT";

  const fetchBookings = async () => {
    if (!isStudent) {
      setBookings([]);
      return;
    }

    const res = await getBookings();
    if (!res.ok) {
      return;
    }

    const tutorBookings = (res.data?.bookings || []).filter((booking: any) => booking.tutorId === tutorId);
    setBookings(tutorBookings);
  };

  useEffect(() => {
    setLoading(true);
    getTutorById(tutorId)
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Could not load tutor");
        setTutor(res.data || null);
        return fetchBookings();
      })
      .catch((e) => setError((e as any).message || "Failed to load tutor"))
      .finally(() => setLoading(false));
  }, [tutorId, isStudent]);

  async function bookSession() {
    setError(null);
    setSuccess(null);
    if (!date) {
      setError("Please choose an available slot or select a date/time.");
      return;
    }

    if (!isStudent) {
      setError("Booking sessions is available for students only.");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await createBooking({ tutorId, date, notes });
      if (!res.ok) throw new Error(res.error || "Booking failed");
      setSuccess("Booking created successfully!");
      setDate("");
      setNotes("");
      await fetchBookings();
    } catch (e: any) {
      setError(e.message || "Unable to book.");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="sb-page">
      <div className="sb-card p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && tutor && (
          <>
            <h1 className="sb-title">{tutor.user?.name || "Tutor"}</h1>
            <p className="mt-2 text-muted">{tutor.bio || "No bio yet."}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <span className="sb-panel p-2 text-sm">Subject: {tutor.categories?.[0]?.name || "General"}</span>
              <span className="sb-panel p-2 text-sm">Rating: {tutor.rating ?? "N/A"}</span>
              <span className="sb-panel p-2 text-sm">
                Price: {tutor.price == null || tutor.price === "" ? "Not set" : `$${tutor.price}/hr`}
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Available Slots</h2>
              {Array.isArray(tutor.availabilities) && tutor.availabilities.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {tutor.availabilities.map((slot: any) => {
                    const slotDateTime = `${slot.day}T${slot.startTime}`;
                    const selected = date === slotDateTime;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setDate(slotDateTime)}
                        className={`flex w-full items-center justify-between rounded border px-4 py-3 text-left ${selected ? "border-brand bg-brand/10" : "border-border bg-card"}`}
                      >
                        <span className="text-sm font-medium">{slot.day}</span>
                        <span className="text-sm text-muted">{slot.startTime} - {slot.endTime}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No booking slots available yet.</p>
              )}
            </div>

            {isStudent ? (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Your Bookings for This Tutor</h2>
                {bookings.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {bookings.map((booking) => (
                      <article key={booking.id} className="rounded border border-border bg-card px-4 py-3">
                        <p className="font-semibold">{new Date(booking.date).toLocaleString()}</p>
                        <p className="text-sm text-muted">Status: {booking.status || "CONFIRMED"}</p>
                        <p className="text-sm text-muted">Notes: {booking.notes || "—"}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">No bookings for this tutor yet.</p>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded border border-border bg-background/60 p-4 text-sm text-muted">
                Booking sessions is available to students only. Tutors can update profile, availability, and booking status from the tutor dashboard.
              </div>
            )}
          </>
        )}

        {!loading && !tutor && <p className="text-slate-500">Tutor data not found.</p>}
      </div>

      {isStudent ? (
        <section className="sb-card mt-8 p-6">
          <h2 className="text-2xl font-semibold">Book a Session</h2>
          <p className="mt-1 text-sm text-muted">Pick one of the available slots above, or choose a custom date/time.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="sb-input text-sm" />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes or topics"
              className="sb-input text-sm"
            />
          </div>

          <button onClick={bookSession} className="sb-btn sb-btn-primary mt-4" disabled={bookingLoading}>
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>

          {success && <p className="mt-2 text-green-600">{success}</p>}
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </section>
      ) : null}
    </main>
  );
}

