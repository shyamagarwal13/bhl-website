"use client";

import { useState } from "react";

/*
 * Demo request.
 *
 * Deliberately backend-free for now: it composes a prefilled mail draft, so the form
 * works on day one with nothing to deploy and no data sitting in a third party. Swap the
 * submit handler for a POST when there's a CRM to put this in — the markup won't change.
 */
const INBOX = "hello@beholdlabs.com";

export function DemoForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      "I'd like to see Behold Labs.",
      "",
      `Work email: ${email}`,
      `Company: ${company || "—"}`,
      `Engineering size: ${size || "—"}`,
    ].join("\n");
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(
      "Demo request",
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          aria-label="Work email"
          className="h-11 flex-1 rounded-lg border border-hairline-strong bg-surface px-3.5 text-sm text-text placeholder:text-text-faint focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-lg bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold-hi"
        >
          Book a demo
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          aria-label="Company"
          className="h-11 flex-1 rounded-lg border border-hairline bg-surface px-3.5 text-sm text-text placeholder:text-text-faint focus:border-gold focus:outline-none"
        />
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          aria-label="Engineering team size"
          className="h-11 flex-1 rounded-lg border border-hairline bg-surface px-3 text-sm text-text focus:border-gold focus:outline-none"
        >
          <option value="">Engineering size</option>
          <option>1–25</option>
          <option>26–100</option>
          <option>101–500</option>
          <option>500+</option>
        </select>
      </div>
      <p className="text-xs text-text-faint">
        We&apos;ll reply within one business day. No cold sequence, no reselling your data.
      </p>
    </form>
  );
}
