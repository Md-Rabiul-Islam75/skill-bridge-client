/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/authClient";
import { createBooking, createReview, getBookings, getTutorBookingsByTutorId, getTutorById } from "@/lib/apiClient";

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
  const [reviewLoadingId, setReviewLoadingId] = useState<string | null>(null);
  const [confirmedSlotTimes, setConfirmedSlotTimes] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const currentUser = getCurrentUser() as CurrentUser | null;
  const isStudent = currentUser?.role === "STUDENT";
  const selectedSlotLabel = date ? new Date(date).toLocaleString() : "No slot selected yet";

  const now = Date.now();
  const confirmedSlotSet = useMemo(() => new Set(confirmedSlotTimes), [confirmedSlotTimes]);
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcomingBookings = sortedBookings.filter((booking) => new Date(booking.date).getTime() >= now);
  const pastBookings = sortedBookings.filter((booking) => new Date(booking.date).getTime() < now);

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

  const fetchConfirmedSlots = async () => {
    const tutorBookingsRes = await getTutorBookingsByTutorId(tutorId);
    const blockedTimes = (tutorBookingsRes.data?.bookings || [])
      .filter((booking: any) => booking.status === "CONFIRMED" || booking.status === "COMPLETED")
      .map((booking: any) => new Date(booking.date).getTime());
    setConfirmedSlotTimes(blockedTimes);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getTutorById(tutorId), fetchConfirmedSlots()])
      .then(async ([tutorRes]) => {
        if (!tutorRes.ok) throw new Error(tutorRes.error || "Could not load tutor");
        setTutor(tutorRes.data || null);

        await fetchBookings();
      })
      .catch((e) => setError((e as any).message || "Failed to load tutor"))
      .finally(() => setLoading(false));
  }, [tutorId, isStudent]);

  async function bookSession() {
    setError(null);
    setSuccess(null);
    if (!date) {
      setError("Please choose one of the available slots first.");
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
      await Promise.all([fetchBookings(), fetchConfirmedSlots()]);
    } catch (e: any) {
      setError(e.message || "Unable to book.");
    } finally {
      setBookingLoading(false);
    }
  }

  async function submitReview(bookingId: string) {
    const draft = reviewDrafts[bookingId];
    if (!draft) {
      setError("Please choose a rating before submitting the review.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      setReviewLoadingId(bookingId);
      const res = await createReview({ bookingId, rating: draft.rating, comment: draft.comment });
      if (!res.ok) throw new Error(res.error || "Unable to submit review");

      setSuccess("Review submitted successfully.");
      setReviewDrafts((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
      await fetchBookings();
    } catch (e: any) {
      setError(e.message || "Unable to submit review.");
    } finally {
      setReviewLoadingId(null);
    }
  }

  return (
    <main className="sb-page">
      <section className="sb-card overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="p-6 sm:p-8">
            {loading && <p className="text-sm text-muted">Loading tutor...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {!loading && tutor && (
              <>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="sb-chip">Tutor profile</span>
                  <span className="sb-chip">Student view</span>
                  <span className="sb-chip">Book from available slots</span>
                </div>

                <h1 className="sb-title mt-4">{tutor.user?.name || "Tutor"}</h1>
                <p className="mt-3 max-w-2xl text-base text-muted">
                  {tutor.bio || "No bio yet."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <MetricCard label="Main subject" value={tutor.categories?.[0]?.name || "General"} />
                  <MetricCard label="Rating" value={tutor.rating ?? "N/A"} />
                  <MetricCard label="Hourly price" value={tutor.price == null || tutor.price === "" ? "Not set" : `$${tutor.price}/hr`} />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <InfoCallout
                    title="What this tutor is best for"
                    text={`Students looking for ${tutor.categories?.[0]?.name || "general"} support with a clear session plan.`}
                  />
                  <InfoCallout
                    title="How booking works"
                    text="Pick an available slot, add a short note, then confirm your session."
                  />
                </div>
              </>
            )}

            {!loading && !tutor && <p className="text-slate-500">Tutor data not found.</p>}
          </div>

          <aside className="border-t border-border bg-background/50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <h2 className="text-lg font-semibold">Booking snapshot</h2>
            <div className="mt-4 space-y-3">
              <MiniSummary label="Selected time" value={selectedSlotLabel} />
              <MiniSummary label="Tutor" value={tutor?.user?.name || "Tutor"} />
              <MiniSummary label="Price" value={tutor?.price == null || tutor?.price === "" ? "Not set" : `$${tutor.price}/hr`} />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Before you book</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>Choose a slot that matches your schedule.</li>
                <li>Add notes if you want the tutor to prepare something specific.</li>
                <li>Your booking will appear in your bookings list after confirmation.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 sb-card p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Available slots</h2>
              <p className="mt-1 text-sm text-muted">Pick a slot to prefill your booking time.</p>
            </div>
            <span className="sb-chip">{Array.isArray(tutor?.availabilities) ? tutor.availabilities.length : 0} slots</span>
          </div>

          {Array.isArray(tutor?.availabilities) && tutor.availabilities.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {tutor.availabilities.map((slot: any) => {
                const slotDateTime = `${slot.day}T${slot.startTime}`;
                const slotTime = new Date(slotDateTime).getTime();
                const isConfirmed = confirmedSlotSet.has(slotTime);
                const selected = date === slotDateTime;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      if (isConfirmed) return;
                      setDate(slotDateTime);
                    }}
                    disabled={isConfirmed}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${isConfirmed ? "cursor-not-allowed border-emerald-200 bg-emerald-50/70" : selected ? "border-brand bg-brand/10 shadow-sm" : "border-border bg-card hover:border-brand/40"}`}
                  >
                    <div>
                      <p className="font-semibold">{slot.day}</p>
                      <p className="mt-1 text-sm text-muted">{isConfirmed ? "This slot is already confirmed." : "Select this time to prefill your booking."}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {isConfirmed ? (
                        <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Confirmed
                        </span>
                      ) : null}
                      <span className="rounded-full bg-background px-3 py-1 text-sm font-medium text-muted">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-background/60 p-5 text-sm text-muted">
              No booking slots available yet. Check back later or browse another tutor.
            </div>
          )}

          {isStudent ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Selected slot</p>
                <p className="mt-1 text-sm font-medium">{selectedSlotLabel}</p>
              </div>

              <div className="space-y-2">
                <button onClick={bookSession} className="sb-btn sb-btn-primary h-fit w-full lg:w-auto" disabled={bookingLoading}>
                  {bookingLoading ? "Booking..." : "Confirm"}
                </button>
                {success && <p className="text-sm text-green-600">{success}</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>
          ) : null}

          {isStudent ? (
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium">Notes for the tutor</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What do you want to focus on?"
                  className="sb-textarea mt-2 min-h-28 text-sm"
                />
              </label>
            </div>
          ) : null}

          {isStudent ? (
            <div className="mt-8 space-y-8">
              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">Upcoming bookings</h3>
                  <span className="sb-chip">{upcomingBookings.length} sessions</span>
                </div>

                <div className="mt-3 space-y-3">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <article key={booking.id} className="rounded-xl border border-border bg-background/70 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{new Date(booking.date).toLocaleString()}</p>
                            <p className="text-sm text-muted">Notes: {booking.notes || "—"}</p>
                          </div>
                          <span className="sb-chip">{booking.status || "CONFIRMED"}</span>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No upcoming sessions for this tutor yet.</p>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">Past bookings and reviews</h3>
                  <span className="sb-chip">{pastBookings.length} sessions</span>
                </div>

                <div className="mt-3 space-y-3">
                  {pastBookings.length > 0 ? (
                    pastBookings.map((booking) => {
                      const draft = reviewDrafts[booking.id] || { rating: 5, comment: "" };
                      const hasReview = Boolean(booking.review);
                      const reviewRating = Number(booking.review?.rating || 0);

                      return (
                        <article key={booking.id} className="rounded-xl border border-border bg-background/70 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{new Date(booking.date).toLocaleString()}</p>
                              <p className="text-sm text-muted">Notes: {booking.notes || "—"}</p>
                            </div>
                            <span className="sb-chip">{booking.status || "CONFIRMED"}</span>
                          </div>

                          {hasReview ? (
                            <div className="mt-4 rounded-xl border border-border bg-card p-4">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold">Your review</p>
                                <span className="text-sm text-muted">{renderStars(reviewRating)}</span>
                              </div>
                              <p className="mt-2 text-sm text-muted">{booking.review?.comment || "No comment added."}</p>
                            </div>
                          ) : (
                            <div className="mt-4 grid gap-4 md:grid-cols-[140px_1fr]">
                              <label className="block">
                                <span className="text-sm font-medium">Your rating</span>
                                <div className="mt-2 flex flex-wrap items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => {
                                    const active = draft.rating >= value;
                                    return (
                                      <button
                                        key={value}
                                        type="button"
                                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                                        onClick={() =>
                                          setReviewDrafts((prev) => ({
                                            ...prev,
                                            [booking.id]: { ...draft, rating: value },
                                          }))
                                        }
                                        className={`text-3xl leading-none transition ${active ? "text-amber-400 drop-shadow-sm" : "text-slate-300 hover:text-amber-300"}`}
                                      >
                                        ★
                                      </button>
                                    );
                                  })}
                                </div>
                                <p className="mt-2 text-xs text-muted">{draft.rating} out of 5</p>
                              </label>

                              <label className="block">
                                <span className="text-sm font-medium">Comment</span>
                                <textarea
                                  className="sb-textarea mt-2 min-h-24 text-sm"
                                  placeholder="Tell other students how the session went"
                                  value={draft.comment}
                                  onChange={(e) =>
                                    setReviewDrafts((prev) => ({
                                      ...prev,
                                      [booking.id]: { ...draft, comment: e.target.value },
                                    }))
                                  }
                                />
                              </label>
                            </div>
                          )}

                          {!hasReview && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <p className="text-sm text-muted">Reviews help other students pick the right tutor.</p>
                              <button
                                type="button"
                                onClick={() => submitReview(booking.id)}
                                disabled={reviewLoadingId === booking.id}
                                className="sb-btn sb-btn-primary"
                              >
                                {reviewLoadingId === booking.id ? "Submitting..." : "Submit review"}
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted">No past sessions for this tutor yet.</p>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-border bg-background/60 p-4 text-sm text-muted">
              Booking sessions is available to students only. Tutors can update profile, availability, and booking status from the tutor dashboard.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="sb-panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function InfoCallout({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  );
}

function MiniSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < rating;
    return (
      <span key={index} className={filled ? "text-amber-400" : "text-slate-300"}>
        ★
      </span>
    );
  });
}

