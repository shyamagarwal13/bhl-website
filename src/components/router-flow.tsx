"use client";

import { useEffect, useRef, useState } from "react";
import { Logomark } from "./brand";

/*
 * The router, shown working.
 *
 * Four attempts to get here. A prism, two scrolling lists, one large terminal window, and a
 * stack of six flat rows. The large window was the shape the reference used and was also the
 * wrong picture, because a router does not sit behind one session. The flat rows fixed that
 * but stopped looking like sessions at all: strip the chrome off a terminal and what is left
 * is a list item.
 *
 * So the panes are real windows again, just small: a title bar with its own traffic lights and
 * working directory, a body with a prompt line and one line of output. And rather than six of
 * them sitting still, the column is a queue that advances. Work arrives from the bottom, takes
 * its turn at the middle, and leaves through the top, which is what a request queue actually
 * does and what six static cards could never say.
 *
 * The geometry that makes this cheap: the panes move but the fan does not. A pane always comes
 * to rest on one of five fixed positions, so the five lines converging on the mark are static
 * and the live one is always the flat middle one. Only the outgoing line moves, and it moves
 * because the model changed.
 *
 * The queue advances on a timer and the track is transitioned per step rather than run as a
 * CSS animation, so the highlight can never drift out of phase with the pane under it. The
 * list is rendered twice and the track snaps back at the wrap, where the two copies are
 * identical and the jump is invisible.
 *
 * All figures illustrative.
 */

const MODELS = [
  { name: "Haiku", sub: "4.5", q: 71, cost: "$0.80" },
  { name: "GLM-5.2", sub: "Z.ai", q: 76, cost: "$4.40" },
  { name: "Gemini", sub: "3.1 Pro", q: 83, cost: "$12" },
  { name: "Sonnet", sub: "4.6", q: 89, cost: "$15" },
  { name: "GPT-5.5", sub: "Codex", q: 92, cost: "$30" },
  { name: "Opus", sub: "4.8", q: 96, cost: "$75" },
];

/*
 * `need` is the bar the *task* sets, not the model. An earlier version carried a hand-written
 * model index per session and promptly drew a request routed to a model scoring below the bar
 * printed beside it: the picture contradicted its own caption. Deriving the route means the
 * diagram cannot disagree with the numbers on it, whatever anyone edits later.
 *
 * Spread deliberately across the board. The cheap end does most of the work and the expensive
 * end earns its place occasionally, which is the entire argument.
 */
const SESSIONS = [
  { cwd: "~/acme/web", cmd: "Rename the billing props", out: "4 files changed, 61 lines", need: 68 },
  { cwd: "~/acme/ledger", cmd: "Why is the payments test flaky?", out: "bisected 9 runs, found it", need: 70 },
  { cwd: "~/acme/platform", cmd: "Design the caching layer", out: "write-through, 90s TTL", need: 94 },
  { cwd: "~/acme/web", cmd: "Add a /changelog page from MDX", out: "2 routes, RSS 2.0", need: 74 },
  { cwd: "~/acme/api", cmd: "Write the migration for orders", out: "reversible, 1 new index", need: 81 },
  { cwd: "~/acme/infra", cmd: "Bump the Terraform providers", out: "no plan diff", need: 66 },
  { cwd: "~/acme/auth", cmd: "Refactor the session module", out: "11 call sites updated", need: 87 },
  { cwd: "~/acme/web", cmd: "Add tests for the cart reducer", out: "18 cases, 3 edge", need: 72 },
  { cwd: "~/acme/search", cmd: "Explain why recall dropped", out: "analyzer change, week 31", need: 90 },
];

/* the cheapest model that clears the bar, which is the whole of the routing policy */
const routeFor = (need: number) => {
  const i = MODELS.findIndex((m) => m.q >= need);
  return i === -1 ? MODELS.length - 1 : i;
};

const M_CARD = 60;
const M_GAP = 10;
const BOARD = MODELS.length * M_CARD + (MODELS.length - 1) * M_GAP; // 422

const PANE = 76;
const PANE_GAP = 12;
const PITCH = PANE + PANE_GAP; // 88
const MID = BOARD / 2; // 211
/* what the track is offset by so that pane `step` lands on the middle line */
const REST = MID - PANE / 2;

const FAN_W = 168;
const HUB = 26;
const CYCLE = 3200;
const SLIDE = 820;
/* Start two in, so the queue opens with work already above the middle. Starting at zero leaves
   the top half of the column empty, which reads as a bug rather than as the head of a queue. */
const FIRST = 2;
const WRAP = SESSIONS.length + FIRST;
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

/* the five rest positions a pane can occupy, which is why the incoming fan never has to move */
const STOPS = [-2, -1, 0, 1, 2]
  .map((j) => MID + j * PITCH)
  .filter((y) => y > 0 && y < BOARD);

const modelY = (i: number) => i * (M_CARD + M_GAP) + M_CARD / 2;

