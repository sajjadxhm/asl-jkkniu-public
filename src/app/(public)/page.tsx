import Link from "next/link";
import Image from "next/image";
import campusImage from "../../../public/images/jkkniu-campus.webp";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicationEntry } from "@/features/publications/components/publication-entry";
import { getHomepageData } from "@/features/home/queries";
import { publicMetadata, SITE_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_ALTERNATE_NAME, SITE_URL } from "@/lib/seo";

export const metadata = publicMetadata("/", { title: { absolute: SITE_TITLE }, description: SITE_DESCRIPTION });
// Read fresh CMS data, including visibility and account-status changes, on each request.
export const dynamic = "force-dynamic";

const homepageUrl = new URL("/", SITE_URL).href;
const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": homepageUrl + "#website",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: homepageUrl,
      publisher: { "@id": homepageUrl + "#organization" },
    },
    {
      "@type": "Organization",
      "@id": homepageUrl + "#organization",
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: homepageUrl,
      logo: new URL("/asl-logo.svg", SITE_URL).href,
    },
  ],
};

// Existing Research-page topics provide a useful fallback before database areas are configured.
const defaultResearchAreas = [
  "Robotics & Autonomous Systems", "Artificial Intelligence", "Computer Vision",
  "GNSS & Navigation", "IoT & Embedded Systems", "Human Activity Recognition",
].map((name) => ({ id: name, name }));

const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const textLink = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0058D6] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0067FF]";

function SectionHeading({ id, eyebrow, title, href, label }: { id: string; eyebrow: string; title: string; href: string; label: string }) {
  return (
    <div className="mb-5 flex flex-col gap-2 border-b border-[#002B56]/15 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0058D6]">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      <Link href={href} className={textLink}>{label}<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></Link>
    </div>
  );
}

