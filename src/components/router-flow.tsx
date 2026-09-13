"use client";

import { useEffect, useState } from "react";
import { Logomark } from "./brand";

/*
 * The router, shown working.
 *
 * The first attempt was crammed into a hero side-column about 480px wide, inside a bordered
 * card, with 12px grey type and a 90px wire. It read as a cramped widget because it was one.
 * Both of the sites worth measuring against give this moment the full width of the page and a
 * great deal of air, and that is not decoration: a routing diagram is a journey, and a journey
 * needs distance before it is legible.
 *
 * So — no card, no border, full bleed. The lists sit near the thirds, the mark sits in the
 * middle with real space around it, and the wire sweeps the gap rather than poking through it.
 *
 * The geometry is the part worth explaining. The mark sits deliberately *above* the live row,
 * so each wire rises from the request into the hub and falls from the hub onto the model. Two
 * arcs meeting at a peak read as a route being taken; a straight horizontal line between two
 * rows at the same height reads as a rule.
 *
 * All figures illustrative.
 */

/*
 * The bar belongs to the request, not the router. A rename does not need a frontier model and
 * a caching layer does, so each task carries the quality it has to clear — the thing that makes
 * this routing rather than a spend cap.
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

/* MODELS run cheapest-first, so the cheapest model clearing a bar is simply the first that
   reaches it. Derived rather than authored: a hardcoded version routed a request to a model
   scoring 83 against a bar of 84, which is the one mistake this diagram cannot afford. */
const routeFor = (need: number) => {
  const i = MODELS.findIndex((m) => m.q >= need);
  return i === -1 ? MODELS.length - 1 : i;
};

const ROW = 46;
const CYCLE = 3600;
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

const IN_PATH = "M 300 168 C 424 168, 432 106, 506 106";
const OUT_PATH = "M 594 106 C 668 106, 676 168, 800 168";

/* Rows fade towards the top and bottom with a mask rather than stacked gradient overlays,
   which is what made the earlier version look muddy at its edges. */
const FADE = {
  WebkitMaskImage: "linear-gradient(180deg, transparent, #000 24%, #000 76%, transparent)",
  maskImage: "linear-gradient(180deg, transparent, #000 24%, #000 76%, transparent)",
} as const;

