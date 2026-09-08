import Link from "next/link";

import { PublicationForm } from "@/features/publications/components/publication-form";
import { getPublicationFormData } from "@/features/publications/queries";

export default async function NewPublicationPage() {
  const { people, researchAreas } =
    await getPublicationFormData();

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
          Add Publication
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Add a journal article, conference paper, book,
          thesis, or other research publication.
        </p>
      </div>

      <section className="max-w-5xl rounded-xl border bg-background p-5 sm:p-8">
        <div className="mb-8 border-b pb-6">
          <h3 className="font-semibold">
            Publication Information
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the bibliographic and research information.
          </p>
        </div>

        <PublicationForm
          mode="create"
          people={people}
          researchAreas={researchAreas}
        />
      </section>
    </div>
  );
}