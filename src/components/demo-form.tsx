"use client";

import { useState } from "react";

/*
 * Demo request.
 *
 * Backend-free by design for now: it composes a prefilled mail draft, so the form works
 * on day one with nothing deployed and no lead data sitting in a third party. Swap the
 * submit handler for a POST when there's a CRM — the markup won't change.
 */
const INBOX = "hello@beholdlabs.com";

export function DemoForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const onDark = tone === "dark";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(
      "Demo request",
    )}&body=${encodeURIComponent(`I'd like to see Behold.\n\nWork email: ${email}`)}`;
  }

  /*
   * Stacked on phones, one pill from `sm` up.
   *
   * Side by side, the row needs the placeholder's 157px plus 32px of padding plus a 146px
   * button. The hero has 342px at 390px wide and the CTA panel only 272px, so the input
   * lost the fight and the placeholder rendered as "What's your work ema". Shortening the
   * button label or shaving padding buys ~12px, which the next font fallback would eat;
   * stacking gives the input the whole row and holds down to 320px.
   */
  return (
    <form
      onSubmit={submit}
      className={`mx-auto flex w-full max-w-[440px] flex-col gap-1.5 rounded-3xl border p-1.5 sm:flex-row sm:items-center sm:rounded-full ${
        onDark ? "border-white/20 bg-white/10 backdrop-blur-md" : "border-line-2 bg-white lift"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="What's your work email?"
        aria-label="Work email"
        className={`h-10 w-full min-w-0 bg-transparent px-4 text-[14px] focus:outline-none sm:w-auto sm:flex-1 ${
          onDark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-ink-4"
        }`}
      />
      <button
        type="submit"
        className={`h-10 w-full shrink-0 rounded-full px-5 text-[13.5px] font-bold transition-transform hover:scale-[1.03] sm:w-auto ${
          onDark ? "bg-white text-ink" : "bg-ink text-white"
        }`}
      >
        Request a demo
      </button>
    </form>
  );
}
