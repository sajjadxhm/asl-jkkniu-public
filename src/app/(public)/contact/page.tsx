import { safeHttpUrl } from "@/lib/validations/url";
import { publicMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MessageSquareText,
} from "lucide-react";

import { PersonImage } from "@/components/people/person-image";
import { getPeople } from "@/features/people/queries";

export const metadata = publicMetadata("/contact", {
  title: "Contact",
  description:
    "Contact Advanced System Lab (ASL-JKKNIU), including the Principal Investigator and the lab website/development contact.",
});

type Person = Awaited<ReturnType<typeof getPeople>>[number];

function ContactCard({
  person,
  eyebrow,
  title,
  description,
}: {
  person: Person;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#002B56]/10 bg-white transition-colors hover:border-[#0067FF]/35">
      {/* Profile header */}
      <div className="relative overflow-hidden bg-[#E1FFE1]/28 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 size-52 rounded-full border border-[#0067FF]/10"
        />

        <div
          aria-hidden="true"
          className="absolute right-6 top-6 size-20 rounded-full border border-[#002B56]/5"
        />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0067FF]">
            {eyebrow}
          </p>

          <div className="mt-5 flex items-start gap-5">
            <PersonImage
              name={person.name}
              src={person.profileImage}
              className="size-24 shrink-0 rounded-xl sm:size-28"
            />

            <div className="min-w-0 pt-1">
              <h2 className="text-xl font-semibold tracking-tight text-[#002B56] sm:text-2xl">
                {person.name}
              </h2>

              {person.designation && (
                <p className="mt-2 text-sm leading-6 text-[#002B56]/60">
                  {person.designation}
                </p>
              )}

              {person.department && (
                <p className="mt-1 text-sm leading-6 text-[#002B56]/50">
                  {person.department}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#002B56]">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#002B56]/60">
            {description}
          </p>
        </div>

        {!!person.researchAreas.length && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#002B56]/40">
              Research interests
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {person.researchAreas
                .slice(0, 4)
                .map(({ researchArea }) => (
                  <span
                    key={researchArea.id}
                    className="rounded-md bg-[#E1FFE1]/55 px-2.5 py-1.5 text-xs text-[#002B56]/70"
                  >
                    {researchArea.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
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
                  href={safeHttpUrl(person.linkedinUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-[#002B56]/15 px-4 py-2.5 text-sm font-medium text-[#002B56] transition-colors hover:bg-[#E1FFE1]/35"
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

export default async function ContactPage() {
  const people = await getPeople();

  const principalInvestigator = people.find(
    (person) =>
      person.researcherProfile?.position ===
      "PRINCIPAL_INVESTIGATOR",
  );

  const associateResearchLead = people.find(
    (person) =>
      person.researcherProfile?.position ===
      "ASSOCIATE_RESEARCH_LEAD",
  );

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
          <div className="absolute -left-40 top-20 size-80 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -right-40 -top-36 size-[30rem] rounded-full bg-[#E1FFE1]/40" />

          <div className="absolute right-10 top-16 size-60 rounded-full border border-[#002B56]/5" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Contact ASL-JKKNIU
              </p>
            </div>

            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Reach the
              <span className="block text-[#0067FF]">
                right person directly.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#002B56]/60 sm:text-xl">
              For research, academic, collaboration, or laboratory
              inquiries, contact the Principal Investigator. For
              website, technical, or platform-related matters,
              contact the Associate Research Lead.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT GUIDANCE
      ====================================================== */}
      <section className="border-b border-[#002B56]/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="flex items-start gap-4 rounded-xl border border-[#002B56]/10 bg-[#E1FFE1]/25 p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0067FF]">
              <Mail className="size-4" />
            </div>

            <div>
              <p className="font-semibold text-[#002B56]">
                Research & academic matters
              </p>

              <p className="mt-2 text-sm leading-6 text-[#002B56]/60">
                Research opportunities, collaboration, supervision,
                academic inquiries, laboratory matters, and official
                communication.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-[#002B56]/10 bg-[#F5F8FB] p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0067FF]">
              <MessageSquareText className="size-4" />
            </div>

            <div>
              <p className="font-semibold text-[#002B56]">
                Website & technical matters
              </p>

              <p className="mt-2 text-sm leading-6 text-[#002B56]/60">
                Website content, technical issues, profile corrections,
                platform-related questions, and digital development
                matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRIMARY CONTACTS
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-[#002B56]/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 size-96 rounded-full bg-[#E1FFE1]/20"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Primary contacts
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Two contact points. Clear responsibilities.
            </h2>

            <p className="mt-5 text-base leading-7 text-[#002B56]/60">
              Choose the contact that best matches the nature of your
              inquiry.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {principalInvestigator ? (
              <ContactCard
                person={principalInvestigator}
                eyebrow="Main Contact"
                title="Principal Investigator"
                description="Primary contact for research, academic collaboration, supervision, laboratory matters, institutional communication, and research opportunities."
              />
            ) : (
              <MissingContact
                title="Principal Investigator"
                description="The current Principal Investigator will appear here once their public profile is available."
              />
            )}

            {associateResearchLead ? (
              <ContactCard
                person={associateResearchLead}
                eyebrow="Developer Contact"
                title="Associate Research Lead"
                description="Contact for website-related questions, technical issues, profile or content corrections, digital platforms, and development matters."
              />
            ) : (
              <MissingContact
                title="Associate Research Lead"
                description="The current Associate Research Lead will appear here once their public profile is available."
              />
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT ETIQUETTE
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
              className="absolute -bottom-24 right-24 size-64 rounded-full border border-[#E1FFE1]/15"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  Before contacting us
                </p>

                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  A clear message helps us respond better.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
                  Briefly introduce yourself, explain the purpose of
                  your inquiry, and include any relevant project,
                  publication, profile, or supporting link.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/join-us"
                  className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1475ff]"
                >
                  Interested in joining?
                  <ArrowRight className="ml-2 size-4" />
                </Link>

                <Link
                  href="/people"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  Browse people
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MissingContact({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#002B56]/20 bg-white p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[#E1FFE1]/50">
        <Mail className="size-5 text-[#0067FF]" />
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-[#002B56]/60">
        {description}
      </p>

      <Link
        href="/people"
        className="mt-6 inline-flex items-center text-sm font-medium text-[#0067FF] hover:underline"
      >
        Browse people
        <ArrowRight className="ml-2 size-4" />
      </Link>
    </div>
  );
}