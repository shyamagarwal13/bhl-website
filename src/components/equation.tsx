"use client";

import { useEffect, useRef, useState } from "react";
import { TermChart } from "./term-charts";

/*
 * The engineering value equation, as a rail of instruments.
 *
 * The previous version scattered six full-width cards down a scroll-driven column, which
 * left screens of dead space between a term and the equation it belonged to. This holds
 * the whole model in a single dark panel: equation on top, term selector under it,
 * detail below — so the variable and its explanation are always in the same frame.
 *
 * All six terms sit side by side on a horizontal rail. Nothing is hidden behind a click:
 * scrolling the rail moves through the terms, and whichever card is nearest the centre
 * lights its variable in the equation above. Tabs still work as jump targets, so a reader
 * who wants R goes straight there.
 *
 * Horizontal rather than the vertical pinned-scroll used in the delivery-stage section —
 * repeating that device would make the second one read as a tic, and a rail lets the six
 * instruments be compared against each other rather than seen one at a time.
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
    body: "What the work was worth to the business. Everything to the right of it is what you paid to get it, so this is the term that makes the others mean anything.",
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
    body: "Rework and harm. It is also the reason this term carries a t. The cost of low-quality code isn't paid when it's written. It accrues, and it lands in a later quarter than the one that booked the saving.",
    drivers: [
      { good: false, text: "Lower quality, more harm, more rework" },
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
    body: "How much liability review actually catches. It multiplies against L, so a small drop is expensive. Effectiveness falls exactly when volume rises.",
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
    body: "What it costs to run review at all: reviewer hours, automated checks, CI. Doubling merged output doesn't leave this term alone. It roughly doubles the load on whoever is reading.",
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

/** The rail's left padding, which is the x-position both the observer and go() anchor to. */
function railPad(el: HTMLElement) {
  return parseFloat(getComputedStyle(el).paddingLeft) || 0;
}

/**
 * The equation as a compact strip, with an arbitrary set of terms lit. Exported so the
 * use-cases section can light the terms each case moves — which makes the "Moves: P, F"
 * tag literal rather than a label.
 */
