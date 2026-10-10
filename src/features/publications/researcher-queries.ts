import { prisma } from "@/lib/db/prisma";
import { requireResearcher } from "@/lib/permissions/auth";

async function requireOwnPerson(personId: string) {
  const actor = await requireResearcher();
  const account = await prisma.user.findUnique({ where: { id: actor.id }, select: { personId: true } });
  return account?.personId === personId;
}

export async function getResearcherPublications(
  personId: string,
) {
  if (!await requireOwnPerson(personId)) return [];
  return prisma.publication.findMany({
    where: {
      authors: {
        some: {
          personId,
        },
      },
    },

    orderBy: [
      {
        publicationDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          person: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },

      researchAreas: {
        include: {
          researchArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getResearcherPublicationById(
  id: string,
  personId: string,
) {
  if (!await requireOwnPerson(personId)) return null;
  return prisma.publication.findFirst({
    where: {
      id,
      authors: {
        some: {
          personId,
        },
      },
    },

    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          person: {
            select: {
              id: true,
              name: true,
              designation: true,
              slug: true,
            },
          },
        },
      },

      researchAreas: {
        include: {
          researchArea: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function getResearcherPublicationFormData() {
  await requireResearcher();
  const [people, researchAreas] =
    await Promise.all([
      prisma.person.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            name: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          designation: true,
        },
      }),

      prisma.researchArea.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            name: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

  return {
    people,
    researchAreas,
  };
}
