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

  // The floating pill sits on the gradient at rest and turns solid once it's over paper,
  // so it never becomes an unreadable white bar on a white section.
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 560);
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

  const onDark = !past;

  return (
    <>
      {/* announcement */}
      <div className="relative z-50 bg-ink px-4 py-2 text-center">
        <a href="#platform" className="text-[12.5px] text-white/80 transition-colors hover:text-white">
          <span className="mr-2 rounded bg-amber px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
            New
          </span>
          Cost per merged pull request — the metric your AI budget is missing
          <span className="ml-1.5">→</span>
        </a>
      </div>

      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav
          className={`mx-auto flex h-14 max-w-[var(--maxw)] items-center gap-7 rounded-full border px-3 pl-5 transition-colors duration-300 ${
            onDark
              ? "border-white/15 bg-white/10 backdrop-blur-md"
              : "border-line bg-white/90 backdrop-blur-md lift"
          }`}
        >
          <Wordmark tone={onDark ? "white" : "color"} />

          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-[13.5px] font-medium transition-colors ${
                    onDark ? "text-white/75 hover:text-white" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <a
              href="#demo"
              className={`px-3 text-[13.5px] font-medium transition-colors ${
                onDark ? "text-white/75 hover:text-white" : "text-ink-3 hover:text-ink"
              }`}
            >
              Sign in
            </a>
            <a
              href="#demo"
              className={`rounded-full px-4 py-2 text-[13.5px] font-bold transition-transform hover:scale-[1.03] ${
                onDark ? "bg-white text-indigo" : "bg-indigo text-white"
              }`}
            >
              Request a demo
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={`ml-auto flex h-9 w-9 items-center justify-center rounded-full border md:hidden ${
              onDark ? "border-white/20 text-white" : "border-line text-ink"
            }`}
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
              className="mt-3 block rounded-full bg-indigo px-4 py-3 text-center text-sm font-bold text-white"
            >
              Request a demo
            </a>
          </div>
        )}
      </header>
    </>
  );
}
