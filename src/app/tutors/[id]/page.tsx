/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getTutorById, createBooking } from "@/lib/apiClient";

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTutorById(params.id)
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Could not load tutor");
        setTutor(res.data?.tutor || null);
      })
      .catch((e) => setError((e as any).message || "Failed to load tutor"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function bookSession() {
    setError(null);
    setSuccess(null);
    try {
      const res = await createBooking({ tutorId: params.id, date, notes });
      if (!res.ok) throw new Error(res.error || "Booking failed");
      setSuccess("Booking created successfully!");
      setDate("");
      setNotes("");
    } catch (e: any) {
      setError(e.message || "Unable to book.");
    }
  }

  return (
    <main className="p-8">
      <div className="rounded-xl border p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && tutor && (
          <>
            <h1 className="text-4xl font-bold">{tutor.name}</h1>
            <p className="mt-2 text-slate-600">{tutor.bio || "No bio yet."}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <span className="rounded-lg bg-slate-100 p-2 text-sm">Subject: {tutor.subject}</span>
              <span className="rounded-lg bg-slate-100 p-2 text-sm">Rating: {tutor.rating ?? "N/A"}</span>
              <span className="rounded-lg bg-slate-100 p-2 text-sm">Price: ${tutor.price ?? "N/A"}/hr</span>
            </div>
          </>
        )}

        {!loading && !tutor && <p className="text-slate-500">Tutor data not found.</p>}
      </div>

      <section className="mt-8 rounded-xl border p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-2xl font-semibold">Book a Session</h2>
        <p className="mt-1 text-sm text-slate-500">Select a date/time and confirm booking.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <input value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" className="rounded border px-3 py-2 text-sm" />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes or topics"
            className="rounded border px-3 py-2 text-sm"
          />
        </div>

        <button onClick={bookSession} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Book Now
        </button>

        {success && <p className="mt-2 text-green-600">{success}</p>}
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </section>
    </main>
  );
}

