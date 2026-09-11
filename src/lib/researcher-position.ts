export const RESEARCHER_POSITION_LABELS = {
  RESEARCHER: "Research Assistant",
  LEAD_RESEARCHER: "Lead Researcher",
  ASSOCIATE_RESEARCH_LEAD: "Associate Research Lead",
  PRINCIPAL_INVESTIGATOR: "Principal Investigator",
} as const;

export type ResearcherPosition =
  keyof typeof RESEARCHER_POSITION_LABELS;

export function getResearcherPositionLabel(
  position: string | null | undefined,
) {
  if (!position) {
    return null;
  }

  return (
    RESEARCHER_POSITION_LABELS[
      position as ResearcherPosition
    ] ?? position
  );
}