import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Advanced System Lab (ASL-JKKNIU), our mission, vision, research philosophy, and approach to engineering intelligent systems.",
};

/**
 * ============================================================
 * IMAGE PLACEHOLDER
 * ============================================================
 *
 * Replace ONLY the string below with your direct JKKNIU
 * landscape/campus image URL.
 *
 * Example:
 * const JKKNIU_LANDSCAPE_IMAGE =
 *   "https://example.com/jkkniu-campus.jpg";
 *
 * You can also use a local public asset:
 * "/images/about/jkkniu-campus.jpg"
 */
const JKKNIU_LANDSCAPE_IMAGE =
  "https://i.ibb.co/qY4Knh0H/Cover-ASL-JKKNIU.jpg";

const principles = [
  {
    number: "01",
    title: "Research with purpose",
    description:
      "We pursue questions that can lead to meaningful scientific and engineering outcomes, connecting fundamental investigation with practical relevance.",
  },
  {
    number: "02",
    title: "Build to understand",
    description:
      "Ideas become more valuable when they are translated into prototypes, experiments, datasets, algorithms, and working systems.",
  },
  {
    number: "03",
    title: "Think across disciplines",
    description:
      "Modern engineering problems rarely belong to one discipline. We connect intelligent algorithms, electronics, software, sensing, control, and automation.",
  },
  {
    number: "04",
    title: "Grow through collaboration",
    description:
      "A strong research culture is built by sharing knowledge, questioning assumptions, learning from experiments, and working together.",
  },
];

const researchProcess = [
  {
    number: "01",
    title: "Question",
    description:
      "Identify meaningful scientific or engineering problems worth investigating.",
  },
  {
    number: "02",
    title: "Explore",
    description:
      "Study the problem, examine existing knowledge, and develop a strong technical direction.",
  },
  {
    number: "03",
    title: "Engineer",
    description:
      "Turn concepts into algorithms, prototypes, datasets, platforms, and experimental systems.",
  },
  {
    number: "04",
    title: "Validate",
    description:
      "Evaluate ideas through experimentation, measurement, comparison, and repeatable analysis.",
  },
  {
    number: "05",
    title: "Share",
    description:
      "Transform validated work into publications, projects, datasets, and future research directions.",
  },
];

