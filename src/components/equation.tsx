"use client";

import { useState } from "react";

/*
 * The engineering value equation, as one contained instrument panel.
 *
 * The previous version scattered six full-width cards down a scroll-driven column, which
 * left screens of dead space between a term and the equation it belonged to. This holds
 * the whole model in a single dark panel: equation on top, term selector under it,
 * detail below — so the variable and its explanation are always in the same frame.
 *
 * Click-driven rather than scroll-driven on purpose. The page already has a pinned
 * scroll story in the delivery-stage section; repeating the device makes the second one
 * feel like a tic, and a reader who wants R shouldn't have to scroll past four terms
 * to reach it.
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
  side: string;
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
    side: "Value",
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
    side: "Value",
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
    side: "Cost",
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
    side: "Cost",
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
    side: "Review",
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
    side: "Review",
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
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {good ? <path d="M4 4l8 8M12 12H6M12 12V6" /> : <path d="M4 12L12 4M12 4H6M12 4v6" />}
    </svg>
  );
}

export function EquationPanel() {
  // Opens on L(t): the term nobody is currently pricing, and the reason for the product.
  const [i, setI] = useState(3);
  const cur = TERMS[i];

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-line bg-white p-6 lift sm:p-10">
      {/* the active term's colour washes the top of the frame, so the whole panel responds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(84% 52% at 50% -16%, color-mix(in srgb, ${cur.band} 13%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-2 sm:gap-x-3">
          {TOKENS.map((tok, n) => {
            const isVar = !!tok.t;
            const on = isVar && (tok.t === cur.k || tok.t === "V");
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
                  opacity: !isVar ? 1 : on ? 1 : 0.32,
                  fontSize: "clamp(1.15rem, 3.3vw, 2.5rem)",
                  textShadow: "none",
                }}
              >
                {tok.s}
              </span>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4">
          Engineering value = what it was worth − what it cost to get
        </p>

        <div
          role="tablist"
          aria-label="Equation terms"
          className="mt-9 flex flex-wrap justify-center gap-2"
        >
          {TERMS.map((t, n) => {
            const on = n === i;
            return (
              <button
                key={t.k}
                role="tab"
                aria-selected={on}
                onClick={() => setI(n)}
                className="flex items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-300"
                style={{
                  borderColor: on ? t.band : "var(--line)",
                  background: on ? `color-mix(in srgb, ${t.band} 9%, transparent)` : "var(--white)",
                }}
              >
                <span
                  className="font-mono text-[13px] font-bold transition-colors duration-300"
                  style={{ color: on ? t.band : "var(--ink-4)" }}
                >
                  {t.sym}
                </span>
                <span
                  className="hidden text-[12.5px] font-medium transition-colors duration-300 sm:inline"
                  style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
                >
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
            <div className="min-w-0">
              <div className="flex items-baseline gap-4">
                <span
                  className="font-mono text-[2.5rem] font-extrabold leading-none transition-colors duration-500"
                  style={{ color: cur.band }}
                >
                  {cur.sym}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[1.1rem] font-bold text-ink">{cur.name}</h3>
                    <span className="rounded border border-line-2 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-ink-4">
                      {cur.side}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-4">{cur.unit}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-3">{cur.body}</p>
            </div>

            <div className="flex min-w-0 flex-col justify-between gap-6">
              <ul className="flex flex-col gap-3">
                {cur.drivers.map((d) => (
                  <li key={d.text} className="flex items-start gap-3 text-[14px] text-ink-2">
                    <span className="mt-[3px] shrink-0" style={{ color: d.good ? "var(--pos)" : "var(--neg)" }}>
                      <Arrow good={d.good} />
                    </span>
                    <span>{d.text}</span>
                  </li>
                ))}
              </ul>

              {cur.cite && (
                <a
                  href={cur.cite.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px] text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cur.band }} />
                  Our research: {cur.cite.short}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