const wireIn = (y: number) =>
  `M 0 ${y} C ${FAN_W * 0.45} ${y}, ${FAN_W * 0.3} ${MID}, ${FAN_W / 2 - HUB} ${MID}`;
const wireOut = (y: number) =>
  `M ${FAN_W / 2 + HUB} ${MID} C ${FAN_W * 0.7} ${MID}, ${FAN_W * 0.55} ${y}, ${FAN_W} ${y}`;

/* --- one session window --------------------------------------------------- */

function Pane({ s, on }: { s: (typeof SESSIONS)[number]; on: boolean }) {
  return (
    <div
      className="overflow-hidden rounded-lg border bg-white"
      style={{
        height: PANE,
        borderColor: on ? "var(--s5)" : "var(--line)",
        boxShadow: on ? "0 16px 34px -20px rgba(18,23,26,0.34)" : "none",
        transition: `border-color 520ms ${EASE}, box-shadow 520ms ${EASE}`,
      }}
    >
      {/* title bar */}
      <div
        className="flex h-[23px] items-center gap-2.5 border-b px-3"
        style={{
          borderColor: on ? "color-mix(in srgb, var(--s5) 22%, transparent)" : "var(--line)",
          background: on
            ? "color-mix(in srgb, var(--s5) 5%, #fff)"
            : "color-mix(in srgb, var(--paper) 62%, #fff)",
          transition: `background 520ms ${EASE}, border-color 520ms ${EASE}`,
        }}
      >
        {/* Traffic lights in the patina palette rather than the usual red, amber, green. Three
            saturated macOS dots would be the only pure hues on the page. */}
        <span className="flex shrink-0 gap-[5px]">
          {[
            on ? "var(--s5)" : "var(--line-2)",
            on ? "var(--s4)" : "var(--line-2)",
            on ? "var(--s3)" : "var(--line-2)",
          ].map((c, i) => (
            <span
              key={i}
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: c, transition: `background 520ms ${EASE}` }}
            />
          ))}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[9.5px] text-ink-4">{s.cwd}</span>
        {/* The bar this task sets, printed so the routing can be checked: the lit line lands on
            the first model to the right that clears this number, and never on one that does not. */}
        <span className="shrink-0 font-mono text-[9.5px] text-ink-4">
          bar{" "}
          <span
            className="tabular font-medium"
            style={{ color: on ? "var(--s5)" : "var(--ink-3)", transition: `color 520ms ${EASE}` }}
          >
            {s.need}
          </span>
        </span>
      </div>

      {/* body */}
      <div className="flex h-[52px] flex-col justify-center gap-1 px-3">
        <p className="truncate font-mono text-[11.5px]">
          <span style={{ color: on ? "var(--s5)" : "var(--ink-4)" }}>&#10095;</span>{" "}
          <span style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}>{s.cmd}</span>
          {on && (
            <span
              aria-hidden="true"
              className="ml-[3px] inline-block h-[11px] w-[6px] translate-y-[1px] align-baseline"
              style={{ background: "var(--ink)", animation: "caret-blink 1.06s steps(1) infinite" }}
            />
          )}
        </p>
        <p className="truncate font-mono text-[10px] text-ink-4">{s.out}</p>
      </div>
    </div>
  );
}

/* --- the instrument ------------------------------------------------------- */

