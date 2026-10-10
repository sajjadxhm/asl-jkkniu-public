import { prisma } from "@/lib/db/prisma";
import { requireRole, requireResearcher } from "@/lib/permissions/auth";

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

    select: {
      id: true, name: true, slug: true, designation: true, department: true,
      profileImage: true, linkedinUrl: true, isActive: true,
      researcherProfile: { select: { position: true } },

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

// Management includes people regardless of public visibility.
export async function getPeopleForManagement() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  return prisma.person.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { name: "asc" },
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
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  return prisma.person.findUnique({
    include: { researcherProfile: { select: { isPublic: true, position: true } } },
    where: {
      id,
    },
  });
}

export async function getPublicResearcherBySlug(slug: string) {
  return prisma.person.findFirst({
    where: {
      slug,
      // Directory listing status does not control published profile access.

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
                      isActive: true,
                      linkedinUrl: true,
                      researcherProfile: { select: { isPublic: true } },
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

export async function getAlumniAndCoResearchers() {
  return prisma.person.findMany({
    where: {
      researcherProfile: null,
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
      slug: true,
      linkedinUrl: true,
      profileImage: true,
      isActive: true,
    },
  });
}

export async function getAlumniAndCoResearchersForManagement() {
  await requireResearcher();
  return prisma.person.findMany({
    where: {
      researcherProfile: null,
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
      slug: true,
      linkedinUrl: true,
      profileImage: true,
      isActive: true,
    },
  });
}
// Published profile URLs include former members who are no longer in the directory.
export async function getPublicResearcherProfileUrls() {
  return prisma.person.findMany({
    where: { researcherProfile: { isPublic: true } },
    select: { slug: true },
  });
}
