"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { signOut } from "next-auth/react";

import { AslLogo } from "./asl-logo";

type ResearcherPortalShellProps = {
  children: React.ReactNode;
  researcherName: string;
  profileSlug?: string | null;
  profileImage?: string | null;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/researcher/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    href: "/researcher/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "Publications",
    href: "/researcher/publications",
    icon: BookOpen,
  },
  {
    label: "ASL Projects",
    href: "/researcher/projects",
    icon: FolderKanban,
  },
  {
    label: "Alumni & Co-researchers",
    href: "/researcher/people",
    icon: UsersRound,
  },
];

export function ResearcherPortalShell({
  children,
  researcherName,
  profileSlug,
  profileImage,
}: ResearcherPortalShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = researcherName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  function isActive(href: string) {
    if (href === "/researcher/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  const publicProfileHref = profileSlug
    ? `/people/${profileSlug}`
    : "/people";

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
{/* Portal Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close portal navigation"
                  : "Open portal navigation"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() =>
                setMobileMenuOpen((open) => !open)
              }
              className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>

            <Link
              href="/researcher/dashboard"
              className="flex items-center"
              aria-label="ASL-JKKNIU Researcher Portal"
              onClick={closeMobileMenu}
            >
              <AslLogo className="h-auto w-32 sm:w-36 lg:w-40" />
            </Link>
          </div>


          {/* Keep the avatar inside the same header row at every breakpoint. */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="text-sm font-medium">Researcher Portal</p>
              <p className="max-w-48 truncate text-xs text-muted-foreground" title={researcherName}>
                {researcherName}
              </p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={`${researcherName}'s profile`}
                  width={40}
                  height={40}
                  className="aspect-square size-10 object-cover"
                />
              ) : (
                initials || "R"
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
          <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col overflow-y-auto">
            <nav
              className="flex-1 p-4"
              aria-label="Researcher portal navigation"
            >
              <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Researcher Portal
              </p>

              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {active && (
                        <ChevronRight className="size-4" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="my-5 border-t" />

              <div className="space-y-1">
                <Link
                  href={publicProfileHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="size-4 shrink-0" />

                  <span className="flex-1">
                    View Public Profile
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-4 shrink-0" />

                  <span>Sign Out</span>
                </button>
              </div>
            </nav>

            <div className="border-t p-4">
              <p className="text-xs leading-5 text-muted-foreground">
                Advanced System Lab
                <br />
                Jatiya Kabi Kazi Nazrul Islam University
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[72px] z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-black/20"
              onClick={closeMobileMenu}
            />

            <aside className="relative h-full w-[280px] max-w-[85vw] overflow-y-auto border-r bg-background shadow-xl">
              <nav
                className="p-4"
                aria-label="Mobile researcher portal navigation"
              >
                <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Researcher Portal
                </p>

                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-4" />

                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="my-5 border-t" />

                <div className="space-y-1">
                  <Link
                    href={publicProfileHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="size-4" />

                    View Public Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="size-4" />

                    Sign Out
                  </button>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      {/* Portal Footer */}
      <footer className="border-t bg-background">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ASL-JKKNIU. All rights
            reserved.
          </p>
            <p>Researcher Portal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}