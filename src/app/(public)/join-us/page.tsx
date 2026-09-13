import { publicMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Mail,
} from "lucide-react";

import { PersonImage } from "@/components/people/person-image";
import { getPeople } from "@/features/people/queries";

export const metadata = publicMetadata("/join-us", {
  title: "Join Us",
  description:
    "Learn how to join, collaborate with, or contribute to Advanced System Lab (ASL-JKKNIU).",
});

type Person = Awaited<ReturnType<typeof getPeople>>[number];

const opportunities = [
  {
    number: "01",
    title: "Student Research",
    description:
      "Work on research problems, experiments, datasets, software, hardware, or technical investigations with the lab.",
  },
  {
    number: "02",
    title: "Research Projects",
    description:
      "Contribute to active ASL projects that match your interests, background, and technical skills.",
  },
  {
    number: "03",
    title: "Research Collaboration",
    description:
      "Collaborate with ASL researchers on academic research, publications, datasets, or interdisciplinary work.",
  },
  {
    number: "04",
    title: "Technical Contribution",
    description:
      "Contribute through engineering, software development, embedded systems, experiments, or specialized technical expertise.",
  },
];

const joiningSteps = [
  {
    number: "01",
    title: "Explore our research",
    description:
      "Review ASL research areas, projects, and publications before contacting the laboratory.",
  },
  {
    number: "02",
    title: "Identify your interest",
    description:
      "Choose the research direction or project that most closely matches your interests and background.",
  },
  {
    number: "03",
    title: "Prepare a short introduction",
    description:
      "Briefly explain who you are, your academic background, relevant experience, and what you hope to work on.",
  },
  {
    number: "04",
    title: "Contact the research leadership",
    description:
      "Reach out to the current Principal Investigator or Associate Research Lead using the contact information available on their profile.",
  },
];

const contactChecklist = [
  "Your name, university, department, and academic level",
  "The ASL research area or project that interests you",
  "A short explanation of why you want to work with ASL",
  "Relevant technical, research, programming, or engineering experience",
  "Links to your CV, portfolio, GitHub, publications, or previous work when relevant",
];

