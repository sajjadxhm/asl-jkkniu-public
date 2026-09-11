import Link from "next/link";
import {
  ExternalLink,
  Pencil,
  Plus,
  UsersRound,
} from "lucide-react";

import { PersonImage } from "@/components/people/person-image";
import { requireResearcher } from "@/lib/permissions/auth";
import {
  getAlumniAndCoResearchersForManagement,
} from "@/features/people/queries";

export default async function ResearcherPeoplePage() {
  await requireResearcher();

  const people =
    await getAlumniAndCoResearchersForManagement();

  const publicCount = people.filter(
    (person) => person.isActive,
  ).length;

  const hiddenCount = people.length - publicCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Researcher Portal
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Alumni & Co-researchers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage former ASL members and external collaborators
              who should appear on the public People page.
            </p>
          </div>

          <Link
            href="/researcher/people/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Add Person
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total People
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {people.length}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UsersRound className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">
                Public
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {publicCount}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Visible on People page
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">
                Hidden
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {hiddenCount}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Saved but not publicly visible
              </p>
            </div>
          </div>
        </div>

        {/* People List */}
        <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex flex-col gap-1 border-b px-5 py-5 sm:px-6">
            <h2 className="font-semibold">
              People Directory
            </h2>

            <p className="text-sm text-muted-foreground">
              Former members and collaborators associated with
              Advanced System Lab.
            </p>
          </div>

          {people.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                <UsersRound className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-medium">
                No Alumni or Co-researchers yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Add former members and collaborators who should
                appear on the public People page.
              </p>

              <Link
                href="/researcher/people/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus className="size-4" />
                Add Person
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="p-5 transition-colors hover:bg-muted/30 sm:px-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Person Information */}
                    <div className="flex min-w-0 items-center gap-4">
                      <PersonImage
                        name={person.name}
                        src={person.profileImage}
                        className="size-14 shrink-0 rounded-full"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {person.name}
                        </h3>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Alumni / Co-researcher
                        </p>

                        {person.linkedinUrl && (
                          <a
                            href={person.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            LinkedIn
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pl-[72px] sm:pl-0">
                      <span
                        className={
                          person.isActive
                            ? "rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                            : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {person.isActive
                          ? "Public"
                          : "Hidden"}
                      </span>

                      <Link
                        href={`/researcher/people/${person.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}