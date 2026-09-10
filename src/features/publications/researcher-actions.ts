"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { requireResearcher } from "@/lib/permissions/auth";
import {
  publicationSchema,
  type PublicationInput,
} from "@/lib/validations/publications";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePublicationDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

async function generateUniqueSlug(title: string) {
  const baseSlug = createSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.publication.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

async function getCurrentResearcherPersonId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      personId: true,
    },
  });

  return user?.personId ?? null;
}

/**
 * Validates the complete author list.
 *
 * Supported author types:
 *
 * PERSON
 *   - Must reference an active Person record.
 *
 * EXTERNAL
 *   - Stores only a name.
 *   - Does not create a Person record.
 *
 * The returned authors preserve the exact order
 * supplied by the publication form.
 */
async function validateAuthors(
  authors: PublicationInput["authors"],
) {
  if (authors.length === 0) {
    return {
      valid: false,
      message: "At least one author is required.",
      authors: [],
    };
  }

  /*
   * Check duplicate ASL researcher authors.
   */
  const personIds = authors
    .filter((author) => author.type === "PERSON")
    .map((author) => author.personId);

  const uniquePersonIds = [...new Set(personIds)];

  if (uniquePersonIds.length !== personIds.length) {
    return {
      valid: false,
      message: "Duplicate researcher authors are not allowed.",
      authors: [],
    };
  }

  /*
   * Check duplicate external authors by normalized name.
   */
  const externalNames = authors
    .filter((author) => author.type === "EXTERNAL")
    .map((author) => author.name.trim());

  const normalizedExternalNames = externalNames.map((name) =>
    name.toLowerCase(),
  );

  const uniqueExternalNames = [
    ...new Set(normalizedExternalNames),
  ];

  if (
    uniqueExternalNames.length !==
    normalizedExternalNames.length
  ) {
    return {
      valid: false,
      message: "Duplicate external authors are not allowed.",
      authors: [],
    };
  }

  /*
   * Validate ASL-JKKNIU researchers.
   */
  if (uniquePersonIds.length > 0) {
    const people = await prisma.person.findMany({
      where: {
        id: {
          in: uniquePersonIds,
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

    const hasInvalidPerson = uniquePersonIds.some(
      (personId) => !validPersonIds.has(personId),
    );

    if (hasInvalidPerson) {
      return {
        valid: false,
        message:
          "One or more selected researcher authors are unavailable.",
        authors: [],
      };
    }
  }

  /*
   * Return normalized authors while preserving
   * the exact order from the form.
   */
  const normalizedAuthors = authors.map((author) => {
    if (author.type === "PERSON") {
      return {
        type: "PERSON" as const,
        personId: author.personId,
      };
    }

    return {
      type: "EXTERNAL" as const,
      name: author.name.trim(),
    };
  });

  return {
    valid: true,
    message: "",
    authors: normalizedAuthors,
  };
}

async function validateResearchAreaIds(
  researchAreaIds: string[],
) {
  const uniqueResearchAreaIds = [
    ...new Set(researchAreaIds),
  ];

  if (uniqueResearchAreaIds.length === 0) {
    return {
      valid: true,
      message: "",
      researchAreaIds: [],
    };
  }

  if (
    uniqueResearchAreaIds.length !==
    researchAreaIds.length
  ) {
    return {
      valid: false,
      message: "Duplicate research areas are not allowed.",
      researchAreaIds: [],
    };
  }

  const areas = await prisma.researchArea.findMany({
    where: {
      id: {
        in: uniqueResearchAreaIds,
      },
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (areas.length !== uniqueResearchAreaIds.length) {
    return {
      valid: false,
      message:
        "One or more selected research areas are unavailable.",
      researchAreaIds: [],
    };
  }

  return {
    valid: true,
    message: "",
    researchAreaIds: uniqueResearchAreaIds,
  };
}

function revalidateResearcherPublicationPaths() {
  revalidatePath("/researcher/publications");
  revalidatePath("/researcher/dashboard");
  revalidatePath("/publications");
  revalidatePath("/people");
}

/**
 * Revalidates public profiles for all ASL researchers
 * currently connected to a publication.
 */
async function revalidatePublicationAuthorProfiles(
  publicationId: string,
) {
  const authors = await prisma.publicationAuthor.findMany({
    where: {
      publicationId,
      personId: {
        not: null,
      },
    },
    select: {
      person: {
        select: {
          slug: true,
        },
      },
    },
  });

  for (const author of authors) {
    if (author.person?.slug) {
      revalidatePath(`/people/${author.person.slug}`);
    }
  }
}

export async function createResearcherPublication(
  input: PublicationInput,
) {
  const user = await requireResearcher();

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid publication information.",
    };
  }

  const currentPersonId =
    await getCurrentResearcherPersonId(user.id);

  if (!currentPersonId) {
    return {
      success: false,
      message:
        "Your researcher profile is not connected to your account.",
    };
  }

  /*
   * Validate complete author list.
   */
  const authorValidation = await validateAuthors(
    result.data.authors,
  );

  if (!authorValidation.valid) {
    return {
      success: false,
      message: authorValidation.message,
    };
  }

  /*
   * The logged-in researcher MUST be an author.
   */
  const currentResearcherIsAuthor =
    authorValidation.authors.some(
      (author) =>
        author.type === "PERSON" &&
        author.personId === currentPersonId,
    );

  if (!currentResearcherIsAuthor) {
    return {
      success: false,
      message:
        "You must be included as an author of the publication.",
    };
  }

  /*
   * Validate research areas.
   */
  const researchAreaValidation =
    await validateResearchAreaIds(
      result.data.researchAreaIds,
    );

  if (!researchAreaValidation.valid) {
    return {
      success: false,
      message: researchAreaValidation.message,
    };
  }

  const data = result.data;

  const slug = await generateUniqueSlug(data.title);

  const publication = await prisma.$transaction(
    async (tx) => {
      const created =
        await tx.publication.create({
          data: {
            title: data.title,
            slug,
            abstract: data.abstract || null,
            publicationType: data.publicationType,
            journal: data.journal || null,
            conference: data.conference || null,
            publisher: data.publisher || null,
            publicationDate: parsePublicationDate(
              data.publicationDate,
            ),
            doi: data.doi || null,
            url: data.url || null,
            pdfUrl: data.pdfUrl || null,

            /*
             * Researchers cannot control administrative
             * citation count.
             */
            citationCount: 0,

            /*
             * Featured status is controlled by admins.
             */
            isFeatured: false,
          },
        });

      /*
       * Create authors in the exact order supplied
       * by the researcher.
       */
      await tx.publicationAuthor.createMany({
        data: authorValidation.authors.map(
          (author, index) => ({
            publicationId: created.id,

            personId:
              author.type === "PERSON"
                ? author.personId
                : null,

            externalName:
              author.type === "EXTERNAL"
                ? author.name
                : null,

            authorOrder: index,
          }),
        ),
      });

      /*
       * Create research-area relationships.
       */
      if (
        researchAreaValidation.researchAreaIds.length > 0
      ) {
        await tx.publicationResearchArea.createMany({
          data: researchAreaValidation.researchAreaIds.map(
            (researchAreaId) => ({
              publicationId: created.id,
              researchAreaId,
            }),
          ),
        });
      }

      return created;
    },
  );

  revalidateResearcherPublicationPaths();

  await revalidatePublicationAuthorProfiles(
    publication.id,
  );

  return {
    success: true,
    message: "Publication created successfully.",
    publicationId: publication.id,
  };
}

export async function updateResearcherPublication(
  id: string,
  input: PublicationInput,
) {
  const user = await requireResearcher();

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid publication information.",
    };
  }

  const currentPersonId =
    await getCurrentResearcherPersonId(user.id);

  if (!currentPersonId) {
    return {
      success: false,
      message:
        "Your researcher profile is not connected to your account.",
    };
  }

  /*
   * Find the publication and its current ASL authors.
   *
   * This is used to enforce ownership and later
   * revalidate affected public profiles.
   */
  const existingPublication =
    await prisma.publication.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authors: {
          select: {
            personId: true,
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

  /*
   * A researcher can edit a publication only if
   * they are currently an author of it.
   */
  const isCurrentAuthor =
    existingPublication.authors.some(
      (author) =>
        author.personId === currentPersonId,
    );

  if (!isCurrentAuthor) {
    return {
      success: false,
      message:
        "You do not have permission to edit this publication.",
    };
  }

  /*
   * Validate the submitted author list.
   */
  const authorValidation = await validateAuthors(
    result.data.authors,
  );

  if (!authorValidation.valid) {
    return {
      success: false,
      message: authorValidation.message,
    };
  }

  /*
   * The logged-in researcher cannot remove
   * themselves from the publication.
   */
  const currentResearcherIsAuthor =
    authorValidation.authors.some(
      (author) =>
        author.type === "PERSON" &&
        author.personId === currentPersonId,
    );

  if (!currentResearcherIsAuthor) {
    return {
      success: false,
      message:
        "You must remain an author of the publication.",
    };
  }

  /*
   * Validate research areas.
   */
  const researchAreaValidation =
    await validateResearchAreaIds(
      result.data.researchAreaIds,
    );

  if (!researchAreaValidation.valid) {
    return {
      success: false,
      message: researchAreaValidation.message,
    };
  }

  const data = result.data;

  await prisma.$transaction(async (tx) => {
    /*
     * Update bibliographic information.
     *
     * citationCount and isFeatured remain untouched
     * because they are admin-controlled fields.
     */
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
        publicationDate: parsePublicationDate(
          data.publicationDate,
        ),
        doi: data.doi || null,
        url: data.url || null,
        pdfUrl: data.pdfUrl || null,

        citationCount: undefined,
        isFeatured: undefined,
      },
    });

    /*
     * Replace author relationships.
     *
     * The submitted author array is the complete
     * source of truth for author membership and order.
     */
    await tx.publicationAuthor.deleteMany({
      where: {
        publicationId: id,
      },
    });

    await tx.publicationAuthor.createMany({
      data: authorValidation.authors.map(
        (author, index) => ({
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
        }),
      ),
    });

    /*
     * Replace research-area relationships.
     */
    await tx.publicationResearchArea.deleteMany({
      where: {
        publicationId: id,
      },
    });

    if (
      researchAreaValidation.researchAreaIds.length > 0
    ) {
      await tx.publicationResearchArea.createMany({
        data: researchAreaValidation.researchAreaIds.map(
          (researchAreaId) => ({
            publicationId: id,
            researchAreaId,
          }),
        ),
      });
    }
  });

  revalidateResearcherPublicationPaths();
  revalidatePath(`/researcher/publications/${id}/edit`);

  /*
   * Revalidate all ASL researcher profiles currently
   * associated with the updated publication.
   */
  await revalidatePublicationAuthorProfiles(id);

  /*
   * Also revalidate the old profiles. This is important
   * if an ASL co-author was removed during editing.
   */
  for (const author of existingPublication.authors) {
    if (author.person?.slug) {
      revalidatePath(`/people/${author.person.slug}`);
    }
  }

  return {
    success: true,
    message: "Publication updated successfully.",
    publicationId: id,
  };
}

export async function deleteResearcherPublication(
  id: string,
) {
  const user = await requireResearcher();

  const currentPersonId =
    await getCurrentResearcherPersonId(user.id);

  if (!currentPersonId) {
    return {
      success: false,
      message:
        "Your researcher profile is not connected to your account.",
    };
  }

  /*
   * Find the publication and its authors.
   */
  const publication =
    await prisma.publication.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        authors: {
          select: {
            personId: true,
            person: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

  if (!publication) {
    return {
      success: false,
      message: "Publication not found.",
    };
  }

  /*
   * A researcher can delete a publication only if
   * they are one of its authors.
   */
  const isCurrentAuthor =
    publication.authors.some(
      (author) =>
        author.personId === currentPersonId,
    );

  if (!isCurrentAuthor) {
    return {
      success: false,
      message:
        "You do not have permission to delete this publication.",
    };
  }

  /*
   * Delete the publication.
   *
   * PublicationAuthor and PublicationResearchArea
   * records are removed automatically through the
   * Prisma onDelete: Cascade relations.
   */
  await prisma.publication.delete({
    where: {
      id,
    },
  });

  revalidateResearcherPublicationPaths();

  /*
   * Refresh all affected ASL researcher profiles.
   */
  for (const author of publication.authors) {
    if (author.person?.slug) {
      revalidatePath(`/people/${author.person.slug}`);
    }
  }

  return {
    success: true,
    message: "Publication deleted successfully.",
  };
}