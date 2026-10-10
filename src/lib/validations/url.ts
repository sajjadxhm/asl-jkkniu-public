import { z } from "zod";

export function safeHttpUrl(value: string | null | undefined) {
  if (!value) return undefined;
  try { return ["http:", "https:"].includes(new URL(value).protocol) ? value : undefined; } catch { return undefined; }
}

export const httpUrl = z.string().trim().max(2000).url("Please enter a valid URL.").refine(
  (value) => { try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; } },
  "Only http:// and https:// URLs are allowed.",
);
