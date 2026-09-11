import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { PersonImage } from "@/components/people/person-image";
import { getPeople } from "@/features/people/queries";

export const metadata = {
  title: "People",
  description:
    "Meet the researchers and members of Advanced System Lab, JKKNIU.",
};

function getPositionLabel(position?: string | null) {
  switch (position) {
    case "PRINCIPAL_INVESTIGATOR":
      return "Principal Investigator";

    case "ASSOCIATE_RESEARCH_LEAD":
      return "Associate Research Lead";

    case "LEAD_RESEARCHER":
      return "Lead Researcher";

case "RESEARCHER":
  return "Research Assistant";

    default:
      return null;
  }
}

function ResearcherCard({
  person,
}: {
  person: Awaited<ReturnType<typeof getPeople>>[number];
}) {
  const position = getPositionLabel(
    person.researcherProfile?.position,
  );

  return (
    <Link
      href={`/people/${person.slug}`}
      className="group overflow-hidden rounded-2xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <PersonImage
        name={person.name}
        src={person.profileImage}
        className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
          {person.name}
        </h3>

        {position && (
          <p className="mt-1 text-sm font-medium text-primary">
            {position}
          </p>
        )}

        {person.designation && (
          <p className="mt-1 text-sm text-muted-foreground">
            {person.designation}
          </p>
        )}

        {person.department && (
          <p className="mt-1 text-sm text-muted-foreground">
            {person.department}
          </p>
        )}

        {person.researchAreas.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {person.researchAreas
              .slice(0, 3)
              .map(({ researchArea }) => (
                <span
                  key={researchArea.id}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  {researchArea.name}
                </span>
              ))}
          </div>
        )}

        <div className="mt-6 text-sm font-medium text-primary">
          View profile →
        </div>
      </div>
    </Link>
  );
}

function AlumniCard({
  person,
}: {
  person: Awaited<ReturnType<typeof getPeople>>[number];
}) {
  const content = (
    <>
      <PersonImage
        name={person.name}
        src={person.profileImage}
        className="aspect-[4/3]"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
          {person.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-primary">
          Alumni / Co-researcher
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
          {person.linkedinUrl ? (
            <>
              LinkedIn
              <ExternalLink className="size-4" />
            </>
          ) : (
            "ASL Member"
          )}
        </div>
      </div>
    </>
  );

  if (person.linkedinUrl) {
    return (
      <a
        href={person.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group overflow-hidden rounded-2xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border bg-background">
      {content}
    </div>
  );
}

function PeopleSection({
  title,
  description,
  people,
}: {
  title: string;
  description?: string;
  people: Awaited<ReturnType<typeof getPeople>>;
}) {
  if (people.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 first:mt-0">
      <div className="mb-7">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) =>
          person.researcherProfile ? (
            <ResearcherCard
              key={person.id}
              person={person}
            />
          ) : (
            <AlumniCard
              key={person.id}
              person={person}
            />
          ),
        )}
      </div>
    </section>
  );
}

export default async function PeoplePage() {
  const people = await getPeople();

  const principalInvestigators = people.filter(
    (person) =>
      person.researcherProfile?.position ===
      "PRINCIPAL_INVESTIGATOR",
  );

  const associateResearchLeads = people.filter(
    (person) =>
      person.researcherProfile?.position ===
      "ASSOCIATE_RESEARCH_LEAD",
  );

  const leadResearchers = people.filter(
    (person) =>
      person.researcherProfile?.position ===
      "LEAD_RESEARCHER",
  );

  const researchAssistants = people.filter(
    (person) =>
      person.researcherProfile?.position === "RESEARCHER",
  );

  const alumniAndCoResearchers = people.filter(
    (person) => !person.researcherProfile,
  );

  return (
    <main>
      {/* Page Header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-medium text-primary">
            Our People
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            The people behind ASL
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Meet the researchers, students, alumni, and
            collaborators contributing to Advanced System Lab
            across intelligent systems, robotics, artificial
            intelligence, navigation, and emerging technologies.
          </p>
        </div>
      </section>

      {/* People Sections */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        {people.length === 0 ? (
          <div className="rounded-2xl border bg-background p-10 text-center">
            <h2 className="text-lg font-semibold">
              No people available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              People will appear here once they are published.
            </p>
          </div>
        ) : (
          <>
            <PeopleSection
              title="Principal Investigator"
              people={principalInvestigators}
            />

            <PeopleSection
              title="Associate Research Lead"
              people={associateResearchLeads}
            />

            <PeopleSection
              title="Lead Researchers"
              people={leadResearchers}
            />

            <PeopleSection
              title="Research Assistants"
              people={researchAssistants}
            />

            <PeopleSection
              title="Alumni & Co-researchers"
              description="Former members and collaborators who have contributed to the work of Advanced System Lab."
              people={alumniAndCoResearchers}
            />
          </>
        )}
      </section>
    </main>
  );
}