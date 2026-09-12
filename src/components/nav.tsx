"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./brand";
import { useContact } from "./contact";

// Anchors track the sections that exist; a nav link to a removed section is a dead
// scroll that looks like a broken page.
// Root-relative rather than bare fragments: these same links render on the product pages,
// where a bare fragment is a link to a section that is not on the document.
const LINKS = [
  { label: "Platform", href: "/#model" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Research", href: "/#approach" },
];

/*
 * The products menu.
 *
 * Every competitor in this category runs one, and a buyer with three tabs open reads the
 * menu as the product surface before reading a word of the page. A site with three flat
 * anchors next to their twelve-item mega-menu looks like a smaller company, whatever the
 * argument underneath says.
 *
 * The human-layer column is first and carries the marker colour, so the differentiated work
 * is the first thing in the menu rather than the last. Every entry points at a section that
 * exists on this page — there are no product pages behind these yet, and a menu of dead
 * links would cost more credibility than the menu buys.
 */
const MENU: {
  group: string;
  band: string;
  items: { t: string; d: string; href: string; tag?: string }[];
}[] = [
  {
    group: "Products",
    band: "var(--s1)",
    items: [
      {
        t: "Engineering intelligence",
        d: "Whether the work was any good, not just whether it shipped",
        href: "/products/engineering-intelligence",
      },
      {
        t: "Token intelligence",
        d: "Every AI dollar, and what it actually bought",
        href: "/products/token-intelligence",
      },
      {
        t: "Router",
        d: "The cheapest model that still clears your bar",
        href: "/products/router",
      },
    ],
  },
  {
    group: "The human layer",
    band: "var(--s5)",
    items: [
      {
        t: "Slop Index",
        d: "What plausible output costs after it merges",
        href: "/products/engineering-intelligence",
      },
      {
        t: "Judgment Rate",
        d: "Where a person changed the direction",
        href: "/products/engineering-intelligence",
      },
      {
        t: "Taste capture",
        d: "Your standards, in the agent's context",
        href: "/products/engineering-intelligence",
      },
    ],
  },
  {
    group: "Foundations",
    band: "var(--t3)",
    items: [
      { t: "Research", d: "The published work behind the numbers", href: "/#approach" },
      { t: "How we measure", d: "What we read, and what it leaves out", href: "/#how-we-see" },
      { t: "Use cases", d: "The decisions this is bought to make", href: "/#use-cases" },
    ],
  },
];

export function Nav() {
  const openContact = useContact();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [past, setPast] = useState(false);

  // Escape closes the products panel. It is not a modal and traps nothing, but a menu that
  // can only be dismissed with the mouse is unusable from the keyboard.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

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
      {/*
        Announcement bar — bold ink, no stripe.

        It announces something that exists. The previous line promised "the metric your AI
        budget is missing" and then landed on a section that never named that metric, which
        is the shape of an ad rather than an announcement: it withholds the thing it claims
        to offer. This states an actual finding from an actual paper and points at the rail
        where that paper is, so the click is paid off.
      */}
      <div className="relative z-50 bg-ink">
        <div className="px-4 py-2.5 text-center">
          <a
            href="/#approach"
            className="group inline-flex items-center gap-2.5 text-[12.5px] text-white/75 transition-colors hover:text-white"
          >
            <span className="rounded bg-s4 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              New
            </span>
            Research: the same pull request data supports opposite conclusions
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 px-4 pt-4" onMouseLeave={() => setMenu(false)}>
        <nav
          className={`mx-auto flex h-[60px] max-w-[var(--maxw)] items-center gap-7 rounded-full border pl-5 pr-3 transition-all duration-300 ${
            past
              ? "border-line bg-white/85 backdrop-blur-xl lift"
              : "border-line/70 bg-white/55 backdrop-blur-md"
          }`}
        >
          <Wordmark />

          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                onMouseEnter={() => setMenu(true)}
                aria-expanded={menu}
                className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink-3 transition-colors hover:text-ink"
              >
                Products
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className={`transition-transform duration-200 ${menu ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onMouseEnter={() => setMenu(false)}
                  className="text-[13.5px] font-medium text-ink-3 transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* opens the dialog rather than scrolling to the pill at the foot of the page:
              a nav CTA that answers with a scroll makes the reader do the work twice */}
          <div className="ml-auto hidden items-center md:flex">
            <button
              type="button"
              onClick={() => openContact()}
              className="rounded-full bg-ink px-4 py-2 text-[13.5px] font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Get in touch
            </button>
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

        {/* the products panel, anchored under the pill. `hidden md:block` rather than a
            separate mobile branch: the drawer below already lists everything. */}
        {menu && (
          <div className="absolute inset-x-0 top-full hidden px-4 md:block">
            <div className="mx-auto mt-2 max-w-[var(--maxw)] overflow-hidden rounded-2xl border border-line bg-white/95 backdrop-blur-xl lift-lg">
              <div className="grid gap-x-8 gap-y-7 p-7 lg:grid-cols-3">
                {MENU.map((g) => (
                  <div key={g.group}>
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: g.band }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">
                        {g.group}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {g.items.map((it) => (
                        <li key={it.t}>
                          <a
                            href={it.href}
                            onClick={() => setMenu(false)}
                            className="-mx-2 block rounded-lg px-2 py-2 transition-colors hover:bg-paper"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[13.5px] font-semibold text-ink">{it.t}</span>
                              {it.tag && (
                                <span className="rounded bg-s4 px-1.5 py-px text-[9px] font-extrabold uppercase tracking-wide text-ink">
                                  {it.tag}
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-ink-4">
                              {it.d}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* the footer of the menu carries the position, so the surface never reads as
                  a list of parity features with no point of view */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line bg-paper/70 px-7 py-4">
                <span className="text-[12.5px] font-semibold text-ink">
                  Creativity is the new productivity.
                </span>
                <span className="text-[12.5px] text-ink-3">
                  Measurement you can act on, and the researchers to read it with you.
                </span>
              </div>
            </div>
          </div>
        )}

        {open && (
          <div className="mx-auto mt-2 max-h-[calc(100dvh-8rem)] max-w-[var(--maxw)] overflow-y-auto rounded-2xl border border-line bg-white p-4 lift md:hidden">
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

            {/* the product surface, flattened. Descriptions are dropped here: on a phone
                they turn a twelve-item menu into a page of its own. */}
            {MENU.map((g) => (
              <div key={g.group} className="mt-4 border-t border-line pt-4">
                <div className="mb-2 flex items-center gap-2 px-3">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.band }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">
                    {g.group}
                  </span>
                </div>
                <ul className="flex flex-col">
                  {g.items.map((it) => (
                    <li key={it.t}>
                      <a
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13.5px] text-ink-2 hover:bg-paper"
                      >
                        {it.t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openContact();
              }}
              className="mt-3 block w-full rounded-full bg-ink px-4 py-3 text-center text-sm font-bold text-white"
            >
              Get in touch
            </button>
          </div>
        )}
      </header>
    </>
  );
}
