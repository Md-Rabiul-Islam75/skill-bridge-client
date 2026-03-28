import Link from "next/link";

const navLinks = [
  { href: "/tutors", label: "Browse Tutors" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "Student Dashboard" },
  { href: "/tutor/dashboard", label: "Tutor Dashboard" },
  { href: "/admin", label: "Admin Dashboard" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-purple-100 text-zinc-900 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <main className="mx-auto w-full max-w-6xl p-8">
        <section className="rounded-3xl bg-white/90 p-10 shadow-xl backdrop-blur dark:bg-zinc-900/80">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">SkillBridge</h1>
              <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
                Connect with expert tutors, manage bookings, and grow your skills with role-based workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-blue-400 dark:hover:bg-zinc-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-blue-500/10 p-5 shadow-sm border border-blue-100 dark:border-blue-900 dark:bg-blue-950/30">
              <h3 className="font-semibold">Students</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Browse tutors, book sessions, review instructors, and access your learning dashboard.
              </p>
            </article>
            <article className="rounded-2xl bg-emerald-500/10 p-5 shadow-sm border border-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30">
              <h3 className="font-semibold">Tutors</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Create a profile, manage availability, and track your teaching sessions and earnings.
              </p>
            </article>
            <article className="rounded-2xl bg-orange-500/10 p-5 shadow-sm border border-orange-100 dark:border-orange-900 dark:bg-orange-950/30">
              <h3 className="font-semibold">Admins</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Oversee users/bookings/categories, moderate content, and inspect platform analytics.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
          <h2 className="text-2xl font-bold">Workflow</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-slate-700 dark:text-slate-300">
            <li>Register as Student or Tutor (role selection in form).</li>
            <li>Login and open dashboard for role-specific actions.</li>
            <li>Student books tutors and leaves reviews.</li>
            <li>Tutor sets availability and manages sessions.</li>
            <li>Admin manages all users, bookings, and categories.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
