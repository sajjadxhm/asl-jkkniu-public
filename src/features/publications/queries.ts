import { prisma } from "@/lib/db/prisma";

export async function getPublications() {
  return prisma.publication.findMany({
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
          person: true,
        },
      },
      researchAreas: {
        include: {
          researchArea: true,
        },
      },
    },
  });
}

export async function getPublicationById(id: string) {
  return prisma.publication.findUnique({
    where: {
      id,
    },
    include: {
      authors: {
        orderBy: {
          authorOrder: "asc",
        },
        include: {
          person: true,
        },
      },
      researchAreas: {
        include: {
          researchArea: true,
        },
      },
    },
  });
}

export async function getPublicationFormData() {
  const [people, researchAreas] = await Promise.all([
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