import { z } from "zod";

export const projectStatuses = ["PLANNED", "ONGOING", "COMPLETED", "ON_HOLD", "ARCHIVED"] as const;
export const statusLabels: Record<(typeof projectStatuses)[number], string> = {
  PLANNED: "Planned", ONGOING: "Ongoing", COMPLETED: "Completed", ON_HOLD: "On hold", ARCHIVED: "Archived",
};
export function projectSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const date = z.string().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00.000Z");
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Enter a valid date.");
const ids = z.array(z.string().trim().min(1)).max(500).refine(
  (values) => new Set(values).size === values.length, "Select each record only once.",
);
export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(250),
  slug: z.string().trim().min(1, "Slug is required.").max(250).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens."),
  description: z.string().trim().max(20000),
  status: z.enum(projectStatuses),
  startDate: date,
  endDate: date,
  principalInvestigatorId: z.string().trim().min(1, "Choose a principal investigator."),
  memberIds: ids,
  researchAreaIds: ids,
  fundingSource: z.string().trim().max(500),
  projectUrl: z.string().trim().max(2000).refine((value) => {
    if (!value) return true;
    try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
  }, "Enter a valid http:// or https:// URL."),
  isFeatured: z.boolean(),
}).refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
  path: ["endDate"], message: "End date must be on or after start date.",
});
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectResult = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof ProjectInput, string[]>>;
};
export type ProjectPortal = "admin" | "researcher";
