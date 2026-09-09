import Link from "next/link";

import { requireResearcher } from "@/lib/permissions/auth";
import { getResearcherByUserId } from "@/features/researcher/queries";

export default async function ResearcherDashboardPage() {
  const user = await requireResearcher();

  const researcher = await getResearcherByUserId(user.id);

  const person = researcher?.person;
  const profile = person?.researcherProfile;

  const publicationCount = person?.publicationAuthors.length ?? 0;
  const projectCount = person?.projectMemberships.length ?? 0;
  const awardCount = person?.awards.length ?? 0;

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

  const completedFields = profileFields.filter(Boolean).length;

  const profileCompleteness = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">
            Researcher Portal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back, {user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your research identity and academic
            activities.
          </p>
        </div>

        <Link
          href="/researcher/dashboard/profile"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            Publications
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {publicationCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            Projects
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {projectCount}
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6">
          <p className="text-sm text-muted-foreground">
            Awards
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {awardCount}
          </p>
        </div>
      </div>

      {/* Profile completeness */}
      <section className="mt-6 rounded-2xl border bg-background p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">
              Profile completeness
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete your profile to create a stronger
              academic presence.
            </p>
          </div>

          <span className="text-2xl font-semibold">
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
      </section>

      {/* Quick actions */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">
          Quick Actions
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Link
            href="/researcher/dashboard/profile"
            className="rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/50"
          >
            <h3 className="font-medium">Update Profile</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your academic information and research
              interests.
            </p>
          </Link>

          <Link
            href="/publications"
            className="rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/50"
          >
            <h3 className="font-medium">
              View Publications
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See publications associated with your profile.
            </p>
          </Link>

          <Link
            href={person ? `/people/${person.slug}` : "/people"}
            className="rounded-2xl border bg-background p-6 transition-colors hover:bg-muted/50"
          >
            <h3 className="font-medium">
              View Public Profile
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See how your researcher profile appears publicly.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}