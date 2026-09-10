import Link from "next/link";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";

import {
  getFeaturedPublications,
  getLatestPublications,
} from "@/features/publications/queries";

export const dynamic = "force-dynamic";

interface PublicationsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function getPublicationYear(date: Date | null) {
  if (!date) return null;
  return date.getFullYear();
}

function getPublicationTypeLabel(type: string) {
  return type.replaceAll("_", " ");
}

function getAuthorKey(
  author: {
    person: {
      id: string;
    } | null;
    externalName: string | null;
  },
  index: number,
) {
  return (
    author.person?.id ??
    `external-${author.externalName ?? "author"}-${index}`
  );
}

function Authors({
  authors,
}: {
  authors: {
    person: {
      id: string;
      name: string;
      slug: string;
    } | null;
    externalName: string | null;
  }[];
}) {
  return (
    <div className="text-sm leading-6 text-muted-foreground">
      {authors.map((author, index) => (
        <span key={getAuthorKey(author, index)}>
          {index > 0 && ", "}

          {author.person ? (
            <Link
              href={`/people/${author.person.slug}`}
              className="hover:text-primary"
            >
              {author.person.name}
            </Link>
          ) : (
            <span>{author.externalName}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function PublicationLinks({
  doi,
  url,
  pdfUrl,
}: {
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
}) {
  if (!doi && !url && !pdfUrl) return null;

  return (
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
      {doi && (
        <a
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          DOI
          <ExternalLink className="size-3.5" />
        </a>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View publication
          <ExternalLink className="size-3.5" />
        </a>
      )}

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          PDF
          <ExternalLink className="size-3.5" />
        </a>
      )}
    </div>
  );
}

function FeaturedPublicationCard({
  publication,
}: {
  publication: Awaited<
    ReturnType<typeof getFeaturedPublications>
  >[number];
}) {
  return (
    <article className="group rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/20 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Star className="size-3.5" />
          Featured
        </div>

        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
          {getPublicationTypeLabel(publication.publicationType)}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-7 tracking-tight sm:text-2xl">
        {publication.title}
      </h3>

      <div className="mt-4">
        <Authors authors={publication.authors} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {publication.journal && (
          <span>{publication.journal}</span>
        )}

        {publication.conference && (
          <span>{publication.conference}</span>
        )}

        {publication.publisher && (
          <span>{publication.publisher}</span>
        )}

        {publication.publicationDate && (
          <span>
            {formatDate(publication.publicationDate)}
          </span>
        )}
      </div>

      <PublicationLinks
        doi={publication.doi}
        url={publication.url}
        pdfUrl={publication.pdfUrl}
      />
    </article>
  );
}

function LatestPublicationCard({
  publication,
}: {
  publication: Awaited<
    ReturnType<typeof getLatestPublications>
  >["publications"][number];
}) {
  const year = getPublicationYear(
    publication.publicationDate,
  );

  return (
    <article className="rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="max-w-4xl text-lg font-semibold leading-7">
          {publication.title}
        </h2>

        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
          {getPublicationTypeLabel(publication.publicationType)}
        </span>
      </div>

      <div className="mt-3">
        <Authors authors={publication.authors} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {publication.journal && (
          <span>{publication.journal}</span>
        )}

        {publication.conference && (
          <span>{publication.conference}</span>
        )}

        {publication.publisher && (
          <span>{publication.publisher}</span>
        )}

        {year && <span>{year}</span>}
      </div>

      <PublicationLinks
        doi={publication.doi}
        url={publication.url}
        pdfUrl={publication.pdfUrl}
      />
    </article>
  );
}

function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <nav
      aria-label="Publications pagination"
      className="flex items-center justify-between border-t pt-6"
    >
      {page > 1 ? (
        <Link
          href={`/publications?page=${previousPage}`}
          className="inline-flex items-center rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="mr-2 size-4" />
          Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={`/publications?page=${nextPage}`}
          className="inline-flex items-center rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Next
          <span className="ml-2">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export async function generateMetadata() {
  return {
    title: "Publications",
    description:
      "Research publications and scientific outputs from ASL-JKKNIU.",
  };
}

export default async function PublicationsPage({
  searchParams,
}: PublicationsPageProps) {
  const params = await searchParams;

  const parsedPage = Number.parseInt(
    params.page ?? "1",
    10,
  );

  const page =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const [featuredPublications, latestData] =
    await Promise.all([
      getFeaturedPublications(),
      getLatestPublications(page, 10),
    ]);

  const {
    publications,
    total,
    totalPages,
  } = latestData;

  return (
    <main className="min-h-screen">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-18">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Home
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Research Output
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Publications
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Explore research publications, conference papers,
              and other scientific outputs from researchers at
              ASL-JKKNIU.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        {/* Featured Publications */}
        {featuredPublications.length > 0 && (
          <section>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Featured
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Featured Publications
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Selected research publications highlighted by
                  ASL-JKKNIU.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {featuredPublications.map(
                (publication) => (
                  <FeaturedPublicationCard
                    key={publication.id}
                    publication={publication}
                  />
                ),
              )}
            </div>
          </section>
        )}

        {/* Latest Publications */}
        <section
          className={
            featuredPublications.length > 0
              ? "mt-16 border-t pt-14"
              : ""
          }
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Latest Research
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Latest Publications
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The most recently added publications from
                ASL-JKKNIU researchers.
              </p>
            </div>

            {total > 0 && (
              <p className="text-sm text-muted-foreground">
                {total} publication{total === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {publications.length > 0 ? (
            <div className="mt-7 space-y-4">
              {publications.map((publication) => (
                <LatestPublicationCard
                  key={publication.id}
                  publication={publication}
                />
              ))}

              <Pagination
                page={page}
                totalPages={totalPages}
              />
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed p-10 text-center">
              <h3 className="font-semibold">
                No publications found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Publications will appear here once they are
                added to the ASL-JKKNIU research database.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}