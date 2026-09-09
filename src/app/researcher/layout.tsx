import { ReactNode } from "react";
import { requireResearcher } from "@/lib/permissions/auth";

export default async function ResearcherLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireResearcher();

  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  );
}