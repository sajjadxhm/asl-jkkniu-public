import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicationForm } from "@/features/publications/components/publication-form";
import {
  getPublicationById,
  getPublicationFormData,
} from "@/features/publications/queries";

type EditPublicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({
  params,
}: EditPublicationPageProps) {
  const { id } = await params;

  const [publication, formData] =
    await Promise.all([
      getPublicationById(id),
      getPublicationFormData(),
    ]);

  if (!publication) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/publications"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Publications
        </Link>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Edit Publication
        </h2>

        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Update information for {publication.title}.
        </p>
      </div>

      <section className="max-w-5xl rounded-xl border bg-background p-5 sm:p-8">
        <div className="mb-8 border-b pb-6">
          <h3 className="font-semibold">
            Publication Information
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the bibliographic and research information.
          </p>
        </div>

        <PublicationForm
          mode="edit"
          people={formData.people}
          researchAreas={formData.researchAreas}
          publication={{
            id: publication.id,
            title: publication.title,
            abstract: publication.abstract,
            publicationType:
              publication.publicationType,
            journal: publication.journal,
            conference: publication.conference,
            publisher: publication.publisher,
            publicationDate:
              publication.publicationDate,
            doi: publication.doi,
            url: publication.url,
            pdfUrl: publication.pdfUrl,
            citationCount:
              publication.citationCount,
            isFeatured:
              publication.isFeatured,
            authorIds: publication.authors.map(
              (author) => author.personId,
            ),
            researchAreaIds:
              publication.researchAreas.map(
                (area) => area.researchAreaId,
              ),
          }}
        />
      </section>
    </div>
  );
}