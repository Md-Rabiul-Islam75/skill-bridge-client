/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "@/lib/apiClient";

export default function TutorProfileEditorPage() {
  const [profile, setProfile] = useState<any>({ name: "", email: "", subjects: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getMyProfile()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to load profile");
        setProfile(res.data?.profile || { name: "", email: "", subjects: "", bio: "" });
      })
      .catch((e) => setError((e as any).message || "Error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateProfile(profile);
      if (!res.ok) throw new Error(res.error || "Unable to save profile");
      setSuccess("Profile updated for tutor.");
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Tutor Profile</h1>
      <p className="mt-2 text-slate-600">Create or edit your tutor profile details.</p>

      {loading && <p className="mt-4">Loading profile...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 rounded-xl border p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <label className="block">
            <span>Name</span>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span>Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span>Subjects (comma separated)</span>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.subjects || ""}
              onChange={(e) => setProfile({ ...profile, subjects: e.target.value })}
            />
          </label>

          <label className="block">
            <span>Bio</span>
            <textarea
              className="mt-1 w-full rounded border px-3 py-2"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </label>

          <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" disabled={saving}>
            {saving ? "Saving..." : "Save tutor profile"}
          </button>

          {success && <p className="text-green-600">{success}</p>}
        </form>
      )}
    </main>
  );
}