const focusAreas = [
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

const ecosystem = [
  {
    title: "Research",
    eyebrow: "What we investigate",
    description:
      "Research areas define the scientific and engineering questions that guide our laboratory.",
    href: "/research",
  },
  {
    title: "Projects",
    eyebrow: "What we build",
    description:
      "Projects transform research ideas into experiments, prototypes, platforms, and real engineering systems.",
    href: "/projects",
  },
  {
    title: "Publications",
    eyebrow: "What we contribute",
    description:
      "Scientific outputs communicate our findings, methods, datasets, and technical contributions.",
    href: "/publications",
  },
  {
    title: "People",
    eyebrow: "Who makes it possible",
    description:
      "Researchers, students, academic mentors, alumni, and collaborators form the intellectual foundation of ASL.",
    href: "/people",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b">
        {/* Campus image */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[58%] bg-cover bg-center lg:block"
          style={{
            backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
          }}
        />

        {/* Image treatment */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[67%] bg-gradient-to-r from-background via-background/70 to-background/5 lg:block"
        />

        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[58%] bg-gradient-to-t from-[#002B56]/35 via-transparent to-[#0067FF]/10 lg:block"
        />

        {/* Brand geometry */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 top-24 size-80 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -left-24 top-40 size-48 rounded-full border border-[#0067FF]/15" />

          <div className="absolute right-[8%] top-16 hidden size-96 rounded-full border border-white/20 lg:block" />

          <div className="absolute right-[14%] top-36 hidden size-64 rounded-full border border-white/15 lg:block" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-end px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="relative z-10 max-w-4xl">
            {/* Brand marker */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/20" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0067FF]">
                About ASL-JKKNIU
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[5.3rem] xl:leading-[0.98]">
              Engineering
              <span className="block text-[#0067FF]">
                intelligent systems
              </span>
              for what comes next.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Advanced System Lab is a research environment at Jatiya Kabi
              Kazi Nazrul Islam University where curiosity, engineering,
              experimentation, and intelligent technologies come together.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#0058dc]"
              >
                Explore our research
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/people"
                className="inline-flex items-center justify-center rounded-md border border-[#002B56]/20 bg-background/90 px-5 py-3 text-sm font-medium text-[#002B56] backdrop-blur-sm transition-colors hover:bg-[#E1FFE1]/50"
              >
                Meet our people
              </Link>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
              {["Research", "Experiment", "Engineer", "Validate"].map(
                (item, index) => (
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
                ),
              )}
            </div>
          </div>

          {/* Mobile campus image */}
          <div className="relative mt-14 overflow-hidden rounded-2xl border lg:hidden">
            <div
              className="min-h-[320px] bg-cover bg-center"
              style={{
                backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#002B56]/65 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Our academic home
              </p>

              <p className="mt-2 font-medium">
                Jatiya Kabi Kazi Nazrul Islam University
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO WE ARE
      ====================================================== */}
      <section className="relative border-b">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0067FF] via-[#E1FFE1] to-transparent"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              Who we are
            </p>

            <div className="mt-5 h-px w-16 bg-[#0067FF]" />
          </div>

          <div>
            <p className="max-w-5xl text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              A research culture where
              <span className="text-muted-foreground">
                {" "}
                curiosity becomes experimentation, experimentation becomes
                engineering, and engineering becomes knowledge.
              </span>
            </p>

            <div className="mt-12 grid gap-8 border-t pt-8 sm:grid-cols-2">
              <p className="text-base leading-7 text-muted-foreground">
                ASL-JKKNIU brings together researchers interested in advanced
                and intelligent engineering systems. Our work spans software,
                hardware, sensing, automation, algorithms, data, and
                experimental platforms.
              </p>

              <p className="text-base leading-7 text-muted-foreground">
                We aim to create an environment where students and researchers
                can ask difficult questions, build real systems, evaluate
                their ideas carefully, and communicate what they discover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION + VISION
      ====================================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-2">
            {/* Mission */}
            <article className="group relative overflow-hidden bg-background p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-20 size-52 rounded-full bg-[#0067FF]/5 transition-transform duration-500 group-hover:scale-110"
              />

              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#0067FF]/10 text-sm font-semibold text-[#0067FF]">
                  M
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                  Our mission
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
                  Turn ambitious ideas into rigorous engineering research.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                  Our mission is to create an environment where researchers
                  can investigate emerging technologies, strengthen technical
                  capability, develop experimental systems, and contribute
                  useful knowledge through high-quality research.
                </p>
              </div>
            </article>

            {/* Vision */}
            <article className="group relative overflow-hidden bg-[#E1FFE1]/45 p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-20 size-52 rounded-full border border-[#0067FF]/10 transition-transform duration-500 group-hover:scale-110"
              />

              <div className="relative">
                <div className="flex size-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#002B56] ring-1 ring-[#002B56]/10">
                  V
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#002B56]">
                  Our vision
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-[#002B56] sm:text-4xl">
                  Grow a research community capable of building what comes
                  next.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-[#002B56]/70">
                  We envision a laboratory where students and researchers
                  develop the confidence, discipline, and interdisciplinary
                  knowledge needed to tackle complex engineering problems and
                  contribute to future intelligent systems.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESEARCH PROCESS
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                How we work
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Research should move.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                From an unanswered question to something that can be tested,
                measured, understood, improved, and shared.
              </p>

              <div className="mt-8 h-1 w-20 rounded-full bg-gradient-to-r from-[#0067FF] to-[#E1FFE1]" />
            </div>

            <div className="border-t">
              {researchProcess.map((item) => (
                <div
                  key={item.number}
                  className="group grid gap-4 border-b py-7 transition-colors hover:bg-[#0067FF]/[0.025] sm:grid-cols-[70px_0.7fr_1.3fr] sm:items-start sm:px-4"
                >
                  <p className="text-xs font-semibold text-[#0067FF]">
                    {item.number}
                  </p>

                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOCUS AREAS
      ====================================================== */}
      <section className="relative overflow-hidden border-b bg-[#002B56] text-white">
        <div
          aria-hidden="true"
          className="absolute -right-28 -top-28 size-96 rounded-full border border-[#0067FF]/35"
        />

        <div
          aria-hidden="true"
          className="absolute -right-8 top-12 size-64 rounded-full border border-[#E1FFE1]/15"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0067FF] via-[#E1FFE1] to-[#0067FF]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                Interdisciplinary by design
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Complex problems do not respect academic boundaries.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
                Our research connects intelligent algorithms, electronics,
                software, sensing, navigation, automation, and physical
                systems.
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
            {focusAreas.map((area) => (
              <article
                key={area.number}
                className="group bg-[#002B56] p-7 transition-colors hover:bg-[#063765] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#E1FFE1]/70">
                    {area.number}
                  </span>

                  <div className="size-2 rounded-full bg-[#0067FF] transition-transform group-hover:scale-150" />
                </div>

                <h3 className="mt-10 text-xl font-semibold">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRINCIPLES
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              What defines us
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Principles behind the work.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Good research depends on more than tools and technology. It
              requires a way of thinking.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="group relative overflow-hidden bg-background p-7 transition-colors hover:bg-[#E1FFE1]/20 sm:p-9"
              >
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-1 w-0 bg-[#0067FF] transition-all duration-300 group-hover:w-full"
                />

                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#0067FF]">
                    {principle.number}
                  </span>

                  <span className="text-xl text-muted-foreground transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h3 className="mt-12 text-xl font-semibold tracking-tight">
                  {principle.title}
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ASL ECOSYSTEM
      ====================================================== */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-sm bg-[#0067FF]" />
                <div className="size-3 rounded-sm bg-[#E1FFE1] ring-1 ring-[#002B56]/10" />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                The ASL ecosystem
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                One laboratory.
                <br />
                Four connected layers.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                Research ideas, engineering projects, scientific outputs, and
                people strengthen one another.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
              {ecosystem.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group bg-background p-7 transition-all hover:bg-[#E1FFE1]/25 sm:p-8"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0067FF]">
                    {item.title}
                  </p>

                  <h3 className="mt-8 text-xl font-semibold tracking-tight">
                    {item.eyebrow}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Explore
                    </span>

                    <span className="flex size-8 items-center justify-center rounded-full border border-[#0067FF]/20 text-[#0067FF] transition-all group-hover:bg-[#0067FF] group-hover:text-white">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          UNIVERSITY / LANDSCAPE IMAGE
      ====================================================== */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="overflow-hidden rounded-2xl border">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              {/* Landscape */}
              <div
                className="relative min-h-[380px] bg-cover bg-center sm:min-h-[480px] lg:min-h-[580px]"
                style={{
                  backgroundImage: `url("${JKKNIU_LANDSCAPE_IMAGE}")`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#002B56]/85 via-[#002B56]/15 to-transparent" />

                <div
                  aria-hidden="true"
                  className="absolute left-8 top-8 size-24 rounded-full border border-white/25 sm:size-32"
                />

                <div
                  aria-hidden="true"
                  className="absolute left-14 top-14 size-12 rounded-full border border-[#E1FFE1]/40 sm:size-16"
                />

                <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                    Rooted at JKKNIU
                  </p>

                  <p className="mt-3 max-w-lg text-2xl font-medium tracking-tight sm:text-3xl">
                    A place for ideas, experimentation, engineering, and
                    discovery.
                  </p>
                </div>
              </div>

              {/* University text */}
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

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#002B56] sm:text-4xl lg:text-5xl">
                    Jatiya Kabi Kazi Nazrul Islam University
                  </h2>

                  <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                    Advanced System Lab is part of the academic research
                    environment of JKKNIU in Trishal, Mymensingh. The
                    laboratory provides a space where students and
                    researchers can strengthen technical capability, pursue
                    experimental work, and contribute to advanced engineering
                    research.
                  </p>

                  <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E1FFE1]/60 px-4 py-2 text-xs font-medium text-[#002B56]">
                    <span className="size-2 rounded-full bg-[#0067FF]" />
                    Trishal · Mymensingh · Bangladesh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MANIFESTO
      ====================================================== */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0067FF]/[0.035]"
        />

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0067FF]/10"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0067FF]">
              Why ASL
            </p>

            <p className="mt-8 text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              The best way to understand the future of engineering is to
              <span className="text-[#0067FF]">
                {" "}
                research it, build it, test it, and improve it.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-[#002B56] text-white">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-24 size-72 rounded-full bg-[#0067FF]/30"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-24 size-64 rounded-full border border-[#E1FFE1]/20"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 size-56 rounded-full bg-[#E1FFE1]/10"
            />

            <div className="relative grid lg:grid-cols-[1fr_auto]">
              <div className="p-8 sm:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
                  Discover ASL-JKKNIU
                </p>

                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  See the research. Explore the work. Meet the people behind
                  it.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                  Explore our research directions, engineering projects,
                  scientific publications, and the researchers building them.
                </p>
              </div>

              <div className="grid border-t border-white/15 lg:w-64 lg:border-l lg:border-t-0">
                {[
                  ["Research", "/research"],
                  ["Projects", "/projects"],
                  ["Publications", "/publications"],
                  ["People", "/people"],
                ].map(([label, href], index) => (
                  <Link
                    key={label}
                    href={href}
                    className={`group flex items-center justify-between px-6 py-5 text-sm font-medium transition-colors hover:bg-[#0067FF] ${
                      index < 3 ? "border-b border-white/15" : ""
                    }`}
                  >
                    {label}

                    <span className="text-[#E1FFE1] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}