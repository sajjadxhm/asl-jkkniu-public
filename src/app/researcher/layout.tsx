export const metadata = { robots: { index: false, follow: false } };

import type { ReactNode } from "react";

import { requireResearcherAccount } from "@/lib/permissions/auth";
import { getResearcherByUserId } from "@/features/researcher/queries";

import { ResearcherPortalShell } from "@/components/layout/researcher-portal-shell";

export default async function ResearcherLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireResearcherAccount();

  const researcher = await getResearcherByUserId(user.id);

  const person = researcher?.person;

  return (
    <ResearcherPortalShell
      researcherName={person?.name ?? user.name ?? "Researcher"}
      profileSlug={person?.slug ?? null}
      profileImage={person?.profileImage ?? null}
    >
      {children}
    </ResearcherPortalShell>
  );
}