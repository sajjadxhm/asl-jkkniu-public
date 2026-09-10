import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { PublicationForm } from "@/features/publications/components/publication-form";
import {
  getResearcherPublicationById,
  getResearcherPublicationFormData,
} from "@/features/publications/researcher-queries";
import { requireResearcher } from "@/lib/permissions/auth";
import { prisma } from "@/lib/db/prisma";

type EditResearcherPublicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditResearcherPublicationPage({
  params,
}: EditResearcherPublicationPageProps) {
  const user = await requireResearcher();

  const { id } = await params;

  const account = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!account?.personId) {
    notFound();
  }

  const [publication, formData] =
    await Promise.all([
      getResearcherPublicationById(
        id,
        account.personId,
      ),
      getResearcherPublicationFormData(),
    ]);

  if (!publication) {
    notFound();
  }

  const initialPublication = {
    id: publication.id,
    title: publication.title,
    abstract: publication.abstract,
    publicationType: publication.publicationType,
    journal: publication.journal,
    conference: publication.conference,
    publisher: publication.publisher,
    publicationDate: publication.publicationDate,
    doi: publication.doi,
    url: publication.url,
    pdfUrl: publication.pdfUrl,
    citationCount: publication.citationCount,
    isFeatured: publication.isFeatured,

    authors: publication.authors.map((author) =>
      author.person
        ? {
            type: "PERSON" as const,
            personId: author.person.id,
          }
        : {
            type: "EXTERNAL" as const,
            name: author.externalName ?? "",
          },
    ),

    researchAreaIds:
      publication.researchAreas.map(
        (item) => item.researchArea.id,
      ),
  };

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
              Edit Publication
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Update the publication information,
              authors, and research areas.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
        <PublicationForm
          mode="edit"
          portal="researcher"
          currentPersonId={account.personId}
          cancelPath="/researcher/publications"
          publication={initialPublication}
          people={formData.people}
          researchAreas={formData.researchAreas}
        />
      </div>
    </main>
  );
}