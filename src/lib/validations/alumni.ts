import { z } from "zod";
import { httpUrl } from "./url";

export const alumniSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be 150 characters or fewer."),

  linkedinUrl: httpUrl
    .optional()
    .or(z.literal("")),

  profileImage: httpUrl
    .optional()
    .or(z.literal("")),

  isActive: z.boolean(),
});

export type AlumniInput = z.infer<typeof alumniSchema>;
