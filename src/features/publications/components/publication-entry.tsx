import { ExternalLink, Star } from "lucide-react";
import { PublicationAuthor } from "./publication-author";
import type { getLatestPublications } from "../queries";

type Publication = Pick<Awaited<ReturnType<typeof getLatestPublications>>["publications"][number],
  "title" | "publicationType" | "publicationDate" | "journal" | "conference" | "publisher" | "doi" | "url" | "pdfUrl" | "authors">;
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
export function PublicationEntry({ publication, featured = false }: { publication: Publication; featured?: boolean }) {
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
