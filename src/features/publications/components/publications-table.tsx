"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { deletePublication } from "@/features/publications/actions";

type PublicationTableItem = {
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
  isFeatured: boolean;

  authors: {
    person: {
      name: string;
    } | null;
    externalName: string | null;
  }[];
};

type PublicationsTableProps = {
  publications: PublicationTableItem[];
};

const typeLabels = {
  JOURNAL: "Journal",
  CONFERENCE: "Conference",
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

export function PublicationsTable({
  publications,
}: PublicationsTableProps) {
  const [search, setSearch] = useState("");

  const [type, setType] = useState<
    "ALL" | keyof typeof typeLabels
  >("ALL");

  const [featured, setFeatured] = useState<
    "ALL" | "FEATURED" | "REGULAR"
  >("ALL");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const filteredPublications = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return publications.filter((publication) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        publication.title
          .toLowerCase()
          .includes(normalizedSearch) ||
            publication.authors
              .map(
                (author) =>
                  author.person?.name ??
                  author.externalName ??
                  "Unknown Author",
              )
              .join(", ")

      const matchesType =
        type === "ALL" ||
        publication.publicationType === type;

      const matchesFeatured =
        featured === "ALL" ||
        (featured === "FEATURED" &&
          publication.isFeatured) ||
        (featured === "REGULAR" &&
          !publication.isFeatured);

      return (
        matchesSearch &&
        matchesType &&
        matchesFeatured
      );
    });
  }, [
    publications,
    search,
    type,
    featured,
  ]);

  async function handleDelete(
    publication: PublicationTableItem,
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${publication.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(publication.id);

    try {
      const result = await deletePublication(
        publication.id,
      );

      if (!result.success) {
        window.alert(result.message);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Failed to delete publication:",
        error,
      );

      window.alert(
        "Something went wrong while deleting the publication.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <div>
          <label
            htmlFor="publication-search"
            className="sr-only"
          >
            Search publications
          </label>

          <input
            id="publication-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search title or author..."
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <select
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as
                | "ALL"
                | keyof typeof typeLabels,
            )
          }
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          <option value="ALL">All Types</option>

          {Object.entries(typeLabels).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>

        <select
          value={featured}
          onChange={(event) =>
            setFeatured(
              event.target.value as
                | "ALL"
                | "FEATURED"
                | "REGULAR",
            )
          }
          className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          <option value="ALL">
            All Publications
          </option>
          <option value="FEATURED">
            Featured
          </option>
          <option value="REGULAR">
            Regular
          </option>
        </select>
      </div>

      {publications.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">
            No publications found
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your first publication to get started.
          </p>

          <Link
            href="/admin/publications/new"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Add Publication
          </Link>
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">
            No matching publications
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setType("ALL");
              setFeatured("ALL");
            }}
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">
                    Publication
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Authors
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Year
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPublications.map(
                  (publication) => (
                    <tr
                      key={publication.id}
                      className="border-b last:border-0"
                    >
                      <td className="max-w-md px-4 py-4">
                        <p className="font-medium">
                          {publication.title}
                        </p>
                      </td>

                      <td className="max-w-xs px-4 py-4 text-muted-foreground">
                        {publication.authors
                        .map(
                          (author) =>
                            author.person?.name ??
                            author.externalName ??
                            "Unknown Author",
                        )
                        .join(", ")}
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {
                          typeLabels[
                            publication
                              .publicationType
                          ]
                        }
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {formatYear(
                          publication.publicationDate,
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {publication.isFeatured ? (
                          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Regular
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/publications/${publication.id}/edit`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              publication.id
                            }
                            onClick={() =>
                              handleDelete(
                                publication,
                              )
                            }
                            className="text-sm font-medium text-destructive hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            publication.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredPublications.map(
              (publication) => (
                <div
                  key={publication.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {publication.title}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {publication.authors
                        .map(
                          (author) =>
                            author.person?.name ??
                            author.externalName ??
                            "Unknown Author",
                        )
                        .join(", ")}
                      </p>
                    </div>

                    {publication.isFeatured && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {
                        typeLabels[
                          publication
                            .publicationType
                        ]
                      }
                    </span>

                    <span>
                      {formatYear(
                        publication.publicationDate,
                      )}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-4 border-t pt-3">
                    <Link
                      href={`/admin/publications/${publication.id}/edit`}
                      className="text-sm font-medium text-primary"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        publication.id
                      }
                      onClick={() =>
                        handleDelete(
                          publication,
                        )
                      }
                      className="text-sm font-medium text-destructive disabled:opacity-50"
                    >
                      {deletingId ===
                      publication.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </>
      )}

      {filteredPublications.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {filteredPublications.length} of{" "}
          {publications.length}{" "}
          {publications.length === 1
            ? "publication"
            : "publications"}
          .
        </p>
      )}
    </div>
  );
}