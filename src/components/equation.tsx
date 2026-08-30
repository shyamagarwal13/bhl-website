"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The engineering value equation, revealed term by term.
 *
 * The equation pins while the term cards scroll past it; whichever card is nearest the
 * middle of the viewport lights its symbol and dims the rest. Same reasoning as the
 * delivery-stage section: `position: sticky` plus an IntersectionObserver, because sticky
 * is the browser's own pinning and can't drift or judder against momentum scrolling.
 *
 * The colour assignment is not decorative. F and T are the value side, P and L the cost
 * side, E and R both belong to review — which is why they share a band rather than each
 * getting an arbitrary new one.
 */

type Term = {
  k: string;
  sym: string;
  name: string;
  unit: string;
  band: string;
  body: string;
  // `good` is separate from `dir` on purpose: raising F is good, raising L is not.
  // Keying colour to direction alone made the value terms read backwards.
  drivers: { dir: "up" | "down"; good: boolean; text: string }[];
  cite?: { short: string; href: string };
};

export const TERMS: Term[] = [
  {
    k: "F",
    sym: "F",
    name: "Feature value delivered",
    unit: "$ revenue / ARR impact",
    band: "var(--t3)",
    body: "What the work was actually worth to the business. Everything to the right of this is what it cost you to get it — so this is the only term that makes the others mean anything.",
    drivers: [
      { dir: "up", good: true, text: "Shipping what customers pay for" },
      { dir: "down", good: false, text: "Work that never reaches production" },
    ],
  },
  {
    k: "T",
    sym: "T",
    name: "Time multiplier",
    unit: "1 if on time, < 1 if late",
    band: "var(--t2)",
    body: "Value decays when it arrives late. A feature worth $1M shipped two quarters after the window is not worth $1M, and no velocity dashboard prices that gap.",
    drivers: [
      { dir: "up", good: true, text: "Faster cycle time, earlier feedback" },
      { dir: "down", good: false, text: "Queueing, rework loops, review backlog" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
  {
    k: "P",
    sym: "P",
    name: "Production cost",
    unit: "$",
    band: "var(--t1)",
    body: "Everything it takes to produce the code: engineer salaries, AI tooling and model spend, hiring, onboarding. The lever most teams pull first, and the only one they can currently see.",
    drivers: [
      { dir: "down", good: true, text: "Agents producing code faster" },
      { dir: "up", good: false, text: "Headcount, model spend, onboarding" },
    ],
    cite: { short: "Agents vs. AI IDEs", href: "https://doi.org/10.1145/3793302.3793589" },
  },
  {
    k: "L",
    sym: "L(t)",
    name: "Liability",
    unit: "$, compounding over time",
    band: "var(--t4)",
    body: "Rework and harm, and the reason this term carries a t: the cost of low-quality code is not paid when it is written. It accrues, and it is charged to a later quarter than the one that booked the saving.",
    drivers: [
      { dir: "up", good: false, text: "Lower quality — more harm, more rework" },
      { dir: "down", good: true, text: "Committed AI configuration, tests, proofs" },
    ],
    cite: { short: "Speed at the Cost of Quality", href: "https://doi.org/10.1145/3793302.3793349" },
  },
  {
    k: "E",
    sym: "E",
    name: "Review effectiveness",
    unit: "%",
    band: "var(--t5)",
    body: "How much liability review actually catches. It multiplies against L, so a small drop in effectiveness is expensive — and effectiveness falls exactly when volume rises.",
    drivers: [
      { dir: "down", good: false, text: "Productivity pressure on reviewers" },
      { dir: "down", good: false, text: "Deceptive plausibility of generated code" },
      { dir: "down", good: false, text: "Cognitive debt from unfamiliar changes" },
    ],
    cite: { short: "AI writes faster than humans review", href: "https://arxiv.org/abs/2607.01904" },
  },
  {
    k: "R",
    sym: "R",
    name: "Review cost",
    unit: "$",
    band: "var(--t5)",
    body: "What it costs to run review at all — reviewer hours, automated checks, CI. Doubling merged output does not leave this term alone; it roughly doubles the load on whoever is reading.",
    drivers: [
      { dir: "down", good: true, text: "Automated review that actually catches things" },
      { dir: "up", good: false, text: "More merged changes per reviewer" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
];

/** One token of the rendered equation. `t` marks it as a variable we can light up. */
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
  { s: "(1 −" },
  { s: "E", t: "E" },
  { s: ")" },
  { s: "+" },
  { s: "R", t: "R" },
  { s: "]" },
];

function bandOf(k: string) {
  return TERMS.find((t) => t.k === k)?.band ?? "var(--ink)";
}

function Arrow({ dir, good }: { dir: "up" | "down"; good: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={good ? "text-pos" : "text-neg"}
      aria-hidden="true"
    >
      {dir === "up" ? <path d="M4 12L12 4M12 4H6M12 4v6" /> : <path d="M4 4l8 8M12 12H6M12 12V6" />}
    </svg>
  );
}

export function EquationScroll() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (!vis.length) return;
        const best = vis.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top - window.innerHeight / 2) <
          Math.abs(b.boundingClientRect.top - window.innerHeight / 2)
            ? a
            : b,
        );
        const i = els.indexOf(best.target as HTMLDivElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = TERMS[active];

  return (
    <div className="relative">
      {/* pinned equation */}
      {/*
        Sticky from the very top with opaque padding tall enough to clear the header,
        rather than sticking below it. The nav is a floating pill, so page content scrolls
        through the gaps around it — which looked fine everywhere else on the page but
        turned into ghost text sandwiched above the equation. This band covers the whole
        strip; the pill (z-40) floats over it.
      */}
      <div className="sticky top-0 z-20 -mx-6 bg-paper px-6 pb-3 pt-[86px]">
        <div className="rounded-2xl border border-line bg-white px-4 py-5 lift sm:px-8">
          <div className="flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-2 font-mono text-[1.15rem] font-bold sm:gap-x-3.5 sm:text-[1.9rem] lg:text-[2.3rem]">
            {TOKENS.map((tok, i) => {
              const isVar = !!tok.t;
              const on = isVar && (tok.t === cur.k || tok.t === "V");
              return (
                <span
                  key={i}
                  className="transition-all duration-500"
                  style={{
                    color: isVar
                      ? tok.t === "V"
                        ? "var(--ink)"
                        : bandOf(tok.t!)
                      : "var(--ink-4)",
                    opacity: !isVar ? 0.85 : on ? 1 : 0.22,
                    transform: on && tok.t !== "V" ? "translateY(-2px)" : "none",
                  }}
                >
                  {tok.s}
                </span>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5 border-t border-line pt-4">
            <span
              className="h-2 w-2 shrink-0 rounded-full transition-colors duration-500"
              style={{ background: cur.band }}
            />
            <span className="text-center text-[13px] text-ink-3 transition-all duration-500">
              <span className="font-bold text-ink">{cur.sym}</span> — {cur.name}{" "}
              <span className="text-ink-4">({cur.unit})</span>
            </span>
          </div>
        </div>
      </div>

      {/* term cards */}
      <div className="mt-6 flex flex-col">
        {TERMS.map((t, i) => (
          <div
            key={t.k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex min-h-[48vh] flex-col justify-center py-6"
          >
            <div
              className="rounded-2xl border bg-white p-7 transition-all duration-500 sm:p-9"
              style={{
                borderColor: active === i ? t.band : "var(--line)",
                boxShadow:
                  active === i
                    ? `0 18px 48px -22px color-mix(in srgb, ${t.band} 45%, transparent)`
                    : "none",
              }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="font-mono text-[2.4rem] font-extrabold leading-none transition-colors duration-500"
                  style={{ color: active === i ? t.band : "var(--ink-4)" }}
                >
                  {t.sym}
                </span>
                <div>
                  <h3 className="text-[1.15rem] font-bold text-ink">{t.name}</h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-4">
                    {t.unit}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-3">{t.body}</p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {t.drivers.map((d) => (
                  <li key={d.text} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                    <span className="mt-[3px] shrink-0">
                      <Arrow dir={d.dir} good={d.good} />
                    </span>
                    <span>{d.text}</span>
                  </li>
                ))}
              </ul>

              {t.cite && (
                <a
                  href={t.cite.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:border-line-2 hover:text-ink"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.band }} />
                  Our research: {t.cite.short}
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
