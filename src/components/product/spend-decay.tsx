"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/*
 * The half-life of a dollar.
 *
 * Every competitor in this category can draw a spend breakdown, because a provider invoice is
 * the one dataset everybody already has. A bar chart of what you spent per tool is table
 * stakes and says nothing, and a waste chart ("only eighteen cents of every dollar reaches
 * production") is an argument one of them already owns.
 *
 * This page claims something narrower and harder: the return shows up in what the work cost to
 * keep. So the instrument plots the thing an invoice structurally cannot, which is time. Every
 * dollar enters at the left on the day it was billed, and the stack erodes as the work it
 * bought gets rewritten, until what is left at ninety days is what the month actually bought.
 *
 * The playhead is the whole animation, and the chart only exists behind it. The reader watches
 * the money decay rather than arriving at a finished picture, and the figure at the top is
 * whatever is still standing on the day the line is sitting over.
 *
 * It draws, holds on the finished month, then retracts and goes again. An earlier version left
 * the chart standing after the first pass and replayed the line over it, which was wrong in the
 * way that matters: a line crossing a chart that is already drawn is a cursor reading a result,
 * and this line is not reading a result, it is the passage of time that produces one. The
 * retraction is the only part of the cycle that runs backwards and it is over in half a second,
 * so it reads as a tape resetting rather than as a glitch.
 *
 * One requestAnimationFrame writes the clip, the playhead, the two readouts and the five
 * per-tool figures straight to the DOM. A React state update per frame to move a line would be
 * sixty renders a second to change eight numbers, and every one of those numbers is a leaf.
 *
 * Nothing here is drawn by hand. The curves, the retained total, the per-source figures and
 * the finding at the bottom all come out of the same five rows, so the picture cannot end up
 * disagreeing with its own caption.
 *
 * All figures illustrative.
 */

/*
 * `keep` is the share of the work that dollar bought which is still in the codebase at ninety
 * days. The numbers sit either side of two thirds on purpose: the home page already states
 * that 31% of merged work is rewritten within ninety days, and a survival curve that implied
 * 70% was rewritten would contradict it three sections further down the same site.
 */
const SOURCES = [
  { k: "Claude Code", spend: 21480, keep: 0.71, band: "var(--s1)" },
  { k: "Cursor", spend: 12905, keep: 0.62, band: "var(--s2)" },
  { k: "Copilot", spend: 7640, keep: 0.66, band: "var(--s3)" },
  { k: "Agents (API)", spend: 4312, keep: 0.48, band: "var(--s4)" },
  { k: "Everything else", spend: 1877, keep: 0.58, band: "var(--s5)" },
];

const DAYS = 90;
/* how fast the erosion runs; the curve is most of the way down by the first month, which is
   where the rewriting actually happens */
const TAU = 21;

/** what one source is still worth on day t */
const valueAt = (s: (typeof SOURCES)[number], t: number) =>
  s.spend * (s.keep + (1 - s.keep) * Math.exp(-t / TAU));

const totalAt = (t: number) => SOURCES.reduce((sum, s) => sum + valueAt(s, t), 0);

const SPENT = totalAt(0);
const STANDING = totalAt(DAYS);

/* the ends of the range, found rather than asserted */
const WEAKEST = SOURCES.reduce((a, b) => (a.keep <= b.keep ? a : b));
const STRONGEST = SOURCES.reduce((a, b) => (a.keep >= b.keep ? a : b));

const money = (n: number) =>
  "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* --- geometry -------------------------------------------------------------- */

/* The plot is drawn in its own 1000 x 300 space and stretched to whatever width it is given.
   Every mark in it is a filled area, so there is no stroke to go oval and no text to squash;
   all the type lives in HTML on top, where it stays crisp at any size. */
const VW = 1000;
const VH = 300;
const STEPS = 72;

const x = (t: number) => (t / DAYS) * VW;
const y = (v: number) => VH - (v / SPENT) * VH;

/* one filled band, between the running total below it and the running total including it */
function bandPath(index: number) {
  const under = (t: number) =>
    SOURCES.slice(0, index).reduce((sum, s) => sum + valueAt(s, t), 0);
  const over = (t: number) => under(t) + valueAt(SOURCES[index], t);

  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * DAYS;
    top.push(`${x(t).toFixed(2)},${y(over(t)).toFixed(2)}`);
    bottom.push(`${x(t).toFixed(2)},${y(under(t)).toFixed(2)}`);
  }
  bottom.reverse();
  return `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`;
}

