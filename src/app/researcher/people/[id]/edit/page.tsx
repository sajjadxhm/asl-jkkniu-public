import Link from "next/link";
import { notFound } from "next/navigation";

import { requireResearcher } from "@/lib/permissions/auth";
import { AlumniForm } from "@/features/people/components/alumni-form";
import { prisma } from "@/lib/db/prisma";

type EditPersonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditResearcherPersonPage({
  params,
}: EditPersonPageProps) {
  await requireResearcher();

  const { id } = await params;

  const person = await prisma.person.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      linkedinUrl: true,
      profileImage: true,
      isActive: true,
      researcherProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!person || person.researcherProfile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/researcher/people"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Alumni & Co-researchers
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Edit Alumni / Co-researcher
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update this person&apos;s public information.
        </p>
      </div>

      <section className="rounded-xl border bg-background p-5 sm:p-8">
        <AlumniForm
          mode="edit"
          person={{
            id: person.id,
            name: person.name,
            linkedinUrl: person.linkedinUrl,
            profileImage: person.profileImage,
            isActive: person.isActive,
          }}
        />
      </section>
    </div>
  );
}