import { requireRole } from "@/lib/permissions/auth";
import Link from "next/link";
import { LogoutButton } from "@/components/forms/logout-button";

import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Newspaper,
  PanelsTopLeft,
  Settings,
  Users,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireRole([
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
  ]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
          <div className="flex h-16 items-center border-b px-6">
            <div>
              <p className="font-semibold">ASL-JKKNIU</p>
              <p className="text-xs text-muted-foreground">
                Research Lab Admin
              </p>
            </div>
          </div>

        <nav className="space-y-1 p-4">
          <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Administration
          </p>

          <Link
            href="/admin"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutDashboard className="mr-3 size-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/people"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Users className="mr-3 size-4" />
            People
          </Link>

          {user.role === "SUPER_ADMIN" && (
            <Link
              href="/admin/researchers"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <Users className="mr-3 size-4" />
              Researcher Accounts
            </Link>
          )}

          <Link
            href="/admin/publications"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <BookOpen className="mr-3 size-4" />
            Publications
          </Link>

          <Link
            href="/admin/projects"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <FolderKanban className="mr-3 size-4" />
            Projects
          </Link>

          <Link
            href="/admin/news"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Newspaper className="mr-3 size-4" />
            News
          </Link>

          <Link
            href="/admin/landing-page"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <PanelsTopLeft className="mr-3 size-4" />
            Landing Page
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Settings className="mr-3 size-4" />
            Settings
          </Link>
        </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user.name ?? "Administrator"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.role}
              </p>
            </div>

            <LogoutButton />
            </div>
          </header>

          <nav aria-label="People management" className="flex flex-wrap gap-4 border-b bg-background px-4 py-3 text-sm font-medium md:hidden">
            <Link href="/admin/people" className="hover:underline">People</Link>
            {user.role === "SUPER_ADMIN" && (
              <Link href="/admin/researchers" className="hover:underline">Researcher Accounts</Link>
            )}
          </nav>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}