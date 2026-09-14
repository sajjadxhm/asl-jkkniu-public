import { publicMetadata, SITE_TITLE, SITE_DESCRIPTION, SITE_NAME, SITE_ALTERNATE_NAME, SITE_URL } from "@/lib/seo";
import Link from "next/link";

export const metadata = publicMetadata("/", { title: { absolute: SITE_TITLE }, description: SITE_DESCRIPTION });

/**
 * ============================================================
 * IMAGE PLACEHOLDERS
 * ============================================================
 *
 * Replace these with direct image URLs or local public paths.
 *
 * Example local:
 * "/images/home/jkkniu-campus.webp"
 *
 * Example remote:
 * "https://example.com/jkkniu-campus.webp"
 */

const JKKNIU_LANDSCAPE_IMAGE =
  "https://i.ibb.co/wZzM5Fx3/Cover-ASL-JKKNIU-1.jpg";

const ASL_LAB_IMAGE =
  "https://i.ibb.co/wZzM5Fx3/Cover-ASL-JKKNIU-1.jpg";

const hasCampusImage = !JKKNIU_LANDSCAPE_IMAGE.startsWith(
  "PASTE-",
);

const hasLabImage = !ASL_LAB_IMAGE.startsWith("PASTE-");

const researchAreas = [
  {
    number: "01",
    title: "Robotics & Autonomous Systems",
    description:
      "Intelligent robots, autonomous navigation, perception, sensing, and robotic systems.",
  },
  {
    number: "02",
    title: "Computer Vision",
    description:
      "Visual perception, image understanding, tracking, recognition, and human activity analysis.",
  },
  {
    number: "03",
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Machine learning and intelligent methods for prediction, classification, automation, and decision systems.",
  },
  {
    number: "04",
    title: "IoT & Embedded Systems",
    description:
      "Connected sensing, embedded platforms, edge computing, and intelligent hardware systems.",
  },
  {
    number: "05",
    title: "GNSS & Navigation",
    description:
      "Precise positioning, RTK, sensor fusion, localization, and advanced navigation technologies.",
  },
{
  number: "06",
  title: "Human Activity Recognition",
  description:
    "Activity recognition, fall detection, and intelligent human-centered sensing.",
},
];

const researchFlow = [
  {
    number: "01",
    title: "Explore",
    description: "Ask meaningful scientific and engineering questions.",
  },
  {
    number: "02",
    title: "Experiment",
    description: "Develop methods, datasets, prototypes, and test systems.",
  },
  {
    number: "03",
    title: "Engineer",
    description: "Turn promising ideas into real technical solutions.",
  },
  {
    number: "04",
    title: "Share",
    description: "Contribute findings through projects and publications.",
  },
];

