import { prisma } from "@/lib/db/prisma";

export async function getResearcherByUserId(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
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
          designation: true,
          department: true,
        },
      },
    },
  });
}