export function RouterFlow() {
  const [step, setStep] = useState(FIRST);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);
  /* set for one frame at the wrap, to move the track back without animating it */
  const [snap, setSnap] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    setLive(true);
    const t = window.setTimeout(() => setOpen(true), 200);
    const id = window.setInterval(() => setStep((s) => s + 1), CYCLE);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  /*
   * The wrap. At `WRAP` the centred pane is the second copy of the one that was centred at the
   * start, and so are its neighbours above and below, so once the slide has finished the track
   * can be put back with transitions off and nothing visible happens.
   *
   * The frame that clears `snap` is held in a ref rather than cancelled by this effect's
   * cleanup. Setting the step re-runs the effect, and a cleanup that cancelled the frame would
   * cancel the one it had just scheduled, leaving the track stuck with transitions off.
   */
  useEffect(() => {
    if (step !== WRAP) return;
    const t = window.setTimeout(() => {
      setSnap(true);
      setStep(FIRST);
      raf.current = window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => setSnap(false)),
      );
    }, SLIDE + 60);
    return () => clearTimeout(t);
  }, [step]);

  const active = step % SESSIONS.length;
  const session = SESSIONS[active];
  const routed = routeFor(session.need);
  const e = open ? 1 : 0;

  const track = [...SESSIONS, ...SESSIONS];

  return (
    /* Capped and centred rather than run to the full measure. The session lines are short, and
       across a 950px column the panes read as empty bars with a word in them. */
    <div className="mx-auto max-w-[980px] select-none">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_168px_286px] lg:gap-0">
        {/* --- the queue ---------------------------------------------------------------- */}
        <div
          className="relative overflow-hidden"
          style={{
            height: BOARD,
            opacity: e,
            transform: `translateX(${(1 - e) * -26}px)`,
            transition: `opacity 700ms ${EASE} 80ms, transform 800ms ${EASE} 80ms`,
            /* Panes dissolve at the ends rather than being clipped in half. A hard edge makes
               the column read as a scrollbox with content cut off; a soft one makes it read as
               work passing through. */
            maskImage:
              "linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 flex flex-col"
            style={{
              gap: PANE_GAP,
              paddingTop: REST,
              transform: `translateY(${-step * PITCH}px)`,
              transition: live && !snap ? `transform ${SLIDE}ms ${EASE}` : "none",
            }}
          >
            {track.map((s, i) => {
              const on = i === step;
              return (
                <div
                  key={i}
                  style={{
                    /* everything that is not taking its turn steps back */
                    opacity: on ? 1 : 0.4,
                    transform: `scale(${on ? 1 : 0.975})`,
                    transition: live ? `opacity 520ms ${EASE}, transform 520ms ${EASE}` : "none",
                  }}
                >
                  <Pane s={s} on={on} />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- the fan, and the mark at its throat -------------------------------------- */}
        <div className="relative hidden lg:block" style={{ height: BOARD }}>
          <svg
            width={FAN_W}
            height={BOARD}
            viewBox={`0 0 ${FAN_W} ${BOARD}`}
            className="absolute inset-0"
            aria-hidden="true"
            style={{ opacity: e, transition: `opacity 600ms ${EASE} 380ms` }}
          >
            {STOPS.map((y) => (
              <path
                key={`in-${y}`}
                d={wireIn(y)}
                fill="none"
                stroke="var(--line-2)"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            {MODELS.map((m, i) => (
              <path
                key={`out-${m.name}`}
                d={wireOut(modelY(i))}
                fill="none"
                stroke="var(--line-2)"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}

            {/* The live path. The incoming half never moves, because the pane always comes to
                the middle; the outgoing half moves whenever the bar picks a different model. */}
            <path d={wireIn(MID)} fill="none" stroke="var(--s5)" strokeWidth="1.7" />
            <path
              d={wireOut(modelY(routed))}
              fill="none"
              stroke="var(--s5)"
              strokeWidth="1.7"
              style={{ transition: live ? `d 640ms ${EASE} 140ms` : "none" }}
            />
          </svg>

          <div
            className="absolute z-10"
            style={{
              left: FAN_W / 2 - HUB,
              top: MID - HUB,
              width: HUB * 2,
              height: HUB * 2,
              opacity: e,
              transform: `scale(${e ? 1 : 0.8})`,
              transition: `opacity 560ms ${EASE} 260ms, transform 680ms ${EASE} 260ms`,
            }}
          >
            {/* Keyed on the session rather than the step, so the ring does not fire a second
                time when the track snaps back onto the same pane at the wrap. */}
            <span
              key={active}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--s5)",
                animation: live ? "hub-ring 3.2s ease-out" : "none",
              }}
            />
            <span className="relative flex h-full w-full items-center justify-center rounded-full border border-line bg-white lift">
              <Logomark size={13} />
            </span>
          </div>
        </div>

        {/* --- the model board ---------------------------------------------------------- */}
        <div
          className="flex flex-col"
          style={{
            gap: M_GAP,
            opacity: e,
            transform: `translateX(${(1 - e) * 26}px)`,
            transition: `opacity 700ms ${EASE} 200ms, transform 800ms ${EASE} 200ms`,
          }}
        >
          {MODELS.map((m, i) => {
            const on = i === routed;
            return (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-lg border px-3.5"
                style={{
                  height: M_CARD,
                  borderColor: on ? "var(--s5)" : "var(--line)",
                  background: on ? "color-mix(in srgb, var(--s5) 7%, #fff)" : "var(--white)",
                  transition: live
                    ? `border-color 560ms ${EASE}, background 560ms ${EASE}`
                    : "none",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13px] font-semibold"
                    style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
                  >
                    {m.name}
                  </p>
                  <p className="truncate font-mono text-[10px] text-ink-4">{m.sub}</p>
                </div>
                {/* the other half of the comparison the route is decided by */}
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-4">
                    scores
                  </span>
                  <span
                    className="tabular block font-mono text-[12px]"
                    style={{ color: on ? "var(--t3)" : "var(--ink-4)" }}
                  >
                    {m.q}
                  </span>
                </span>
                <span
                  className="tabular w-12 shrink-0 text-right font-mono text-[11.5px]"
                  style={{ color: on ? "var(--ink-2)" : "var(--ink-4)" }}
                >
                  {m.cost}
                </span>
                <span
                  className="w-[42px] shrink-0 pl-1 text-right font-mono text-[8.5px] uppercase tracking-[0.14em]"
                  style={{
                    color: "var(--s5)",
                    opacity: on ? 1 : 0,
                    transition: `opacity 460ms ${EASE}`,
                  }}
                >
                  routed
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
