import Link from "next/link";

import { AslLogo } from "@/components/layout/asl-logo";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex"
            aria-label="ASL-JKKNIU home"
          >
            <AslLogo className="h-auto w-40" />
          </Link>

          <p className="mt-5 text-sm font-medium text-primary">
            Researcher Portal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Researcher Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to manage your academic profile and
            research activities.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
          <LoginForm />

          <div className="mt-6 border-t pt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to ASL-JKKNIU website
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized ASL-JKKNIU researchers only.
        </p>
      </div>
    </main>
  );
}