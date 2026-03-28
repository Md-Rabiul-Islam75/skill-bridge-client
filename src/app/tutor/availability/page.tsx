/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getTutorAvailability, updateTutorAvailability } from "@/lib/apiClient";

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<string[]>([]);
  const [slotInput, setSlotInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTutorAvailability()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to load availability");
        setSlots(res.data?.availability || []);
      })
      .catch((e) => setError((e as any).message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const submitAvailability = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = { availability: slots };
      const res = await updateTutorAvailability(payload);
      if (!res.ok) throw new Error(res.error || "Unable to save availability");
      setSuccess("Availability saved.");
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const addSlot = () => {
    if (!slotInput.trim()) return;
    setSlots((prev) => [...prev, slotInput.trim()]);
    setSlotInput("");
  };

  const removeSlot = (index: number) => setSlots((prev) => prev.filter((_, i) => i !== index));

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">Availability</h1>
      <p className="mt-2 text-slate-600">Set tutor availability slots (e.g., 2026-04-01 10:00).</p>

      <form onSubmit={submitAvailability} className="mt-6 space-y-4 rounded-xl border p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex gap-2">
          <input
            value={slotInput}
            onChange={(e) => setSlotInput(e.target.value)}
            placeholder="Add availability slot"
            className="w-full rounded border px-3 py-2"
          />
          <button type="button" onClick={addSlot} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add
          </button>
        </div>

        <ul className="space-y-1">
          {slots.map((slot, idx) => (
            <li key={idx} className="flex items-center justify-between rounded bg-slate-100 px-3 py-2 dark:bg-zinc-800">
              <span>{slot}</span>
              <button type="button" onClick={() => removeSlot(idx)} className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </li>
          ))}
          {slots.length === 0 && <li className="text-sm text-slate-500">No availability set yet.</li>}
        </ul>

        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" disabled={loading}>
          {loading ? "Saving..." : "Save availability"}
        </button>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
