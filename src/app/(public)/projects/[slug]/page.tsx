import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProject } from "@/features/projects/queries";
import { statusLabels } from "@/features/projects/validations";

export const dynamic = "force-dynamic";
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProject(slug);
  if (!project) notFound();
  // Also protect links from legacy values not written through the current form.
  const externalUrl = project.projectUrl && /^https?:\/\//i.test(project.projectUrl) ? project.projectUrl : null;
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/projects" className="text-sm font-medium text-primary hover:underline">Back to ASL Projects</Link>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{statusLabels[project.status]}</span>
        {project.isFeatured && <span className="rounded-full bg-muted px-2.5 py-1">Featured</span>}
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-4xl">{project.title}</h1>
      {project.description && <p className="mt-6 whitespace-pre-wrap leading-7 text-muted-foreground [overflow-wrap:anywhere]">{project.description}</p>}
      <section className="mt-8 rounded-2xl border bg-background p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Project information</h2>
        <dl className="mt-5 grid gap-6 sm:grid-cols-2">
          <div className="min-w-0"><dt className="text-sm text-muted-foreground">Principal Investigator</dt><dd className="mt-1 [overflow-wrap:anywhere]">{project.principalInvestigator.name}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Dates</dt><dd className="mt-1 text-sm">Start: {project.startDate?.toISOString().slice(0, 10) ?? "Not set"}<br />End: {project.endDate?.toISOString().slice(0, 10) ?? "Not set"}</dd></div>
          {project.fundingSource && <div className="min-w-0"><dt className="text-sm text-muted-foreground">Funding Source</dt><dd className="mt-1 [overflow-wrap:anywhere]">{project.fundingSource}</dd></div>}
          {externalUrl && <div className="min-w-0"><dt className="text-sm text-muted-foreground">Project website</dt><dd className="mt-1"><a href={externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline [overflow-wrap:anywhere]">{externalUrl}</a></dd></div>}
        </dl>
      </section>
      {!!project.members.length && <section className="mt-8"><h2 className="text-lg font-semibold">Project Members</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {project.members.map(({ person }) => <li key={person.id} className="min-w-0 rounded-xl border p-4 [overflow-wrap:anywhere]">{person.name}</li>)}
      </ul></section>}
      {!!project.researchAreas.length && <section className="mt-8"><h2 className="text-lg font-semibold">Research Areas</h2><div className="mt-4 flex flex-wrap gap-2">
        {project.researchAreas.map(({ researchArea }) => <span key={researchArea.id} className="max-w-full rounded-lg bg-muted px-3 py-2 text-sm [overflow-wrap:anywhere]">{researchArea.name}</span>)}
      </div></section>}
    </main>
  );
}