export default async function HomePage() {
  const data = await getHomepageData();
  const researchAreas = data.researchAreas.length ? data.researchAreas : defaultResearchAreas;
  const stats = [
    { label: "Publications", value: data.publicationCount, href: "/publications" },
    { label: "Active researchers", value: data.researcherCount, href: "/people" },
    { label: "Ongoing projects", value: data.projectCount, href: "/projects" },
    ...(data.researchAreaCount > 0 ? [{ label: "Research areas", value: data.researchAreaCount, href: "/research" }] : []),
  ];

  return (
    <main className="bg-white text-[#002B56]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData).replace(/</g, "\u003c") }} />
      <section aria-labelledby="home-heading" className="border-b border-[#002B56]/10 bg-[#F4F7FA]">
        <div className={container + " grid gap-7 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-12"}>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0058D6]">Advanced System Lab / ASL-JKKNIU</p>
            <h1 id="home-heading" className="mt-4 text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl xl:text-[3.5rem]">Researching intelligent systems.<span className="block text-[#0058D6]">Engineering what comes next.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#334E68]">Research Lab at Jatiya Kabi Kazi Nazrul Islam University, connecting academic knowledge with world class research experiments.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/publications" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0058D6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002B56]">View Publications<ArrowRight aria-hidden="true" className="size-4" /></Link>
              <Link href="/projects" className="inline-flex min-h-11 items-center justify-center gap-2 px-3 py-3 text-sm font-semibold hover:underline">Explore Projects<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
            </div>
          </div>

          <figure className="min-w-0">
            <div className="relative h-52 overflow-hidden rounded-xl border border-[#002B56]/15 bg-[#E1FFE1] shadow-[0_10px_30px_rgba(0,43,86,0.12)] sm:h-72 lg:aspect-[4/3] lg:h-auto">
              <Image
                src={campusImage}
                alt="Aerial view of JKKNIU campus buildings, green spaces, and a pond"
                fill
                priority
                sizes="(min-width: 1280px) 505px, (min-width: 1024px) 43vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                className="object-cover object-center"
              />
            </div>

            <figcaption className="mt-3 text-center text-xs leading-5 text-[#334E68]">
              <span className="font-semibold text-[#002B56]">
                Our academic home
              </span>
              {" · "}
              <a
                href="https://jkkniu.edu.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#334E68] transition-colors duration-200 hover:text-[#002B56]"
              >
                Jatiya Kabi Kazi Nazrul Islam University
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="ASL in numbers" className="border-b border-[#002B56]/10">
        <div className={container + " py-5"}>
          <dl className={"grid grid-cols-2 gap-3 sm:gap-6 " + (stats.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0 border-l-2 border-[#E1FFE1] pl-4">
                <dt><Link href={stat.href} className="inline-flex min-h-11 items-center text-xs font-medium text-[#334E68] hover:text-[#0058D6] hover:underline sm:text-sm">{stat.label}</Link></dt>
                <dd className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{stat.value.toLocaleString("en-US")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="publications-heading" className={container + " py-9 sm:py-12"}>
        <SectionHeading id="publications-heading" eyebrow="Research output" title={data.publications.some((publication) => publication.isFeatured) ? "Selected publications" : "Latest publications"} href="/publications" label="View all publications" />
        {data.publications.length ? <div>{data.publications.map((publication) => <PublicationEntry key={publication.id} publication={publication} />)}</div> : <p className="rounded-xl border border-dashed border-[#002B56]/20 p-6 text-sm leading-6 text-[#334E68]">Publications will appear here as the lab shares its research.</p>}
      </section>

      <section aria-labelledby="projects-heading" className="border-y border-[#002B56]/10 bg-[#F4F7FA]">
        <div className={container + " py-9 sm:py-12"}>
          <SectionHeading id="projects-heading" eyebrow="Research in practice" title="Current projects" href="/projects" label="Explore all projects" />
          {data.projects.length ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">
              {data.projects.map((project) => (
                <article key={project.id} className="flex min-w-0 flex-col rounded-xl border border-[#002B56]/15 bg-white p-5 sm:p-6">
                  <p className="text-xs font-semibold text-[#0058D6]">Ongoing</p>
                  <h3 className="mt-3 text-xl font-semibold leading-7 tracking-tight [overflow-wrap:anywhere]"><Link href={"/projects/" + project.slug} className="hover:text-[#0058D6] hover:underline">{project.title}</Link></h3>
                  {project.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#334E68] [overflow-wrap:anywhere]">{project.description}</p>}
                  <p className="mt-4 text-xs leading-5 text-[#334E68] [overflow-wrap:anywhere]"><span className="font-semibold">PI:</span> {project.principalInvestigator.name}</p>
                  <div className="mt-auto pt-4"><Link href={"/projects/" + project.slug} aria-label={"Explore project: " + project.title} className={textLink}>Explore project<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></Link></div>
                </article>
              ))}
            </div>
          ) : <p className="rounded-xl border border-dashed border-[#002B56]/20 bg-white p-6 text-sm leading-6 text-[#334E68]">No ongoing projects are listed right now. Explore all projects for the lab&apos;s wider work.</p>}
        </div>
      </section>

      <section aria-labelledby="research-heading" className={container + " py-9 sm:py-12"}>
        <SectionHeading id="research-heading" eyebrow="Research focus" title="Connected by intelligent systems" href="/research" label="Explore our research" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => <li key={area.id} className="min-w-0"><Link href="/research" className="flex h-full min-h-16 items-center justify-between gap-4 rounded-lg border border-[#002B56]/15 px-4 py-3 text-sm font-semibold hover:border-[#0058D6] hover:bg-[#E1FFE1]/50"><span className="[overflow-wrap:anywhere]">{area.name}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-[#0058D6]" /></Link></li>)}
          </ul>
      </section>

      <section aria-labelledby="explore-heading" className={container + " pb-9 sm:pb-12"}>
        <div className="flex flex-col gap-5 rounded-xl bg-[#002B56] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E1FFE1]">Explore ASL</p><h2 id="explore-heading" className="mt-2 text-2xl font-semibold tracking-tight">Meet the people behind the research.</h2></div>
          <nav aria-label="Explore the lab" className="flex flex-wrap gap-x-5 gap-y-1">
            {[{ label: "People", href: "/people" }, { label: "Research", href: "/research" }, { label: "Projects", href: "/projects" }, { label: "Publications", href: "/publications" }].map((item) => <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 hover:text-[#E1FFE1] hover:underline">{item.label}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>)}
          </nav>
        </div>
      </section>
    </main>
  );
}