export function RouterFlow() {
  const [step, setStep] = useState(3);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    setLive(true);
    const t = window.setTimeout(() => setOpen(true), 220);
    const id = window.setInterval(() => setStep((s) => (s + 1) % TASKS.length), CYCLE);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const task = TASKS[step];
  const model = routeFor(task.need);
  const e = open ? 1 : 0;

  return (
    <div className="relative select-none">
      {/* Three columns need width. At 390px the task names were truncating to a single
          letter, so below sm the composition stacks instead: the live request, the mark, the
          model it landed on. Same idea, one column, nothing clipped. */}
      <div className="mx-auto hidden max-w-[1100px] grid-cols-[minmax(0,1fr)_190px_minmax(0,1fr)] items-center sm:grid sm:grid-cols-[minmax(0,1fr)_290px_minmax(0,1fr)]">
        {/* --- requests coming in ------------------------------------------------------ */}
        <div
          className="relative h-[322px] overflow-hidden"
          style={{
            ...FADE,
            opacity: e,
            transform: `translateX(${(1 - e) * 46}px)`,
            transition: `opacity 760ms ${EASE} 120ms, transform 860ms ${EASE} 120ms`,
          }}
        >
          <div
            className="absolute inset-x-0 flex flex-col"
            style={{
              top: `calc(50% - ${ROW / 2}px)`,
              transform: `translateY(${-step * ROW}px)`,
              transition: live ? `transform 820ms ${EASE}` : "none",
            }}
          >
            {TASKS.map((x, i) => {
              const on = i === step;
              return (
                <div
                  key={x.t}
                  className="flex items-center justify-end gap-4 pr-7"
                  style={{ height: ROW }}
                >
                  <span
                    className="truncate text-[15px] transition-all duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-3)", opacity: on ? 1 : 0.28 }}
                  >
                    {x.t}
                  </span>
                  <span
                    className="tabular shrink-0 font-mono text-[11px] transition-opacity duration-500"
                    style={{ color: on ? "var(--s5)" : "var(--ink-4)", opacity: on ? 1 : 0.22 }}
                  >
                    {x.need}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- the mark, sitting above the live row so the wires arc into it ------------ */}
        <div className="relative h-[322px]">
          <div
            className="absolute left-1/2 h-[78px] w-[78px]"
            style={{
              top: 67,
              transform: `translateX(-50%) scale(${1 + (1 - e) * 0.7})`,
              transition: `transform 920ms ${EASE}`,
            }}
          >
            <span
              key={step}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--s5)",
                animation: live ? "hub-ring 3.6s ease-out" : "none",
              }}
            />
            <span className="relative flex h-full w-full items-center justify-center rounded-full border border-line bg-white lift">
              <Logomark size={19} />
            </span>
          </div>
        </div>

        {/* --- the models -------------------------------------------------------------- */}
        <div
          className="relative h-[322px] overflow-hidden"
          style={{
            ...FADE,
            opacity: e,
            transform: `translateX(${(1 - e) * -46}px)`,
            transition: `opacity 760ms ${EASE} 200ms, transform 860ms ${EASE} 200ms`,
          }}
        >
          <div
            className="absolute inset-x-0 flex flex-col"
            style={{
              top: `calc(50% - ${ROW / 2}px)`,
              transform: `translateY(${-model * ROW}px)`,
              transition: live ? `transform 820ms ${EASE} 260ms` : "none",
            }}
          >
            {MODELS.map((m, i) => {
              const on = i === model;
              const clears = m.q >= task.need;
              return (
                <div key={m.name} className="flex items-center gap-4 pl-7" style={{ height: ROW }}>
                  <span
                    className="w-[92px] shrink-0 truncate text-[15px] transition-all duration-500"
                    style={{ color: on ? "var(--ink)" : "var(--ink-3)", opacity: on ? 1 : 0.28 }}
                  >
                    {m.name}
                  </span>
                  <span
                    className="tabular w-7 shrink-0 text-right font-mono text-[12px] transition-all duration-500"
                    style={{
                      color: clears ? "var(--t3)" : "var(--ink-4)",
                      opacity: on ? 1 : clears ? 0.32 : 0.2,
                    }}
                  >
                    {m.q}
                  </span>
                  <span
                    className="tabular w-11 shrink-0 text-right font-mono text-[12px] transition-opacity duration-500"
                    style={{ color: "var(--ink-3)", opacity: on ? 0.85 : 0.22 }}
                  >
                    {m.cost}
                  </span>
                  <span
                    className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] transition-opacity duration-500"
                    style={{ color: "var(--s5)", opacity: on ? 1 : 0 }}
                  >
                    routed
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- the same routing, stacked, for narrow screens --------------------------- */}
      <div className="sm:hidden" style={{ opacity: e, transition: `opacity 700ms ${EASE} 120ms` }}>
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <span className="min-w-0 flex-1 truncate text-[15px] text-ink">{task.t}</span>
          <span className="tabular shrink-0 font-mono text-[11px]" style={{ color: "var(--s5)" }}>
            needs {task.need}
          </span>
        </div>

        <div className="flex justify-center py-6">
          <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border border-line bg-white lift">
            <span
              key={step}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--s5)",
                animation: live ? "hub-ring 3.6s ease-out" : "none",
              }}
            />
            <Logomark size={15} />
          </span>
        </div>

        <div className="flex items-baseline gap-3 border-t border-line pt-4">
          <span className="min-w-0 flex-1 truncate text-[15px] text-ink">
            {MODELS[model].name}
          </span>
          <span className="tabular shrink-0 font-mono text-[12px]" style={{ color: "var(--t3)" }}>
            {MODELS[model].q}
          </span>
          <span className="tabular shrink-0 font-mono text-[12px] text-ink-3">
            {MODELS[model].cost}
          </span>
          <span
            className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: "var(--s5)" }}
          >
            routed
          </span>
        </div>
      </div>

      {/* --- the wire, drawn over the whole composition so it can sweep ---------------- */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
        viewBox="0 0 1100 322"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ opacity: e, transition: `opacity 620ms ${EASE} 540ms` }}
      >
        <path d={IN_PATH} fill="none" stroke="var(--s5)" strokeWidth="1.3" opacity="0.6" />
        <path d={OUT_PATH} fill="none" stroke="var(--s5)" strokeWidth="1.3" opacity="0.6" />
        {live && (
          <>
            <circle r="3.4" fill="var(--s5)" opacity="0">
              <animateMotion dur="0.85s" begin="0s;go.end+2.75s" id="go" path={IN_PATH} />
              <animate attributeName="opacity" values="0;1;1;0" dur="0.85s" begin="0s;go.end+2.75s" />
            </circle>
            <circle r="3.4" fill="var(--s5)" opacity="0">
              <animateMotion dur="0.85s" begin="go.end;go.end+3.6s" path={OUT_PATH} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="0.85s"
                begin="go.end;go.end+3.6s"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
