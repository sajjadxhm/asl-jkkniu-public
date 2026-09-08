import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              ASL
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Research Lab Admin
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage ASL-JKKNIU content.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Advanced System Lab — JKKNIU
        </p>
      </div>
    </main>
  );
}