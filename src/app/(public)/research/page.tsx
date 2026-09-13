import { publicMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = publicMetadata("/research", {
  title: "Research",
  description:
    "Explore the research areas of Advanced System Lab (ASL-JKKNIU), including robotics, artificial intelligence, computer vision, GNSS, embedded systems, and human activity recognition.",
});

const researchAreas = [
  {
    number: "01",
    title: "Robotics & Autonomous Systems",
    description:
      "Intelligent robots, autonomous navigation, perception, sensing, and robotic systems.",
  },
  {
    number: "02",
    title: "Artificial Intelligence",
    description:
      "Machine learning, intelligent decision systems, prediction, classification, and automation.",
  },
  {
    number: "03",
    title: "Computer Vision",
    description:
      "Visual perception, image understanding, tracking, recognition, and activity analysis.",
  },
  {
    number: "04",
    title: "GNSS & Navigation",
    description:
      "Precise positioning, RTK, sensor fusion, localization, and navigation technologies.",
  },
  {
    number: "05",
    title: "IoT & Embedded Systems",
    description:
      "Connected sensing, intelligent hardware, embedded platforms, and edge systems.",
  },
  {
    number: "06",
    title: "Human Activity Recognition",
    description:
      "Activity recognition, fall detection, and intelligent human-centered sensing.",
  },
];

const researchApproach = [
  {
    number: "01",
    title: "Question",
    description:
      "Identify meaningful research problems with scientific and engineering relevance.",
  },
  {
    number: "02",
    title: "Explore",
    description:
      "Study existing methods, technologies, data, and possible technical approaches.",
  },
  {
    number: "03",
    title: "Engineer",
    description:
      "Develop algorithms, prototypes, datasets, sensing systems, and experimental platforms.",
  },
  {
    number: "04",
    title: "Validate",
    description:
      "Evaluate ideas through experiments, measurements, comparison, and real-world testing.",
  },
  {
    number: "05",
    title: "Share",
    description:
      "Document findings through publications, datasets, projects, and research outputs.",
  },
];

const connections = [
  {
    title: "Projects",
    description:
      "See how our research directions become experiments, prototypes, and engineering systems.",
    href: "/projects",
    label: "Explore projects",
  },
  {
    title: "Publications",
    description:
      "Browse the scientific outputs, papers, and research contributions produced by the lab.",
    href: "/publications",
    label: "View publications",
  },
  {
    title: "People",
    description:
      "Meet the researchers and contributors working across the laboratory's research areas.",
    href: "/people",
    label: "Meet the researchers",
  },
];

export default function ResearchPage() {
  return (
    <main className="overflow-hidden">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 top-16 size-80 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -left-20 top-36 size-44 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -right-28 -top-24 size-96 rounded-full bg-[#E1FFE1]/35" />

          <div className="absolute right-8 top-20 size-56 rounded-full border border-[#002B56]/5" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Research at ASL
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Exploring the systems
              <span className="block text-[#0067FF]">
                that sense, think, and act.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Research at Advanced System Lab connects intelligent
              algorithms, sensing, electronics, navigation, software,
              and human-centered systems to investigate challenging
              engineering problems.
            </p>
          </div>

          <div className="lg:pb-2">
            <div className="rounded-2xl border border-[#002B56]/10 bg-[#E1FFE1]/25 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0067FF]">
                Research philosophy
              </p>

              <p className="mt-5 text-2xl font-medium leading-snug tracking-[-0.02em] text-[#002B56]">
                Strong research begins with good questions and grows
                through experimentation, engineering, and evidence.
              </p>

              <div className="mt-7 h-px bg-[#002B56]/10" />

              <p className="mt-5 text-sm leading-6 text-[#002B56]/60">
                We approach research as a process of understanding,
                building, testing, validating, and contributing useful
                knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH INTRODUCTION
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.58fr_1.42fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Our direction
            </p>

            <div className="mt-5 h-px w-16 bg-[#0067FF]" />
          </div>

          <div>
            <p className="max-w-5xl text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Our work sits at the intersection of
              <span className="text-muted-foreground">
                {" "}
                intelligent computation, sensing, positioning,
                perception, embedded technology, and human activity.
              </span>
            </p>

            <div className="mt-10 grid gap-8 border-t pt-8 sm:grid-cols-2">
              <p className="text-base leading-7 text-muted-foreground">
                Rather than treating each discipline independently,
                we explore how different technologies can work
                together to understand and solve complex problems.
              </p>

              <p className="text-base leading-7 text-muted-foreground">
                The result is a research environment where algorithms,
                sensors, software, hardware, and experiments inform
                one another.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH AREAS
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#002B56] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -right-32 -top-32 size-[28rem] rounded-full border border-[#0067FF]/30" />

          <div className="absolute -right-4 top-10 size-64 rounded-full border border-[#E1FFE1]/10" />

          <div className="absolute -bottom-36 -left-28 size-80 rounded-full bg-[#0067FF]/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                Research areas
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Six areas.
                <br />
                One connected research ecosystem.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/55 lg:text-right">
              Each area represents a distinct direction, but many of
              our research problems naturally connect multiple areas
              together.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <article
                key={area.number}
                className="group relative min-h-[300px] overflow-hidden bg-[#002B56] p-7 transition-colors hover:bg-[#063765] sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#E1FFE1]/65">
                    {area.number}
                  </span>

                  <span className="size-2 rounded-full bg-[#0067FF]" />
                </div>

                <div className="mt-20">
                  <h3 className="max-w-xs text-xl font-semibold tracking-tight sm:text-2xl">
                    {area.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                    {area.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CROSS-DISCIPLINARY RESEARCH
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#E1FFE1]/35 p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 size-64 rounded-full border border-[#0067FF]/10"
            />

            <div
              aria-hidden="true"
              className="absolute right-8 top-8 size-28 rounded-full border border-[#002B56]/5"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Cross-disciplinary research
              </p>

              <p className="mt-7 max-w-3xl text-3xl font-medium leading-tight tracking-[-0.03em] text-[#002B56] sm:text-4xl">
                The most interesting problems often live between
                traditional research boundaries.
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#002B56]/60">
                Robotics may depend on computer vision. Navigation
                may require sensor fusion and artificial
                intelligence. Human activity recognition may combine
                vision, sensing, embedded systems, and machine
                learning.
              </p>

              <div className="mt-10 h-1 w-20 rounded-full bg-[#0067FF]" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Connected thinking
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Research areas are not isolated boxes.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground">
              We encourage research that brings together methods,
              sensing technologies, algorithms, and engineering
              platforms when the problem demands it.
            </p>

            <p className="mt-5 text-base leading-7 text-muted-foreground">
              This allows the lab to approach complex systems from
              multiple technical perspectives rather than forcing a
              problem into a single discipline.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH APPROACH
      ====================================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Research approach
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              From curiosity to contribution.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Our research process emphasizes understanding,
              experimentation, engineering, validation, and clear
              documentation.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2 lg:grid-cols-5">
            {researchApproach.map((item) => (
              <article
                key={item.number}
                className="group relative min-h-[260px] overflow-hidden bg-background p-7 transition-colors hover:bg-[#E1FFE1]/20"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                />

                <p className="text-xs font-semibold text-[#0067FF]">
                  {item.number}
                </p>

                <h3 className="mt-14 text-xl font-semibold tracking-tight">
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
          RESEARCH OUTPUTS
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Beyond investigation
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Research should create something others can use,
              examine, or build upon.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Our research connects naturally with the laboratory&apos;s
              projects, publications, datasets, prototypes, and
              technical experiments.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border">
            {connections.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between gap-8 bg-background p-7 transition-colors hover:bg-[#E1FFE1]/20 sm:flex-row sm:items-center sm:p-8"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0067FF]">
                    {item.title}
                  </p>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-sm font-medium text-[#002B56]">
                  {item.label}

                  <span className="flex size-9 items-center justify-center rounded-full border border-[#0067FF]/20 text-[#0067FF] transition-all group-hover:bg-[#0067FF] group-hover:text-white">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          MANIFESTO
      ====================================================== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#002B56] p-8 text-white sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 size-72 rounded-full bg-[#0067FF]/25"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 right-28 size-64 rounded-full border border-[#E1FFE1]/15"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-16 size-56 rounded-full bg-[#E1FFE1]/[0.05]"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  Research at ASL-JKKNIU
                </p>

                <h2 className="mt-5 max-w-4xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Ask better questions.
                  <br />
                  Build better experiments.
                  <br />
                  Create useful knowledge.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
                  Explore the projects, publications, and people that
                  bring these research directions to life.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1475ff]"
                >
                  Explore projects
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  href="/publications"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  View publications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}