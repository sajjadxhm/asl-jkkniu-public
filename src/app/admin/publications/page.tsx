import Link from "next/link";

import { PublicationsTable } from "@/features/publications/components/publications-table";
import { getPublications } from "@/features/publications/queries";

export default async function AdminPublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Publications
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage journal articles, conference papers,
            books, theses, and other research publications.
          </p>
        </div>

        <Link
          href="/admin/publications/new"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
        >
          + Add Publication
        </Link>
      </div>

      <section className="rounded-xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <h3 className="font-semibold">
            All Publications
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {publications.length}{" "}
            {publications.length === 1
              ? "publication"
              : "publications"}{" "}
            in the database.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <PublicationsTable publications={publications} />
        </div>
      </section>
    </div>
  );
}