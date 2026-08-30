"use client";

import { useEffect, useRef, useState } from "react";
import { TermChart } from "./term-charts";

/*
 * The engineering value equation, read down the page.
 *
 * The previous version scattered six full-width cards down a scroll-driven column, which
 * left screens of dead space between a term and the equation it belonged to. This holds
 * the whole model in a single dark panel: equation on top, term selector under it,
 * detail below — so the variable and its explanation are always in the same frame.
 *
 * Terms scroll vertically on the left while the instrument panel pins on the right and
 * swaps to match. Built on `position: sticky` plus a scroll listener rather than scroll
 * maths: sticky is the browser's own pinning, so it can't drift or judder against
 * momentum scrolling.
 *
 * The equation lives inside the pinned panel rather than above the section, so the
 * variable and the instrument that measures it are always on screen together — which was
 * the failure of every earlier version of this section.
 *
 * Below `lg` the pin is dropped and each term carries its own panel: a frozen panel taller
 * than a phone viewport traps the reader.
 *
 * Light, like the rest of the page — a lone dark slab in the middle of a light document
 * reads as a different site's component that wandered in.
 *
 * Colour uses the darkened text stops (--t1..--t5). The bright display bands measure
 * 2.1–2.8:1 on white: fine behind a bar, illegible as type, and these variables are type.
 */

type Term = {
  k: string;
  sym: string;
  name: string;
  unit: string;
  band: string;
  body: string;
  drivers: { good: boolean; text: string }[];
  cite?: { short: string; href: string };
};

