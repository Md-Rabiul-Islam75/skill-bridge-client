"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/authClient";

type AppRole = "STUDENT" | "TUTOR" | "ADMIN";

type CurrentUser = {
  role?: string;
} | null;

function normalizeRole(role?: string): AppRole | null {
  if (role === "STUDENT" || role === "TUTOR" || role === "ADMIN") return role;
  return null;
}

export default function Home() {
  const user = useMemo(() => getCurrentUser() as CurrentUser, []);

  const role = normalizeRole(user?.role);

  const navLinks = useMemo(() => {
    const common = [{ href: "/tutors", label: "Browse Tutors" }];

    if (!role) {
      return [
        ...common,
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];
    }

    if (role === "STUDENT") {
      return [...common, { href: "/dashboard", label: "Student Dashboard" }];
    }

    if (role === "TUTOR") {
      return [{ href: "/tutor/dashboard", label: "Tutor Dashboard" }];
    }

    return [{ href: "/admin", label: "Admin Dashboard" }];
  }, [role]);

  return (
    <div className="sb-page">
      <section className="sb-card sb-fade-up overflow-hidden p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="sb-chip w-fit">Trusted learning marketplace</p>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Learn smarter with expert tutors.</h1>
            <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
              SkillBridge connects students, tutors, and admins in one focused platform with fast booking, profile management, and role-based dashboards.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/tutors" className="sb-btn sb-btn-primary">Explore Tutors</Link>
              {!role ? (
                <Link href="/register" className="sb-btn sb-btn-ghost">Create Account</Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="sb-panel px-4 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="sb-card p-5">
          <h3 className="text-lg font-semibold">Students</h3>
          <p className="mt-2 text-sm text-muted">Browse tutors, book sessions instantly, and track your full learning history.</p>
        </article>
        <article className="sb-card p-5">
          <h3 className="text-lg font-semibold">Tutors</h3>
          <p className="mt-2 text-sm text-muted">Manage your profile, set availability, and grow your teaching visibility.</p>
        </article>
        <article className="sb-card p-5">
          <h3 className="text-lg font-semibold">Admins</h3>
          <p className="mt-2 text-sm text-muted">Oversee platform health with user, category, and booking management tools.</p>
        </article>
      </section>

      <section className="sb-card mt-8 p-7 sm:p-8">
        <h2 className="text-2xl font-bold">Workflow</h2>
        <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-sm text-muted">
          <li>Register as Student or Tutor and login.</li>
          <li>Students browse tutors and book sessions.</li>
          <li>Tutors set availability and manage sessions.</li>
          <li>Students review completed sessions.</li>
          <li>Admins supervise users, bookings, and categories.</li>
        </ol>
      </section>

      <section className="sb-card mt-8 p-7 sm:p-8">
        <h2 className="text-2xl font-bold">Quick Test Panel</h2>
        <p className="mt-2 text-sm text-muted">Use these practical flows to verify each role quickly.</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="sb-panel p-5">
            <h3 className="text-lg font-semibold">Student</h3>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
              <li>Register as Student from <Link href="/register" className="font-semibold text-brand hover:underline">Register</Link>.</li>
              <li>Login from <Link href="/login" className="font-semibold text-brand hover:underline">Login</Link>.</li>
              <li>Browse tutors from <Link href="/tutors" className="font-semibold text-brand hover:underline">Browse Tutors</Link>.</li>
              <li>Book and track in <Link href="/dashboard/bookings" className="font-semibold text-brand hover:underline">My Bookings</Link>.</li>
            </ol>
          </article>

          <article className="sb-panel p-5">
            <h3 className="text-lg font-semibold">Tutor</h3>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
              <li>Register as Tutor.</li>
              <li>Complete <Link href="/tutor/profile" className="font-semibold text-brand hover:underline">Tutor Profile</Link>.</li>
              <li>Set slots at <Link href="/tutor/availability" className="font-semibold text-brand hover:underline">Availability</Link>.</li>
              <li>Use <Link href="/tutor/dashboard" className="font-semibold text-brand hover:underline">Tutor Dashboard</Link>.</li>
            </ol>
          </article>

          <article className="sb-panel p-5">
            <h3 className="text-lg font-semibold">Admin</h3>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
              <li>Login with admin account.</li>
              <li>Open <Link href="/admin" className="font-semibold text-brand hover:underline">Admin Dashboard</Link>.</li>
              <li>Manage <Link href="/admin/users" className="font-semibold text-brand hover:underline">Users</Link> and <Link href="/admin/bookings" className="font-semibold text-brand hover:underline">Bookings</Link>.</li>
            </ol>
          </article>
        </div>
      </section>
    </div>
  );
}
