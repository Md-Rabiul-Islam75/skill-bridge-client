/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser, safeFetch } from "./authClient";

export async function getTutors() {
  return safeFetch<Array<any>>("/api/tutors");
}

export async function getTutorById(id: string) {
  return safeFetch<any>(`/api/tutors/${id}`);
}

export async function getBookings() {
  const currentUser = getCurrentUser() as { id?: string; role?: string } | null;
  if (!currentUser?.id) {
    return {
      status: 401,
      ok: false,
      data: null,
      error: "Student must be logged in to fetch bookings",
    };
  }

  const query = `?userId=${encodeURIComponent(currentUser.id)}&role=${encodeURIComponent(currentUser.role || "STUDENT")}`;
  const result = await safeFetch<Array<any>>(`/api/bookings${query}`);
  return {
    ...result,
    data: result.data ? { bookings: result.data } : null,
  };
}

export async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  return safeFetch(`/api/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function createBooking(payload: { tutorId: string; date: string; notes?: string }) {
  const currentUser = getCurrentUser() as { id?: string } | null;
  if (!currentUser?.id) {
    return {
      status: 401,
      ok: false,
      data: null,
      error: "Student must be logged in to book a session",
    };
  }

  return safeFetch<{ booking: any }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      tutorId: payload.tutorId,
      date: payload.date,
      notes: payload.notes,
      studentId: currentUser.id,
    }),
  });
}

export async function getMyProfile() {
  const currentUser = getCurrentUser() as { id?: string; role?: string } | null;
  
  if (!currentUser?.id) {
    return {
      status: 401,
      ok: false,
      data: null,
      error: "Not signed in",
    };
  }

  // For tutors, fetch full profile from server with bio and categories
  if (currentUser.role === "TUTOR") {
    return safeFetch<{ profile: any }>(`/api/tutor/profile?userId=${encodeURIComponent(currentUser.id)}`, {
      method: "GET",
    });
  }

  // For students, return from localStorage
  return {
    status: 200,
    ok: true,
    data: { profile: currentUser },
    error: null,
  };
}

export async function updateProfile(payload: any) {
  const currentUser = getCurrentUser() as { id?: string } | null;
  if (!currentUser?.id) {
    return { status: 401, ok: false, data: null, error: "User not signed in" };
  }

  const normalizedPrice =
    payload.price === "" || payload.price == null || Number.isNaN(Number(payload.price))
      ? undefined
      : Number(payload.price);

  return safeFetch("/api/tutor/profile", {
    method: "PUT",
    body: JSON.stringify({
      userId: currentUser.id,
      name: payload.name,
      email: payload.email,
      bio: payload.bio,
      price: normalizedPrice,
      categoryIds: payload.categoryIds,
      subjects: payload.subjects,
    }),
  });
}

export async function getTutorAvailability() {
  const currentUser = getCurrentUser() as { id?: string } | null;
  
  if (!currentUser?.id) {
    return {
      status: 401,
      ok: false,
      data: null,
      error: "Not signed in",
    };
  }

  const query = `?userId=${encodeURIComponent(currentUser.id)}`;
  return safeFetch<{ availability: any }>(`/api/tutor/availability${query}`);
}

export async function updateTutorAvailability(payload: any) {
  const currentUser = getCurrentUser() as { id?: string } | null;
  const userId = currentUser?.id;
  return safeFetch("/api/tutor/availability", {
    method: "PUT",
    body: JSON.stringify({ userId, availabilities: payload.availabilities }),
  });
}

export async function getAllUsers() {
  return safeFetch<Array<any>>("/api/admin/users");
}

export async function getAdminBookings() {
  const result = await safeFetch<Array<any>>("/api/admin/bookings");
  return {
    ...result,
    data: result.data ? { bookings: result.data } : null,
  };
}

export async function getCategories() {
  const result = await safeFetch<Array<any> | { categories: Array<any> }>("/api/tutors/categories");
  const normalized = Array.isArray(result.data)
    ? { categories: result.data }
    : result.data || { categories: [] };

  return {
    ...result,
    data: normalized,
  };
}
