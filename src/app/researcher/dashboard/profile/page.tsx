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

    researchStatement: profile?.researchStatement ?? "",
    education: profile?.education ?? "",
    experience: profile?.experience ?? "",
    skills: profile?.skills ?? "",
    researchInterests: profile?.researchInterests ?? "",

    phone: profile?.phone ?? "",

    website: person.website ?? "",
    googleScholarUrl: person.googleScholarUrl ?? "",
    orcidUrl: person.orcidUrl ?? "",
    linkedinUrl: person.linkedinUrl ?? "",
    githubUrl: person.githubUrl ?? "",

    isPublic: profile?.isPublic ?? true,
  } as const;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-10">
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

      <ResearcherProfileForm initialData={initialData} />
    </main>
  );
}