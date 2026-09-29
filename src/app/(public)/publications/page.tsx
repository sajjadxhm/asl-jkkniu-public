import { publicMetadata } from "@/lib/seo";
import Link from "next/link";
import { PublicationEntry } from "@/features/publications/components/publication-entry";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PublicPageHeader } from "@/components/layout/public-page-header";
import { getFeaturedPublications, getLatestPublications } from "@/features/publications/queries";

export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const parsed = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed > 1 ? parsed : 1;
  return publicMetadata(page > 1 ? `/publications?page=${page}` : "/publications", {
  title: "Publications",
  description: "Research publications and scientific outputs from ASL-JKKNIU.",
});
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
