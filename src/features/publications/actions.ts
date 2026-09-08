"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";
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

export async function createPublication(input: PublicationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid publication information.",
    };
  }

  const data = result.data;

  const slug = await generateUniqueSlug(data.title);

  const publication = await prisma.$transaction(async (tx) => {
    const created = await tx.publication.create({
      data: {
        title: data.title,
        slug,
        abstract: data.abstract || null,
        publicationType: data.publicationType,
        journal: data.journal || null,
        conference: data.conference || null,
        publisher: data.publisher || null,
        publicationDate: parsePublicationDate(data.publicationDate),
        doi: data.doi || null,
        url: data.url || null,
        pdfUrl: data.pdfUrl || null,
        citationCount: data.citationCount,
        isFeatured: data.isFeatured,
      },
    });

    await tx.publicationAuthor.createMany({
      data: data.authorIds.map((personId, index) => ({
        publicationId: created.id,
        personId,
        authorOrder: index,
      })),
    });

    if (data.researchAreaIds.length > 0) {
      await tx.publicationResearchArea.createMany({
        data: data.researchAreaIds.map((researchAreaId) => ({
          publicationId: created.id,
          researchAreaId,
        })),
      });
    }

    return created;
  });

  revalidatePath("/admin/publications");

  return {
    success: true,
    message: "Publication created successfully.",
    publicationId: publication.id,
  };
}

export async function updatePublication(
  id: string,
  input: PublicationInput,
) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  const result = publicationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid publication information.",
    };
  }

  const existingPublication = await prisma.publication.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingPublication) {
    return {
      success: false,
      message: "Publication not found.",
    };
  }

  const data = result.data;

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
        publicationDate: parsePublicationDate(data.publicationDate),
        doi: data.doi || null,
        url: data.url || null,
        pdfUrl: data.pdfUrl || null,
        citationCount: data.citationCount,
        isFeatured: data.isFeatured,
      },
    });

    await tx.publicationAuthor.deleteMany({
      where: {
        publicationId: id,
      },
    });

    await tx.publicationAuthor.createMany({
      data: data.authorIds.map((personId, index) => ({
        publicationId: id,
        personId,
        authorOrder: index,
      })),
    });

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

  revalidatePath("/admin/publications");
  revalidatePath(`/admin/publications/${id}/edit`);

  return {
    success: true,
    message: "Publication updated successfully.",
    publicationId: id,
  };
}

export async function deletePublication(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

  const existingPublication = await prisma.publication.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
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

  revalidatePath("/admin/publications");

  return {
    success: true,
    message: "Publication deleted successfully.",
  };
}