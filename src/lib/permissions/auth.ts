import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export const USER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "RESEARCHER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Every protected call checks current state, including old JWTs and role changes.
  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, isActive: true, mustChangePassword: true },
  });
  if (!account?.isActive) return null;
  return account;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(
  allowedRoles: UserRole[],
) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "RESEARCHER") {
      redirect("/researcher/dashboard");
    }

    redirect("/admin");
  }

  return user;
}

export function hasRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
) {
  return allowedRoles.includes(userRole);
}

export async function requireResearcherAccount() {
  const user = await requireUser();

  if (user.role !== "RESEARCHER") {
    redirect("/admin");
  }

  return user;
}

export async function requireResearcher() {
  const user = await requireResearcherAccount();

  if (user.mustChangePassword) {
    redirect("/researcher/change-password");
  }

  return user;
}
