import "server-only";

import { prisma } from "@/lib/db/prisma";
import { publicPublicationInclude } from "@/features/publications/queries";

export async function getHomepageData() {
  // Publications have no draft/visibility field; all are public in the existing CMS.
  // Projects have no visibility field either; only ongoing work belongs here.
  const ongoingProjects = { status: "ONGOING" as const };
  const [publicationCount, researcherCount, projectCount, researchAreaCount, publications, projects, researchAreas] = await Promise.all([
    prisma.publication.count(),
    prisma.person.count({
      where: {
        isActive: true,
        researcherProfile: { isPublic: true },
        // No login is required, but disabled accounts are excluded from this statistic only.
        OR: [{ user: null }, { user: { isActive: true } }],
      },
    }),
    prisma.project.count({ where: ongoingProjects }),
    prisma.researchArea.count({ where: { isActive: true } }),
    prisma.publication.findMany({
      take: 3,
      // One query fills featured slots with latest publications, without duplicates.
      orderBy: [
        { isFeatured: "desc" },
        { publicationDate: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
        { id: "asc" },
      ],
      select: {
        id: true, title: true, publicationType: true, publicationDate: true,
        journal: true, conference: true, publisher: true,
        doi: true, url: true, pdfUrl: true, isFeatured: true,
        authors: publicPublicationInclude.authors,
      },
    }),
    prisma.project.findMany({
      where: ongoingProjects,
      take: 3,
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }, { id: "asc" }],
      select: {
        id: true, title: true, slug: true, description: true,
        principalInvestigator: { select: { name: true } },
      },
    }),
    prisma.researchArea.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { id: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  return { publicationCount, researcherCount, projectCount, researchAreaCount, publications, projects, researchAreas };
}
