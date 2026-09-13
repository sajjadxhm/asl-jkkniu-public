import type { MetadataRoute } from "next";
import { getPeople } from "@/features/people/queries";
import { getPublicProjects } from "@/features/projects/queries";
import { SITE_URL, PUBLIC_PATHS } from "@/lib/seo";

// Always reflect current visibility and deletions; don't cache private profile URLs.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [people, projects] = await Promise.all([getPeople(), getPublicProjects()]);
  return [
    ...PUBLIC_PATHS.map(path => ({ url: new URL(path, SITE_URL).href })),
    ...people.filter(person => person.isActive && person.researcherProfile?.isPublic).map(person => ({
      url: SITE_URL + "/people/" + encodeURIComponent(person.slug),
    })),
    ...projects.map(project => ({ url: SITE_URL + "/projects/" + encodeURIComponent(project.slug) })),
  ];
}