function LeadershipCard({
  person,
  role,
}: {
  person: Person;
  role: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#002B56]/10 bg-white transition-all hover:border-[#0067FF]/35">
      <div className="relative overflow-hidden bg-[#E1FFE1]/25 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 size-52 rounded-full border border-[#0067FF]/10"
        />

        <div
          aria-hidden="true"
          className="absolute right-6 top-6 size-20 rounded-full border border-[#002B56]/5"
        />

        <div className="relative flex items-start gap-5">
          <PersonImage
            name={person.name}
            src={person.profileImage}
            className="size-24 shrink-0 rounded-xl sm:size-28"
          />

          <div className="min-w-0 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0067FF]">
              {role}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#002B56] sm:text-2xl">
              {person.name}
            </h3>

            {person.designation && (
              <p className="mt-2 text-sm leading-6 text-[#002B56]/60">
                {person.designation}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {person.department && (
          <p className="text-sm leading-6 text-[#002B56]/65">
            {person.department}
          </p>
        )}

        {!!person.researchAreas.length && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#002B56]/45">
              Research interests
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {person.researchAreas
                .slice(0, 4)
                .map(({ researchArea }) => (
                  <span
                    key={researchArea.id}
                    className="rounded-md bg-[#E1FFE1]/55 px-2.5 py-1.5 text-xs text-[#002B56]/75"
                  >
                    {researchArea.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-7">
          <div className="border-t border-[#002B56]/10 pt-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/people/${person.slug}`}
                className="group/button inline-flex flex-1 items-center justify-center rounded-md bg-[#0067FF] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0058dc]"
              >
                View profile

                <ArrowRight className="ml-2 size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>

              {person.linkedinUrl && (
                <a
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-[#002B56]/15 px-4 py-2.5 text-sm font-medium text-[#002B56] transition-colors hover:bg-[#E1FFE1]/40"
                >
                  LinkedIn

                  <ExternalLink className="ml-2 size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function JoinUsPage() {
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

  const researchLeadership = [
    ...principalInvestigators.map((person) => ({
      person,
      role: "Principal Investigator",
    })),

    ...associateResearchLeads.map((person) => ({
      person,
      role: "Associate Research Lead",
    })),
  ];

  return (
    <main className="overflow-hidden bg-white text-[#002B56]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#002B56]/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-44 top-24 size-80 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -left-20 top-44 size-44 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -right-36 -top-36 size-[30rem] rounded-full bg-[#E1FFE1]/45" />

          <div className="absolute right-6 top-16 size-64 rounded-full border border-[#002B56]/5" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Join ASL-JKKNIU
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Curious enough to
              <span className="block text-[#0067FF]">
                build, test, and discover?
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#002B56]/60 sm:text-xl">
              ASL welcomes motivated students, researchers, and
              collaborators interested in intelligent systems and
              engineering research. Start by understanding our work,
              identifying where you can contribute, and contacting
              the current research leadership.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0058dc]"
              >
                Explore research
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md border border-[#002B56]/15 px-5 py-3 text-sm font-medium text-[#002B56] transition-colors hover:bg-[#E1FFE1]/35"
              >
                Explore projects
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#002B56]/10 bg-[#E1FFE1]/30 p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0067FF]">
              Before contacting us
            </p>

            <p className="mt-5 text-2xl font-medium leading-snug tracking-[-0.02em]">
              Understand what ASL works on and tell us where your
              interests connect.
            </p>

            <div className="mt-7 border-t border-[#002B56]/10 pt-6">
              <p className="text-sm leading-6 text-[#002B56]/60">
                A thoughtful message that demonstrates genuine
                interest in a research area is much more useful than
                a generic request to join.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO CAN ENGAGE
      ====================================================== */}
      <section className="border-b border-[#002B56]/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Opportunities
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Different ways to engage with ASL.
              </h2>

              <p className="mt-5 text-base leading-7 text-[#002B56]/60">
                Participation depends on current research needs,
                available supervision, relevant skills, and alignment
                with the laboratory&apos;s work.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#002B56]/10 bg-[#002B56]/10 sm:grid-cols-2">
              {opportunities.map((item) => (
                <article
                  key={item.number}
                  className="group relative min-h-[260px] bg-white p-7 transition-colors hover:bg-[#E1FFE1]/20 sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                  />

                  <p className="text-xs font-semibold text-[#0067FF]">
                    {item.number}
                  </p>

                  <h3 className="mt-12 text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#002B56]/60">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW TO JOIN
      ====================================================== */}
      <section className="border-b border-[#002B56]/10 bg-[#F7F9FB]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              How to approach ASL
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with curiosity. Contact us with context.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#002B56]/60">
              Following these steps helps the research leadership
              understand your interests and determine whether there
              is a suitable opportunity.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#002B56]/10 bg-[#002B56]/10 md:grid-cols-2 lg:grid-cols-4">
            {joiningSteps.map((step) => (
              <article
                key={step.number}
                className="group relative min-h-[290px] bg-white p-7 transition-colors hover:bg-[#E1FFE1]/20"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#0067FF]">
                    {step.number}
                  </p>

                  <div className="flex size-7 items-center justify-center rounded-full bg-[#E1FFE1]/60">
                    <Check className="size-3.5 text-[#0067FF]" />
                  </div>
                </div>

                <h3 className="mt-16 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#002B56]/60">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH LEADERSHIP
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#002B56]/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-12 size-96 rounded-full bg-[#E1FFE1]/25"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Research leadership
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Who should you contact?
              </h2>

              <p className="mt-5 text-base leading-7 text-[#002B56]/60">
                Students and potential collaborators should contact
                the current Principal Investigator or Associate
                Research Lead regarding research opportunities and
                collaboration.
              </p>

              <p className="mt-5 text-sm leading-6 text-[#002B56]/50">
                Review their profile and research interests before
                reaching out.
              </p>
            </div>

            <div>
              {researchLeadership.length ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  {researchLeadership.map(({ person, role }) => (
                    <LeadershipCard
                      key={person.id}
                      person={person}
                      role={role}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#002B56]/20 bg-white p-10 text-center">
                  <h3 className="font-semibold">
                    Research leadership information unavailable
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#002B56]/60">
                    Leadership profiles will appear here once the
                    Principal Investigator or Associate Research Lead
                    is published in the ASL people directory.
                  </p>

                  <Link
                    href="/people"
                    className="mt-6 inline-flex items-center text-sm font-medium text-[#0067FF] hover:underline"
                  >
                    Browse all people
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CHECKLIST
      ====================================================== */}
      <section className="border-b border-[#002B56]/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#E1FFE1]/35 p-8 sm:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 size-56 rounded-full border border-[#0067FF]/10"
            />

            <div className="relative">
              <Mail className="size-6 text-[#0067FF]" />

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Your introduction
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Make your first message useful.
              </h2>

              <p className="mt-5 text-base leading-7 text-[#002B56]/60">
                You do not need to write a long email. A concise,
                thoughtful introduction that clearly explains your
                interests and experience is usually more effective.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              What to include
            </p>

            <div className="mt-6 divide-y divide-[#002B56]/10 border-y border-[#002B56]/10">
              {contactChecklist.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 py-5"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E1FFE1] text-[10px] font-semibold text-[#0067FF]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-6 text-[#002B56]/70">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#002B56] p-8 text-white sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-28 size-80 rounded-full bg-[#0067FF]/25"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-20 size-64 rounded-full border border-[#E1FFE1]/15"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  Interested in ASL?
                </p>

                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Explore our work first.
                  <br />
                  Then start the conversation.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
                  The best collaborations begin with shared research
                  interests and a clear idea of how you would like to
                  contribute.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/research"
                  className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1475ff]"
                >
                  Explore research
                  <ArrowRight className="ml-2 size-4" />
                </Link>

                <Link
                  href="/people"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  Meet our people
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}