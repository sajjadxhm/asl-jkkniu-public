import { redirect } from "next/navigation";
import { requireRole } from "@/lib/permissions/auth";
import { prisma } from "@/lib/db/prisma";
import type { ProjectPortal } from "./validations";

// Projects belong to the lab: no ownership or per-project permissions.
export async function requireProjectAccess(portal?: ProjectPortal) {
  const user = await requireRole(portal === "admin" ? ["SUPER_ADMIN"] :
    portal === "researcher" ? ["RESEARCHER"] : ["SUPER_ADMIN", "RESEARCHER"]);
  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, isActive: true, mustChangePassword: true },
  });
  if (!account?.isActive) redirect("/login");
  if (account.role !== user.role) redirect("/login");
  if (account.role === "RESEARCHER" && account.mustChangePassword) {
    redirect("/researcher/change-password");
  }
  return user;
}
