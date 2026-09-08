import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const USER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
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