import { z } from "zod";

export const alumniSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be 150 characters or fewer."),

  linkedinUrl: z
    .string()
    .trim()
    .url("Please enter a valid LinkedIn URL.")
    .optional()
    .or(z.literal("")),

  profileImage: z
    .string()
    .trim()
    .url("Please enter a valid image URL.")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export type AlumniInput = z.infer<typeof alumniSchema>;