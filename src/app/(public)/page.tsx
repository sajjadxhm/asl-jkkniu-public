import Link from "next/link";

const researchAreas = [
  {
    title: "Robotics & Autonomous Systems",
    description:
      "Research in intelligent robots, autonomous navigation, perception, and robotic systems.",
  },
  {
    title: "Computer Vision",
    description:
      "Visual perception, image understanding, object detection, tracking, and human activity recognition.",
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Machine learning and AI methods for intelligent systems, prediction, classification, and automation.",
  },
  {
    title: "IoT & Embedded Systems",
    description:
      "Connected sensing, embedded platforms, edge computing, and intelligent hardware systems.",
  },
  {
    title: "GNSS & Navigation",
    description:
      "Precise positioning, GNSS, RTK, sensor fusion, and navigation technologies.",
  },
  {
    title: "Industrial Automation",
    description:
      "PLC, HMI, industrial control, machine automation, and manufacturing system optimization.",
  },
];

const statistics = [
  {
    value: "01",
    label: "Research Laboratory",
  },
  {
    value: "06+",
    label: "Research Areas",
  },
  {
    value: "14+",
    label: "Research Projects",
  },
  {
    value: "50+",
    label: "Publications & Research Outputs",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Advanced System Lab
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Researching intelligent systems for a smarter future.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              ASL-JKKNIU is a research laboratory at Jatiya Kabi Kazi
              Nazrul Islam University focused on intelligent systems,
              robotics, computer vision, artificial intelligence,
              navigation, and emerging technologies.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Our Research
              </Link>

              <Link
                href="/people"
                className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Meet the Researchers
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-muted/30 p-6 sm:p-8">
              <div className="aspect-square rounded-xl border bg-background p-8">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      ASL-JKKNIU
                    </div>

                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      Advanced
                      <br />
                      System Lab
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 h-px w-full bg-border" />

                    <p className="text-sm leading-6 text-muted-foreground">
                      Research • Innovation • Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl divide-y px-4 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-6 lg:grid-cols-4 lg:px-8">
          {statistics.map((item) => (
            <div key={item.label} className="px-6 py-8 first:pl-0 last:pr-0">
              <p className="text-3xl font-semibold tracking-tight">
                {item.value}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Research
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where engineering meets intelligent systems.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Our research brings together electrical and electronic
              engineering, robotics, artificial intelligence,
              computer vision, navigation, and industrial automation.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <div key={area.title} className="bg-background p-6">
                <h3 className="font-semibold">{area.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>

                <Link
                  href="/research"
                  className="mt-5 inline-flex text-sm font-medium hover:underline"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Projects
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From research ideas to real-world systems.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Explore the projects and engineering work being developed
              by researchers and members of ASL-JKKNIU.
            </p>

            <Link
              href="/projects"
              className="mt-6 inline-flex text-sm font-medium hover:underline"
            >
              View all projects →
            </Link>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Featured Project
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Intelligent Navigation & Perception
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Developing robust perception and navigation systems by
                combining cameras, inertial sensors, GNSS, and machine
                learning.
              </p>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Research
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Human Activity Recognition
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Research on visual-inertial sensing and machine learning
                approaches for recognizing human activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Publications
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Knowledge that contributes beyond the lab.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Browse our research publications, conference papers,
                datasets, and other scientific outputs.
              </p>
            </div>

            <Link
              href="/publications"
              className="text-sm font-medium hover:underline"
            >
              View publications →
            </Link>
          </div>
        </div>
      </section>

      {/* Join */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="rounded-2xl border bg-muted/20 px-6 py-12 text-center sm:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Join ASL-JKKNIU
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Build, experiment, and research with us.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              We welcome motivated students, researchers, and collaborators
              interested in advancing intelligent systems and engineering
              research.
            </p>

            <Link
              href="/join-us"
              className="mt-7 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Learn how to join
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}