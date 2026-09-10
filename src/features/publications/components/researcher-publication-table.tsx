"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { deleteResearcherPublication } from "@/features/publications/researcher-actions";

type ResearcherPublication = {
  id: string;
  title: string;
  publicationType:
    | "JOURNAL"
    | "CONFERENCE"
    | "BOOK"
    | "BOOK_CHAPTER"
    | "THESIS"
    | "PREPRINT"
    | "OTHER";
  publicationDate: Date | null;
  doi: string | null;
  url: string | null;

  authors: {
    person: {
      id: string;
      name: string;
      slug: string;
    } | null;
    externalName: string | null;
  }[];
};

type ResearcherPublicationTableProps = {
  publications: ResearcherPublication[];
};

const typeLabels = {
  JOURNAL: "Journal Article",
  CONFERENCE: "Conference Paper",
  BOOK: "Book",
  BOOK_CHAPTER: "Book Chapter",
  THESIS: "Thesis",
  PREPRINT: "Preprint",
  OTHER: "Other",
} as const;

function formatYear(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).getFullYear();
}

function getAuthorName(author: ResearcherPublication["authors"][number]) {
  return author.person?.name ?? author.externalName ?? "Unknown Author";
}

export function ResearcherPublicationTable({
  publications,
}: ResearcherPublicationTableProps) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPublications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return publications;
    }

    return publications.filter((publication) => {
      const titleMatches = publication.title
        .toLowerCase()
        .includes(normalizedSearch);

      const authorMatches = publication.authors.some((author) =>
        getAuthorName(author).toLowerCase().includes(normalizedSearch),
      );

      return titleMatches || authorMatches;
    });
  }, [publications, search]);

  async function handleDelete(publication: ResearcherPublication) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${publication.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(publication.id);

    try {
      const result = await deleteResearcherPublication(publication.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to delete publication:", error);
      window.alert("Something went wrong while deleting the publication.");
    } finally {
      setDeletingId(null);
    }
  }

  /*
   * Empty state
   */
  if (publications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="size-5" />
        </div>

        <h2 className="mt-4 font-semibold">No publications yet</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add your first publication to build your research profile and
          showcase your work.
        </p>

        <Link
          href="/researcher/publications/new"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Publication
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full sm:max-w-md">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search publications or authors..."
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* No search results */}
      {filteredPublications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No matching publications</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* ============================================================
              Desktop Table
              ============================================================ */}
          <div className="hidden overflow-hidden rounded-xl border md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-5 py-3 text-left font-medium">
                    Publication
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Authors
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Year
                  </th>

                  <th className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPublications.map((publication) => (
                  <tr
                    key={publication.id}
                    className="border-b last:border-0"
                  >
                    {/* Publication */}
                    <td className="max-w-md px-5 py-4">
                      <p className="font-medium leading-6">
                        {publication.title}
                      </p>

                      {publication.doi && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          DOI: {publication.doi}
                        </p>
                      )}
                    </td>

                    {/* Authors */}
                    <td className="max-w-xs px-5 py-4 text-muted-foreground">
                      {publication.authors
                        .map((author) => getAuthorName(author))
                        .join(", ")}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-muted-foreground">
                      {typeLabels[publication.publicationType]}
                    </td>

                    {/* Year */}
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatYear(publication.publicationDate)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {publication.url && (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Open publication"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}

                        <Link
                          href={`/researcher/publications/${publication.id}/edit`}
                          className="inline-flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Edit publication"
                        >
                          <Pencil className="size-4" />
                        </Link>

                        <button
                          type="button"
                          disabled={deletingId === publication.id}
                          onClick={() => handleDelete(publication)}
                          className="inline-flex size-9 items-center justify-center rounded-md border text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete publication"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ============================================================
              Mobile Cards
              ============================================================ */}
          <div className="space-y-3 md:hidden">
            {filteredPublications.map((publication) => (
              <article
                key={publication.id}
                className="rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium leading-6">
                      {publication.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {publication.authors
                        .map((author) => getAuthorName(author))
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    {typeLabels[publication.publicationType]}
                  </span>

                  <span>
                    {formatYear(publication.publicationDate)}
                  </span>
                </div>

                <div className="mt-4 flex gap-2 border-t pt-3">
                  {publication.url && (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
                    >
                      <ExternalLink className="size-4" />
                      View
                    </a>
                  )}

                  <Link
                    href={`/researcher/publications/${publication.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === publication.id}
                    onClick={() => handleDelete(publication)}
                    className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Result count */}
          <p className="text-xs text-muted-foreground">
            Showing {filteredPublications.length} of{" "}
            {publications.length} publications.
          </p>
        </>
      )}
    </div>
  );
}