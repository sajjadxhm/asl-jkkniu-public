"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";
import { publicationSchema } from "@/lib/validations/publications";

function createSlug(title: string) {
  return `${title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${Date.now()}`;
}

/*
 * Convert the HTML date input value (YYYY-MM-DD)
 * into a valid JavaScript Date for Prisma DateTime.
 *
 * Example:
 * "2026-07-15"
 * →
 * 2026-07-15T00:00:00.000Z
 */
function parsePublicationDate(
  date: string | undefined,
): Date | null {
  if (!date) return null;

  const [year, month, day] = date.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const parsedDate = new Date(
    Date.UTC(year, month - 1, day),
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export async function createPublication(input: unknown) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message:
        "Please check the publication information and try again.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    /*
     * Validate all ASL-JKKNIU researcher authors.
     * External authors do not need a Person record.
     */
    const personAuthorIds = data.authors
      .filter((author) => author.type === "PERSON")
      .map((author) => author.personId);

    if (personAuthorIds.length > 0) {
      const people = await prisma.person.findMany({
        where: {
          id: {
            in: personAuthorIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const validPersonIds = new Set(
        people.map((person) => person.id),
      );

      const hasInvalidAuthor = personAuthorIds.some(
        (personId) => !validPersonIds.has(personId),
      );

      if (hasInvalidAuthor) {
        return {
          success: false,
          message:
            "One or more selected researcher authors are invalid or inactive.",
        };
      }
    }

    /*
     * Validate research areas.
     */
    if (data.researchAreaIds.length > 0) {
      const researchAreas = await prisma.researchArea.findMany({
        where: {
          id: {
            in: data.researchAreaIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const validResearchAreaIds = new Set(
        researchAreas.map((area) => area.id),
      );

      const hasInvalidResearchArea =
        data.researchAreaIds.some(
          (areaId) => !validResearchAreaIds.has(areaId),
        );

      if (hasInvalidResearchArea) {
        return {
          success: false,
          message:
            "One or more selected research areas are invalid or inactive.",
        };
      }
    }

    /*
     * Parse publication date once before the transaction.
     */
    const publicationDate = parsePublicationDate(
      data.publicationDate,
    );

    /*
     * Create publication and relationships in one transaction.
     */
    const created = await prisma.$transaction(async (tx) => {
      const publication = await tx.publication.create({
        data: {
          title: data.title,
          slug: createSlug(data.title),
          abstract: data.abstract || null,
          publicationType: data.publicationType,
          journal: data.journal || null,
          conference: data.conference || null,
          publisher: data.publisher || null,
          publicationDate,
          doi: data.doi || null,
          url: data.url || null,
          pdfUrl: data.pdfUrl || null,
          citationCount: data.citationCount,

          /*
           * Super Admin/Admin/Editor can control
           * the Featured Publication status.
           */
          isFeatured: data.isFeatured,
        },
      });

      /*
       * Create authors while preserving the exact
       * order selected in the publication form.
       */
      if (data.authors.length > 0) {
        await tx.publicationAuthor.createMany({
          data: data.authors.map((author, index) => ({
            publicationId: publication.id,
            personId:
              author.type === "PERSON"
                ? author.personId
                : null,
            externalName:
              author.type === "EXTERNAL"
                ? author.name
                : null,
            authorOrder: index,
          })),
        });
      }

      /*
       * Create research-area relationships.
       */
      if (data.researchAreaIds.length > 0) {
        await tx.publicationResearchArea.createMany({
          data: data.researchAreaIds.map((researchAreaId) => ({
            publicationId: publication.id,
            researchAreaId,
          })),
        });
      }

      return publication;
    });

    /*
     * Refresh affected pages.
     */
    revalidatePath("/admin/publications");
    revalidatePath("/researcher/publications");
    revalidatePath("/publications");
    revalidatePath("/people");

    return {
      success: true,
      message: "Publication created successfully.",
      publicationId: created.id,
    };
  } catch (error) {
    console.error("Failed to create publication:", error);

    return {
      success: false,
      message:
        "Something went wrong while creating the publication.",
    };
  }
}

export async function updatePublication(
  id: string,
  input: unknown,
) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message:
        "Please check the publication information and try again.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    /*
     * Make sure the publication exists.
     */
    const existingPublication =
      await prisma.publication.findUnique({
        where: {
          id,
        },
        include: {
          authors: {
            include: {
              person: {
                select: {
                  id: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

    if (!existingPublication) {
      return {
        success: false,
        message: "Publication not found.",
      };
    }

    /*
     * Validate ASL-JKKNIU researcher authors.
     */
    const personAuthorIds = data.authors
      .filter((author) => author.type === "PERSON")
      .map((author) => author.personId);

    if (personAuthorIds.length > 0) {
      const people = await prisma.person.findMany({
        where: {
          id: {
            in: personAuthorIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const validPersonIds = new Set(
        people.map((person) => person.id),
      );

      const hasInvalidAuthor = personAuthorIds.some(
        (personId) => !validPersonIds.has(personId),
      );

      if (hasInvalidAuthor) {
        return {
          success: false,
          message:
            "One or more selected researcher authors are invalid or inactive.",
        };
      }
    }

    /*
     * Validate research areas.
     */
    if (data.researchAreaIds.length > 0) {
      const researchAreas = await prisma.researchArea.findMany({
        where: {
          id: {
            in: data.researchAreaIds,
          },
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const validResearchAreaIds = new Set(
        researchAreas.map((area) => area.id),
      );

      const hasInvalidResearchArea =
        data.researchAreaIds.some(
          (areaId) => !validResearchAreaIds.has(areaId),
        );

      if (hasInvalidResearchArea) {
        return {
          success: false,
          message:
            "One or more selected research areas are invalid or inactive.",
        };
      }
    }

    /*
     * Parse publication date before entering the transaction.
     */
    const publicationDate = parsePublicationDate(
      data.publicationDate,
    );

    /*
     * Update publication and relationships in one transaction.
     */
    await prisma.$transaction(async (tx) => {
      await tx.publication.update({
        where: {
          id,
        },
        data: {
          title: data.title,
          abstract: data.abstract || null,
          publicationType: data.publicationType,
          journal: data.journal || null,
          conference: data.conference || null,
          publisher: data.publisher || null,
          publicationDate,
          doi: data.doi || null,
          url: data.url || null,
          pdfUrl: data.pdfUrl || null,
          citationCount: data.citationCount,

          /*
           * Explicitly write the boolean value.
           */
          isFeatured: data.isFeatured,
        },
      });

      /*
       * Replace author relationships.
       *
       * The submitted array represents the complete
       * and exact author order.
       */
      await tx.publicationAuthor.deleteMany({
        where: {
          publicationId: id,
        },
      });

      if (data.authors.length > 0) {
        await tx.publicationAuthor.createMany({
          data: data.authors.map((author, index) => ({
            publicationId: id,
            personId:
              author.type === "PERSON"
                ? author.personId
                : null,
            externalName:
              author.type === "EXTERNAL"
                ? author.name
                : null,
            authorOrder: index,
          })),
        });
      }

      /*
       * Replace research-area relationships.
       */
      await tx.publicationResearchArea.deleteMany({
        where: {
          publicationId: id,
        },
      });

      if (data.researchAreaIds.length > 0) {
        await tx.publicationResearchArea.createMany({
          data: data.researchAreaIds.map((researchAreaId) => ({
            publicationId: id,
            researchAreaId,
          })),
        });
      }
    });

    /*
     * Read the record again immediately after the transaction.
     */
    const verifiedPublication =
      await prisma.publication.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          isFeatured: true,
        },
      });


    /*
     * Detect an unexpected database result.
     */
    if (
      verifiedPublication?.isFeatured !==
      data.isFeatured
    ) {
      console.error(
        "WARNING: isFeatured value did not persist as expected.",
        {
          submitted: data.isFeatured,
          database: verifiedPublication?.isFeatured,
          publicationId: id,
        },
      );

      return {
        success: false,
        message:
          "The publication was not saved correctly. The Featured Publication value could not be verified.",
      };
    }

    /*
     * Refresh affected pages.
     */
    revalidatePath("/admin/publications");
    revalidatePath(`/admin/publications/${id}/edit`);
    revalidatePath("/researcher/publications");
    revalidatePath(`/researcher/publications/${id}/edit`);
    revalidatePath("/publications");
    revalidatePath("/people");

    /*
     * Revalidate public profiles of existing ASL authors.
     */
    for (const author of existingPublication.authors) {
      if (author.person?.slug) {
        revalidatePath(
          `/people/${author.person.slug}`,
        );
      }
    }

    /*
     * Revalidate public profiles of newly submitted ASL authors.
     */
    const updatedPeople = await prisma.person.findMany({
      where: {
        id: {
          in: personAuthorIds,
        },
      },
      select: {
        slug: true,
      },
    });

    for (const person of updatedPeople) {
      revalidatePath(`/people/${person.slug}`);
    }

    return {
      success: true,
      message: "Publication updated successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to update publication:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while updating the publication.",
    };
  }
}

export async function deletePublication(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  try {
    const existingPublication =
      await prisma.publication.findUnique({
        where: {
          id,
        },
        include: {
          authors: {
            include: {
              person: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });

    if (!existingPublication) {
      return {
        success: false,
        message: "Publication not found.",
      };
    }

    await prisma.publication.delete({
      where: {
        id,
      },
    });

    /*
     * Refresh affected pages.
     */
    revalidatePath("/admin/publications");
    revalidatePath("/researcher/publications");
    revalidatePath("/publications");
    revalidatePath("/people");

    for (const author of existingPublication.authors) {
      if (author.person?.slug) {
        revalidatePath(
          `/people/${author.person.slug}`,
        );
      }
    }

    return {
      success: true,
      message: "Publication deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Failed to delete publication:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while deleting the publication.",
    };
  }
}
