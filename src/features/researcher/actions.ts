"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

import { prisma } from "@/lib/db/prisma";
import {
  requireResearcher,
  requireRole,
} from "@/lib/permissions/auth";
import {
  createResearcherSchema,
  researcherProfileSchema,
} from "./validations";

function normalizeUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createResearcher(input: unknown) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const result = createResearcherSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Invalid researcher information.",
    };
  }

  const data = result.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "A user account with this email already exists.",
    };
  }

  const baseSlug = createSlug(data.name);

  let slug = baseSlug;
  let counter = 1;

  while (
    await prisma.person.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const researcher = await prisma.$transaction(async (tx) => {
    const person = await tx.person.create({
      data: {
        name: data.name,
        slug,
        email: data.email,
        designation: data.designation || null,
        department: data.department || null,
        isActive: true,
      },
    });

    await tx.researcherProfile.create({
      data: {
        personId: person.id,
        position: data.position,
        academicSession: data.academicSession || null,
        university:
          data.university ||
          "Jatiya Kabi Kazi Nazrul Islam University",
        isPublic: true,
      },
    });

    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: "RESEARCHER",
        isActive: true,
        personId: person.id,
      },
    });

    return {
      person,
      user,
    };
  });

  revalidatePath("/admin/people");
  revalidatePath("/researcher/dashboard");

  return {
    success: true,
    message: "Researcher account created successfully.",
    personId: researcher.person.id,
  };
}

export async function updateResearcherProfile(
  input: unknown,
) {
  const user = await requireResearcher();

  const result = researcherProfileSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid profile information.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!currentUser?.personId) {
    return {
      success: false,
      error: "Your account is not connected to a researcher profile.",
    };
  }

  await prisma.$transaction([
    prisma.person.update({
      where: {
        id: currentUser.personId,
      },
      data: {
        designation: data.designation || null,
        department: data.department || null,
        bio: data.bio || null,

        website: normalizeUrl(data.website),
        googleScholarUrl: normalizeUrl(data.googleScholarUrl),
        orcidUrl: normalizeUrl(data.orcidUrl),
        linkedinUrl: normalizeUrl(data.linkedinUrl),
        githubUrl: normalizeUrl(data.githubUrl),
      },
    }),

    prisma.researcherProfile.upsert({
      where: {
        personId: currentUser.personId,
      },
      create: {
        personId: currentUser.personId,
        position: data.position,
        academicSession: data.academicSession || null,
        university: data.university || null,
        researchStatement: data.researchStatement || null,
        education: data.education || null,
        experience: data.experience || null,
        skills: data.skills || null,
        researchInterests: data.researchInterests || null,
        phone: data.phone || null,
        isPublic: data.isPublic,
      },
      update: {
        position: data.position,
        academicSession: data.academicSession || null,
        university: data.university || null,
        researchStatement: data.researchStatement || null,
        education: data.education || null,
        experience: data.experience || null,
        skills: data.skills || null,
        researchInterests: data.researchInterests || null,
        phone: data.phone || null,
        isPublic: data.isPublic,
      },
    }),
  ]);

  revalidatePath("/researcher/dashboard");
  revalidatePath("/researcher/dashboard/profile");
  revalidatePath("/people");

  return {
    success: true,
  };
}

export async function updateResearcherProfileImage(
  profileImage: string | null,
) {
  const user = await requireResearcher();

  if (profileImage !== null && profileImage.trim() === "") {
    return {
      success: false,
      error: "Invalid profile image.",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!currentUser?.personId) {
    return {
      success: false,
      error:
        "Your account is not connected to a researcher profile.",
    };
  }

  await prisma.person.update({
    where: {
      id: currentUser.personId,
    },
    data: {
      profileImage,
    },
  });

  revalidatePath("/researcher/dashboard");
  revalidatePath("/researcher/dashboard/profile");
  revalidatePath("/people");

  return {
    success: true,
  };
}

export async function uploadResearcherProfileImage(
  formData: FormData,
) {
  const user = await requireResearcher();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false,
      error: "Please select an image.",
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "Only JPG, PNG, and WebP images are allowed.",
    };
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return {
      success: false,
      error: "Profile photo must be smaller than 5 MB.",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!currentUser?.personId) {
    return {
      success: false,
      error:
        "Your account is not connected to a researcher profile.",
    };
  }

  const personId = currentUser.personId;

  const extension =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : "webp";

  const filePath = `researchers/${personId}/profile.${extension}`;

  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } =
    await supabaseServer.storage
      .from("researcher-photos")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

  if (uploadError) {
    console.error(
      "Profile photo upload failed:",
      uploadError,
    );

    return {
      success: false,
      error: "Failed to upload profile photo.",
    };
  }

  const {
    data: { publicUrl },
  } = supabaseServer.storage
    .from("researcher-photos")
    .getPublicUrl(filePath);

  await prisma.person.update({
    where: {
      id: personId,
    },
    data: {
      profileImage: publicUrl,
    },
  });

  revalidatePath("/researcher/dashboard");
  revalidatePath("/researcher/dashboard/profile");
  revalidatePath("/people");

  return {
    success: true,
    profileImage: publicUrl,
  };
}

export async function removeResearcherProfileImage() {
  const user = await requireResearcher();

  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      personId: true,
    },
  });

  if (!currentUser?.personId) {
    return {
      success: false,
      error:
        "Your account is not connected to a researcher profile.",
    };
  }

  const personId = currentUser.personId;

  const { data: files, error: listError } =
    await supabaseServer.storage
      .from("researcher-photos")
      .list(`researchers/${personId}`);

  if (listError) {
    console.error(
      "Profile photo listing failed:",
      listError,
    );

    return {
      success: false,
      error: "Failed to remove profile photo.",
    };
  }

  if (files.length > 0) {
    const paths = files.map(
      (file) =>
        `researchers/${personId}/${file.name}`,
    );

    const { error: removeError } =
      await supabaseServer.storage
        .from("researcher-photos")
        .remove(paths);

    if (removeError) {
      console.error(
        "Profile photo removal failed:",
        removeError,
      );

      return {
        success: false,
        error: "Failed to remove profile photo.",
      };
    }
  }

  await prisma.person.update({
    where: {
      id: personId,
    },
    data: {
      profileImage: null,
    },
  });

  revalidatePath("/researcher/dashboard");
  revalidatePath("/researcher/dashboard/profile");
  revalidatePath("/people");

  return {
    success: true,
  };
}