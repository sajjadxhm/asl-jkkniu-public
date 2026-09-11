"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { requireProjectAccess } from "./permissions";
import { projectSchema, type ProjectResult } from "./validations";

function refreshProjects() {
  revalidatePath("/admin/projects", "layout");
  revalidatePath("/researcher/projects", "layout");
  revalidatePath("/projects", "layout");
  revalidatePath("/people", "layout");
  revalidatePath("/researcher/dashboard");
  revalidatePath("/admin");
  revalidatePath("/");
}
function mutationError(error: unknown): ProjectResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return { success: false, message: "That project slug is already in use.", errors: { slug: ["Choose a unique slug."] } };
    if (error.code === "P2025") return { success: false, message: "Project no longer exists. Refresh the list." };
    if (error.code === "P2003") return { success: false, message: "A selected record no longer exists. Refresh the form and try again." };
  }
  console.error("Project mutation failed:", error);
  return { success: false, message: "Unable to save the project. Please try again." };
}
async function saveProject(input: unknown, id?: string): Promise<ProjectResult> {
  await requireProjectAccess();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the highlighted fields.", errors: parsed.error.flatten().fieldErrors };
  const { memberIds, researchAreaIds, startDate, endDate, ...fields } = parsed.data;
  try {
    const result = await prisma.$transaction(async (tx): Promise<ProjectResult> => {
      const personIds = [...new Set([fields.principalInvestigatorId, ...memberIds])];
      const [people, areas] = await Promise.all([
        tx.person.findMany({ where: { id: { in: personIds } }, select: { id: true } }),
        tx.researchArea.findMany({ where: { id: { in: researchAreaIds } }, select: { id: true } }),
      ]);
      const validPeople = new Set(people.map((person) => person.id));
      const errors: NonNullable<ProjectResult["errors"]> = {};
      if (!validPeople.has(fields.principalInvestigatorId)) errors.principalInvestigatorId = ["Choose an existing Person."];
      if (memberIds.some((personId) => !validPeople.has(personId))) errors.memberIds = ["One or more members no longer exist."];
      if (areas.length !== researchAreaIds.length) errors.researchAreaIds = ["One or more research areas no longer exist."];
      if (Object.keys(errors).length) return { success: false, message: "Please check the selected records.", errors };
      const data = {
        ...fields,
        description: fields.description || null,
        fundingSource: fields.fundingSource || null,
        projectUrl: fields.projectUrl || null,
        startDate: startDate ? new Date(startDate + "T00:00:00.000Z") : null,
        endDate: endDate ? new Date(endDate + "T00:00:00.000Z") : null,
      };
      const project = id
        ? await tx.project.update({ where: { id }, data })
        : await tx.project.create({ data });
      // Preserve historical member roles for retained members.
      await tx.projectMember.deleteMany({ where: { projectId: project.id, personId: { notIn: memberIds } } });
      await tx.projectMember.createMany({
        data: memberIds.map((personId) => ({ projectId: project.id, personId })), skipDuplicates: true,
      });
      await tx.projectResearchArea.deleteMany({ where: { projectId: project.id, researchAreaId: { notIn: researchAreaIds } } });
      await tx.projectResearchArea.createMany({
        data: researchAreaIds.map((researchAreaId) => ({ projectId: project.id, researchAreaId })), skipDuplicates: true,
      });
      return { success: true, message: id ? "Project updated." : "Project created." };
    });
    if (result.success) refreshProjects();
    return result;
  } catch (error) { return mutationError(error); }
}
export async function createProject(input: unknown) { return saveProject(input); }
export async function updateProject(id: string, input: unknown) {
  if (typeof id !== "string" || !id.trim()) {
    await requireProjectAccess();
    return { success: false, message: "Invalid project ID." };
  }
  return saveProject(input, id);
}
export async function deleteProject(id: string): Promise<ProjectResult> {
  await requireProjectAccess();
  if (typeof id !== "string" || !id.trim()) return { success: false, message: "Invalid project ID." };
  try {
    // Existing cascade rules remove only this project's join records.
    await prisma.project.delete({ where: { id } });
    refreshProjects();
    return { success: true, message: "Project deleted." };
  } catch (error) { return mutationError(error); }
}
