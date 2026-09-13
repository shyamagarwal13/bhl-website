"use client";

import { useEffect, useRef, useState } from "react";
import { Logomark } from "./brand";

/*
 * The router, shown working.
 *
 * Replaces a static prism diagram that asserted "one beam in, a spectrum out" without ever
 * showing a decision being made. The competitors both solve this the same way — a stream of
 * work on one side, a hub, a choice on the other — and that shape is right because it is what
 * a router literally is. What makes this one ours is the middle column: the decision is not
 * "which model is best", it is "which is the cheapest one that still clears your bar", so the
 * bar is drawn and the models below it are visibly out of the running.
 *
 * Every three and a bit seconds one request is picked up, carried through the mark, and lands
 * on a model. The lists move so the live row is always on the centre line, which keeps the
 * wire geometry fixed and lets the travelling packet be a single element instead of a path
 * recalculated per frame.
 *
 * All figures illustrative.
 */

/*
 * The bar belongs to the request, not to the router. A rename does not need a frontier model
 * and a caching layer does, so each task carries the quality it actually has to clear — which
 * is the thing that makes this routing rather than a cost cap.
 *
 * An earlier version fixed one bar for the whole board and hardcoded the routes, and promptly
 * sent a request to a model scoring 83 against a bar of 84. The route is now derived, so the
 * animation cannot contradict the claim it exists to make.
 */
const TASKS: { t: string; need: number }[] = [
  { t: "rename a variable", need: 64 },
  { t: "summarise this pull request", need: 68 },
  { t: "add a regression test", need: 74 },
  { t: "explain this stack trace", need: 80 },
  { t: "write the migration", need: 83 },
  { t: "refactor the auth module", need: 87 },
  { t: "debug a flaky integration test", need: 90 },
  { t: "design the caching layer", need: 93 },
];

const MODELS = [
  { name: "Haiku 4.5", q: 71, cost: "$0.80" },
  { name: "GLM-5.2", q: 76, cost: "$4.40" },
  { name: "Gemini 3.1", q: 83, cost: "$12" },
  { name: "Sonnet 4.6", q: 89, cost: "$15" },
  { name: "GPT-5.5", q: 92, cost: "$30" },
  { name: "Opus 4.8", q: 96, cost: "$75" },
];

/* MODELS are ordered by cost ascending, so the cheapest model clearing a bar is simply the
   first one that reaches it. */
const routeFor = (need: number) => {
  const i = MODELS.findIndex((m) => m.q >= need);
  return i === -1 ? MODELS.length - 1 : i;
};

const ROW = 34; // px per row, fixed so the centre line is exact
const CYCLE = 3400;

