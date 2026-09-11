import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  ExternalLink,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy information for the Advanced System Lab (ASL-JKKNIU) website.",
};

const privacySections = [
  {
    number: "01",
    title: "Information we collect",
    content: [
      "Most public areas of the ASL-JKKNIU website can be viewed without creating an account or providing personal information.",
      "Information may be stored when authorized researchers or administrators use the Researcher Portal, manage their profiles, or submit content through the laboratory's internal website system.",
      "Information displayed publicly may include researcher names, academic or professional designations, departments, profile photographs, research interests, publication information, project information, and contact or professional links provided for publication.",
    ],
  },
  {
    number: "02",
    title: "How information is used",
    content: [
      "Information stored through the website is used to operate and maintain the ASL-JKKNIU research platform, publish laboratory information, manage researcher profiles, and present research outputs such as projects and publications.",
      "Account information for authorized users is used to provide access to protected website management features.",
      "ASL-JKKNIU does not intend to use personal information collected through this website for unrelated commercial marketing purposes.",
    ],
  },
  {
    number: "03",
    title: "Researcher accounts",
    content: [
      "Researcher Portal accounts are intended only for authorized members of Advanced System Lab.",
      "Users are responsible for keeping their login credentials confidential and should not share passwords with unauthorized persons.",
      "Account access may be changed, suspended, or removed when a person's role or authorization within the laboratory changes.",
    ],
  },
  {
    number: "04",
    title: "Public researcher profiles",
    content: [
      "Some information about laboratory members may be intentionally published through the People directory and individual researcher profiles.",
      "Only information intended for public presentation should be included in publicly visible profiles.",
      "Researchers who identify incorrect or outdated public information should contact the laboratory or website administrator so that it can be reviewed.",
    ],
  },
  {
    number: "05",
    title: "Projects, publications & research content",
    content: [
      "The website may publish information about ASL-JKKNIU projects, publications, datasets, research areas, and related academic activities.",
      "Research content may include links to external publishers, repositories, datasets, source-code platforms, or other third-party services.",
      "Content hosted by external services is governed by the privacy policies and terms of those respective services.",
    ],
  },
  {
    number: "06",
    title: "Data security",
    content: [
      "Reasonable technical and organizational measures are used to protect administrative accounts and website data from unauthorized access.",
      "No internet-based system can guarantee absolute security. Authorized users should therefore use strong passwords and follow appropriate account-security practices.",
    ],
  },
  {
    number: "07",
    title: "Third-party links",
    content: [
      "The ASL-JKKNIU website may contain links to external websites such as academic publishers, GitHub, research repositories, social profiles, or dataset platforms.",
      "ASL-JKKNIU is not responsible for the privacy practices, content, or security of third-party websites.",
    ],
  },
  {
    number: "08",
    title: "Updates to this notice",
    content: [
      "This privacy notice may be updated as the ASL-JKKNIU website, research platform, or available services evolve.",
      "Material changes should be reflected on this page so visitors can understand how website information is handled.",
    ],
  },
];

const summaryItems = [
  {
    icon: UserRound,
    title: "Public browsing",
    description:
      "Most public research content can be viewed without creating an account.",
  },
  {
    icon: LockKeyhole,
    title: "Protected accounts",
    description:
      "Researcher Portal access is restricted to authorized laboratory members.",
  },
  {
    icon: Database,
    title: "Research information",
    description:
      "The platform stores information needed to present people, projects, and publications.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible handling",
    description:
      "Website information is used for operating and presenting the ASL research platform.",
  },
];

