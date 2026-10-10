"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import {
  requireResearcherAccount,
  requireRole,
} from "@/lib/permissions/auth";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/password";

export async function changeMyPassword(
  input: ChangePasswordInput,
) {
  const user = await requireResearcherAccount();

  const result = changePasswordSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Please check the password fields.",
    };
  }

  const { currentPassword, newPassword } = result.data;

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!dbUser) {
    return {
      success: false,
      message: "User account not found.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    dbUser.passwordHash,
  );

  if (!passwordMatches) {
    return {
      success: false,
      message: "Current password is incorrect.",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });

  revalidatePath("/researcher/dashboard");
  revalidatePath("/researcher/dashboard/profile");

  return {
    success: true,
    message: "Password changed successfully. Please sign in with your new password.",
  };
}

function generateTemporaryPassword() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

  const randomBytes = crypto.randomBytes(12);

  let password = "";

  for (let i = 0; i < 12; i += 1) {
    password += characters[randomBytes[i] % characters.length];
  }

  return password;
}

export async function resetResearcherPassword(
  userId: string,
) {
  await requireRole(["SUPER_ADMIN"]);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      message: "User account not found.",
    };
  }

  if (existingUser.role !== "RESEARCHER") {
    return {
      success: false,
      message: "Only researcher accounts can be reset here.",
    };
  }

  const temporaryPassword = generateTemporaryPassword();

  const passwordHash = await bcrypt.hash(
    temporaryPassword,
    12,
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
      mustChangePassword: true,
    },
  });

  return {
    success: true,
    message:
      "Temporary password generated successfully.",
    temporaryPassword,
    userName: existingUser.name,
    userEmail: existingUser.email,
  };
}

export async function setResearcherAccountStatus(
  userId: string,
  isActive: boolean,
) {
  await requireRole(["SUPER_ADMIN"]);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      message: "User account not found.",
    };
  }

  if (existingUser.role !== "RESEARCHER") {
    return {
      success: false,
      message:
        "Only researcher accounts can be managed here.",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
  });

  revalidatePath("/admin/researchers");
  revalidatePath("/admin/people");

  return {
    success: true,
    message: isActive
      ? "Researcher account enabled."
      : "Researcher account disabled.",
  };
}
