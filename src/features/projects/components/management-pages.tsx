import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProjectAccess } from "../permissions";
import { getProjectForManagement, getProjectFormOptions, getProjectsForManagement } from "../queries";
import type { ProjectPortal } from "../validations";
import { ProjectForm } from "./project-form";
import { ProjectList } from "./project-list";

function ProjectPage({ portal, children }: { portal: ProjectPortal; children: React.ReactNode }) {
  return <div className={portal === "researcher" ? "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10" : ""}>{children}</div>;
}
export async function ProjectManagementPage({ portal }: { portal: ProjectPortal }) {
  await requireProjectAccess(portal);
  const projects = await getProjectsForManagement();
  return (
    <ProjectPage portal={portal}>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">ASL Projects</h1>
          <p className="mt-2 text-muted-foreground">Manage ASL projects, collaborators, and research areas.</p>
        </div>
        <Link href={`/${portal}/projects/new`} className="inline-flex shrink-0 justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Create Project</Link>
      </div>
      <ProjectList portal={portal} projects={projects.map((project) => ({
        id: project.id, title: project.title, status: project.status, isFeatured: project.isFeatured,
        principalInvestigator: project.principalInvestigator,
        startDate: project.startDate?.toISOString().slice(0, 10) ?? null,
        endDate: project.endDate?.toISOString().slice(0, 10) ?? null,
      }))} />
    </ProjectPage>
  );
}
export async function ProjectEditorPage({ portal, id }: { portal: ProjectPortal; id?: string }) {
  await requireProjectAccess(portal);
  const [options, project] = await Promise.all([getProjectFormOptions(), id ? getProjectForManagement(id) : null]);
  if (id && !project) notFound();
  return (
    <ProjectPage portal={portal}>
      <div className="max-w-4xl space-y-6">
        <Link href={`/${portal}/projects`} className="text-sm text-primary hover:underline">Back to ASL Projects</Link>
        <h1 className="text-3xl font-semibold tracking-tight">{id ? "Edit Project" : "Create Project"}</h1>
        <ProjectForm portal={portal} {...options} project={project ? {
          id: project.id,
          values: {
            title: project.title, slug: project.slug, description: project.description ?? "", status: project.status,
            startDate: project.startDate?.toISOString().slice(0, 10) ?? "",
            endDate: project.endDate?.toISOString().slice(0, 10) ?? "",
            principalInvestigatorId: project.principalInvestigatorId,
            memberIds: project.members.map((member) => member.personId),
            researchAreaIds: project.researchAreas.map((area) => area.researchAreaId),
            fundingSource: project.fundingSource ?? "", projectUrl: project.projectUrl ?? "", isFeatured: project.isFeatured,
          },
        } : undefined} />
      </div>
    </ProjectPage>
  );
}
