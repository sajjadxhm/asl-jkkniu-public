import { prisma } from "@/lib/db/prisma";
import { requireResearcherAccount, requireRole } from "@/lib/permissions/auth";

export async function getResearcherByUserId(userId: string) {
  const actor = await requireResearcherAccount();
  if (actor.id !== userId) return null;
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true, name: true, email: true, personId: true,
      person: {
        include: {
          researcherProfile: true,
          researchAreas: {
            include: {
              researchArea: true,
            },
          },
          publicationAuthors: {
            include: {
              publication: true,
            },
            orderBy: {
              publication: {
                publicationDate: "desc",
              },
            },
          },
          projectMemberships: {
            include: {
              project: true,
            },
          },
        },
      },
    },
  });
}

export async function getResearchersForAccountManagement() {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.user.findMany({
    where: {
      role: "RESEARCHER",
    },

    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      mustChangePassword: true,

      person: {
        select: {
          id: true,
          slug: true,
          profileImage: true,
          researcherProfile: { select: { position: true } },
          designation: true,
          department: true,
        },
      },
    },
  });
}
