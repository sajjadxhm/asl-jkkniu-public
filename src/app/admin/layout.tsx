import { requireRole } from "@/lib/permissions/auth";
import { AdminPortalShell } from "@/components/layout/admin-portal-shell";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  return (
    <AdminPortalShell userName={user.name ?? "Administrator"} userRole={user.role}>
      {children}
    </AdminPortalShell>
  );
}