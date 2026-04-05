"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getDashboardPath, getCurrentUser, logout } from "@/lib/authClient";

type User = {
  name?: string;
  role?: string;
};

export default function TopNav() {
  const user = useMemo<User | null>(() => {
    const raw = getCurrentUser() as unknown;
    if (!raw || typeof raw !== "object") return null;

    const maybeUser = raw as Record<string, unknown>;
    return {
      name: typeof maybeUser.name === "string" ? maybeUser.name : undefined,
      role: typeof maybeUser.role === "string" ? maybeUser.role : undefined,
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
          SkillBridge
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {/* Show Browse Tutors only for students and non-logged-in users */}
          {!user || user.role === "STUDENT" ? (
            <Link
              href="/tutors"
              className="sb-btn sb-btn-ghost"
            >
              Browse Tutors
            </Link>
          ) : null}

          {user ? (
            <>
              <Link
                href={getDashboardPath(user.role)}
                className="sb-btn sb-btn-primary"
              >
                My Dashboard
              </Link>

              <div className="sb-chip">
                {user.name || "User"} · {user.role || "Unknown"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="sb-btn sb-btn-danger"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="sb-btn sb-btn-ghost"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="sb-btn sb-btn-primary"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
