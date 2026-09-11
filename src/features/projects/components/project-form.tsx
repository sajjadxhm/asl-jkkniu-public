"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createProject, updateProject } from "../actions";
import { projectSchema, projectSlug, projectStatuses, statusLabels, type ProjectInput, type ProjectPortal } from "../validations";

type Option = { id: string; name: string };
type Props = {
  portal: ProjectPortal;
  people: Option[];
  researchAreas: Option[];
  project?: { id: string; values: ProjectInput };
};
const inputClass = "w-full min-w-0 rounded-md border bg-background px-3 py-2.5 text-sm disabled:opacity-50";
export function ProjectForm({ portal, people, researchAreas, project }: Props) {
  const router = useRouter();
  const listPath = `/${portal}/projects`;
  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting, dirtyFields } } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project?.values ?? {
      title: "", slug: "", description: "", status: "PLANNED", startDate: "", endDate: "",
      principalInvestigatorId: "", memberIds: [], researchAreaIds: [], fundingSource: "", projectUrl: "", isFeatured: false,
    },
  });
  function fieldError(name: keyof ProjectInput) {
    return errors[name] ? <p id={`${name}-error`} role="alert" className="mt-1 text-sm text-destructive">{errors[name]?.message}</p> : null;
  }
  function accessibility(name: keyof ProjectInput) {
    return { "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-error` : undefined };
  }
  async function submit(values: ProjectInput) {
    try {
      const result = project ? await updateProject(project.id, values) : await createProject(values);
      if (!result.success) {
        if (result.errors) {
          for (const [name, messages] of Object.entries(result.errors)) {
            setError(name as keyof ProjectInput, { message: messages?.[0] ?? "Invalid value." });
          }
        }
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(listPath);
      router.refresh();
    } catch { toast.error("Unable to save the project. Please try again."); }
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="rounded-2xl border bg-background p-4 sm:p-6">
      <p className="mb-6 text-sm text-muted-foreground">Saved projects appear on the public Projects page. Required fields are marked *.</p>
      <fieldset disabled={isSubmitting} className="grid min-w-0 gap-6 sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">Title *</label>
          <input id="title" className={inputClass} {...accessibility("title")} {...register("title", {
            onChange: (event) => { if (!project && !dirtyFields.slug) setValue("slug", projectSlug(event.target.value)); },
          })} />
          {fieldError("title")}
        </div>
        <div className="min-w-0">
          <label htmlFor="slug" className="mb-2 block text-sm font-medium">Slug *</label>
          <input id="slug" className={inputClass} {...accessibility("slug")} {...register("slug")} />
          <p className="mt-1 text-xs text-muted-foreground">Used in /projects/your-slug. Changing it changes the public URL.</p>
          {fieldError("slug")}
        </div>
        <div className="min-w-0">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">Status *</label>
          <select id="status" className={inputClass} {...accessibility("status")} {...register("status")}>
            {projectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
          {fieldError("status")}
        </div>
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
          <textarea id="description" rows={6} className={inputClass} {...accessibility("description")} {...register("description")} />
          {fieldError("description")}
        </div>
        {(["startDate", "endDate"] as const).map((name) => (
          <div key={name} className="min-w-0">
            <label htmlFor={name} className="mb-2 block text-sm font-medium">{name === "startDate" ? "Start Date" : "End Date"}</label>
            <input id={name} type="date" className={inputClass} {...accessibility(name)} {...register(name)} />
            {fieldError(name)}
          </div>
        ))}
        <div className="min-w-0 sm:col-span-2">
          <label htmlFor="principalInvestigatorId" className="mb-2 block text-sm font-medium">Principal Investigator *</label>
          <select id="principalInvestigatorId" className={inputClass} {...accessibility("principalInvestigatorId")} {...register("principalInvestigatorId")}>
            <option value="">Choose a Person</option>
            {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
          {people.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Add a Person through directory management before creating a project.</p>}
          {fieldError("principalInvestigatorId")}
        </div>
        {([
          { name: "memberIds", label: "Project Members", options: people },
          { name: "researchAreaIds", label: "Research Areas", options: researchAreas },
        ] as const).map(({ name, label, options }) => (
          <fieldset key={name} className="min-w-0">
            <legend className="mb-2 text-sm font-medium">{label}</legend>
            <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
              {options.length === 0 && <p className="text-sm text-muted-foreground">No records available.</p>}
              {options.map((option) => (
                <label key={option.id} className="flex items-start gap-3 text-sm">
                  <input type="checkbox" value={option.id} className="mt-1 size-4 shrink-0" {...accessibility(name)} {...register(name)} />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{option.name}</span>
                </label>
              ))}
            </div>
            {fieldError(name)}
          </fieldset>
        ))}
        <div className="min-w-0">
          <label htmlFor="fundingSource" className="mb-2 block text-sm font-medium">Funding Source</label>
          <input id="fundingSource" className={inputClass} {...accessibility("fundingSource")} {...register("fundingSource")} />
          {fieldError("fundingSource")}
        </div>
        <div className="min-w-0">
          <label htmlFor="projectUrl" className="mb-2 block text-sm font-medium">Project URL</label>
          <input id="projectUrl" type="url" placeholder="https://" className={inputClass} {...accessibility("projectUrl")} {...register("projectUrl")} />
          {fieldError("projectUrl")}
        </div>
        <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
          <input type="checkbox" className="size-4" {...register("isFeatured")} />Featured Project
        </label>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-6 sm:col-span-2">
          <Link href={listPath} className="rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</Link>
          <button type="submit" className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {isSubmitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
