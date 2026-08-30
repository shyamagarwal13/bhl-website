"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";
import { EquationStrip } from "./equation";
import { TermChart } from "./term-charts";

/*
 * Use cases.
 *
 * Every vendor in this category runs a six-card grid here, so the differentiator can't be
 * the format — it has to be what the cards say. Each one names a question a leader can't
 * currently answer, and tags which terms of the equation it moves. That ties the section
 * back to the model instead of listing capabilities in a vacuum, and it's a claim only a
 * company with the model can make.
 *
 * Deliberately no "Learn more" links: there is nothing behind them yet, and a grid of six
 * dead links is worse than a grid of six honest statements.
 *
 * Read vertically with a pinned panel: the case scrolls on the left while the right shows
 * the equation with that case's terms lit and the instrument for its primary term. That
 * makes the "Moves: P, F" tag literal — you see which part of the model the decision
 * touches, and what you'd actually be looking at.
 *
 * Below `lg` the pin is dropped; a frozen panel taller than a phone viewport traps the
 * reader.
 */

type Case = {
  q: string;
  d: string;
  terms: string[];
  /** which term's instrument to show alongside — the case's primary lever */
  chart: string;
  band: string;
  icon: React.ReactNode;
};

const S = { w: 20, h: 20, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.7 } as const;

const CASES: Case[] = [
  {
    q: "Prove Your AI Investment Is Working",
    chart: "P",
    d: "Connect model and tool spend to the changes that actually shipped, so you can answer what the investment returned instead of reporting what it cost.",
    terms: ["P", "F"],
    band: "var(--t1)",
    icon: (
      <>
        <path d="M12 3v18" strokeLinecap="round" />
        <path d="M16.5 7.5A3.5 3.5 0 0 0 13 5h-2a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-2a3.5 3.5 0 0 1-3.5-2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    q: "Price Rework and Abandoned Work",
    chart: "L",
    d: "See what was abandoned before merge or reverted after it, priced apart from what survived, so you know how much of the budget bought something that is still running.",
    terms: ["L(t)", "P"],
    band: "var(--t4)",
    icon: (
      <>
        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
        <path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" strokeLinecap="round" />
      </>
    ),
  },
  {
    q: "Protect Your Review Capacity",
    chart: "E",
    d: "Track how many changes clear review first time alongside reviewer load, so a decline in review depth surfaces as a trend rather than as an incident.",
    terms: ["E", "R"],
    band: "var(--t5)",
    icon: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
  },
  {
    q: "Reduce Developer Friction",
    chart: "T",
    d: "Combine delivery data with short, targeted developer input to find where time is lost, ranked by the hours each source of friction actually costs you.",
    terms: ["T"],
    band: "var(--t2)",
    icon: (
      <>
        <path d="M14.5 4.5a4.5 4.5 0 0 0 5.9 5.9L12 18.8 5.2 12l8.4-8.4a4.5 4.5 0 0 0 .9.9Z" strokeLinejoin="round" />
        <path d="M5.2 12 3 20l8-2.2" strokeLinejoin="round" />
      </>
    ),
  },
  {
    q: "Compare Teams on Equal Terms",
    chart: "P",
    d: "Normalize unit cost for the work each team actually does, so a comparison holds up when the teams being compared are the ones asking the questions.",
    terms: ["P", "T"],
    band: "var(--t3)",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" strokeLinecap="round" />,
  },
  {
    q: "Automate Engineering Cost Reporting",
    chart: "F",
    d: "Produce unit economics reconciled to provider billing with the derivation attached to every figure, ready for capitalization, R&D claims and board reporting.",
    terms: ["F", "P"],
    band: "var(--t1)",
    icon: (
      <>
        <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
        <path d="M8 11h8M8 15h5" strokeLinecap="round" />
      </>
    ),
  },
];
export function UseCases() {
  const [i, setI] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const cur = CASES[i];

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      cards.current.forEach((el, n) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      });
      setI(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="border-y border-line bg-paper/60">
      <section id="use-cases" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              What engineering leaders use it for.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Each of these is a decision already being made without the evidence to settle it.
              The tag on every case names the terms of the model that decision moves.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <div className="flex min-w-0 flex-col">
            {CASES.map((c, n) => (
              <div
                key={c.q}
                ref={(el) => {
                  cards.current[n] = el;
                }}
                className="border-t border-line py-9 first:border-t-0 lg:flex lg:min-h-[54vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-10"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500"
                  style={{
                    borderColor:
                      i === n ? `color-mix(in srgb, ${c.band} 45%, transparent)` : "var(--line)",
                    background:
                      i === n ? `color-mix(in srgb, ${c.band} 9%, transparent)` : "transparent",
                    color: i === n ? c.band : "var(--ink-4)",
                  }}
                >
                  <svg {...S} stroke="currentColor" aria-hidden="true">
                    {c.icon}
                  </svg>
                </span>

                <h3
                  className="mt-5 max-w-md text-balance text-[1.3rem] font-bold leading-snug transition-colors duration-500 sm:text-[1.5rem]"
                  style={{ color: i === n ? "var(--ink)" : "var(--ink-3)" }}
                >
                  {c.q}
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-3">{c.d}</p>

                <div className="mt-5 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4">
                    Moves
                  </span>
                  {c.terms.map((t) => (
                    <span
                      key={t}
                      className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold"
                      style={{
                        color: c.band,
                        background: `color-mix(in srgb, ${c.band} 10%, transparent)`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 lg:hidden">
                  <TermChart k={c.chart} band={c.band} />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden min-w-0 lg:block">
            <div className="sticky top-[calc(50vh-220px)]">
              <div className="rounded-2xl border border-line bg-white p-6 lift">
                <EquationStrip active={cur.terms.map((t) => (t === "L(t)" ? "L" : t))} />
                <div className="mt-5 border-t border-line pt-5">
                  <div className="relative min-h-[318px]">
                    {CASES.map((c, n) => (
                      <div
                        key={c.q}
                        aria-hidden={i !== n}
                        className="transition-opacity duration-500"
                        style={{
                          position: n === 0 ? "relative" : "absolute",
                          inset: n === 0 ? undefined : 0,
                          opacity: i === n ? 1 : 0,
                          pointerEvents: i === n ? "auto" : "none",
                        }}
                      >
                        <TermChart k={c.chart} band={c.band} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-1.5">
                {CASES.map((c, n) => (
                  <span
                    key={c.q}
                    className="h-[3px] flex-1 rounded-full transition-all duration-500"
                    style={{ background: n <= i ? c.band : "var(--line)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
