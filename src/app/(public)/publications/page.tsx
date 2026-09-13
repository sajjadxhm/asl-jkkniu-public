import Link from "next/link";
import { PublicationAuthor } from "@/features/publications/components/publication-author";
import { ArrowLeft, ArrowRight, ExternalLink, Star } from "lucide-react";
import { PublicPageHeader } from "@/components/layout/public-page-header";
import { getFeaturedPublications, getLatestPublications } from "@/features/publications/queries";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Publications",
  description: "Research publications and scientific outputs from ASL-JKKNIU.",
};
type Publication = Awaited<ReturnType<typeof getLatestPublications>>["publications"][number];
function PublicationLinks({ publication }: { publication: Publication }) {
  const links = [
    { label: "DOI", href: publication.doi ? `https://doi.org/${publication.doi}` : null },
    { label: "View publication", href: publication.url },
    { label: "PDF", href: publication.pdfUrl },
  ].filter((link) => link.href);
  if (!links.length) return null;
  return <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
    {links.map((link) => <a key={link.label} href={link.href!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0067FF] underline-offset-4 hover:underline">
      {link.label}<ExternalLink aria-hidden="true" className="size-3.5" />
    </a>)}
  </div>;
}
function PublicationEntry({ publication, featured = false }: { publication: Publication; featured?: boolean }) {
  const year = publication.publicationDate?.getFullYear();
  const date = publication.publicationDate ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(publication.publicationDate) : null;
  const venue = [publication.journal, publication.conference, publication.publisher].filter(Boolean);
  return (
    <article className={featured
      ? "min-w-0 rounded-xl border border-[#002B56]/10 bg-[#F5FAF8] p-5 sm:p-6"
      : "grid min-w-0 gap-3 border-b border-[#002B56]/12 py-6 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-6"}>
      {!featured && <p className="text-sm font-semibold tabular-nums text-[#0067FF]">{year ?? "Undated"}</p>}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {featured && <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0067FF]"><Star aria-hidden="true" className="size-3.5" />Featured</span>}
          <span className="rounded bg-[#E1FFE1]/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#002B56]">{publication.publicationType.replaceAll("_", " ")}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-7 tracking-tight text-[#002B56] [overflow-wrap:anywhere] sm:text-xl">{publication.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#002B56]/75 [overflow-wrap:anywhere]">
          {publication.authors.map((author, index) => <span key={author.person?.id ?? `external-${index}`}>
            {index > 0 && ", "}
            <PublicationAuthor author={author} className="underline-offset-4 hover:text-[#0067FF] hover:underline" />
          </span>)}
        </p>
        {(venue.length > 0 || date) && <p className="mt-2 text-xs leading-5 text-[#002B56]/70 [overflow-wrap:anywhere]">
          {venue.join(" · ")}{venue.length > 0 && date ? " · " : ""}{date}
        </p>}
        <PublicationLinks publication={publication} />
      </div>
    </article>
  );
}
function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return <nav aria-label="Publications pagination" className="mt-6 flex flex-wrap items-center justify-between gap-3">
    <div>{page > 1 && <Link href={`/publications?page=${page - 1}`} className="inline-flex items-center gap-2 rounded-md border border-[#002B56]/15 px-3 py-2.5 text-sm hover:bg-[#E1FFE1]/50"><ArrowLeft aria-hidden="true" className="size-4" />Previous</Link>}</div>
    <p className="text-xs tabular-nums text-[#002B56]/65">Page {page} of {totalPages}</p>
    <div>{page < totalPages && <Link href={`/publications?page=${page + 1}`} className="inline-flex items-center gap-2 rounded-md border border-[#002B56]/15 px-3 py-2.5 text-sm hover:bg-[#E1FFE1]/50">Next<ArrowRight aria-hidden="true" className="size-4" /></Link>}</div>
  </nav>;
}
export default async function PublicationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const [featured, { publications, total, totalPages }] = await Promise.all([
    getFeaturedPublications(), getLatestPublications(page, 10),
  ]);
  return (
    <main className="bg-white text-[#002B56]">
      <PublicPageHeader eyebrow="Research output" title="Knowledge, shared." description="Explore the publications, conference papers, and scientific contributions of ASL-JKKNIU researchers.">
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <span className="text-[#002B56]/65">{total} {total === 1 ? "publication" : "publications"}</span>
          <a href="#publication-library" className="inline-flex items-center gap-2 font-medium text-[#0067FF] hover:underline">Browse publications<ArrowRight aria-hidden="true" className="size-4" /></a>
        </div>
      </PublicPageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {!!featured.length && <section aria-labelledby="featured-heading">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 id="featured-heading" className="text-2xl font-semibold tracking-tight">Featured publications</h2>
            <span className="text-xs text-[#002B56]/70">Selected by ASL</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">{featured.map((publication) => <PublicationEntry key={publication.id} publication={publication} featured />)}</div>
        </section>}
        <section id="publication-library" className={`scroll-mt-28 ${featured.length ? "mt-12" : ""}`} aria-labelledby="library-heading">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#002B56] pb-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0067FF]">Research library</p><h2 id="library-heading" className="mt-2 text-2xl font-semibold tracking-tight">Latest publications</h2></div>
            <p className="text-xs text-[#002B56]/70">Ordered by publication date</p>
          </div>
          {publications.length ? publications.map((publication) => <PublicationEntry key={publication.id} publication={publication} />) : <div className="py-12 text-center">
            <h3 className="font-semibold">No publications found</h3>
            <p className="mt-2 text-sm text-[#002B56]/65">{total ? "There are no publications on this page." : "Publications will appear here once they are added."}</p>
            {total > 0 && <Link href="/publications" className="mt-4 inline-block text-sm text-[#0067FF] hover:underline">Return to the first page</Link>}
          </div>}
          {!!publications.length && <Pagination page={page} totalPages={totalPages} />}
        </section>
      </div>
    </main>
  );
}
