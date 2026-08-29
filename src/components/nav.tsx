"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./brand";

const LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "How it works", href: "#how" },
  { label: "Integrations", href: "#integrations" },
  { label: "Security", href: "#security" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  // The header only earns its border and backdrop once the page has moved; over the
  // hero it should feel like part of the artwork.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu that stays open behind a scrolled page is a bug waiting to be reported.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        lifted ? "border-b border-hairline bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[var(--maxw)] items-center gap-8 px-6">
        <Wordmark />

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a
            href="#demo"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Sign in
          </a>
          <a
            href="#demo"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-hi"
          >
            Book a demo
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-text md:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4h12M2 8h12M2 12h12" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-hairline bg-ink px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm text-text-muted hover:bg-surface hover:text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#demo"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-semibold text-ink"
          >
            Book a demo
          </a>
        </div>
      )}
    </header>
  );
}
