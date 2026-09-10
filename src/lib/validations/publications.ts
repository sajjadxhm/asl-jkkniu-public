import { z } from "zod";

export const publicationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(500, "Title must be 500 characters or fewer."),

  abstract: z
    .string()
    .trim()
    .max(10000, "Abstract must be 10000 characters or fewer.")
    .optional()
    .or(z.literal("")),

  publicationType: z.enum([
    "JOURNAL",
    "CONFERENCE",
    "BOOK",
    "BOOK_CHAPTER",
    "THESIS",
    "PREPRINT",
    "OTHER",
  ]),

  journal: z
    .string()
    .trim()
    .max(300, "Journal name is too long.")
    .optional()
    .or(z.literal("")),

  conference: z
    .string()
    .trim()
    .max(300, "Conference name is too long.")
    .optional()
    .or(z.literal("")),

  publisher: z
    .string()
    .trim()
    .max(300, "Publisher name is too long.")
    .optional()
    .or(z.literal("")),

  publicationDate: z
    .string()
    .optional()
    .or(z.literal("")),

  doi: z
    .string()
    .trim()
    .max(300, "DOI is too long.")
    .optional()
    .or(z.literal("")),

  url: z
    .string()
    .trim()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),

  pdfUrl: z
    .string()
    .trim()
    .url("Please enter a valid PDF URL.")
    .optional()
    .or(z.literal("")),

  citationCount: z
    .number()
    .int()
    .min(0, "Citation count cannot be negative."),

  isFeatured: z.boolean(),

  authors: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("PERSON"),
          personId: z.string().min(1),
        }),

        z.object({
          type: z.literal("EXTERNAL"),
          name: z
            .string()
            .trim()
            .min(1, "External author name is required.")
            .max(
              200,
              "External author name must be 200 characters or fewer.",
            ),
        }),
      ]),
    )
    .min(1, "At least one author is required."),

  researchAreaIds: z.array(z.string()),
});

export type PublicationInput = z.infer<
  typeof publicationSchema
>;