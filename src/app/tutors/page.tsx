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
        setTutors(res.data || []);
      })
      .catch((e) => setError((e as any).message || "Failed to load tutors"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="sb-page">
      <h1 className="sb-title">Browse Tutors</h1>
      <p className="sb-subtitle">Find the best tutor by subject, rating, and price.</p>

      {loading && <p className="mt-5 text-sm">Loading tutors...</p>}
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(tutors.length > 0 ? tutors : new Array(3).fill(null)).map((tutor, idx) => (
          <article key={tutor?.user?.id ?? idx} className="sb-card p-5">
            {tutor ? (
              <>
                <h2 className="text-xl font-semibold">{tutor.user?.name || "Unnamed Tutor"}</h2>
                <p className="mt-2 text-sm text-muted">
                  Subject: {tutor.categories?.[0]?.name || "General"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="sb-chip">Rating: {tutor.rating ?? "—"}</span>
                  <span className="sb-chip">
                    Price: {tutor.price == null || tutor.price === "" ? "Not set" : `$${tutor.price}/hr`}
                  </span>
                </div>
                <Link href={`/tutors/${tutor.user?.id}`} className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">
                  View profile
                </Link>
              </>
            ) : (
              <div className="h-28 animate-pulse rounded bg-border" />
            )}
          </article>
        ))}
      </div>

      <section className="sb-panel mt-8 p-4">
        <h2 className="font-semibold">Filter and sort</h2>
        <p className="text-sm text-muted">You can add subject/rating/price controls here as soon as full API filter UI is wired.</p>
      </section>
    </main>
  );
}

