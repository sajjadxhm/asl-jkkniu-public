import Link from "next/link";
import Image from "next/image";

import { getPeople } from "@/features/people/queries";

export const metadata = {
  title: "People",
  description:
    "Meet the researchers, faculty members, and members of Advanced System Lab, JKKNIU.",
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
      return "Researcher";

    default:
      return null;
  }
}

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <main>
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-medium text-primary">
            Our People
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Researchers shaping the future
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Meet the researchers and members of Advanced System
            Lab working across intelligent systems, robotics,
            artificial intelligence, navigation, and emerging
            technologies.
          </p>
        </div>
      </section>

      {/* People */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        {people.length === 0 ? (
          <div className="rounded-2xl border bg-background p-10 text-center">
            <h2 className="text-lg font-semibold">
              No researchers available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Researcher profiles will appear here once they are
              published.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => {
              const position = getPositionLabel(
                person.researcherProfile?.position,
              );

              return (
                <Link
                  key={person.id}
                  href={`/people/${person.slug}`}
                  className="group overflow-hidden rounded-2xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {person.profileImage ? (
                    <Image
                    src={person.profileImage}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary">
                          {person.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                      {person.name}
                    </h2>

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
            })}
          </div>
        )}
      </section>
    </main>
  );
}