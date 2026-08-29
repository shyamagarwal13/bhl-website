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

  return (
    <form
      onSubmit={submit}
      className={`flex w-full max-w-[440px] items-center gap-1.5 rounded-full border p-1.5 ${
        onDark ? "border-white/20 bg-white/12 backdrop-blur-md" : "border-line bg-white lift"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="What's your work email?"
        aria-label="Work email"
        className={`h-10 min-w-0 flex-1 bg-transparent px-4 text-[14px] focus:outline-none ${
          onDark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-ink-4"
        }`}
      />
      <button
        type="submit"
        className={`h-10 shrink-0 rounded-full px-5 text-[13.5px] font-bold transition-transform hover:scale-[1.03] ${
          onDark ? "bg-white text-indigo" : "bg-indigo text-white"
        }`}
      >
        Request a demo
      </button>
    </form>
  );
}
