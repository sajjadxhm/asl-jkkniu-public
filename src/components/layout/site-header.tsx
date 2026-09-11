"use client";

import Link from "next/link";
import {
  ArrowRight,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AslLogo } from "./asl-logo";
import {
  publicPrimaryAction,
  researcherPortalNavigation,
  siteNavigation,
} from "./site-navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const researcherPortalActive = isActive(
    researcherPortalNavigation.href,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#002B56]/10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center"
          onClick={closeMobileMenu}
          aria-label="ASL-JKKNIU home"
        >
          <AslLogo className="h-auto w-36 transition-opacity group-hover:opacity-90 sm:w-40 lg:w-[170px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {siteNavigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-[#002B56]"
                    : "text-muted-foreground hover:text-[#002B56]"
                }`}
              >
                <span className="relative z-10">
                  {item.label}
                </span>

                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-md transition-colors ${
                    active
                      ? "bg-[#E1FFE1]/50"
                      : "bg-transparent group-hover:bg-[#E1FFE1]/30"
                  }`}
                />

                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 -bottom-[15px] h-0.5 rounded-full bg-[#0067FF]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={researcherPortalNavigation.href}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              researcherPortalActive
                ? "bg-[#E1FFE1]/55 text-[#002B56]"
                : "text-muted-foreground hover:bg-muted hover:text-[#002B56]"
            }`}
          >
            <UserRound className="size-4" />

            {researcherPortalNavigation.label}
          </Link>

          <Link
            href={publicPrimaryAction.href}
            className="group inline-flex items-center justify-center rounded-md bg-[#0067FF] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0058dc]"
          >
            {publicPrimaryAction.label}

            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          onClick={() =>
            setMobileMenuOpen((open) => !open)
          }
          className="inline-flex size-10 items-center justify-center rounded-md border border-[#002B56]/15 text-[#002B56] transition-colors hover:bg-[#E1FFE1]/40 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#002B56]/10 bg-background lg:hidden">
          <nav
            className="mx-auto max-w-7xl px-4 py-5 sm:px-6"
            aria-label="Mobile navigation"
          >
            {/* Mobile brand marker */}
            <div className="mb-5 flex items-center gap-2">
              <div className="h-1.5 w-8 rounded-full bg-[#0067FF]" />

              <div className="h-1.5 w-4 rounded-full bg-[#E1FFE1] ring-1 ring-[#0067FF]/15" />

              <p className="ml-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0067FF]">
                Navigate ASL
              </p>
            </div>

            <div className="grid gap-1">
              {siteNavigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#E1FFE1]/55 text-[#002B56]"
                        : "text-muted-foreground hover:bg-muted hover:text-[#002B56]"
                    }`}
                  >
                    {item.label}

                    {active && (
                      <span className="size-1.5 rounded-full bg-[#0067FF]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile actions */}
            <div className="mt-5 border-t border-[#002B56]/10 pt-5">
              <Link
                href={researcherPortalNavigation.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  researcherPortalActive
                    ? "bg-[#E1FFE1]/55 text-[#002B56]"
                    : "text-muted-foreground hover:bg-muted hover:text-[#002B56]"
                }`}
              >
                <UserRound className="size-4" />

                {researcherPortalNavigation.label}
              </Link>

              <Link
                href={publicPrimaryAction.href}
                onClick={closeMobileMenu}
                className="group mt-2 flex items-center justify-between rounded-lg bg-[#0067FF] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0058dc]"
              >
                {publicPrimaryAction.label}

                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}