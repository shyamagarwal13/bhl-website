import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/*
 * Leads captured from the site.
 *
 * One row per person, keyed on a lowercased email. The site collects in two steps — the
 * pill takes an email, the dialog that follows asks for the rest — so every column past
 * `email` is nullable and the second step is an update, not an insert. Someone who gives
 * an email and closes the dialog is still a lead we can act on.
 *
 * `capturedFrom` records which pill they used (the hero or the closing panel), because
 * that is the only thing on the page that tells us how far they read before asking.
 *
 * No IP address and no user agent. Neither improves a lead, both are personal data we
 * would then have to justify holding.
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // stored lowercased and trimmed; the unique index is what makes step two an upsert
    email: text("email").notNull().unique(),

    firstName: text("first_name"),
    lastName: text("last_name"),
    jobTitle: text("job_title"),
    companyName: text("company_name"),
    personalWebsite: text("personal_website"),
    companyWebsite: text("company_website"),
    heardAbout: text("heard_about"),

    /** "hero" | "cta" — which form started the conversation */
    capturedFrom: text("captured_from"),

    /** set when the dialog is completed, so a partial lead is distinguishable at a glance */
    detailsAt: timestamp("details_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_created_at_idx").on(t.createdAt)],
);

export type Lead = typeof leads.$inferSelect;
