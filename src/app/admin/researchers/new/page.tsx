import Link from "next/link";

import { CreateResearcherForm } from "@/features/researcher/components/create-researcher-form";

export default function NewResearcherPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/people"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to People
        </Link>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Create Researcher
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Create a researcher profile and login account
          for the ASL-JKKNIU researcher portal.
        </p>
      </div>

      <section className="max-w-4xl rounded-xl border bg-background p-5 sm:p-8">
        <CreateResearcherForm />
      </section>
    </div>
  );
}