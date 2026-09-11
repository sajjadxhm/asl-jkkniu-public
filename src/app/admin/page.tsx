import Link from "next/link";
import { ArrowRight, BookOpen, UserPlus, UsersRound } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";

export default async function AdminDashboardPage() {
  const user = await requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const [publications, accounts, activeAccounts] = await Promise.all([
    prisma.publication.count(),
    isSuperAdmin ? prisma.user.count({ where: { role: "RESEARCHER" } }) : Promise.resolve(0),
    isSuperAdmin ? prisma.user.count({ where: { role: "RESEARCHER", isActive: true } }) : Promise.resolve(0),
  ]);
  const cards = [
    ...(isSuperAdmin ? [{ title: "Researcher Accounts", value: accounts, detail: `${activeAccounts} login-enabled accounts`, href: "/admin/researchers", icon: UsersRound }] : []),
    { title: "Publications", value: publications, detail: "Publications in the lab library", href: "/admin/publications", icon: BookOpen },
  ];
  const actions = [
    ...(isSuperAdmin ? [{ title: "Create Researcher", description: "Set up a researcher profile and login account.", href: "/admin/researchers/new", icon: UserPlus }] : []),
    { title: "Add Publication", description: "Add a research publication to the lab library.", href: "/admin/publications/new", icon: BookOpen },
  ];

  return (
    <div>
      <p className="text-sm font-medium text-primary">Administration overview</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, {user.name ?? "Administrator"}</h1>
      <p className="mt-2 text-muted-foreground">Manage the people behind the research and the work they publish.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(({ title, value, detail, href, icon: Icon }) => (
          <section key={href} className="rounded-2xl border bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm text-muted-foreground">{title}</h2>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></div>
            </div>
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Manage {title.toLowerCase()}<ArrowRight className="size-4" /></Link>
          </section>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {actions.map(({ title, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/50">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
              <h3 className="mt-4 font-medium group-hover:text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}