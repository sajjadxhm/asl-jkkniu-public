import { prisma } from "@/lib/db/prisma";

export async function getPeople() {
  return prisma.person.findMany({
    where: {
      isActive: true,
      OR: [
        {
          researcherProfile: null,
        },
        {
          researcherProfile: {
            isPublic: true,
          },
        },
      ],
    },

    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],

    include: {
      researcherProfile: true,

      researchAreas: {
        include: {
          researchArea: true,
        },
        orderBy: {
          researchArea: {
            displayOrder: "asc",
          },
        },
      },
    },
  });
}

export async function getPersonById(id: string) {
  return prisma.person.findUnique({
    where: {
      id,
    },
  });
}

export async function getPublicResearcherBySlug(slug: string) {
  return prisma.person.findFirst({
    where: {
      slug,
      isActive: true,

      researcherProfile: {
        isPublic: true,
      },
    },

    include: {
      researcherProfile: true,

      researchAreas: {
        include: {
          researchArea: true,
        },

        orderBy: {
          researchArea: {
            displayOrder: "asc",
          },
        },
      },

      publicationAuthors: {
        orderBy: {
          publication: {
            publicationDate: "desc",
          },
        },

        include: {
          publication: {
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
            },
          },
        },
      },

      projectMemberships: {
        include: {
          project: {
            include: {
              principalInvestigator: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },

        orderBy: {
          project: {
            startDate: "desc",
          },
        },
      },

      principalInvestigatorProjects: {
        orderBy: {
          startDate: "desc",
        },
      },

      awards: {
        orderBy: {
          awardDate: "desc",
        },
      },
    },
  });
}