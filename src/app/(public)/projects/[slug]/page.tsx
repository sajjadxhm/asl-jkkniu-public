import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageHeader } from "@/components/layout/public-page-header";
import { getPublicProject } from "@/features/projects/queries";
import { statusLabels } from "@/features/projects/validations";

export const dynamic = "force-dynamic";
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) notFound();
  const externalUrl = project.projectUrl && /^https?:\/\//i.test(project.projectUrl) ? project.projectUrl : null;
  return (
    <main className="bg-white text-[#002B56]">
      <PublicPageHeader eyebrow="ASL Projects" title={project.title} description={`Principal Investigator: ${project.principalInvestigator.name}`}>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="rounded bg-[#E1FFE1] px-3 py-1.5">{statusLabels[project.status]}</span>
          {project.isFeatured && <span className="text-[#0067FF]">Featured project</span>}
          <Link href="/projects" className="ml-auto text-[#0067FF] hover:underline">Back to ASL Projects</Link>
        </div>
      </PublicPageHeader>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:px-8 lg:py-12">
        <div className="min-w-0 space-y-9">
          {project.description && <section>
            <h2 className="border-b border-[#002B56]/15 pb-3 text-2xl font-semibold tracking-tight">Project overview</h2>
            <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#002B56]/75 [overflow-wrap:anywhere]">{project.description}</p>
          </section>}
          {!!project.members.length && <section>
            <h2 className="border-b border-[#002B56]/15 pb-3 text-2xl font-semibold tracking-tight">Project members</h2>
            <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {project.members.map(({ person }) => <li key={person.id} className="min-w-0 border-b border-[#002B56]/8 py-3 text-sm font-medium [overflow-wrap:anywhere]">{person.name}</li>)}
            </ul>
          </section>}
          {!!project.researchAreas.length && <section>
            <h2 className="text-xl font-semibold tracking-tight">Research areas</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.researchAreas.map(({ researchArea }) => <span key={researchArea.id} className="max-w-full rounded bg-[#E1FFE1]/60 px-3 py-2 text-xs [overflow-wrap:anywhere]">{researchArea.name}</span>)}
            </div>
          </section>}
        </div>
        <aside className="min-w-0">
          <section className="rounded-xl border border-[#002B56]/10 bg-[#F5FAF8] p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0067FF]">Project information</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div><dt className="text-xs text-[#002B56]/70">Principal Investigator</dt><dd className="mt-1 font-medium [overflow-wrap:anywhere]">{project.principalInvestigator.name}</dd></div>
              <div><dt className="text-xs text-[#002B56]/70">Start date</dt><dd className="mt-1">{project.startDate?.toISOString().slice(0, 10) ?? "Not set"}</dd></div>
              <div><dt className="text-xs text-[#002B56]/70">End date</dt><dd className="mt-1">{project.endDate?.toISOString().slice(0, 10) ?? "Not set"}</dd></div>
              {project.fundingSource && <div><dt className="text-xs text-[#002B56]/70">Funding source</dt><dd className="mt-1 [overflow-wrap:anywhere]">{project.fundingSource}</dd></div>}
              {externalUrl && <div className="border-t border-[#002B56]/10 pt-4"><dt className="text-xs text-[#002B56]/70">Project website</dt><dd className="mt-2"><a href={externalUrl} target="_blank" rel="noopener noreferrer" className="text-[#0067FF] underline underline-offset-4 [overflow-wrap:anywhere]">{externalUrl}</a></dd></div>}
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}
