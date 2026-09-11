"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProject } from "../actions";
import { projectStatuses, statusLabels, type ProjectInput, type ProjectPortal } from "../validations";

export type ProjectListItem = {
  id: string; title: string; status: ProjectInput["status"]; isFeatured: boolean;
  principalInvestigator: { name: string }; startDate: string | null; endDate: string | null;
};
export function ProjectList({ projects, portal }: { projects: ProjectListItem[]; portal: ProjectPortal }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const visible = projects.filter((project) =>
    (!status || status === project.status) &&
    (project.title + " " + project.principalInvestigator.name).toLowerCase().includes(search.trim().toLowerCase()),
  );
  async function remove(project: ProjectListItem) {
    if (!window.confirm(`Delete "${project.title}"? This permanently removes the project and its membership/research-area links.`)) return;
    setDeletingId(project.id);
    try {
      const result = await deleteProject(project.id);
      if (!result.success) { toast.error(result.message); return; }
      toast.success(result.message);
      router.refresh();
    } catch { toast.error("Unable to delete the project. Please try again."); }
    finally { setDeletingId(null); }
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <input id="project-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or PI" className="w-full rounded-md border bg-background px-3 py-2.5 text-sm" />
        </div>
        <label className="flex items-center gap-3 text-sm">Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2.5">
            <option value="">All statuses</option>
            {projectStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}
          </select>
        </label>
      </div>
      <p className="text-sm text-muted-foreground">{visible.length} of {projects.length} projects</p>
      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((project) => (
          <article key={project.id} className="min-w-0 rounded-2xl border bg-background p-5 sm:p-6">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{statusLabels[project.status]}</span>
              {project.isFeatured && <span className="rounded-full bg-muted px-2.5 py-1">Featured</span>}
            </div>
            <h2 className="mt-3 font-semibold [overflow-wrap:anywhere]">{project.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground [overflow-wrap:anywhere]">PI: {project.principalInvestigator.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">Start: {project.startDate ?? "Not set"} · End: {project.endDate ?? "Not set"}</p>
            <div className="mt-5 flex flex-wrap gap-4 border-t pt-4 text-sm font-medium">
              <Link href={`/${portal}/projects/${project.id}/edit`} className="text-primary hover:underline">Edit</Link>
              <button type="button" disabled={deletingId !== null} onClick={() => remove(project)} className="text-destructive hover:underline disabled:opacity-50">
                {deletingId === project.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
        {projects.length ? "No projects match your search." : "No projects yet. Create the first ASL project."}
      </p>}
    </div>
  );
}
