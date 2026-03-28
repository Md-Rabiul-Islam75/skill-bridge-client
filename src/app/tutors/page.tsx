/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTutors } from "@/lib/apiClient";

interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  price: number;
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTutors()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Could not load tutors");
        setTutors(res.data?.tutors || []);
      })
      .catch((e) => setError((e as any).message || "Failed to load tutors"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Browse Tutors</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Find the best tutor by subject, rating, and price.</p>

      {loading && <p className="mt-5 text-sm">Loading tutors...</p>}
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(tutors.length > 0 ? tutors : new Array(3).fill(null)).map((tutor, idx) => (
          <article key={tutor?.id ?? idx} className="rounded-xl border border-slate-200 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            {tutor ? (
              <>
                <h2 className="text-xl font-semibold">{tutor.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Subject: {tutor.subject}</p>
                <p className="text-sm">Rating: {tutor.rating || "—"}</p>
                <p className="text-sm">Price: ${tutor.price || "—"}/hr</p>
                <Link href={`/tutors/${tutor.id}`} className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700">
                  View profile
                </Link>
              </>
            ) : (
              <div className="h-28 animate-pulse rounded bg-slate-200 dark:bg-zinc-700" />
            )}
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/20">
        <h2 className="font-semibold">Filter & sort</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Add filter controls here when API support is available.</p>
      </section>
    </main>
  );
}

