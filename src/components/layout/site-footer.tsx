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
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Publications",
      href: "/publications",
    },
    {
      label: "Datasets",
      href: "/research/datasets",
    },
  ],

  Explore: [
    {
      label: "People",
      href: "/people",
    },
    {
      label: "News",
      href: "/news",
    },
    {
      label: "About",
      href: "/about",
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
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex"
              aria-label="ASL-JKKNIU home"
            >
              <AslLogo className="h-auto w-40" />
            </Link>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Advanced System Lab (ASL-JKKNIU) is a research
              laboratory focused on intelligent systems,
              robotics, computer vision, artificial intelligence,
              navigation, and emerging technologies.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              Jatiya Kabi Kazi Nazrul Islam University
            </p>
          </div>

          {/* Footer Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold">{group}</h3>

              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ASL-JKKNIU. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}