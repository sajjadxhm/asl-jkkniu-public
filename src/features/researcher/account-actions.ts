"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";

export async function deleteResearcherAccount(userId: string) {
  const currentUser = await requireRole(["SUPER_ADMIN"]);
  if (userId === currentUser.id) {
    return { success: false, message: "You cannot delete your own account." };
  }
  if (typeof userId !== "string" || !userId.trim()) {
    return { success: false, message: "Invalid account." };
  }

  try {
    const actor = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { role: true, isActive: true },
    });
    if (!actor?.isActive || actor.role !== "SUPER_ADMIN") {
      return { success: false, message: "Only an active Super Admin can delete accounts." };
    }

    // The role condition also protects administrators if the target role changes.
    // User owns the Person foreign key; deleting User leaves all academic data intact.
    const deleted = await prisma.user.deleteMany({
      where: { id: userId, role: "RESEARCHER" },
    });
    if (deleted.count === 0) {
      return { success: false, message: "Only existing researcher accounts can be deleted." };
    }
  } catch {
    return { success: false, message: "Unable to delete the account. Please try again." };
  }

  revalidatePath("/admin/researchers");
  revalidatePath("/admin");
  return { success: true, message: "Login account deleted. The profile and academic records have been preserved." };
}
