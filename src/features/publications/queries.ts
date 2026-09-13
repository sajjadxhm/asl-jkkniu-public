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

const publicPublicationInclude = {
  authors: {
    orderBy: {
      authorOrder: "asc" as const,
    },
    include: {
      person: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          linkedinUrl: true,
          researcherProfile: { select: { isPublic: true } },
        },
      },
    },
  },
  researchAreas: {
    include: {
      researchArea: true,
    },
  },
};

export async function getFeaturedPublications() {
  return prisma.publication.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: [
      {
        publicationDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 4,
    include: publicPublicationInclude,
  });
}

export async function getLatestPublications(
  page: number,
  pageSize = 10,
) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;

  const [publications, total] = await Promise.all([
    prisma.publication.findMany({
      orderBy: [
        {
          publicationDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: safePageSize,
      include: publicPublicationInclude,
    }),

    prisma.publication.count(),
  ]);

  return {
    publications,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  };
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