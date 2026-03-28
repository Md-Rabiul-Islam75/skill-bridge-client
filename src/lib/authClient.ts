/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FetchResult<T> = {
  status: number;
  ok: boolean;
  data: T | null;
  error: string | null;
};

async function safeFetch<T>(path: string, init: RequestInit = {}): Promise<FetchResult<T>> {
  const url = `${API_BASE}${path}`;
  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
        credentials: "include",
        ...init,
      });

      const contentType = response.headers.get("content-type") || "";
      let json: any = null;
      if (contentType.includes("application/json")) {
        json = await response.json();
      }

      if (response.ok) {
        return { status: response.status, ok: true, data: json || null, error: null };
      }

      if (response.status >= 500 && attempt < maxRetries) {
        attempt++;
        continue;
      }

      if (response.status === 401) {
        if (typeof window !== "undefined") localStorage.removeItem("skillbridge_user");
      }

      return {
        status: response.status,
        ok: false,
        data: null,
        error: json?.message || response.statusText || "Unknown error",
      };
    } catch (err: any) {
      if (attempt < maxRetries) {
        attempt++;
        continue;
      }
      return { status: 0, ok: false, data: null, error: err?.message || "Network error" };
    }
  }

  return { status: 0, ok: false, data: null, error: "Failed to reach server" };
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
}) {
  return safeFetch<{ user: unknown; token?: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { safeFetch };


export async function loginUser(payload: { email: string; password: string }) {
  return safeFetch<{ user: unknown; token?: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentUser() {
  const result = await safeFetch<{ user: unknown }>("/api/auth/me", {
    method: "GET",
  });

  if (!result.ok && result.status === 401) {
    if (typeof window !== "undefined") localStorage.removeItem("skillbridge_user");
  }

  return result;
}

export function saveCurrentUser(user: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem("skillbridge_user", JSON.stringify(user));
}

export function getCurrentUser(): unknown {
  if (typeof window === "undefined") return null;
  try {
    const json = localStorage.getItem("skillbridge_user");
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem("skillbridge_user");
  return safeFetch("/api/auth/logout", { method: "POST" });
}
