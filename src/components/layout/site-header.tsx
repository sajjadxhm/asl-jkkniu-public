"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={closeMobileMenu}
          aria-label="ASL-JKKNIU home"
        >
          <AslLogo className="h-auto w-36 sm:w-40 lg:w-[170px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {siteNavigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={researcherPortalNavigation.href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              researcherPortalActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {researcherPortalNavigation.label}
          </Link>

          <Link
            href={publicPrimaryAction.href}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {publicPrimaryAction.label}
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
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
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
        <div className="border-t bg-background lg:hidden">
          <nav
            className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {/* Main navigation */}
              {siteNavigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Researcher Portal */}
              <div className="mt-3 border-t pt-3">
                <Link
                  href={researcherPortalNavigation.href}
                  onClick={closeMobileMenu}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    researcherPortalActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {researcherPortalNavigation.label}
                </Link>
              </div>

              {/* Join Us */}
              <Link
                href={publicPrimaryAction.href}
                onClick={closeMobileMenu}
                className="mt-1 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {publicPrimaryAction.label}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}