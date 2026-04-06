/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getTutorAvailability, updateTutorAvailability } from "@/lib/apiClient";

type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
};

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hourValue = Number(hours);
  if (Number.isNaN(hourValue) || !minutes) return time;

  const suffix = hourValue >= 12 ? "PM" : "AM";
  const normalizedHour = hourValue % 12 || 12;
  return `${normalizedHour}:${minutes} ${suffix}`;
}

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSlots = async () => {
    try {
      const res = await getTutorAvailability();
      if (!res.ok) {
        setError(res.error || "Unable to load availability");
        setSlots([]);
        return;
      }
      const availability = res.data?.availability || [];
      setSlots(
        availability.map((slot: any) => ({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      );
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load availability");
      setSlots([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSlots().finally(() => setLoading(false));
  }, []);

  const submitAvailability = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (slots.length === 0) {
      setError("Add at least one availability slot before saving.");
      return;
    }

    setLoading(true);

    try {
      const res = await updateTutorAvailability({ availabilities: slots });
      if (!res.ok) throw new Error(res.error || "Unable to save availability");
      setSuccess("Availability saved.");
      // Refetch slots from server to ensure they're persisted and rendered from DB
      await fetchSlots();
      // Clear the input fields
      setStartDateTime("");
      setEndDateTime("");
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const addSlot = () => {
    if (!startDateTime || !endDateTime) {
      setError("Please select both start and end date/time.");
      return;
    }

    const [dayStart, timeStart] = startDateTime.split("T");
    const [dayEnd, timeEnd] = endDateTime.split("T");

    if (!dayStart || !timeStart || !dayEnd || !timeEnd) {
      setError("Invalid date/time format.");
      return;
    }

    if (startDateTime >= endDateTime) {
      setError("End time must be later than start time.");
      return;
    }

    setSlots((prev) => [
      ...prev,
      {
        day: dayStart,
        startTime: timeStart,
        endTime: timeEnd,
      },
    ]);
    setStartDateTime("");
    setEndDateTime("");
    setError(null);
  };

  const removeSlot = (index: number) => setSlots((prev) => prev.filter((_, i) => i !== index));

  return (
    <main className="sb-page">
      <h1 className="sb-title">Availability</h1>
      <p className="sb-subtitle">Set tutor availability using calendar date/time pickers.</p>

      <form onSubmit={submitAvailability} className="sb-card mt-6 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Start date/time</span>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="sb-input mt-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">End date/time</span>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="sb-input mt-2"
            />
          </label>
        </div>

        <button type="button" onClick={addSlot} className="sb-btn sb-btn-ghost w-fit">
          Add slot
        </button>

        {/* Display slots list */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Availability Slots</h3>
            <span className="text-xs text-muted">{slots.length} saved</span>
          </div>
          <div className="space-y-3">
            {slots.length > 0 ? (
              slots.map((slot, idx) => (
                <div key={`${slot.day}-${slot.startTime}-${idx}`} className="flex items-center justify-between rounded border border-border bg-card px-4 py-3">
                  <div>
                    <p className="font-semibold text-foreground">{slot.day}</p>
                    <p className="text-sm text-muted">{formatTime(slot.startTime)} → {formatTime(slot.endTime)}</p>
                  </div>
                  <button type="button" onClick={() => removeSlot(idx)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No saved slots yet. Add one above to get started.</p>
            )}
          </div>
        </div>

        <button type="submit" className="sb-btn sb-btn-primary w-fit" disabled={loading}>
          {loading ? "Saving..." : "Save availability"}
        </button>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
