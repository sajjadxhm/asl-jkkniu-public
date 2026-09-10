import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";

import { requireResearcher } from "@/lib/permissions/auth";
import { getResearcherByUserId } from "@/features/researcher/queries";
import { ResearcherProfileForm } from "@/features/researcher/components/researcher-profile-form";

export default async function ResearcherProfilePage() {
  const user = await requireResearcher();

  const researcher = await getResearcherByUserId(user.id);

  if (!researcher?.person) {
    redirect("/researcher/dashboard");
  }

  const person = researcher.person;
  const profile = person.researcherProfile;

  const initialData = {
    name: person.name,
    email: researcher.email,
    profileImage: person.profileImage ?? "",

    designation: person.designation ?? "",
    department: person.department ?? "",
    bio: person.bio ?? "",

    position: profile?.position ?? "RESEARCHER",
    academicSession: profile?.academicSession ?? "",
    university:
      profile?.university ??
      "Jatiya Kabi Kazi Nazrul Islam University",

    researchStatement:
      profile?.researchStatement ?? "",

    education: profile?.education ?? "",
    experience: profile?.experience ?? "",
    skills: profile?.skills ?? "",
    researchInterests:
      profile?.researchInterests ?? "",

    phone: profile?.phone ?? "",

    website: person.website ?? "",
    googleScholarUrl:
      person.googleScholarUrl ?? "",
    orcidUrl: person.orcidUrl ?? "",
    linkedinUrl:
      person.linkedinUrl ?? "",
    githubUrl: person.githubUrl ?? "",

    isPublic: profile?.isPublic ?? true,
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Page heading */}
      <div className="mb-8">
        <Link
          href="/researcher/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">
              Researcher Portal
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Keep your academic profile up to date. This
              information can be displayed on your public
              ASL-JKKNIU researcher page.
            </p>
          </div>

          <Link
            href={`/people/${person.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-4" />
            View Public Profile
          </Link>
        </div>
      </div>

      <ResearcherProfileForm
        initialData={initialData}
      />
    </div>
  );
}