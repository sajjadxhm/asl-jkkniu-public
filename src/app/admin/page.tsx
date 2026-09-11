import Link from "next/link";

const dashboardItems = [
  {
    title: "People",
    description:
      "Manage directory profiles and public visibility, including alumni and co-researchers.",
    href: "/admin/people",
  },
  {
    title: "Publications",
    description:
      "Manage journal articles, conference papers, books, theses, and other publications.",
    href: "/admin/publications",
  },
  {
    title: "Projects",
    description:
      "Manage ongoing, completed, planned, and archived research projects.",
    href: "/admin/projects",
  },
  {
    title: "News",
    description:
      "Manage lab announcements, events, achievements, and research news.",
    href: "/admin/news",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Welcome to the ASL-JKKNIU administration dashboard.
          Manage your lab website content from here.
        </p>
      </div>

      {/* Overview */}
      <section>
        <div className="mb-4">
          <h3 className="font-semibold">Content Management</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the main content areas of the research lab website.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border bg-background p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <h3 className="font-semibold">Quick Actions</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Quickly access common content-management tasks.
          </p>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <Link
            href="/admin/people/new"
            className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            + Add Person
          </Link>

          <Link
            href="/admin/publications/new"
            className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            + Add Publication
          </Link>

          <Link
            href="/admin/projects/new"
            className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            + Add Project
          </Link>

          <Link
            href="/admin/news/new"
            className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            + Add News
          </Link>
        </div>
      </section>

      {/* System Status */}
      <section className="rounded-xl border bg-muted/20 p-5 sm:p-6">
        <h3 className="font-semibold">System Status</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Database
            </p>

            <p className="mt-1 text-sm font-medium">
              Connected
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Authentication
            </p>

            <p className="mt-1 text-sm font-medium">
              Active
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Environment
            </p>

            <p className="mt-1 text-sm font-medium">
              Development
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}