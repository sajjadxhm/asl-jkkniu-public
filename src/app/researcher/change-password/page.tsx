import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { requireResearcherAccount } from "@/lib/permissions/auth";

export default async function ChangePasswordPage() {
  const user = await requireResearcherAccount();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Change Your Password
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to the ASL-JKKNIU researcher portal,
            {user.name ? ` ${user.name}` : ""}.
          </p>
        </div>

        <section className="rounded-xl border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            Your account was created with a temporary
            password. Please change it before continuing
            to the researcher portal.
          </div>

          <ChangePasswordForm />
        </section>
      </div>
    </main>
  );
}