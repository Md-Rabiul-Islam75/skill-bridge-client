/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeFetch } from "./authClient";

export async function getTutors() {
  return safeFetch<{ tutors: Array<any> }>("/api/tutors");
}

export async function getTutorById(id: string) {
  return safeFetch<{ tutor: any }>(`/api/tutors/${id}`);
}

export async function getBookings() {
  return safeFetch<{ bookings: Array<any> }>("/api/bookings");
}

export async function createBooking(payload: { tutorId: string; date: string; notes?: string }) {
  return safeFetch<{ booking: any }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyProfile() {
  return safeFetch<{ profile: any }>("/api/auth/me");
}

export async function updateProfile(payload: any) {
  return safeFetch("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getTutorAvailability() {
  return safeFetch<{ availability: any }>("/api/tutor/availability");
}

export async function updateTutorAvailability(payload: any) {
  return safeFetch("/api/tutor/availability", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getAllUsers() {
  return safeFetch<{ users: Array<any> }>("/api/admin/users");
}

export async function getAdminBookings() {
  return safeFetch<{ bookings: Array<any> }>("/api/admin/bookings");
}

export async function getCategories() {
  return safeFetch<{ categories: Array<any> }>("/api/categories");
}
