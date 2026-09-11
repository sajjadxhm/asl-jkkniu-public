"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { BookOpen, ChevronRight, FolderKanban, LayoutDashboard, LogOut, Menu, UsersRound, X } from "lucide-react";
import { AslLogo } from "./asl-logo";
import type { UserRole } from "@/lib/permissions/auth";

type AdminPortalShellProps = {
  children: React.ReactNode;
  userName: string;
  userRole: UserRole;
};

export function AdminPortalShell({ children, userName, userRole }: AdminPortalShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const initials = userName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const navigationItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ...(userRole === "SUPER_ADMIN"
      ? [{ label: "Researcher Accounts", href: "/admin/researchers", icon: UsersRound }]
      : [{ label: "People", href: "/admin/people", icon: UsersRound }]),
    { label: "Publications", href: "/admin/publications", icon: BookOpen },
    ...(userRole === "SUPER_ADMIN" ? [{ label: "ASL Projects", href: "/admin/projects", icon: FolderKanban }] : []),
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const dialog = dialogRef.current;
    const menuButton = menuButtonRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog?.close();
      menuButton?.focus();
    };
  }, [mobileMenuOpen]);

  function navigation(mobile = false) {
    return (
      <nav aria-label={mobile ? "Mobile admin navigation" : "Admin navigation"} className="flex-1 p-4">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administration</p>
        <div className="space-y-1">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="size-4" />}
              </Link>
            );
          })}
        </div>
        <div className="my-5 border-t" />
        <button type="button" onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <LogOut className="size-4 shrink-0" />Sign Out
        </button>
      </nav>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button ref={menuButtonRef} type="button" aria-label="Open admin navigation" aria-expanded={mobileMenuOpen}
              aria-controls="admin-mobile-navigation" onClick={() => setMobileMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted lg:hidden">
              <Menu className="size-5" />
            </button>
            <Link href="/admin" aria-label="ASL-JKKNIU Admin Portal"><AslLogo className="h-auto w-32 sm:w-36 lg:w-40" /></Link>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="text-sm font-medium">Admin Portal</p>
              <p className="max-w-48 truncate text-xs text-muted-foreground">{userName}</p>
            </div>
            <div title={userName} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials || "A"}</div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
          <div className="sticky top-[72px] flex h-[calc(100vh-72px)] flex-col overflow-y-auto">
            {navigation()}
            <div className="border-t p-4 text-xs leading-5 text-muted-foreground">Advanced System Lab<br />Jatiya Kabi Kazi Nazrul Islam University</div>
          </div>
        </aside>
        <dialog ref={dialogRef} id="admin-mobile-navigation" aria-label="Admin navigation" onCancel={() => setMobileMenuOpen(false)}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-foreground backdrop:bg-black/20 lg:hidden"
          onClick={(event) => { if (event.target === event.currentTarget) setMobileMenuOpen(false); }}>
          <div className="flex h-full w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r bg-background shadow-xl">
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold">Admin Portal</span>
              <button type="button" aria-label="Close admin navigation" onClick={() => setMobileMenuOpen(false)} className="inline-flex size-10 items-center justify-center rounded-md border hover:bg-muted"><X className="size-5" /></button>
            </div>
            {navigation(true)}
          </div>
        </dialog>
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
        </main>
      </div>
      <footer className="border-t bg-background px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ASL-JKKNIU. All rights reserved.</p><p>Admin Portal</p>
        </div>
      </footer>
    </div>
  );
}