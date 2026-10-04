import { RESEARCHER_POSITIONS } from "@/lib/researcher-position";
import { z } from "zod";

export const personSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be 150 characters or fewer."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .toLowerCase()
    .optional()
    .or(z.literal("")),

  designation: z
    .string()
    .trim()
    .max(150, "Designation must be 150 characters or fewer.")
    .optional()
    .or(z.literal("")),

  department: z
    .string()
    .trim()
    .max(150, "Department must be 150 characters or fewer.")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .trim()
    .max(2000, "Bio must be 2000 characters or fewer.")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
  isPublic: z.boolean().optional(),
  position: z.enum(RESEARCHER_POSITIONS).optional(),
});

export type PersonInput = z.infer<typeof personSchema>;