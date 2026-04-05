/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "@/lib/apiClient";

export default function TutorProfileEditorPage() {
  const [profile, setProfile] = useState<any>({ name: "", email: "", subjects: "", bio: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getMyProfile()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to load profile");
        setProfile(res.data?.profile || { name: "", email: "", subjects: "", bio: "", price: "" });
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
      // Refetch profile to ensure all changes are reflected
      const reloadRes = await getMyProfile();
      if (reloadRes.ok) {
        setProfile(reloadRes.data?.profile || profile);
      }
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="sb-page">
      <h1 className="sb-title">Tutor Profile</h1>
      <p className="sb-subtitle">Create or edit your tutor profile details.</p>

      {loading && <p className="mt-4">Loading profile...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && (
        <form onSubmit={handleSubmit} className="sb-card mt-5 space-y-4 p-6">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              className="sb-input mt-1"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="sb-input mt-1"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Subjects (comma separated)</span>
            <input
              className="sb-input mt-1"
              value={profile.subjects || ""}
              onChange={(e) => setProfile({ ...profile, subjects: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Hourly Price (USD)</span>
            <input
              type="number"
              min="0"
              step="1"
              className="sb-input mt-1"
              value={profile.price ?? ""}
              onChange={(e) => setProfile({ ...profile, price: e.target.value })}
              placeholder="e.g. 25"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Bio</span>
            <textarea
              className="sb-textarea mt-1"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </label>

          <button type="submit" className="sb-btn sb-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save tutor profile"}
          </button>

          {success && <p className="text-green-600">{success}</p>}
        </form>
      )}
    </main>
  );
}

