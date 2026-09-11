import {
  ArrowUpRight,
  FlaskConical,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { AslLogo } from "./asl-logo";
import { researcherPortalNavigation } from "./site-navigation";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkGroups = {
  Research: FooterLink[];
  Explore: FooterLink[];
  Connect: FooterLink[];
};

const footerLinks: FooterLinkGroups = {
  Research: [
    {
      label: "Research Areas",
      href: "/research",
    },
    {
      label: "ASL Projects",
      href: "/projects",
    },
    {
      label: "Publications",
      href: "/publications",
    },
    {
      label: "Datasets",
      href: "https://www.kaggle.com/",
      external: true,
    },
  ],

  Explore: [
    {
      label: "About ASL",
      href: "/about",
    },
    {
      label: "People",
      href: "/people",
    },
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Join Us",
      href: "/join-us",
    },
  ],

  Connect: [
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: researcherPortalNavigation.label,
      href: researcherPortalNavigation.href,
    },
    {
      label: "GitHub",
      href: "https://github.com/sajjadxhm/asl-jkkniu",
      external: true,
    },
  ],
};

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#002B56] text-white">
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-44 -top-52 size-[34rem] rounded-full bg-[#0067FF]/10" />

        <div className="absolute -right-16 -top-20 size-72 rounded-full border border-[#E1FFE1]/10" />

        <div className="absolute right-16 top-16 size-40 rounded-full border border-white/5" />

        <div className="absolute -bottom-32 -left-28 size-80 rounded-full bg-[#E1FFE1]/[0.04]" />

        <div className="absolute left-[42%] top-0 hidden h-full w-px bg-white/[0.04] lg:block" />
      </div>

      {/* Top identity strip */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-10 rounded-full bg-[#0067FF]" />

            <div className="h-1.5 w-5 rounded-full bg-[#E1FFE1]" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E1FFE1]">
              Advanced System Lab
            </p>
          </div>

          <p className="max-w-xl text-sm leading-6 text-white/45 lg:text-right">
            Research · Innovation · Engineering · Intelligent Systems
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex rounded-xl bg-white p-3 transition-opacity hover:opacity-90"
              aria-label="ASL-JKKNIU home"
            >
              <AslLogo className="h-auto w-40 sm:w-44" />
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-white/55">
              Advanced System Lab (ASL-JKKNIU) is an academic
              research laboratory exploring intelligent systems,
              robotics, artificial intelligence, computer vision,
              navigation, embedded technologies, and automation.
            </p>

            <div className="mt-6 flex items-start gap-3 text-sm text-white/50">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#E1FFE1]" />

              <p className="leading-6">
                Jatiya Kabi Kazi Nazrul Islam University
                <br />
                Trishal, Mymensingh, Bangladesh
              </p>
            </div>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
              <FlaskConical className="size-3.5 text-[#E1FFE1]" />

              Research · Innovation · Engineering
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#0067FF]" />

                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]">
                  {group}
                </h3>
              </div>

              <ul className="mt-6 space-y-3.5">
                {links.map((link) => (
                  <li key={`${group}-${link.href}`}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}

                      {link.external && (
                        <ArrowUpRight className="size-3.5 text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#E1FFE1]" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick navigation */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/research"
            className="group bg-[#002B56] p-5 transition-colors hover:bg-[#063765]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]/65">
              Discover
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Research
              </p>

              <span className="text-[#0067FF] transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/projects"
            className="group bg-[#002B56] p-5 transition-colors hover:bg-[#063765]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]/65">
              Explore
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Projects
              </p>

              <span className="text-[#0067FF] transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/publications"
            className="group bg-[#002B56] p-5 transition-colors hover:bg-[#063765]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]/65">
              Read
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                Publications
              </p>

              <span className="text-[#0067FF] transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          <a
            href="https://github.com/sajjadxhm/asl-jkkniu"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#002B56] p-5 transition-colors hover:bg-[#063765]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E1FFE1]/65">
              Open source
            </p>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                GitHub
              </p>

              <ArrowUpRight className="size-4 text-[#0067FF] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-[#001F3D]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-white/55">
              © {new Date().getFullYear()} ASL-JKKNIU.
              All rights reserved.
            </p>

            <p className="mt-1 text-xs text-white/30">
              Advanced System Lab · Jatiya Kabi Kazi Nazrul Islam University
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/40">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>

            <Link
              href={researcherPortalNavigation.href}
              className="transition-colors hover:text-[#E1FFE1]"
            >
              Researcher Portal
            </Link>
          </div>
        </div>

        <div className="grid h-1 grid-cols-[2fr_1fr]">
          <div className="bg-[#0067FF]" />
          <div className="bg-[#E1FFE1]" />
        </div>
      </div>
    </footer>
  );
}