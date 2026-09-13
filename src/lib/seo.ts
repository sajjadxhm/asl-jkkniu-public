import type { Metadata } from "next";

export const SITE_URL = "https://www.asljkkniu.org";
export const SITE_TITLE = "Advanced System Lab (ASL-JKKNIU) | Research Laboratory at JKKNIU";
export const SITE_DESCRIPTION = "Advanced System Lab at Jatiya Kabi Kazi Nazrul Islam University researches robotics, artificial intelligence, computer vision, navigation, and embedded systems.";
export const PUBLIC_PATHS = ["/", "/about", "/research", "/projects", "/people", "/publications", "/join-us", "/contact", "/privacy"];

export function publicMetadata(path: string, metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : SITE_TITLE;
  const description = metadata.description ?? SITE_DESCRIPTION;
  const url = new URL(path, SITE_URL).href;
  return {
    ...metadata,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "ASL-JKKNIU", type: "website", ...metadata.openGraph },
    twitter: { card: "summary", title, description, ...metadata.twitter },
  };
}
