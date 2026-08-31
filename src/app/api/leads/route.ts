import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { captureSchema, detailsSchema, normalizeUrl } from "@/lib/leads";

/*
 * Lead capture.
 *
 * POST  — step one, the email from the pill.
 * PATCH — step two, the details from the dialog.
 *
 * The database is reached only from here. No Supabase key, connection string or table
 * name ever goes to the browser, so there is no row-level-security policy standing
 * between an anonymous visitor and the table: they cannot address it at all.
 *
 * Both handlers answer `{ ok: true }` for any well-formed request, including one whose
 * email is already on file. Telling a caller whether an address is known would turn this
 * into an oracle for checking who has talked to us.
 */

// postgres.js needs Node APIs; the edge runtime cannot run it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Best-effort throttle.
 *
 * Per-instance and in memory, so it is a speed bump rather than a guarantee — serverless
 * spreads traffic across instances and cold starts wipe the map. It costs nothing and
 * stops the naive case (one script, one connection, thousands of rows). The real backstop
 * is the unique index on email, which caps a flood at one row per address.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function throttled(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // the map is per-instance and unbounded otherwise; a lazy sweep is enough at this size
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Used only to throttle, never stored or logged. */
function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/*
 * Same-origin only. There is no session to ride on, so this is not classic CSRF defence —
 * it just means another site cannot point its form at our endpoint and fill our table.
 */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // curl and same-origin GETs send none; the throttle still applies
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

const ok = () => NextResponse.json({ ok: true });
const bad = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: message }, { status });

async function readJson(req: Request): Promise<unknown> {
  if (!req.headers.get("content-type")?.includes("application/json")) return null;
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/** Step one: email only. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (throttled(clientKey(req))) return bad("Too many requests. Try again shortly.", 429);

  const body = await readJson(req);
  if (body === null) return bad("Expected a JSON body");

  const parsed = captureSchema.safeParse(body);
  if (!parsed.success) return bad("Enter a valid email address");

  // a filled honeypot is a bot; answer as though it worked so it learns nothing
  if (parsed.data.website) return ok();

  try {
    await db
      .insert(leads)
      .values({ email: parsed.data.email, capturedFrom: parsed.data.capturedFrom })
      // seeing the same address again is not new information, and must not clobber
      // details the person already gave us
      .onConflictDoUpdate({ target: leads.email, set: { updatedAt: new Date() } });
    return ok();
  } catch (err) {
    console.error("lead capture failed", err);
    return bad("Something went wrong. Please email hello@beholdlabs.com.", 500);
  }
}

/** Step two: the rest of the dialog. */
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (throttled(clientKey(req))) return bad("Too many requests. Try again shortly.", 429);

  const body = await readJson(req);
  if (body === null) return bad("Expected a JSON body");

  const parsed = detailsSchema.safeParse(body);
  if (!parsed.success) return bad("Check the highlighted fields");
  if (parsed.data.website) return ok();

  const d = parsed.data;
  // Drop the keys the visitor left blank. Passing them through would write NULL over
  // whatever they told us on an earlier visit, so a half-filled second form would erase
  // a fully-filled first one.
  const fields = Object.fromEntries(
    Object.entries({
      firstName: d.firstName,
      lastName: d.lastName,
      jobTitle: d.jobTitle,
      companyName: d.companyName,
      personalWebsite: normalizeUrl(d.personalWebsite),
      companyWebsite: normalizeUrl(d.companyWebsite),
      heardAbout: d.heardAbout,
      detailsAt: new Date(),
      updatedAt: new Date(),
    }).filter(([, v]) => v !== undefined),
  );

  try {
    // an insert rather than an update, because the dialog can outlive its row: someone
    // who lands here without a step-one row still gets recorded in full
    await db
      .insert(leads)
      .values({ email: d.email, ...fields })
      .onConflictDoUpdate({ target: leads.email, set: fields });
    return ok();
  } catch (err) {
    console.error("lead details failed", err);
    return bad("Something went wrong. Please email hello@beholdlabs.com.", 500);
  }
}
