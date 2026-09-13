import { PublicationAuthor } from "@/features/publications/components/publication-author";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleScholarIcon } from "@/components/icons/google-scholar-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { OrcidIcon } from "@/components/icons/orcid-icon";

import {
  ExternalLink as ExternalLinkIcon,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

import { getPublicResearcherBySlug } from "@/features/people/queries";

interface ResearcherPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getPositionLabel(position: string) {
  switch (position) {
    case "PRINCIPAL_INVESTIGATOR":
      return "Principal Investigator";

    case "ASSOCIATE_RESEARCH_LEAD":
      return "Associate Research Lead";

    case "LEAD_RESEARCHER":
      return "Lead Researcher";

    default:
      return "Researcher";
  }
}

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function generateMetadata({
  params,
}: ResearcherPageProps) {
  const { slug } = await params;

  const person = await getPublicResearcherBySlug(slug);

  if (!person) {
    return {
      title: "Researcher Not Found",
    };
  }

  const position = getPositionLabel(
    person.researcherProfile?.position ?? "RESEARCHER",
  );

  const description =
    person.bio ??
    `${person.name} — ${position} at Advanced System Lab, JKKNIU.`;

  return {
    title: person.name,
    description,
    openGraph: {
      title: person.name,
      description,
      images: person.profileImage
        ? [person.profileImage]
        : undefined,
    },
  };
}

export default async function ResearcherPublicProfile({
  params,
}: ResearcherPageProps) {
  const { slug } = await params;

  const person = await getPublicResearcherBySlug(slug);

  if (!person || !person.researcherProfile) {
    notFound();
  }

  const profile = person.researcherProfile;

  const position = getPositionLabel(profile.position);

  /*
   * Projects can appear in two ways:
   *
   * 1. The researcher is a project member.
   * 2. The researcher is the principal investigator.
   *
   * Avoid showing the same project twice.
   */
  const projects = [
    ...person.projectMemberships.map((membership) => ({
      ...membership.project,
      memberRole: membership.role,
    })),

    ...person.principalInvestigatorProjects
      .filter(
        (project) =>
          !person.projectMemberships.some(
            (membership) =>
              membership.project.id === project.id,
          ),
      )
      .map((project) => ({
        ...project,
        memberRole: "PRINCIPAL_INVESTIGATOR" as const,
      })),
  ];

const academicLinks = [
  {
    label: "Google Scholar",
    href: person.googleScholarUrl,
    icon: GoogleScholarIcon,
  },
  {
    label: "ORCID",
    href: person.orcidUrl,
    icon: OrcidIcon,
  },
  {
    label: "LinkedIn",
    href: person.linkedinUrl,
    icon: LinkedinIcon,
  },
  {
    label: "GitHub",
    href: person.githubUrl,
    icon: GithubIcon,
  },
  {
    label: "Personal Website",
    href: person.website,
    icon: Globe,
  },
].filter((item) => Boolean(item.href));


  return (
    <main className="min-h-screen bg-white text-[#002B56] [overflow-wrap:anywhere]">
      {/* =======================================================
          HERO
      ======================================================= */}
      <section className="border-b border-[#002B56]/10 bg-[#F5FAF8]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/people"
            className="text-sm font-medium text-[#002B56]/65 transition-colors hover:text-foreground"
          >
            ← Back to People
          </Link>

          <div className="mt-7 grid gap-6 sm:grid-cols-[176px_minmax(0,1fr)] sm:items-center lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-8">
            {/* Profile image */}
            <div className="flex justify-start">
              <div className="relative aspect-square w-36 shrink-0 overflow-hidden rounded-xl border border-[#002B56]/10 bg-white sm:w-44 lg:w-52">
                {person.profileImage ? (
                  <Image
                    src={person.profileImage}
                    alt={`${person.name} profile photo`}
                    fill
                    sizes="(max-width: 639px) 144px, (max-width: 1023px) 176px, 208px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#E1FFE1]/50">
                    <span className="text-6xl font-semibold text-[#0067FF]">
                      {getInitials(person.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Identity */}
            <div>
              <p className="text-sm font-medium text-[#0067FF]">
                {position}
              </p>

              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {person.name}
              </h1>

              {person.designation && (
                <p className="mt-4 text-lg text-[#002B56]/65">
                  {person.designation}
                </p>
              )}

              <div className="mt-5 space-y-1 text-sm text-[#002B56]/65">
                {person.department && (
                  <p>{person.department}</p>
                )}

                {profile.university && (
                  <p>{profile.university}</p>
                )}

                {profile.academicSession && (
                  <p>
                    Academic Session:{" "}
                    {profile.academicSession}
                  </p>
                )}
              </div>

              {/* Social / academic icons */}
              {academicLinks.map((item) => {
                const { label, href, icon: Icon } = item;

                if (!href) return null;

                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="mr-2 mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#002B56]/15 bg-white text-[#002B56]/65 transition-all hover:border-[#0067FF] hover:bg-[#E1FFE1]/50 hover:text-[#0067FF]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          CONTENT
      ======================================================= */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          {/* Main column */}
          <div className="min-w-0 space-y-9">
            {/* About */}
            {person.bio && (
              <section>
                <SectionHeading title="About" />

                <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#002B56]/65">
                  {person.bio}
                </p>
              </section>
            )}

            {/* Research Interests */}
            {profile.researchInterests && (
              <section>
                <SectionHeading title="Research Interests" />

                <div className="mt-5 rounded-xl border border-[#002B56]/10 bg-[#F5FAF8] p-5 sm:p-6">
                  <p className="whitespace-pre-line leading-8 text-[#002B56]/65">
                    {profile.researchInterests}
                  </p>
                </div>
              </section>
            )}

            {/* Education */}
            {profile.education && (
              <section>
                <SectionHeading title="Education" />

                <div className="mt-5 rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6">
                  <p className="whitespace-pre-line leading-8 text-[#002B56]/65">
                    {profile.education}
                  </p>
                </div>
              </section>
            )}

            {/* Experience */}
            {profile.experience && (
              <section>
                <SectionHeading title="Research Experience" />

                <div className="mt-5 rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6">
                  <p className="whitespace-pre-line leading-8 text-[#002B56]/65">
                    {profile.experience}
                  </p>
                </div>
              </section>

            )}


            {/* =================================================
                PUBLICATIONS
            ================================================= */}
            {person.publicationAuthors.length > 0 && (
              <section>
                <SectionHeading
                  title="Publications"
                  count={person.publicationAuthors.length}
                />

                <div className="mt-5 space-y-4">
                  {person.publicationAuthors.map(
                    ({ publication }) => (
                      <article
                        key={publication.id}
                        className="rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6 transition-colors hover:bg-muted/20"
                      >
                        {/* Publication type */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="max-w-3xl font-semibold leading-7">
                            {publication.title}
                          </h3>

                          <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            {publication.publicationType.replaceAll(
                              "_",
                              " ",
                            )}
                          </span>
                        </div>

                        {/* Authors */}
                        <div className="mt-3 text-sm leading-6 text-[#002B56]/65">
                          {publication.authors.map(
                            (author, index) => (
                              <span
                                key={
                                  author.person?.id ??
                                  `external-${author.externalName}-${index}`
                                }
                              >
                                {index > 0 && ", "}

                                <PublicationAuthor
                                  author={author}
                                  className={author.person?.id === person.id
                                    ? "font-medium text-foreground"
                                    : "hover:text-[#0067FF]"}
                                />
                              </span>
                            ),
                          )}
                        </div>

                        {/* Publication metadata */}
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#002B56]/65">
                          {publication.journal && (
                            <span>
                              {publication.journal}
                            </span>
                          )}

                          {publication.conference && (
                            <span>
                              {publication.conference}
                            </span>
                          )}

                          {publication.publisher && (
                            <span>
                              {publication.publisher}
                            </span>
                          )}

                          {publication.publicationDate && (
                            <span>
                              {formatDate(
                                publication.publicationDate,
                              )}
                            </span>
                          )}
                        </div>

                        {/* Publication links */}
                        {(publication.doi ||
                          publication.url ||
                          publication.pdfUrl) && (
                          <div className="mt-5 flex flex-wrap gap-4">
                            {publication.doi && (
                              <a
                                href={`https://doi.org/${publication.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0067FF] hover:underline"
                              >
                                DOI
                                <ExternalLinkIcon className="h-3.5 w-3.5" />
                              </a>
                            )}

                            {publication.url && (
                              <a
                                href={publication.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0067FF] hover:underline"
                              >
                                View publication
                                <ExternalLinkIcon className="h-3.5 w-3.5" />
                              </a>
                            )}

                            {publication.pdfUrl && (
                              <a
                                href={publication.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0067FF] hover:underline"
                              >
                                PDF
                                <ExternalLinkIcon className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </article>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <SectionHeading
                  title="Projects"
                  count={projects.length}
                />

                <div className="mt-5 grid gap-4">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <h3 className="font-semibold">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="mt-2 leading-7 text-[#002B56]/65">
                              {project.description}
                            </p>
                          )}
                        </div>

                        <span className="h-fit shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                          {project.status.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#002B56]/65">
                        {project.startDate && (
                          <span>
                            Started{" "}
                            {formatDate(project.startDate)}
                          </span>
                        )}

                        {project.endDate && (
                          <span>
                            Ended{" "}
                            {formatDate(project.endDate)}
                          </span>
                        )}
                      </div>

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0067FF] hover:underline"
                        >
                          Project details
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {person.researcherProfile?.projects?.trim() && (
              <section className="border-t pt-10">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Projects
                  </h2>

                  <p className="mt-1 text-sm text-[#002B56]/65">
                    Selected research and technical projects.
                  </p>
                </div>

                <div className="whitespace-pre-line text-sm leading-7 text-[#002B56]/65">
                  {person.researcherProfile.projects}
                </div>
              </section>
            )}

            {person.researcherProfile?.awards?.trim() && (
              <section className="border-t pt-10">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Awards & Achievements
                  </h2>

                  <p className="mt-1 text-sm text-[#002B56]/65">
                    Selected academic, research, and professional achievements.
                  </p>
                </div>

                <div className="whitespace-pre-line text-sm leading-7 text-[#002B56]/65">
                  {person.researcherProfile.awards}
                </div>
              </section>
            )}



            {/* Awards */}
            {person.awards.length > 0 && (
              <section>
                <SectionHeading
                  title="Awards & Recognition"
                  count={person.awards.length}
                />

                <div className="mt-5 space-y-4">
                  {person.awards.map((award) => (
                    <article
                      key={award.id}
                      className="rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6"
                    >
                      <h3 className="font-semibold">
                        {award.title}
                      </h3>

                      {award.organization && (
                        <p className="mt-1 text-sm font-medium text-[#0067FF]">
                          {award.organization}
                        </p>
                      )}

                      {award.description && (
                        <p className="mt-3 whitespace-pre-line leading-7 text-[#002B56]/65">
                          {award.description}
                        </p>
                      )}

                      {award.awardDate && (
                        <p className="mt-4 text-sm text-[#002B56]/65">
                          {formatDate(award.awardDate)}
                        </p>
                      )}

                      {award.url && (
                        <a
                          href={award.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#0067FF] hover:underline"
                        >
                          View award
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {profile.skills && (
              <section>
                <SectionHeading title="Skills & Expertise" />

                <div className="mt-5 rounded-xl border border-[#002B56]/10 bg-[#F5FAF8] p-5 sm:p-6">
                  <p className="whitespace-pre-line leading-8 text-[#002B56]/65">
                    {profile.skills}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* ===================================================
              SIDEBAR
          =================================================== */}
          <aside className="min-w-0 space-y-6">
            {/* Research Areas */}
            {person.researchAreas.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#002B56]/65">
                  Research Areas
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {person.researchAreas.map(
                    ({ researchArea }) => (
                      <span
                        key={researchArea.id}
                        className="max-w-full rounded bg-[#E1FFE1]/60 px-3 py-2 text-xs"
                      >
                        {researchArea.name}
                      </span>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Contact */}
            {(person.email || profile.phone) && (
              <section className="rounded-xl border border-[#002B56]/10 bg-white p-5 sm:p-6">
                <h2 className="font-semibold">Contact</h2>

                <div className="mt-4 space-y-3 text-sm">
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="flex items-start gap-3 text-[#002B56]/65 hover:text-[#0067FF]"
                    >
                      <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="break-all">
                        {person.email}
                      </span>
                    </a>
                  )}

                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3 text-[#002B56]/65 hover:text-[#0067FF]"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{profile.phone}</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Academic & Professional Links */}
            {academicLinks.length > 0 && (
              <div className="rounded-xl border border-[#002B56]/10 bg-[#F5FAF8] p-5">
                <h2 className="text-lg font-semibold">
                  Academic & Professional Links
                </h2>

                <div className="mt-4 space-y-2">
                  {academicLinks.map((item) => {
                    const { label, href, icon: Icon } = item;

                    if (!href) return null;

                    return (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 transition-colors hover:bg-muted"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-[#002B56]/65">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {label}
                        </span>

                        <ExternalLinkIcon className="h-4 w-4 shrink-0 text-[#002B56]/65 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#002B56]/15 pb-3">
      <h2 className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>

      {typeof count === "number" && (
        <span className="text-sm text-[#002B56]/65">
          {count}
        </span>
      )}
    </div>
  );
}