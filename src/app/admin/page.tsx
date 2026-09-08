import Link from "next/link";

const statistics = [
  {
    label: "People",
    value: "0",
    description: "Researchers and members",
    href: "/admin/people",
  },
  {
    label: "Publications",
    value: "0",
    description: "Research publications",
    href: "/admin/publications",
  },
  {
    label: "Projects",
    value: "0",
    description: "Research projects",
    href: "/admin/projects",
  },
  {
    label: "News",
    value: "0",
    description: "Lab news and updates",
    href: "/admin/news",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your research lab content and administration.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => (
          <Link
            key={statistic.label}
            href={statistic.href}
            className="rounded-xl border bg-background p-5 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {statistic.label}
            </p>

            <p className="mt-2 text-3xl font-bold">
              {statistic.value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {statistic.description}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border bg-background p-6">
        <h3 className="font-semibold">Quick Actions</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Frequently used content management actions.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/admin/people"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Manage People
          </Link>

          <Link
            href="/admin/publications"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Manage Publications
          </Link>

          <Link
            href="/admin/projects"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Manage Projects
          </Link>
        </div>
      </section>
    </div>
  );
}