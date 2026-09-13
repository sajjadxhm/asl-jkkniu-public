import { publicMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicPageHeader } from "@/components/layout/public-page-header";
import { getPublicProjects } from "@/features/projects/queries";
import { statusLabels } from "@/features/projects/validations";

export const dynamic = "force-dynamic";
export const metadata = publicMetadata("/projects", { title: "ASL Projects", description: "Explore research projects, collaborators, and ongoing work at Advanced System Lab." });
export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <main className="bg-white text-[#002B56]">
      <PublicPageHeader eyebrow="Research in practice" title="Ideas into working systems." description="Explore ASL projects, from planned investigations and active experiments to completed research.">
        <div className="flex flex-wrap gap-5 text-sm text-[#002B56]/65">
          <span><strong className="font-semibold text-[#002B56]">{projects.length}</strong> projects</span>
          <span><strong className="font-semibold text-[#002B56]">{projects.filter((project) => project.status === "ONGOING").length}</strong> ongoing</span>
        </div>
      </PublicPageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#002B56]/15 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">ASL Projects</h2>
          <p className="text-xs text-[#002B56]/70">Featured projects first, then recently updated</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group flex min-w-0 flex-col rounded-xl border border-[#002B56]/12 bg-white p-5 transition-colors hover:border-[#0067FF]/50 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 ${project.status === "ONGOING" ? "bg-[#E1FFE1] text-[#002B56]" : "bg-[#F1F5F9] text-[#002B56]/75"}`}>
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${project.status === "ONGOING" ? "bg-[#0067FF]" : "bg-[#002B56]/40"}`} />{statusLabels[project.status]}
                </span>
                {project.isFeatured && <span className="text-[#0067FF]">Featured</span>}
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-7 tracking-tight [overflow-wrap:anywhere]">
                <Link href={`/projects/${project.slug}`} className="hover:text-[#0067FF]">{project.title}</Link>
              </h3>
              {project.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#002B56]/70 [overflow-wrap:anywhere]">{project.description}</p>}
              {!!project.researchAreas.length && <div className="mt-4 flex flex-wrap gap-1.5">
                {project.researchAreas.map(({ researchArea }) => <span key={researchArea.id} className="max-w-full rounded border border-[#002B56]/10 px-2 py-1 text-[10px] text-[#002B56]/70 [overflow-wrap:anywhere]">{researchArea.name}</span>)}
              </div>}
              <dl className="mt-5 space-y-2 border-t border-[#002B56]/8 pt-4 text-xs">
                <div><dt className="text-[10px] uppercase tracking-wider text-[#002B56]/65">Principal Investigator</dt><dd className="mt-1 font-medium [overflow-wrap:anywhere]">{project.principalInvestigator.name}</dd></div>
                {(project.startDate || project.endDate) && <div><dt className="sr-only">Project dates</dt><dd className="text-[#002B56]/65">{project.startDate?.toISOString().slice(0, 10) ?? "Start not set"} — {project.endDate?.toISOString().slice(0, 10) ?? "End not set"}</dd></div>}
              </dl>
              <div className="mt-auto pt-5"><Link href={`/projects/${project.slug}`} className="flex items-center justify-between text-xs font-semibold text-[#0067FF]" aria-label={`View project: ${project.title}`}>Explore project<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
            </article>
          ))}
        </div>
        {!projects.length && <p className="rounded-xl border border-dashed border-[#002B56]/20 p-8 text-center text-sm text-[#002B56]/65">Projects will be shared here as the lab adds them.</p>}
      </div>
    </main>
  );
}
