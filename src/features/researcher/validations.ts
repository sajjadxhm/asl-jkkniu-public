import { RESEARCHER_POSITIONS } from "@/lib/researcher-position";
import { z } from "zod";

const flexibleUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => {
      if (!value) return true;

      const normalized = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;

      try {
        const url = new URL(normalized);
        return Boolean(url.hostname && url.hostname.includes("."));
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid website or profile link.",
    },
  )
  .optional()
  .or(z.literal(""));

export const researcherProfileSchema = z.object({
  designation: z.string().trim().max(150).optional(),
  department: z.string().trim().max(200).optional(),

  position: z.enum(RESEARCHER_POSITIONS),

  academicSession: z.string().trim().max(100).optional(),
  university: z.string().trim().max(200).optional(),

  bio: z.string().trim().max(3000).optional(),
  // researchStatement: z.string().trim().max(5000).optional(),
  education: z.string().trim().max(5000).optional(),
  experience: z.string().trim().max(5000).optional(),
  skills: z.string().trim().max(3000).optional(),
  researchInterests: z.string().trim().max(3000).optional(),
  projects: z
  .string()
  .max(10000, "Projects must be 10,000 characters or fewer.")
  .optional(),

awards: z
  .string()
  .max(10000, "Awards must be 10,000 characters or fewer.")
  .optional(),
  phone: z.string().trim().max(30).optional(),

  website: flexibleUrl,
  googleScholarUrl: flexibleUrl,
  orcidUrl: flexibleUrl,
  linkedinUrl: flexibleUrl,
  githubUrl: flexibleUrl,

  isPublic: z.boolean(),
});

export type ResearcherProfileInput =
  z.infer<typeof researcherProfileSchema>;

/* -------------------------------------------------- */
/* Create Researcher                                  */
/* -------------------------------------------------- */

export const createResearcherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100)
    .refine((value) => new TextEncoder().encode(value).length <= 72, "Password must be 72 UTF-8 bytes or fewer."),

  designation: z.string().trim().max(150).optional(),

  department: z.string().trim().max(200).optional(),

  position: z.enum(RESEARCHER_POSITIONS),

  academicSession: z.string().trim().max(100).optional(),

  university: z.string().trim().max(200).optional(),
});

export type CreateResearcherInput =
  z.infer<typeof createResearcherSchema>;
