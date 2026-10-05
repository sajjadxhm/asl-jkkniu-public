import type { MetadataRoute } from "next";
import { getPublicResearcherProfileUrls } from "@/features/people/queries";
import { getPublicProjects } from "@/features/projects/queries";
import { SITE_URL, PUBLIC_PATHS } from "@/lib/seo";

// Always reflect current visibility and deletions; don't cache private profile URLs.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [people, projects] = await Promise.all([getPublicResearcherProfileUrls(), getPublicProjects()]);
  return [
    ...PUBLIC_PATHS.map(path => ({ url: new URL(path, SITE_URL).href })),
    ...people.map(person => ({
      url: SITE_URL + "/people/" + encodeURIComponent(person.slug),
    })),
    ...projects.map(project => ({ url: SITE_URL + "/projects/" + encodeURIComponent(project.slug) })),
  ];
}
