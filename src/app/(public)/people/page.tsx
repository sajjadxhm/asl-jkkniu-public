import { safeHttpUrl } from "@/lib/validations/url";
import { RESEARCHER_POSITION_GROUPS, getResearcherPositionLabel } from "@/lib/researcher-position";
import { publicMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PersonImage } from "@/components/people/person-image";
import { PublicPageHeader } from "@/components/layout/public-page-header";
import { getPeople } from "@/features/people/queries";

export const metadata = publicMetadata("/people", {
  title: "People",
  description: "Meet the researchers and members of Advanced System Lab, JKKNIU.",
});
type Person = Awaited<ReturnType<typeof getPeople>>[number];
const cardClass = "group flex min-w-0 flex-col rounded-xl border border-[#002B56]/12 bg-white p-4 transition-colors hover:border-[#0067FF]/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0067FF]";

function PersonCard({ person }: { person: Person }) {
  const isResearcher = Boolean(person.researcherProfile);
  const position = isResearcher ? getResearcherPositionLabel(person.researcherProfile!.position) : "Alumni / Co-researcher";
  const content = (
    <>
      <div className="flex items-start gap-4">
        <PersonImage name={person.name} src={person.profileImage} className="size-20 shrink-0 rounded-lg sm:size-24" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold leading-4 text-[#0067FF]">{position}</p>
          <h3 className="mt-1.5 text-base font-semibold leading-6 tracking-tight text-[#002B56] [overflow-wrap:anywhere] group-hover:text-[#0067FF] sm:text-lg">{person.name}</h3>
          {person.designation && <p className="mt-1 text-xs leading-5 text-[#002B56]/70 [overflow-wrap:anywhere]">{person.designation}</p>}
        </div>
      </div>
      {person.department && <p className="mt-3 text-xs leading-5 text-[#002B56]/65 [overflow-wrap:anywhere]">{person.department}</p>}
      {!!person.researchAreas.length && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {person.researchAreas.slice(0, 3).map(({ researchArea }) => (
            <span key={researchArea.id} className="max-w-full rounded bg-[#E1FFE1]/60 px-2 py-1 text-[11px] leading-4 text-[#002B56] [overflow-wrap:anywhere]">{researchArea.name}</span>
          ))}
          {person.researchAreas.length > 3 && <span className="py-1 text-[11px] text-[#002B56]/70">+{person.researchAreas.length - 3} more</span>}
        </div>
      )}
      <div className="mt-auto pt-4">
        <span className="flex items-center justify-between border-t border-[#002B56]/8 pt-3 text-xs font-semibold text-[#0067FF]">
          {isResearcher ? "View profile" : person.linkedinUrl ? "LinkedIn" : "ASL Member"}
          {isResearcher ? <ArrowUpRight aria-hidden="true" className="size-4" /> : person.linkedinUrl ? <ExternalLink aria-hidden="true" className="size-3.5" /> : null}
        </span>
      </div>
    </>
  );
  if (isResearcher) return <Link href={`/people/${person.slug}`} className={cardClass}>{content}</Link>;
  if (person.linkedinUrl) return <a href={safeHttpUrl(person.linkedinUrl)} target="_blank" rel="noopener noreferrer" className={cardClass}>{content}</a>;
  return <article className={cardClass}>{content}</article>;
}

export default async function PeoplePage() {
  const people = await getPeople();
  const groups = [
    ...RESEARCHER_POSITION_GROUPS,
    { id: "alumni", title: "Alumni & Co-researchers", position: null },
  ].map((group) => ({
    ...group,
    people: people.filter((person) => group.position
      ? person.researcherProfile?.position === group.position
      : !person.researcherProfile),
  })).filter((group) => group.people.length);
  return (
    <main className="bg-white text-[#002B56]">
      <PublicPageHeader eyebrow="Our People" title="The people behind ASL" description="Researchers, students, alumni, and collaborators advancing intelligent systems through shared curiosity and engineering.">
        <p className="text-sm text-[#002B56]/65">{people.length} {people.length === 1 ? "member" : "members"} in our public directory</p>
      </PublicPageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {!!groups.length && <nav aria-label="People groups" className="mb-8 flex flex-wrap gap-2 border-b border-[#002B56]/10 pb-5">
          {groups.map((group) => <a key={group.id} href={`#${group.id}`} className="rounded-md bg-[#F4F7FA] px-3 py-2 text-xs font-medium transition-colors hover:bg-[#E1FFE1]">{group.title} <span className="ml-1 text-[#0067FF]">{group.people.length}</span></a>)}
        </nav>}
        <div className="space-y-9">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
                <span className="text-xs tabular-nums text-[#0067FF]">{String(group.people.length).padStart(2, "0")}</span>
                <span aria-hidden="true" className="h-px flex-1 bg-[#002B56]/10" />
              </div>
              {group.id === "alumni" && <p className="mb-4 text-sm leading-6 text-[#002B56]/65">Former members and collaborators who have contributed to the work of Advanced System Lab.</p>}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.people.map((person) => <PersonCard key={person.id} person={person} />)}
              </div>
            </section>
          ))}
        </div>
        {!people.length && <div className="rounded-xl border border-dashed border-[#002B56]/20 p-8 text-center"><h2 className="font-semibold">No people available</h2><p className="mt-2 text-sm text-[#002B56]/65">People will appear here once they are published.</p></div>}
      </div>
    </main>
  );
}
