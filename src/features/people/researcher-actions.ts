"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { requireResearcher } from "@/lib/permissions/auth";
import {
  alumniSchema,
  type AlumniInput,
} from "@/lib/validations/alumni";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(name: string, excludeId?: string) {
  const baseSlug = createSlug(name);

  let slug = baseSlug || `person-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existing = await prisma.person.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function createAlumni(input: AlumniInput) {
  await requireResearcher();

  const result = alumniSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid Alumni / Co-researcher information.",
    };
  }

  const {
    name,
    linkedinUrl,
    profileImage,
    isActive,
  } = result.data;

  const slug = await generateUniqueSlug(name);

  const person = await prisma.person.create({
    data: {
      name,
      slug,
      linkedinUrl: linkedinUrl || null,
      profileImage: profileImage || null,
      isActive,
    },
  });

  revalidatePath("/people");
  revalidatePath("/researcher/people");

  return {
    success: true,
    message: "Alumni / Co-researcher added successfully.",
    personId: person.id,
  };
}

export async function updateAlumni(
  id: string,
  input: AlumniInput,
) {
  await requireResearcher();

  const result = alumniSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid Alumni / Co-researcher information.",
    };
  }

  const existingPerson = await prisma.person.findUnique({
    where: { id },
    select: {
      id: true,
      user: { select: { id: true } },
      researcherProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingPerson) {
    return {
      success: false,
      message: "Person not found.",
    };
  }

  // Researchers must not accidentally modify a real researcher
  // through the Alumni / Co-researcher interface.
  if (existingPerson.researcherProfile || existingPerson.user) {
    return {
      success: false,
      message:
        "This person is an active researcher. Manage the researcher profile instead.",
    };
  }

  const {
    name,
    linkedinUrl,
    profileImage,
    isActive,
  } = result.data;

  const slug = await generateUniqueSlug(name, id);

  await prisma.person.update({
    where: { id },
    data: {
      name,
      slug,
      linkedinUrl: linkedinUrl || null,
      profileImage: profileImage || null,
      isActive,
    },
  });

  revalidatePath("/people");
  revalidatePath("/researcher/people");

  return {
    success: true,
    message: "Alumni / Co-researcher updated successfully.",
  };
}

export async function deleteAlumni(id: string) {
  await requireResearcher();

  const existingPerson = await prisma.person.findUnique({
    where: { id },
    select: {
      id: true,
      user: { select: { id: true } },
      researcherProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingPerson) {
    return {
      success: false,
      message: "Person not found.",
    };
  }

  if (existingPerson.researcherProfile || existingPerson.user) {
    return {
      success: false,
      message:
        "This person is an active researcher and cannot be deleted from this section.",
    };
  }

  await prisma.person.delete({
    where: { id },
  });

  revalidatePath("/people");
  revalidatePath("/researcher/people");

  return {
    success: true,
    message: "Alumni / Co-researcher removed successfully.",
  };
}
