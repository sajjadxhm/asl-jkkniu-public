export type SiteNavigationItem = {
  label: string;
  href: string;
};

export const siteNavigation: SiteNavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Research",
    href: "/research",
  },
  {
    label: "People",
    href: "/people",
  },
  {
    label: "Publications",
    href: "/publications",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "News",
    href: "/news",
  },
];

export const researcherPortalNavigation = {
  label: "Researcher Portal",
  href: "/login",
} as const;

export const publicPrimaryAction = {
  label: "Join Us",
  href: "/join-us",
} as const;