import { prisma } from "@/lib/db/prisma";

export async function getPeople() {
  return prisma.person.findMany({
    orderBy: [
      {
        isActive: "desc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      researcherProfile: true,
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