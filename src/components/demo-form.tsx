"use client";

import { useState } from "react";
import { LeadDialog } from "./lead-dialog";
import { emailSchema } from "@/lib/leads";

/*
 * Step one of lead capture: the pill.
 *
 * The email is banked before anything else happens. Only once the server has it does the
 * dialog open to ask for the rest, so someone who closes that dialog is still a lead we
 * can act on rather than a bounce.
 *
 * Nothing here touches the database. The pill posts to /api/leads, which owns the only
 * connection string in the project; no key or table name reaches the browser.
 */

export function DemoForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onDark = tone === "dark";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError("Enter a valid work email.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: parsed.data,
          capturedFrom: onDark ? "cta" : "hero",
        }),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Request failed");
      setEmail(parsed.data);
      setDialogOpen(true);
    } catch {
      // don't open the dialog on failure: it would collect details against an email the
      // server never stored, and the person would leave thinking they had reached us
      setError("We couldn't reach the server. Try again, or email hello@beholdlabs.com.");
    } finally {
      setBusy(false);
    }
  }

  /*
   * Stacked on phones, one pill from `sm` up.
   *
   * Side by side, the row needs the placeholder's 157px plus 32px of padding plus the
   * button. The hero has 342px at 390px wide and the CTA panel less still, so the input
   * lost the fight and the placeholder rendered as "What's your work ema". Shortening the
   * label or shaving padding buys ~12px, which the next font fallback would eat; stacking
   * gives the input the whole row and holds down to 320px.
   */
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <form
        onSubmit={submit}
        noValidate
        // the focus ring goes on the pill, not the bare input, so it follows the shape the
        // user sees; the input's own ring is suppressed in the same breath
        className={`flex w-full flex-col gap-1.5 rounded-3xl border p-1.5 outline-offset-2 has-[input:focus-visible]:outline-2 sm:flex-row sm:items-center sm:rounded-full ${
          onDark
            ? "border-white/20 bg-white/10 backdrop-blur-md has-[input:focus-visible]:outline-white"
            : "border-line-2 bg-white lift has-[input:focus-visible]:outline-ink"
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="What's your work email?"
          aria-label="Work email"
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          className={`h-10 w-full min-w-0 bg-transparent px-4 text-[14px] focus-visible:outline-none sm:w-auto sm:flex-1 ${
            onDark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-ink-4"
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          className={`h-10 w-full shrink-0 rounded-full px-5 text-[13.5px] font-bold transition-transform hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto ${
            onDark ? "bg-white text-ink" : "bg-ink text-white"
          }`}
        >
          {busy ? "Sending…" : "Get in touch"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className={`mt-2.5 px-2 text-[12.5px] font-medium ${onDark ? "text-white/80" : "text-neg"}`}
        >
          {error}
        </p>
      )}

      <LeadDialog open={dialogOpen} email={email} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
