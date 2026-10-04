import type { ResearcherPosition as PrismaResearcherPosition } from "@/generated/prisma/enums";

export const RESEARCHER_POSITIONS = [
  "PRINCIPAL_INVESTIGATOR",
  "ASSOCIATE_RESEARCH_LEAD",
  "LEAD_RESEARCHER",
  "SENIOR_RESEARCHER",
  "RESEARCHER",
  "RESEARCH_INTERN",
] as const satisfies readonly PrismaResearcherPosition[];

export type ResearcherPosition = typeof RESEARCHER_POSITIONS[number];

export const RESEARCHER_POSITION_LABELS = {
  PRINCIPAL_INVESTIGATOR: "Principal Investigator",
  ASSOCIATE_RESEARCH_LEAD: "Associate Research Lead",
  LEAD_RESEARCHER: "Lead Researcher",
  SENIOR_RESEARCHER: "Senior Researcher",
  RESEARCHER: "Research Assistant",
  RESEARCH_INTERN: "Research Intern",
} as const satisfies Record<PrismaResearcherPosition, string>;

const groupIds: Record<ResearcherPosition, string> = {
  PRINCIPAL_INVESTIGATOR: "principal-investigators",
  ASSOCIATE_RESEARCH_LEAD: "associate-leads",
  LEAD_RESEARCHER: "lead-researchers",
  SENIOR_RESEARCHER: "senior-researchers",
  RESEARCHER: "research-assistants",
  RESEARCH_INTERN: "research-interns",
};

export const RESEARCHER_POSITION_OPTIONS = RESEARCHER_POSITIONS.map((value) => ({
  value,
  label: RESEARCHER_POSITION_LABELS[value],
}));

export const RESEARCHER_POSITION_GROUPS = RESEARCHER_POSITION_OPTIONS.map(({ value, label }) => ({
  id: groupIds[value],
  title: label,
  position: value,
}));

export function getResearcherPositionLabel(position: string | null | undefined) {
  if (!position) return null;
  return RESEARCHER_POSITION_LABELS[position as ResearcherPosition] ?? position;
}
