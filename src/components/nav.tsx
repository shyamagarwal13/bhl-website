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
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Announcement — the spectrum's first band as the marker, not a coloured chip. */}
      <div className="relative z-50 border-b border-line bg-white px-4 py-2.5 text-center">
        <a
          href="#platform"
          className="group inline-flex items-center gap-2.5 text-[12.5px] text-ink-3 transition-colors hover:text-ink"
        >
          <span className="spectrum-rule w-6" />
          Cost per merged pull request — the metric your AI budget is missing
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          past ? "border-line bg-white/85 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[66px] max-w-[var(--maxw)] items-center gap-8 px-6">
          <Wordmark />

          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13.5px] font-medium text-ink-3 transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto hidden items-center gap-4 md:flex">
            <a href="#demo" className="text-[13.5px] font-medium text-ink-3 hover:text-ink">
              Sign in
            </a>
            <a
              href="#demo"
              className="rounded-lg bg-ink px-4 py-2 text-[13.5px] font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Request a demo
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 11.5h12" />}
            </svg>
          </button>
        </nav>

        {open && (
          <div className="border-t border-line bg-white px-6 py-4 md:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-sm font-medium text-ink-2 hover:bg-paper"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-lg bg-ink px-4 py-3 text-center text-sm font-bold text-white"
            >
              Request a demo
            </a>
          </div>
        )}
      </header>
    </>
  );
}
