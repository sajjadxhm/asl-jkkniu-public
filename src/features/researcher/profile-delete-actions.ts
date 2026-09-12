"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";

export async function deleteResearcherProfile(personId: string) {
  const currentUser = await requireRole(["SUPER_ADMIN"]);
  if (typeof personId !== "string" || !personId.trim()) {
    return { success: false, message: "Invalid profile." };
  }

  let slug: string;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({
        where: { id: currentUser.id },
        select: { role: true, isActive: true, personId: true },
      });
      if (!actor?.isActive || actor.role !== "SUPER_ADMIN") {
        return { success: false as const, message: "Only an active Super Admin can delete profiles." };
      }
      if (actor.personId === personId) {
        return { success: false as const, message: "You cannot delete your own profile." };
      }
      const person = await tx.person.findUnique({
        where: { id: personId },
        select: {
          name: true, slug: true,
          researcherProfile: { select: { id: true } },
          user: { select: { id: true, role: true } },
          _count: { select: { principalInvestigatorProjects: true } },
        },
      });
      if (!person?.researcherProfile) {
        return { success: false as const, message: "Researcher profile not found." };
      }
      if (person.user && (person.user.id === currentUser.id || person.user.role !== "RESEARCHER")) {
        return { success: false as const, message: "Administrator profiles cannot be deleted here." };
      }
      if (person._count.principalInvestigatorProjects > 0) {
        return { success: false as const, message: "Assign another principal investigator to this person's projects before deleting their profile." };
      }

      // Preserve publication authorship as text before the Person cascade runs.
      await tx.publicationAuthor.updateMany({
        where: { personId, OR: [{ externalName: null }, { externalName: "" }] },
        data: { externalName: person.name },
      });
      await tx.publicationAuthor.updateMany({ where: { personId }, data: { personId: null } });
      await tx.user.deleteMany({ where: { personId, role: "RESEARCHER" } });
      // Cascades remove profile, awards and membership/area links, not projects or publications.
      await tx.person.delete({ where: { id: personId } });
      return { success: true as const, slug: person.slug };
    }, { isolationLevel: "Serializable" });
    if (!result.success) return result;
    slug = result.slug;
  } catch {
    return { success: false, message: "Profile deletion could not be completed. No partial deletion was saved. Refresh and try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/people");
  revalidatePath("/admin/researchers");
  revalidatePath(`/admin/people/${personId}/edit`);
  revalidatePath("/people");
  revalidatePath(`/people/${slug}`);
  revalidatePath("/contact");
  revalidatePath("/join-us");
  revalidatePath("/publications");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin/projects", "layout");
  revalidatePath("/admin/publications", "layout");
  revalidatePath("/researcher/projects", "layout");
  revalidatePath("/researcher/publications", "layout");
  return { success: true, message: "Profile and login permanently deleted. Publications and projects were preserved." };
}