const ecosystem = [
  {
    title: "Research",
    eyebrow: "What we investigate",
    href: "/research",
  },
  {
    title: "Projects",
    eyebrow: "What we build",
    href: "/projects",
  },
  {
    title: "Publications",
    eyebrow: "What we contribute",
    href: "/publications",
  },
  {
    title: "People",
    eyebrow: "Who makes it possible",
    href: "/people",
  },
];

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

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c") }}
      />
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b">
        {/* Campus image */}
        {hasCampusImage && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[59%] bg-cover bg-center lg:block"
              style={{
                backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[70%] bg-gradient-to-r from-background via-background/75 to-background/5 lg:block"
            />

            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 hidden w-[59%] bg-gradient-to-t from-[#002B56]/45 via-transparent to-[#0067FF]/10 lg:block"
            />
          </>
        )}

        {/* Brand geometry */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-44 top-28 size-80 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -left-24 top-44 size-48 rounded-full border border-[#0067FF]/15" />

          <div className="absolute right-[8%] top-16 hidden size-96 rounded-full border border-white/20 lg:block" />

          <div className="absolute right-[14%] top-36 hidden size-64 rounded-full border border-white/15 lg:block" />

          <div className="absolute left-[48%] top-0 hidden h-full w-px bg-border/40 lg:block" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8 lg:py-12 xl:py-23">
          <div className="relative z-10 max-w-4xl">
            {/* Identity */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/20" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0067FF]">
                Advanced System Lab · JKKNIU
              </p>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[4rem]">
              Researching
              <span className="block text-[#0067FF]">
                intelligent systems
              </span>
              for a smarter future.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              ASL-JKKNIU brings together engineering, intelligent
              technologies, experimentation, and research to explore
              challenging problems and build systems that matter.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/publications"
                className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0058dc]"
              >
                Our Publications
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-md border border-[#002B56]/20 bg-background/90 px-5 py-3 text-sm font-medium text-[#002B56] backdrop-blur-sm transition-colors hover:bg-[#E1FFE1]/50"
              >
                Explore our research
              </Link>
            </div>

            {/* Small identity strip */}
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
              {[
                "Research",
                "Experiment",
                "Engineer",
                "Validate",
              ].map((item, index) => (
                <div
                  key={item}
                  className="bg-background/90 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="text-[10px] font-semibold text-[#0067FF]">
                    0{index + 1}
                  </p>

                  <p className="mt-1 text-xs font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right-side hero visual */}
          <div className="relative z-10">
            {!hasCampusImage && (
              <div className="relative overflow-hidden rounded-2xl border bg-[#002B56] p-8 text-white sm:p-10">
                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-24 size-72 rounded-full bg-[#0067FF]/30"
                />

                <div
                  aria-hidden="true"
                  className="absolute -bottom-20 right-10 size-52 rounded-full border border-[#E1FFE1]/20"
                />

                <div className="relative min-h-[340px] sm:min-h-[420px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                    ASL-JKKNIU
                  </p>

                  <p className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
                    People.
                    <br />
                    Ideas.
                    <br />
                    Intelligent
                    <br />
                    systems.
                  </p>

                  <div className="absolute bottom-0 left-0">
                    <div className="h-px w-16 bg-[#0067FF]" />

                    <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
                      Rooted at JKKNIU and focused on research,
                      innovation, and engineering.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile campus image */}
          {hasCampusImage && (
            <div className="relative overflow-hidden rounded-2xl border lg:hidden">
              <div
                className="min-h-[320px] bg-cover bg-center"
                style={{
                  backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#002B56]/75 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]">
                  Our academic home
                </p>

                <p className="mt-2 font-medium">
                  Jatiya Kabi Kazi Nazrul Islam University
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <section className="relative border-b">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0067FF] via-[#E1FFE1] to-transparent"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.58fr_1.42fr] lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Advanced System Lab
            </p>

            <div className="mt-5 h-px w-16 bg-[#0067FF]" />

            <Link
              href="/about"
              className="mt-7 inline-flex text-sm font-medium underline-offset-4 hover:underline"
            >
              Discover our story →
            </Link>
          </div>

          <div>
            <p className="max-w-5xl text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              We explore the space where
              <span className="text-muted-foreground">
                {" "}
                intelligent algorithms, electronics, sensing, software,
                automation, and real-world engineering meet.
              </span>
            </p>

            <div className="mt-12 grid gap-8 border-t pt-8 sm:grid-cols-2">
              <p className="text-base leading-7 text-muted-foreground">
                Our research spans robotics, artificial intelligence,
                computer vision, GNSS and navigation, embedded systems,
                and industrial automation.
              </p>

              <p className="text-base leading-7 text-muted-foreground">
                We believe research becomes more valuable when ideas can
                move from questions to experiments, from experiments to
                systems, and from systems to useful knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH AREAS
      ====================================================== */}
      <section className="relative overflow-hidden border-b bg-[#002B56] text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-28 size-96 rounded-full border border-[#0067FF]/35"
        />

        <div
          aria-hidden="true"
          className="absolute -right-4 top-12 size-64 rounded-full border border-[#E1FFE1]/15"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                Research directions
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Different disciplines.
                <br />
                Connected by intelligent systems.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
                Complex engineering problems rarely fit within one field.
                Our research combines multiple technologies and methods to
                investigate them from different perspectives.
              </p>
            </div>

            <Link
              href="/research"
              className="inline-flex text-sm font-medium text-[#E1FFE1] underline-offset-4 hover:underline"
            >
              Explore all research →
            </Link>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <Link
                key={area.number}
                href="/research"
                className="group bg-[#002B56] p-7 transition-colors hover:bg-[#063765] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#E1FFE1]/70">
                    {area.number}
                  </span>

                  <span className="flex size-8 items-center justify-center rounded-full border border-white/15 text-[#E1FFE1] transition-all group-hover:border-[#0067FF] group-hover:bg-[#0067FF] group-hover:text-white">
                    →
                  </span>
                </div>

                <h3 className="mt-10 text-xl font-semibold">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH PROCESS
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              How ideas move
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Research with purpose.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              A simple philosophy guides how research grows inside ASL.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2 lg:grid-cols-4">
            {researchFlow.map((item) => (
              <article
                key={item.number}
                className="group relative min-h-64 overflow-hidden bg-background p-7 transition-colors hover:bg-[#E1FFE1]/20 sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                />

                <p className="text-xs font-semibold text-[#0067FF]">
                  {item.number}
                </p>

                <h3 className="mt-16 text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECTS / LAB VISUAL
      ====================================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid overflow-hidden rounded-2xl border bg-background lg:grid-cols-[0.95fr_1.05fr]">
            {/* Visual */}
            <div className="relative min-h-[420px] overflow-hidden bg-[#002B56]">
              {hasLabImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${ASL_LAB_IMAGE}")`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#002B56]/90 via-[#002B56]/20 to-transparent" />
                </>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 size-72 rounded-full bg-[#0067FF]/35"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute bottom-8 left-8 size-48 rounded-full border border-[#E1FFE1]/15"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute bottom-16 left-16 size-24 rounded-full border border-white/15"
                  />
                </>
              )}

              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  From ideas to systems
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
                  Engineering becomes meaningful when ideas are tested in
                  the real world.
                </h2>
              </div>
            </div>

            {/* Project content */}
            <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                  ASL Projects
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Research in motion.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                  Our projects transform research directions into
                  experiments, datasets, prototypes, software,
                  instrumentation, and engineering systems.
                </p>
              </div>

              <div className="mt-12 border-t">
                <Link
                  href="/projects"
                  className="group flex items-center justify-between border-b py-5"
                >
                  <div>
                    <p className="font-medium">
                      Explore ASL Projects
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      See what our researchers are working on.
                    </p>
                  </div>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#0067FF]/20 text-[#0067FF] transition-all group-hover:bg-[#0067FF] group-hover:text-white">
                    →
                  </span>
                </Link>

                <Link
                  href="/research"
                  className="group flex items-center justify-between py-5"
                >
                  <div>
                    <p className="font-medium">
                      Understand the research
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Discover the questions behind the projects.
                    </p>
                  </div>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#0067FF]/20 text-[#0067FF] transition-all group-hover:bg-[#0067FF] group-hover:text-white">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PUBLICATIONS
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Publications
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Knowledge that travels beyond the laboratory.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Research becomes part of a larger scientific conversation
              through publications, conference papers, datasets, and
              documented results.
            </p>

            <Link
              href="/publications"
              className="mt-7 inline-flex text-sm font-medium underline-offset-4 hover:underline"
            >
              Browse publications →
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#E1FFE1]/40 p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 size-56 rounded-full border border-[#0067FF]/10"
            />

            <div
              aria-hidden="true"
              className="absolute right-8 top-8 size-24 rounded-full border border-[#0067FF]/10"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#002B56]">
                Research output
              </p>

              <p className="mt-8 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#002B56] sm:text-4xl">
                From an experiment in the lab to knowledge others can
                examine, reproduce, question, and build upon.
              </p>

              <div className="mt-10 h-1 w-20 rounded-full bg-gradient-to-r from-[#0067FF] to-[#E1FFE1]" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PEOPLE / LAB CULTURE
      ====================================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                The people behind ASL
              </p>

              <p className="mt-6 max-w-4xl text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Technology moves forward because
                <span className="text-muted-foreground">
                  {" "}
                  people question, collaborate, experiment, fail, learn,
                  and try again.
                </span>
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <p className="text-base leading-7 text-muted-foreground">
                ASL brings together researchers, students, academic
                mentors, alumni, and collaborators interested in solving
                challenging engineering problems.
              </p>

              <Link
                href="/people"
                className="mt-7 inline-flex w-fit items-center rounded-md border border-[#002B56]/20 px-5 py-3 text-sm font-medium text-[#002B56] transition-colors hover:bg-[#E1FFE1]/40"
              >
                Meet our people
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ASL ECOSYSTEM
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Explore the laboratory
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                One ecosystem. Four perspectives.
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative min-h-64 overflow-hidden bg-background p-7 transition-colors hover:bg-[#E1FFE1]/25 sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0067FF]">
                  {item.title}
                </p>

                <h3 className="mt-14 text-xl font-semibold tracking-tight">
                  {item.eyebrow}
                </h3>

                <div className="absolute bottom-7 right-7 flex size-9 items-center justify-center rounded-full border border-[#0067FF]/20 text-[#0067FF] transition-all group-hover:bg-[#0067FF] group-hover:text-white sm:bottom-8 sm:right-8">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          JKKNIU
      ====================================================== */}
      {hasCampusImage && (
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid overflow-hidden rounded-2xl border lg:grid-cols-[1.1fr_0.9fr]">
              <div
                className="relative min-h-[400px] bg-cover bg-center sm:min-h-[500px]"
                style={{
                  backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#002B56]/85 via-[#002B56]/10 to-transparent" />

                <div
                  aria-hidden="true"
                  className="absolute left-8 top-8 size-28 rounded-full border border-white/25"
                />

                <div
                  aria-hidden="true"
                  className="absolute left-14 top-14 size-16 rounded-full border border-[#E1FFE1]/40"
                />

                <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                    Rooted at JKKNIU
                  </p>

                  <p className="mt-3 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
                    A university environment for ideas,
                    experimentation, engineering, and discovery.
                  </p>
                </div>
              </div>

              <div className="relative flex items-center bg-background p-8 sm:p-10 lg:p-14">
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-2 w-32 bg-[#E1FFE1]"
                />

                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-2 w-16 bg-[#0067FF]"
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                    Our academic home
                  </p>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#002B56] sm:text-4xl">
                    Jatiya Kabi Kazi Nazrul Islam University
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                    ASL-JKKNIU grows within the academic research
                    environment of JKKNIU in Trishal, Mymensingh,
                    Bangladesh.
                  </p>

                  <Link
                    href="/about"
                    className="mt-8 inline-flex text-sm font-medium text-[#002B56] underline-offset-4 hover:underline"
                  >
                    Learn more about ASL →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#002B56] text-white">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-28 size-80 rounded-full bg-[#0067FF]/30"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-32 right-28 size-72 rounded-full border border-[#E1FFE1]/20"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-20 size-64 rounded-full bg-[#E1FFE1]/10"
            />

            <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  Advanced System Lab
                </p>

                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Research. Build. Test. Learn. Create what comes next.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
                  Discover our research, engineering projects,
                  publications, and the people behind ASL-JKKNIU.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/research"
                  className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1475ff]"
                >
                  Explore research
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  About ASL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}