const PATHS = SOURCES.map((_, i) => bandPath(i));

/* --- timing ---------------------------------------------------------------- */

const SWEEP_MS = 3000;
const HOLD_MS = 2200;
/* fast, and the only part of the cycle that runs backwards */
const REWIND_MS = 520;
const CYCLE = SWEEP_MS + HOLD_MS + REWIND_MS;

/* slow at both ends, so the playhead settles onto ninety days rather than slamming into it */
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

/*
 * The chart renders drawn, and JavaScript is what hides it again before the playhead sets off.
 * The other way round fails closed: a clip baked into the markup leaves anyone without
 * JavaScript, and every crawler, looking at a card with a blank rectangle in it. Doing it in a
 * layout effect rather than an effect means it happens before the browser paints, so there is
 * no frame where the finished chart flashes up and vanishes.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* --- the instrument -------------------------------------------------------- */

export function SpendDecay({
  /*
   * The footnote is reading material rather than part of the instrument. On the product page
   * it is the payoff; in the home page walkthrough the paragraph above the card already makes
   * the same point, and carrying both pushes the pinned panel past what a 1024x768 laptop can
   * show without clipping.
   */
  note = true,
}: { note?: boolean } = {}) {
  const root = useRef<HTMLDivElement>(null);
  const plot = useRef<SVGSVGElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const day = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);
  const settled = useRef<HTMLDivElement>(null);
  /* one per source, so the legend reads the same day the playhead is sitting on */
  const rows = useRef<(HTMLSpanElement | null)[]>([]);

  useBeforePaint(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (plot.current) plot.current.style.clipPath = "inset(0 100% 0 0)";
    if (settled.current) settled.current.style.opacity = "0";
    if (head.current) head.current.style.opacity = "1";
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = root.current;
    if (!el) return;

    let frame = 0;
    let start = 0;
    /* only written when it changes, so the hold marker is not restyled sixty times a second */
    let holding = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const phase = (now - start) % CYCLE;

      let p: number;
      if (phase < SWEEP_MS) p = ease(phase / SWEEP_MS);
      else if (phase < SWEEP_MS + HOLD_MS) p = 1;
      else p = 1 - (phase - SWEEP_MS - HOLD_MS) / REWIND_MS;

      const t = p * DAYS;

      if (plot.current) {
        plot.current.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
      }
      if (head.current) head.current.style.left = `${(p * 100).toFixed(2)}%`;
      if (day.current) day.current.textContent = `day ${Math.round(t)}`;
      if (live.current) live.current.textContent = money(totalAt(t));
      for (let k = 0; k < SOURCES.length; k++) {
        const cell = rows.current[k];
        if (cell) cell.textContent = money(valueAt(SOURCES[k], t));
      }

      const nowHolding = phase >= SWEEP_MS && phase < SWEEP_MS + HOLD_MS;
      if (nowHolding !== holding) {
        holding = nowHolding;
        if (settled.current) {
          settled.current.style.transition = holding ? "opacity 500ms ease" : "opacity 180ms ease";
          settled.current.style.opacity = holding ? "1" : "0";
        }
      }

      frame = requestAnimationFrame(tick);
    };

    /* Off screen it does nothing. A playhead nobody can see is still a layout read and a paint
       every frame for as long as the page is open. */
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !frame) {
          start = 0;
          frame = requestAnimationFrame(tick);
        } else if (!e.isIntersecting && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.01 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={root}
      className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift sm:p-7"
    >
      {/* what you were billed, and what is left of it */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-4">
            Billed in July
          </p>
          <p className="tabular mt-1 text-[1.6rem] font-extrabold tracking-tight text-ink">
            {money(SPENT)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-4">
            <span ref={day}>day {DAYS}</span> &middot; still standing
          </p>
          <p
            className="tabular mt-1 text-[1.6rem] font-extrabold tracking-tight"
            style={{ color: "var(--t3)" }}
          >
            <span ref={live}>{money(STANDING)}</span>
          </p>
        </div>
      </div>

      {/* the plot */}
      {/*
        The whole rectangle is the month's bill. Tinting it means the part the bands do not
        cover reads as money that stopped existing, rather than as page background: without it
        the chart is a shape on paper and the argument has to be carried entirely by the two
        figures above.
      */}
      <div
        className="relative mt-6 h-[190px] w-full overflow-hidden rounded-md sm:h-[225px]"
        style={{ background: "color-mix(in srgb, var(--s5) 5%, transparent)" }}
      >
        <svg
          ref={plot}
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {PATHS.map((d, i) => (
            <path key={SOURCES[i].k} d={d} fill={SOURCES[i].band} opacity="0.9" />
          ))}
        </svg>

        <span className="pointer-events-none absolute right-3 top-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-4">
          rewritten or abandoned
        </span>

        {/* Where the erosion stops. Sits above the plot in HTML so the rule stays one pixel and
            the label stays readable however wide the card is drawn. */}
        <div
          ref={settled}
          className="pointer-events-none absolute inset-x-0"
          style={{ top: `${(1 - STANDING / SPENT) * 100}%` }}
        >
          {/* above the rule rather than beside it: at ninety days the space to the right of
              this line is the inside of the chart, and a label there sits on the bands it is
              supposed to be measuring */}
          <span className="absolute bottom-1 right-3 font-mono text-[10px] text-ink-3">
            {money(STANDING)} still standing
          </span>
          <span
            className="block h-px w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--ink-4) 0 5px, transparent 5px 10px)",
            }}
          />
        </div>

        {/* the playhead */}
        <div
          ref={head}
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{ left: "0%", background: "var(--ink-3)", opacity: 0 }}
        >
          <span
            className="absolute -top-1 h-1.5 w-1.5 -translate-x-[3px] rounded-full"
            style={{ background: "var(--ink-3)" }}
          />
        </div>
      </div>

      {/* the axis, in days rather than dates: the claim is about elapsed time, not a calendar */}
      <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-ink-4">
        {[0, 30, 60, DAYS].map((d) => (
          <span key={d}>{d === 0 ? "billed" : `${d}d`}</span>
        ))}
      </div>

      <ul className="mt-6 grid gap-x-7 gap-y-2.5 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-3">
        {SOURCES.map((s, k) => (
          <li key={s.k} className="flex items-center gap-2.5 text-[12.5px]">
            <span
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ background: s.band }}
            />
            <span className="min-w-0 flex-1 truncate text-ink-2">{s.k}</span>
            <span className="tabular shrink-0 font-mono text-[11px] text-ink-4">
              {money(s.spend)}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-ink-4">&#8594;</span>
            {/* The billed figure is fixed; this one is whatever is left of it on the day the
                playhead is over, so the legend and the chart never disagree about the date. */}
            <span
              ref={(el) => {
                rows.current[k] = el;
              }}
              className="tabular w-[54px] shrink-0 text-right font-mono text-[11px]"
              style={{ color: "var(--t3)" }}
            >
              {money(valueAt(s, DAYS))}
            </span>
          </li>
        ))}
      </ul>

      {note && (
        <p className="mt-5 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
          {WEAKEST.k} is the least durable line on the invoice:{" "}
          {Math.round(WEAKEST.keep * 100)}% of what it bought is still there at ninety days,
          against {Math.round(STRONGEST.keep * 100)}% for {STRONGEST.k}. No invoice contains
          that column.
        </p>
      )}
    </div>
  );
}
