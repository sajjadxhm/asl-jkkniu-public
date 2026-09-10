import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

import { PublicationForm } from "@/features/publications/components/publication-form";
import {
  getResearcherPublicationFormData,
} from "@/features/publications/researcher-queries";
import { requireResearcher } from "@/lib/permissions/auth";
import { prisma } from "@/lib/db/prisma";

export default async function NewResearcherPublicationPage() {
  const user = await requireResearcher();

  const account = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!account?.personId) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h1 className="font-semibold">
            Researcher profile unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Your account is not connected to a researcher
            profile.
          </p>
        </div>
      </main>
    );
  }

  const { people, researchAreas } =
    await getResearcherPublicationFormData();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/researcher/publications"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to publications
        </Link>

        <div className="mt-5 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Add Publication
            </h1>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add a publication to your ASL-JKKNIU research
              profile.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
        <PublicationForm
          mode="create"
          portal="researcher"
          currentPersonId={account.personId}
          cancelPath="/researcher/publications"
          people={people}
          researchAreas={researchAreas}
        />
      </div>
    </main>
  );
}