export function EquationStrip({ active, size = "0.95rem" }: { active: string[]; size?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1">
      {TOKENS.map((tok, n) => {
        const isVar = !!tok.t;
        const on = isVar && (active.includes(tok.t!) || tok.t === "V");
        return (
          <span
            key={n}
            className="font-mono font-bold transition-all duration-500"
            style={{
              color: !isVar
                ? "var(--ink-4)"
                : tok.t === "V"
                  ? "var(--ink)"
                  : TERMS.find((t) => t.k === tok.t)!.band,
              opacity: !isVar ? 1 : on ? 1 : 0.26,
              fontSize: size,
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
  const [pinned, setPinned] = useState(false);
  const outer = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const cur = TERMS[i];

  // Scroll-driving is desktop-only, and off entirely for reduced-motion readers.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(wide.matches && !calm.matches);
    sync();
    wide.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  /*
   * Active term = the card whose left edge is nearest the rail's content edge.
   *
   * Still correct when the rail is driven by page scroll, because that path sets
   * scrollLeft on the rail and this listener fires from it.
   *
   * Deliberately a scroll listener and not an IntersectionObserver: an IO callback only
   * receives entries whose visibility *changed*, so reducing over `entries` to find the
   * closest card searched a partial set and settled on the wrong term — clicking the T
   * chip highlighted L(t). Reading positions on scroll considers every card every time.
   * rAF-throttled, passive, so it costs nothing.
   */
  useEffect(() => {
    const root = rail.current;
    if (!root) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const anchor = root.getBoundingClientRect().left + railPad(root);
      let best = 0;
      let bestD = Infinity;
      cards.current.forEach((el, n) => {
        if (!el) return;
        const d = Math.abs(el.getBoundingClientRect().left - anchor);
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
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /*
   * Vertical page scroll drives the rail.
   *
   * The panel pins while a tall spacer scrolls past it; progress through that spacer maps
   * to scrollLeft on the rail, so reading down the page walks through the six terms
   * without the reader having to notice a horizontal control exists.
   *
   * Desktop only. On a phone this would mean hijacking the one gesture the reader has,
   * and a pinned panel taller than the viewport traps them — there the rail stays an
   * ordinary swipeable strip.
   */
  useEffect(() => {
    if (!pinned) return;
    const outerEl = outer.current;
    const root = rail.current;
    if (!outerEl || !root) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const travel = outerEl.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const passed = window.scrollY - outerEl.offsetTop;
      const progress = Math.max(0, Math.min(1, passed / travel));
      root.scrollLeft = progress * (root.scrollWidth - root.clientWidth);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  /** Chips jump: scroll the page to the point whose progress selects term n. */
  const go = (n: number) => {
    const idx = Math.max(0, Math.min(TERMS.length - 1, n));
    const root = rail.current;
    if (pinned && outer.current) {
      const travel = outer.current.offsetHeight - window.innerHeight;
      const frac = idx / (TERMS.length - 1);
      window.scrollTo({ top: outer.current.offsetTop + travel * frac, behavior: "smooth" });
      return;
    }
    const el = cards.current[idx];
    if (!root || !el) return;
    const delta = el.getBoundingClientRect().left - root.getBoundingClientRect().left;
    root.scrollTo({ left: root.scrollLeft + delta - railPad(root), behavior: "smooth" });
  };

  return (
    <div
      ref={outer}
      style={pinned ? { height: `calc(100vh + ${(TERMS.length - 1) * 46}vh)` } : undefined}
    >
      <div className={pinned ? "sticky top-[92px]" : ""}>
    <div className="relative overflow-hidden rounded-[26px] border border-line bg-white py-8 lift sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(80% 46% at 50% -16%, color-mix(in srgb, ${cur.band} 13%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="px-5 sm:px-10">
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
                    fontSize: "clamp(1.15rem, 3.1vw, 2.35rem)",
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

          {/* jump targets — the rail is the primary control, these are shortcuts */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {TERMS.map((t, n) => {
              const on = n === i;
              return (
                <button
                  key={t.k}
                  onClick={() => go(n)}
                  aria-label={`Show ${t.name}`}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300"
                  style={{
                    borderColor: on ? t.band : "var(--line)",
                    background: on
                      ? `color-mix(in srgb, ${t.band} 9%, transparent)`
                      : "var(--white)",
                  }}
                >
                  <span
                    className="font-mono text-[12.5px] font-bold"
                    style={{ color: on ? t.band : "var(--ink-4)" }}
                  >
                    {t.sym}
                  </span>
                  <span
                    className="hidden text-[12px] font-medium sm:inline"
                    style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* the rail */}
        <div className="relative mt-8">
          <div
            ref={rail}
            className={`no-scrollbar flex gap-5 px-5 pb-2 sm:px-10 ${
              pinned ? "overflow-x-hidden" : "snap-x snap-mandatory overflow-x-auto"
            }`}
          >
            {TERMS.map((t, n) => (
              <div
                key={t.k}
                ref={(el) => {
                  cards.current[n] = el;
                }}
                className="w-[min(84vw,392px)] shrink-0 snap-start"
              >
                <article
                  className="flex h-full flex-col rounded-2xl border bg-paper p-5 transition-all duration-500"
                  style={{
                    borderColor: i === n ? t.band : "var(--line)",
                    opacity: i === n ? 1 : 0.62,
                  }}
                >
                  <TermChart k={t.k} band={t.band} />

                  <div className="mt-5 flex items-baseline gap-3">
                    <span
                      className="font-mono text-[1.65rem] font-extrabold leading-none"
                      style={{ color: t.band }}
                    >
                      {t.sym}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-ink">{t.name}</h3>
                      <p className="font-mono text-[10.5px] text-ink-4">{t.unit}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{t.body}</p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {t.drivers.map((d) => (
                      <li key={d.text} className="flex items-start gap-2.5 text-[12.5px] text-ink-2">
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

                </article>
              </div>
            ))}

            {/*
              Trailing spacer. Without it the rail runs out of scroll before the last
              cards can reach the left edge, so clicking the R chip scrolled as far as it
              could and left L(t) highlighted — the chip and the highlight disagreed.
            */}
            <div
              aria-hidden="true"
              className="shrink-0"
              style={{ width: "calc(100% - min(84vw, 392px))" }}
            />
          </div>

          {/* edge fades, so cards read as continuing past the frame */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
        </div>

        {/* rail controls */}
        <div className="mt-6 flex items-center justify-center gap-4 px-5 sm:px-10">
          <button
            onClick={() => go(i - 1)}
            disabled={i === 0}
            aria-label="Previous term"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-3 transition-colors hover:border-line-2 hover:text-ink disabled:opacity-35"
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {TERMS.map((t, n) => (
              <span
                key={t.k}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === n ? 22 : 6,
                  background: i === n ? t.band : "var(--line-2)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => go(i + 1)}
            disabled={i === TERMS.length - 1}
            aria-label="Next term"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-3 transition-colors hover:border-line-2 hover:text-ink disabled:opacity-35"
          >
            →
          </button>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
