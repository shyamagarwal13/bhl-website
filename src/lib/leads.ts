import { z } from "zod";

/*
 * One validation schema, imported by the form and by the route handler.
 *
 * The client copy exists to give fast feedback; the server copy is the one that decides.
 * Sharing the definition is what keeps those two from drifting into a form that accepts
 * what the API rejects.
 */

/** Trim, then treat an empty string as absent, so blank optional inputs store NULL. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

/*
 * Deliberately not a strict RFC 5322 pattern: those reject addresses that work and are a
 * classic way to lose real leads. The checks that earn their place are the ones a typo
 * fails — one @, a dot in the domain, no spaces, plausible length.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5)
  .max(254)
  .refine((v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v), "Enter a valid email address");

/** Step one: the pill. */
export const captureSchema = z.object({
  email: emailSchema,
  capturedFrom: z.enum(["hero", "cta"]).optional(),
  // Honeypot: a real person never fills a field they cannot see. Accepted by the schema
  // rather than rejected by it, so the handler can answer 200 and teach the bot nothing.
  website: z.string().max(300).optional(),
});

/*
 * Step two: the dialog.
 *
 * Only the email is required. The dialog is a favour the visitor is doing us, and a
 * required-field wall is how you turn a captured lead into an abandoned one; anything
 * they skip stays NULL and the lead is still there from step one.
 */
export const detailsSchema = z.object({
  email: emailSchema,
  firstName: optionalText(120),
  lastName: optionalText(120),
  jobTitle: optionalText(160),
  companyName: optionalText(200),
  personalWebsite: optionalText(300),
  companyWebsite: optionalText(300),
  heardAbout: optionalText(400),
  website: z.string().max(300).optional(),
});

export type CaptureInput = z.infer<typeof captureSchema>;
export type DetailsInput = z.infer<typeof detailsSchema>;

/** Options for "How did you hear about us?" — free text stays possible via Other. */
export const HEARD_ABOUT = [
  "A colleague or friend",
  "Search",
  "LinkedIn or X",
  "A paper or talk",
  "An event",
  "Other",
] as const;

/**
 * Accepts what people actually type ("acme.com") and stores something clickable.
 * Returns undefined for input that could not be a host, rather than storing junk.
 */
export function normalizeUrl(input: string | undefined): string | undefined {
  if (!input) return undefined;
  const raw = input.trim();
  if (!raw) return undefined;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
