import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Plus,
} from "lucide-react";

import { getResearcherPublications } from "@/features/publications/researcher-queries";
import { requireResearcher } from "@/lib/permissions/auth";
import { prisma } from "@/lib/db/prisma";

import { ResearcherPublicationTable } from "@/features/publications/components/researcher-publication-table";

export default async function ResearcherPublicationsPage() {
  const user = await requireResearcher();

  const userRecord = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!userRecord?.personId) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h1 className="font-semibold">
            Researcher profile unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your account is not currently connected to a
            researcher profile. Please contact an
            administrator.
          </p>
        </div>
      </main>
    );
  }

  const publications = await getResearcherPublications(
    userRecord.personId,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/researcher/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                My Publications
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your publications and research outputs.
              </p>
            </div>
          </div>
        </div>

        {/* Main Add Publication Action */}
        <Link
          href="/researcher/publications/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Publication
        </Link>
      </div>

      {/* Publications */}
      <ResearcherPublicationTable
        publications={publications}
      />
    </main>
  );
}