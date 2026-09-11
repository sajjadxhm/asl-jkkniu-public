import Link from "next/link";
import {
  BookOpen,
  FolderKanban,
  ExternalLink,
  UserRound,
} from "lucide-react";

import { requireResearcher } from "@/lib/permissions/auth";
import { getResearcherByUserId } from "@/features/researcher/queries";

export default async function ResearcherDashboardPage() {
  const user = await requireResearcher();

  const researcher = await getResearcherByUserId(user.id);

  const person = researcher?.person;
  const profile = person?.researcherProfile;

  const publicationCount =
    person?.publicationAuthors.length ?? 0;

  const projectCount =
    person?.projectMemberships.length ?? 0;

  const profileFields = [
    person?.name,
    person?.designation,
    person?.department,
    person?.bio,
    profile?.position,
    profile?.university,
    profile?.academicSession,
    profile?.researchStatement,
    profile?.education,
    profile?.experience,
    profile?.skills,
    profile?.researchInterests,
    profile?.phone,
    person?.website,
    person?.googleScholarUrl,
    person?.orcidUrl,
    person?.linkedinUrl,
    person?.githubUrl,
  ];

  const completedFields =
    profileFields.filter(Boolean).length;

  const profileCompleteness = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary">
            Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere]">
            Welcome back, {person?.name ?? user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your academic profile and research
            activities.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {person?.slug && (
            <Link
              href={`/people/${person.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              Public Profile
            </Link>
          )}

          <Link
            href="/researcher/dashboard/profile"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserRound className="size-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DashboardStat
          label="Publications"
          value={publicationCount}
          icon={BookOpen}
        />

        <DashboardStat
          label="Projects"
          value={projectCount}
          icon={FolderKanban}
        />
      </div>

      {/* Profile completeness */}
      <section className="mt-6 rounded-2xl border bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Profile completeness
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Complete your profile to build a stronger
              academic presence.
            </p>
          </div>

          <span className="shrink-0 text-2xl font-semibold">
            {profileCompleteness}%
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${profileCompleteness}%`,
            }}
          />
        </div>

        {profileCompleteness < 100 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Add missing academic information and links from
            your profile editor.
          </p>
        )}
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickAction
            href="/researcher/dashboard/profile"
            icon={UserRound}
            title="Update Profile"
            description="Update your academic information, research interests, and professional links."
          />

          <QuickAction
            href="/publications"
            icon={BookOpen}
            title="View Publications"
            description="Explore publications associated with your researcher profile."
          />

          <QuickAction
            href={
              person
                ? `/people/${person.slug}`
                : "/people"
            }
            icon={ExternalLink}
            title="View Public Profile"
            description="See how your researcher profile appears on the public ASL website."
          />
        </div>
      </section>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border bg-background p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h3 className="mt-4 font-medium group-hover:text-primary">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}