const TERMS: Term[] = [
  {
    k: "F",
    sym: "F",
    name: "Feature value delivered",
    unit: "$ revenue / ARR impact",
    band: "var(--t3)",
    body: "What the work was worth to the business. Everything to the right of it is what you paid to get it — so this is the term that makes the others mean anything.",
    drivers: [
      { good: true, text: "Shipping what customers actually pay for" },
      { good: false, text: "Work that never reaches production" },
    ],
  },
  {
    k: "T",
    sym: "T",
    name: "Time multiplier",
    unit: "1 on time · < 1 late",
    band: "var(--t2)",
    body: "Value decays when it arrives late. A feature worth $1M shipped two quarters after the window is not worth $1M, and no velocity dashboard prices that gap.",
    drivers: [
      { good: true, text: "Faster cycle time, earlier feedback" },
      { good: false, text: "Queueing, rework loops, review backlog" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
  {
    k: "P",
    sym: "P",
    name: "Production cost",
    unit: "$",
    band: "var(--t1)",
    body: "Everything it takes to produce the code: salaries, AI tooling and model spend, hiring, onboarding. The lever every team pulls first, because it's the only one they can currently see.",
    drivers: [
      { good: true, text: "Agents producing working code faster" },
      { good: false, text: "Headcount, model spend, onboarding" },
    ],
    cite: { short: "Agents vs. AI IDEs", href: "https://doi.org/10.1145/3793302.3793589" },
  },
  {
    k: "L",
    sym: "L(t)",
    name: "Liability",
    unit: "$, compounding",
    band: "var(--t4)",
    body: "Rework and harm — and the reason this term carries a t. The cost of low-quality code isn't paid when it's written. It accrues, and it lands in a later quarter than the one that booked the saving.",
    drivers: [
      { good: false, text: "Lower quality — more harm, more rework" },
      { good: true, text: "Committed AI configuration, tests, proofs" },
    ],
    cite: {
      short: "Speed at the Cost of Quality",
      href: "https://doi.org/10.1145/3793302.3793349",
    },
  },
  {
    k: "E",
    sym: "E",
    name: "Review effectiveness",
    unit: "%",
    band: "var(--t5)",
    body: "How much liability review actually catches. It multiplies against L, so a small drop is expensive — and effectiveness falls exactly when volume rises.",
    drivers: [
      { good: false, text: "Productivity pressure on reviewers" },
      { good: false, text: "Deceptive plausibility of generated code" },
      { good: false, text: "Cognitive debt from unfamiliar changes" },
    ],
    cite: {
      short: "AI writes faster than humans review",
      href: "https://arxiv.org/abs/2607.01904",
    },
  },
  {
    k: "R",
    sym: "R",
    name: "Review cost",
    unit: "$",
    band: "var(--t5)",
    body: "What it costs to run review at all: reviewer hours, automated checks, CI. Doubling merged output doesn't leave this term alone — it roughly doubles the load on whoever is reading.",
    drivers: [
      { good: true, text: "Automated review that catches real defects" },
      { good: false, text: "More merged changes per reviewer" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
];

type Tok = { s: string; t?: string };
const TOKENS: Tok[] = [
  { s: "V", t: "V" },
  { s: "=" },
  { s: "(" },
  { s: "F", t: "F" },
  { s: "×" },
  { s: "T", t: "T" },
  { s: ")" },
  { s: "−" },
  { s: "[" },
  { s: "P", t: "P" },
  { s: "+" },
  { s: "L(t)", t: "L" },
  { s: "×" },
  { s: "(1−" },
  { s: "E", t: "E" },
  { s: ")" },
  { s: "+" },
  { s: "R", t: "R" },
  { s: "]" },
];

function Arrow({ good }: { good: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {good ? <path d="M4 4l8 8M12 12H6M12 12V6" /> : <path d="M4 12L12 4M12 4H6M12 4v6" />}
    </svg>
  );
}

function Equation({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1.5">
      {TOKENS.map((tok, n) => {
        const isVar = !!tok.t;
        const on = isVar && (tok.t === active || tok.t === "V");
        const color =
          tok.t === "V"
            ? "var(--ink)"
            : isVar
              ? TERMS.find((t) => t.k === tok.t)!.band
              : "var(--ink-4)";
        return (
          <span
            key={n}
            className="font-mono font-bold transition-all duration-500"
            style={{
              color,
              opacity: !isVar ? 1 : on ? 1 : 0.3,
              fontSize: "clamp(0.95rem, 1.55vw, 1.45rem)",
            }}
          >
            {tok.s}
          </span>
        );
      })}
    </div>
  );
}

export function EquationPanel() {
  const [i, setI] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const cur = TERMS[i];

  /*
   * Active term = the card nearest the vertical middle of the viewport. A scroll listener
   * rather than an IntersectionObserver: an IO callback only carries entries whose
   * visibility changed, so reducing over them to find the nearest card searches a partial
   * set and settles on the wrong term.
   */
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
      {/* terms */}
      <div className="flex min-w-0 flex-col">
        {TERMS.map((t, n) => (
          <div
            key={t.k}
            ref={(el) => {
              cards.current[n] = el;
            }}
            className="border-t border-line py-9 first:border-t-0 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-10"
          >
            <div className="flex items-baseline gap-3.5">
              <span
                className="font-mono text-[2rem] font-extrabold leading-none transition-colors duration-500"
                style={{ color: i === n ? t.band : "var(--ink-4)" }}
              >
                {t.sym}
              </span>
              <div>
                <h3
                  className="text-[1.15rem] font-bold transition-colors duration-500"
                  style={{ color: i === n ? "var(--ink)" : "var(--ink-3)" }}
                >
                  {t.name}
                </h3>
                <p className="font-mono text-[10.5px] text-ink-4">{t.unit}</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-3">{t.body}</p>

            <ul className="mt-5 flex flex-col gap-2.5">
              {t.drivers.map((d) => (
                <li key={d.text} className="flex items-start gap-2.5 text-[13.5px] text-ink-2">
                  <span
                    className="mt-[2px] shrink-0"
                    style={{ color: d.good ? "var(--pos)" : "var(--neg)" }}
                  >
                    <Arrow good={d.good} />
                  </span>
                  <span>{d.text}</span>
                </li>
              ))}
            </ul>

            {/* on a phone the panel travels with its term instead of pinning */}
            <div className="mt-6 lg:hidden">
              <TermChart k={t.k} band={t.band} />
            </div>
          </div>
        ))}
      </div>

      {/* pinned instrument */}
      <div className="hidden min-w-0 lg:block">
        <div className="sticky top-[calc(50vh-230px)]">
          <div className="rounded-2xl border border-line bg-white p-6 lift">
            <Equation active={cur.k} />
            <div className="mt-5 border-t border-line pt-5">
              <div className="relative min-h-[330px]">
                {TERMS.map((t, n) => (
                  <div
                    key={t.k}
                    aria-hidden={i !== n}
                    className="transition-all duration-500"
                    style={{
                      position: n === 0 ? "relative" : "absolute",
                      inset: n === 0 ? undefined : 0,
                      opacity: i === n ? 1 : 0,
                      pointerEvents: i === n ? "auto" : "none",
                    }}
                  >
                    <TermChart k={t.k} band={t.band} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-1.5">
            {TERMS.map((t, n) => (
              <span
                key={t.k}
                className="h-[3px] flex-1 rounded-full transition-all duration-500"
                style={{ background: n <= i ? t.band : "var(--line)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
