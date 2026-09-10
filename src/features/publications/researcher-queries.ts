import { prisma } from "@/lib/db/prisma";

export async function getResearcherPublications(
  personId: string,
) {
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