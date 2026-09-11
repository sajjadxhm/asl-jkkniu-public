import { prisma } from "@/lib/db/prisma";
import { requireProjectAccess } from "./permissions";

const projectSummaryInclude = {
  principalInvestigator: { select: { id: true, name: true } },
  researchAreas: { include: { researchArea: { select: { id: true, name: true } } }, orderBy: { researchArea: { displayOrder: "asc" as const } } },
};
const projectOrder = [{ isFeatured: "desc" as const }, { updatedAt: "desc" as const }, { title: "asc" as const }];

export async function getProjectsForManagement() {
  await requireProjectAccess();
  return prisma.project.findMany({
    select: {
      id: true, title: true, status: true, isFeatured: true,
      startDate: true, endDate: true,
      principalInvestigator: { select: { name: true } },
    },
    orderBy: projectOrder,
  });
}
export async function getProjectForManagement(id: string) {
  await requireProjectAccess();
  return prisma.project.findUnique({
    where: { id },
    include: {
      members: { select: { personId: true } },
      researchAreas: { select: { researchAreaId: true } },
    },
  });
}
export async function getProjectFormOptions() {
  await requireProjectAccess();
  const [people, researchAreas] = await Promise.all([
    prisma.person.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.researchArea.findMany({ select: { id: true, name: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
  ]);
  return { people, researchAreas };
}
export async function getPublicProjects() {
  return prisma.project.findMany({ include: projectSummaryInclude, orderBy: projectOrder });
}
export async function getFeaturedProjects() {
  return prisma.project.findMany({ where: { isFeatured: true }, include: projectSummaryInclude, orderBy: projectOrder, take: 4 });
}
export async function getPublicProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      ...projectSummaryInclude,
      members: {
        include: { person: { select: { id: true, name: true } } },
        orderBy: { person: { name: "asc" } },
      },
    },
  });
}