export default function PrivacyPage() {
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

          <div className="absolute -left-16 top-40 size-40 rounded-full border border-[#0067FF]/10" />

          <div className="absolute -right-36 -top-40 size-[30rem] rounded-full bg-[#E1FFE1]/45" />

          <div className="absolute right-10 top-14 size-60 rounded-full border border-[#002B56]/5" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Privacy
              </p>
            </div>

            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Clear information about
              <span className="block text-[#0067FF]">
                how this website handles data.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#002B56]/60 sm:text-xl">
              This notice explains how information may be collected,
              displayed, and used through the Advanced System Lab
              website and Researcher Portal.
            </p>
          </div>

          <div className="rounded-2xl border border-[#002B56]/10 bg-[#E1FFE1]/30 p-7 sm:p-8">
            <ShieldCheck className="size-6 text-[#0067FF]" />

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#0067FF]">
              Our approach
            </p>

            <p className="mt-4 text-2xl font-medium leading-snug tracking-[-0.02em]">
              Collect what is needed. Publish what is intended.
              Protect what should remain private.
            </p>

            <div className="mt-7 border-t border-[#002B56]/10 pt-5">
              <p className="text-sm leading-6 text-[#002B56]/60">
                ASL-JKKNIU is an academic research laboratory, and
                this website primarily exists to communicate its
                research, people, projects, and publications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRIVACY SUMMARY
      ====================================================== */}
      <section className="border-b border-[#002B56]/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[#002B56]/10 bg-[#002B56]/10 sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="bg-white p-6 sm:p-7"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#E1FFE1]/60">
                    <Icon className="size-4 text-[#0067FF]" />
                  </div>

                  <h2 className="mt-6 font-semibold tracking-tight">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#002B56]/60">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN PRIVACY CONTENT
      ====================================================== */}
      <section className="border-b border-[#002B56]/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:px-8 lg:py-28">
          {/* Sticky introduction */}
          <div>
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Privacy notice
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                How information is handled.
              </h2>

              <p className="mt-5 text-base leading-7 text-[#002B56]/60">
                The sections on this page describe the general
                privacy practices of the ASL-JKKNIU website.
              </p>

              <div className="mt-8 rounded-xl border border-[#002B56]/10 bg-[#F7F9FB] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0067FF]">
                  Questions?
                </p>

                <p className="mt-3 text-sm leading-6 text-[#002B56]/60">
                  If you have a privacy-related question or notice
                  incorrect personal information on the website,
                  contact the laboratory.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center text-sm font-medium text-[#0067FF] hover:underline"
                >
                  Contact ASL
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="divide-y divide-[#002B56]/10 border-y border-[#002B56]/10">
            {privacySections.map((section) => (
              <section
                key={section.number}
                className="grid gap-5 py-8 sm:grid-cols-[64px_1fr] sm:py-10"
              >
                <p className="text-xs font-semibold text-[#0067FF]">
                  {section.number}
                </p>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.content.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-7 text-[#002B56]/65 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXTERNAL SERVICES
      ====================================================== */}
      <section className="border-b border-[#002B56]/10 bg-[#F7F9FB]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
              External platforms
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Some research resources live beyond this website.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#002B56]/60">
              Publications, code repositories, datasets, professional
              profiles, and other research resources may link to
              external platforms.
            </p>
          </div>

          <div className="rounded-2xl border border-[#002B56]/10 bg-white p-7 sm:p-8">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#E1FFE1]/60">
              <ExternalLink className="size-4 text-[#0067FF]" />
            </div>

            <h3 className="mt-6 text-xl font-semibold tracking-tight">
              Third-party privacy policies apply
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#002B56]/60">
              When you follow a link from ASL-JKKNIU to another
              website or service, information you provide there is
              subject to that provider&apos;s own terms, security,
              and privacy practices.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#002B56]/60">
              Visitors should review the relevant privacy information
              of external services when appropriate.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
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
                  Privacy questions
                </p>

                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Something unclear or needs correcting?
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/60">
                  Contact the laboratory if you have questions about
                  information displayed on this website or believe
                  personal information needs to be updated.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-[#0067FF] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1475ff]"
              >
                <Mail className="mr-2 size-4" />
                Contact ASL
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}