export function RouterFlow() {
  const [step, setStep] = useState(1);
  const [live, setLive] = useState(false);
  /*
   * The instrument arrives as the mark alone and opens: the columns pull out from behind it
   * and the frame resolves around them.
   *
   * Timed on mount rather than linked to scroll. Scroll-linking is the better technique when
   * the thing sits down the page — the reader does the opening — but this one lives in the
   * hero, above the fold, where there is no scroll to link to. Measured that directly: at
   * scroll position zero the scroll-driven version was already fully open, which is a
   * beautiful effect nobody would ever see.
   */
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    setLive(true);
    const t = window.setTimeout(() => setOpen(true), 260);
    const id = window.setInterval(() => setStep((s) => (s + 1) % TASKS.length), CYCLE);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const e = open ? 1 : 0;
  const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  const task = TASKS[step];
  const model = routeFor(task.need);

  return (
    <div
      ref={box}
      className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur-sm"
      style={{
        borderColor: `color-mix(in srgb, var(--line) ${e * 100}%, transparent)`,
        boxShadow: `0 ${2 * e}px ${6 * e}px rgba(18,23,26,${0.05 * e}), 0 ${28 * e}px ${64 * e}px -20px rgba(18,23,26,${0.2 * e})`,
        transition: `border-color 700ms ${EASE} 220ms, box-shadow 700ms ${EASE} 220ms`,
      }}
    >
      <div
        className="flex items-baseline justify-between gap-4 border-b px-5 py-3"
        style={{
          borderColor: `color-mix(in srgb, var(--line) ${e * 100}%, transparent)`,
          opacity: e,
          transition: `opacity 600ms ${EASE} 320ms, border-color 600ms ${EASE} 320ms`,
        }}
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-4">
          Routing, live
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-4">
          Needs {task.need}
        </span>
      </div>

      <div className="relative grid h-[248px] grid-cols-[minmax(0,1fr)_86px_minmax(0,1.05fr)] items-center overflow-hidden">
        {/* --- incoming requests ------------------------------------------------------ */}
        <div
          className="relative h-full overflow-hidden"
          style={{ opacity: e, transform: `translateX(${(1 - e) * 52}px)`, transition: `opacity 720ms ${EASE} 120ms, transform 820ms ${EASE} 120ms` }}
        >
          <div
            className="absolute left-0 right-0 flex flex-col"
            style={{
              top: `calc(50% - ${ROW / 2}px)`,
              transform: `translateY(${-step * ROW}px)`,
              transition: live ? "transform 620ms cubic-bezier(0.22,0.61,0.36,1)" : "none",
            }}
          >
            {TASKS.map((x, i) => (
              <div
                key={x.t}
                className="flex items-center justify-end gap-3 pr-4 text-right"
                style={{ height: ROW }}
              >
                <span
                  className="truncate text-[12.5px] transition-colors duration-300"
                  style={{ color: i === step ? "var(--ink)" : "var(--ink-4)", opacity: i === step ? 1 : 0.45 }}
                >
                  {x.t}
                </span>
                <span
                  className="tabular shrink-0 font-mono text-[10px] transition-opacity duration-300"
                  style={{ color: "var(--ink-4)", opacity: i === step ? 0.9 : 0.3 }}
                >
                  {x.need}
                </span>
              </div>
            ))}
          </div>
          {/* fade the ends so the column reads as a stream rather than a list with edges */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
        </div>

        {/* --- the mark -------------------------------------------------------------- */}
        <div
          className="relative z-10 flex h-full items-center justify-center"
          style={{ transform: `scale(${1 + (1 - e) * 0.85})`, transition: `transform 900ms ${EASE}` }}
        >
          <span
            key={step}
            className="absolute h-[62px] w-[62px] rounded-full border"
            style={{ borderColor: "var(--s5)", animation: live ? "hub-ring 3.4s ease-out" : "none" }}
          />
          <span className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line bg-white">
            <Logomark size={13} />
          </span>
        </div>

        {/* --- the models ------------------------------------------------------------ */}
        <div
          className="relative h-full overflow-hidden"
          style={{ opacity: e, transform: `translateX(${(1 - e) * -52}px)`, transition: `opacity 720ms ${EASE} 200ms, transform 820ms ${EASE} 200ms` }}
        >
          <div
            className="absolute left-0 right-0 flex flex-col"
            style={{
              top: `calc(50% - ${ROW / 2}px)`,
              transform: `translateY(${-model * ROW}px)`,
              transition: live ? "transform 620ms cubic-bezier(0.22,0.61,0.36,1) 240ms" : "none",
            }}
          >
            {MODELS.map((m, i) => {
              const eligible = m.q >= task.need;
              const chosen = i === model;
              return (
                <div key={m.name} className="flex items-center gap-2.5 pl-4" style={{ height: ROW }}>
                  <span
                    className="w-[74px] shrink-0 truncate text-[12.5px] transition-colors duration-300"
                    style={{ color: chosen ? "var(--ink)" : "var(--ink-4)", opacity: chosen ? 1 : 0.45 }}
                  >
                    {m.name}
                  </span>
                  {/* the quality reading, and whether it clears the bar */}
                  <span
                    className="tabular w-7 shrink-0 text-right font-mono text-[11px]"
                    style={{ color: eligible ? "var(--t3)" : "var(--ink-4)", opacity: chosen ? 1 : 0.5 }}
                  >
                    {m.q}
                  </span>
                  <span
                    className="tabular w-10 shrink-0 text-right font-mono text-[11px] text-ink-4"
                    style={{ opacity: chosen ? 1 : 0.45 }}
                  >
                    {m.cost}
                  </span>
                  {chosen && (
                    <span
                      className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--s5)" }}
                    >
                      routed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
        </div>

        {/* --- the wire -------------------------------------------------------------- */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: e, transition: `opacity 500ms ${EASE} 620ms` }}
          viewBox="0 0 600 248"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            id="wire-in"
            d="M 196 124 C 232 124, 240 124, 258 124"
            fill="none"
            stroke="var(--s5)"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <path
            d="M 342 124 C 360 124, 368 124, 404 124"
            fill="none"
            stroke="var(--s5)"
            strokeWidth="1.2"
            opacity="0.5"
          />
          {live && (
            <>
              <circle r="3" fill="var(--s5)">
                <animate
                  attributeName="cx"
                  values="196;258"
                  dur="0.7s"
                  begin="0s;flow.end+2.7s"
                  id="flow"
                  fill="freeze"
                />
                <animate attributeName="cy" values="124;124" dur="0.7s" begin="0s;flow.end+2.7s" />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="0.7s"
                  begin="0s;flow.end+2.7s"
                />
              </circle>
              <circle r="3" fill="var(--s5)">
                <animate
                  attributeName="cx"
                  values="342;404"
                  dur="0.7s"
                  begin="flow.end;flow.end+3.4s"
                  fill="freeze"
                />
                <animate attributeName="cy" values="124;124" dur="0.7s" begin="flow.end;flow.end+3.4s" />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="0.7s"
                  begin="flow.end;flow.end+3.4s"
                />
              </circle>
            </>
          )}
        </svg>
      </div>

      <p
        className="border-t px-5 py-3 text-[11.5px] leading-relaxed text-ink-4"
        style={{
          borderColor: `color-mix(in srgb, var(--line) ${e * 100}%, transparent)`,
          opacity: e,
          transition: `opacity 600ms ${EASE} 400ms, border-color 600ms ${EASE} 400ms`,
        }}
      >
        Each request carries the quality it has to clear. The router sends it to the cheapest
        model that clears it — which is almost never the expensive one.
      </p>
    </div>
  );
}
