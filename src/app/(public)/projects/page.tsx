import Link from "next/link";
import { getPublicProjects } from "@/features/projects/queries";
import { statusLabels } from "@/features/projects/validations";

export const dynamic = "force-dynamic";
export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-primary">Advanced System Lab</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">ASL Projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Explore what ASL is working on, from planned investigations to completed research.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="min-w-0 rounded-2xl border bg-background p-6">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{statusLabels[project.status]}</span>
              {project.isFeatured && <span className="rounded-full bg-muted px-2.5 py-1">Featured</span>}
            </div>
            <h2 className="mt-4 text-xl font-semibold [overflow-wrap:anywhere]">
              <Link href={`/projects/${project.slug}`} className="hover:text-primary">{project.title}</Link>
            </h2>
            {project.description && <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{project.description}</p>}
            <p className="mt-4 text-sm [overflow-wrap:anywhere]">PI: {project.principalInvestigator.name}</p>
            {(project.startDate || project.endDate) && <p className="mt-2 text-xs text-muted-foreground">
              {project.startDate?.toISOString().slice(0, 10) ?? "Start not set"} — {project.endDate?.toISOString().slice(0, 10) ?? "End not set"}
            </p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {project.researchAreas.map(({ researchArea }) => <span key={researchArea.id} className="max-w-full rounded-md bg-muted px-2 py-1 text-xs [overflow-wrap:anywhere]">{researchArea.name}</span>)}
            </div>
            <Link href={`/projects/${project.slug}`} className="mt-5 inline-block text-sm font-medium text-primary hover:underline">View project</Link>
          </article>
        ))}
      </div>
      {!projects.length && <p className="mt-8 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">Projects will be shared here as the lab adds them.</p>}
    </main>
  );
}
