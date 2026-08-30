"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./brand";

// Anchors track the sections that exist; a nav link to a removed section is a dead
// scroll that looks like a broken page.
const LINKS = [
  { label: "The model", href: "#model" },
  { label: "Our approach", href: "#approach" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Security", href: "#security" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(false);

  // The pill firms up once it's over content; at rest it floats on the refraction.
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 20);
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
      {/* Announcement bar — bold ink, no stripe. */}
      <div className="relative z-50 bg-ink">
        <div className="px-4 py-2.5 text-center">
          <a
            href="#model"
            className="group inline-flex items-center gap-2.5 text-[12.5px] text-white/75 transition-colors hover:text-white"
          >
            <span className="rounded bg-s4 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              New
            </span>
            Cost per merged pull request — the metric your AI budget is missing
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav
          className={`mx-auto flex h-[60px] max-w-[var(--maxw)] items-center gap-7 rounded-full border pl-5 pr-3 transition-all duration-300 ${
            past
              ? "border-line bg-white/85 backdrop-blur-xl lift"
              : "border-line/70 bg-white/55 backdrop-blur-md"
          }`}
        >
          <Wordmark />

          <ul className="hidden items-center gap-6 md:flex">
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

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <a href="#demo" className="px-2 text-[13.5px] font-medium text-ink-3 hover:text-ink">
              Sign in
            </a>
            <a
              href="#demo"
              className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Request a demo
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4.5h12M2 11.5h12" />}
            </svg>
          </button>
        </nav>

        {open && (
          <div className="mx-auto mt-2 max-w-[var(--maxw)] rounded-2xl border border-line bg-white p-4 lift md:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-paper"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#demo"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full bg-ink px-4 py-3 text-center text-sm font-bold text-white"
            >
              Request a demo
            </a>
          </div>
        )}
      </header>
    </>
  );
}
