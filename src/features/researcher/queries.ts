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
          awards: true,
        },
      },
    },
  });
}