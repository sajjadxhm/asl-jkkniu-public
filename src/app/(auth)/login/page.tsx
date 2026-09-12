import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  FlaskConical,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { auth } from "@/auth";
import { AslLogo } from "@/components/layout/asl-logo";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    const role = session.user.role;

    if (
      role === "SUPER_ADMIN" ||
      role === "ADMIN" ||
      role === "EDITOR"
    ) {
      redirect("/admin");
    }

    if (role === "RESEARCHER") {
      redirect("/researcher/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F9FB]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* =====================================================
            LEFT VISUAL PANEL
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-[#002B56] text-white lg:flex lg:flex-col lg:justify-between">
          {/* Background geometry */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -left-28 -top-32 size-[28rem] rounded-full bg-[#0067FF]/25" />

            <div className="absolute -left-6 top-12 size-72 rounded-full border border-white/10" />

            <div className="absolute left-20 top-36 size-44 rounded-full border border-[#E1FFE1]/15" />

            <div className="absolute -bottom-28 -right-20 size-[30rem] rounded-full bg-[#E1FFE1]/[0.06]" />

            <div className="absolute bottom-8 right-12 size-64 rounded-full border border-[#0067FF]/20" />

            <div className="absolute inset-y-0 right-0 w-px bg-white/[0.08]" />
          </div>

          {/* Top */}
          <div className="relative z-10 p-10 xl:p-14">
            <Link
              href="/"
              aria-label="Go to ASL-JKKNIU website"
              className="inline-flex rounded-xl bg-white p-3"
            >
              <AslLogo className="h-auto w-44" />
            </Link>
          </div>

          {/* Main statement */}
          <div className="relative z-10 px-10 pb-10 xl:px-14 xl:pb-14">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1]" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                Researcher Portal
              </p>
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] xl:text-6xl">
              Research.
              <br />
              Build.
              <br />
              Contribute.
              <span className="block text-[#7BAFFF]">
                Manage your work.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/60">
              Access your ASL researcher profile, publications,
              projects, and academic contributions from one place.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              <div className="bg-[#002B56]/90 p-4">
                <FlaskConical className="size-4 text-[#E1FFE1]" />

                <p className="mt-3 text-xs font-medium">
                  Research
                </p>
              </div>

              <div className="bg-[#002B56]/90 p-4">
                <Sparkles className="size-4 text-[#7BAFFF]" />

                <p className="mt-3 text-xs font-medium">
                  Projects
                </p>
              </div>

              <div className="bg-[#002B56]/90 p-4">
                <LockKeyhole className="size-4 text-[#E1FFE1]" />

                <p className="mt-3 text-xs font-medium">
                  Secure Access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LOGIN PANEL
        ====================================================== */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
          {/* Mobile/tablet decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 lg:hidden"
          >
            <div className="absolute -right-28 -top-32 size-80 rounded-full bg-[#E1FFE1]/60" />

            <div className="absolute -left-24 bottom-10 size-64 rounded-full border border-[#0067FF]/10" />
          </div>

          <div className="relative z-10 w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link
                href="/"
                className="inline-flex"
                aria-label="ASL-JKKNIU home"
              >
                <AslLogo className="h-auto w-40" />
              </Link>
            </div>

            {/* Heading */}
            <div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-8 rounded-full bg-[#0067FF]" />

                <div className="h-1.5 w-4 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067FF]">
                  Authorized access
                </p>
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-[#002B56] sm:text-4xl">
                Welcome back.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#002B56]/60">
                Sign in to continue to the ASL-JKKNIU Researcher
                Portal.
              </p>
            </div>

            {/* Login card */}
            <div className="mt-8 rounded-2xl border border-[#002B56]/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,43,86,0.08)] sm:p-8">
              <LoginForm />

              <div className="mt-7 border-t border-[#002B56]/10 pt-6">
                <div className="flex items-start gap-3 rounded-lg bg-[#E1FFE1]/30 p-4">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#0067FF]" />

                  <p className="text-xs leading-5 text-[#002B56]/55">
                    This portal is restricted to authorized
                    ASL-JKKNIU researchers and administrators.
                  </p>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/"
                className="group inline-flex items-center text-sm text-[#002B56]/55 transition-colors hover:text-[#0067FF]"
              >
                <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-0.5" />

                Back to ASL-JKKNIU website
              </Link>
            </div>

            {/* Footer / Easter egg */}
            <div className="mt-8 text-center text-xs text-[#002B56]/35">
              <p>
                Advanced System Lab · Jatiya Kabi Kazi Nazrul Islam
                University
              </p>

              <p className="mt-2">
                Designed &amp; developed by{" "}
                <a
                  href="https://www.linkedin.com/in/md-sajjad-hossen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#002B56]/50 transition-colors hover:text-[#0067FF]"
                >
                  Md. Sajjad Hossen
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}