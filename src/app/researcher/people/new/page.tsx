import Link from "next/link";

import { requireResearcher } from "@/lib/permissions/auth";
import { AlumniForm } from "@/features/people/components/alumni-form";

export default async function NewResearcherPersonPage() {
  await requireResearcher();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/researcher/people"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Alumni & Co-researchers
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Add Alumni / Co-researcher
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a former ASL member or collaborator to the public
          People directory.
        </p>
      </div>

      <section className="rounded-xl border bg-background p-5 sm:p-8">
        <AlumniForm mode="create" />
      </section>
    </div>
  );
}