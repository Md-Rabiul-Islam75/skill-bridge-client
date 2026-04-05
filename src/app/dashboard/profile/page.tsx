/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "@/lib/apiClient";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getMyProfile()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to load profile");
        setProfile(res.data?.profile || {});
      })
      .catch((e) => setError((e as any).message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await updateProfile(profile);
      if (!res.ok) throw new Error(res.error || "Unable to update profile");
      setSuccess("Profile updated.");
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="sb-page">
      <h1 className="sb-title">Profile</h1>
      {loading && <p>Loading profile...</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}

      {!loading && profile && (
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

          <button type="submit" className="sb-btn sb-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>

          {success && <p className="text-green-600">{success}</p>}
        </form>
      )}
    </main>
  );
}

