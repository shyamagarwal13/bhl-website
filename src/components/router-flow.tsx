"use client";

import { useEffect, useRef, useState } from "react";
import { Logomark } from "./brand";
import { MODELS, SESSIONS, routeFor, type Session } from "./router-data";

/*
 * The router, shown working.
 *
 * The panes are small terminal windows, and the column is a reel rather than a list. Each
 * cycle it spins several sessions past, decelerates onto one, and then the route is drawn:
 * a line out of the settled pane to the throat in front of the mark, and a second line out
 * the other side to whichever model the task's quality bar picked. A packet runs the length
 * of it, so the claim arrives as something moving rather than as two lit wires.
 *
 * The spin is the point. A queue that advances one step at a time says "there is a next
 * item"; a reel that riffles through several and stops says "there are many of these and the
 * router is choosing", which is the actual claim.
 *
 * Nothing touches the mark. Every line stops at a throat eleven pixels short of the ring
 * around it, so the convergence reads as a point in space that the work passes through. A
 * line that runs into the logo makes the logo look like a node in a diagram.
 *
 * The geometry that keeps this cheap: the panes move but the fan does not. A pane always
 * comes to rest on one of five fixed positions, so the incoming lines are static and the live
 * one is always the flat middle. Only the outgoing line moves, and only because the model
 * changed.
 *
 * All figures illustrative.
 */

/* --- geometry -------------------------------------------------------------- */

const M_CARD = 60;
const M_GAP = 10;
const BOARD = MODELS.length * M_CARD + (MODELS.length - 1) * M_GAP; // 422

const PANE = 76;
const PANE_GAP = 12;
const PITCH = PANE + PANE_GAP; // 88
const MID = BOARD / 2; // 211
/* what the track is offset by so that pane `step` lands on the middle line */
const REST = MID - PANE / 2;

const FAN_W = 280;
const CX = FAN_W / 2;
const HUB = 26; // the disc carrying the mark
const RING = 35; // the faint ring around it
const THROAT = 46; // where every line stops, eleven clear of the ring
const X1 = CX - THROAT;
const X2 = CX + THROAT;
const SPAN = FAN_W - X2;

/* the five rest positions a pane can occupy, which is why the incoming fan never has to move */
const STOPS = [-2, -1, 0, 1, 2]
  .map((j) => MID + j * PITCH)
  .filter((y) => y > 0 && y < BOARD);

const modelY = (i: number) => i * (M_CARD + M_GAP) + M_CARD / 2;

const wireIn = (y: number) => `M 0 ${y} C ${X1 * 0.55} ${y}, ${X1 * 0.82} ${MID}, ${X1} ${MID}`;
const wireOut = (y: number) =>
  `M ${X2} ${MID} C ${X2 + SPAN * 0.18} ${MID}, ${X2 + SPAN * 0.45} ${y}, ${FAN_W} ${y}`;

/* --- timing ---------------------------------------------------------------- */

const SPIN = 4; // panes riffled past per cycle
const SPIN_MS = 1500;
const STOP_AT = SPIN_MS + 10; // motion over, blur starts clearing
const SNAP_AT = SPIN_MS + 30; // track reset, while nothing is lit
const LAND_AT = SPIN_MS + 130; // the settled pane comes up and the board re-scores
const IN_AT = SPIN_MS + 340;
const IN_MS = 460;
const RING_AT = SPIN_MS + 720;
const OUT_AT = SPIN_MS + 800;
const OUT_MS = 540;
const ROUTE_AT = SPIN_MS + 1200; // the model card takes the highlight
const FLOW_AT = SPIN_MS + 1400;
const FLOW_MS = 1250;
/* the packet's length as a fraction of its path, shared with the keyframes that park it */
const DASH = "0.38";
const CYCLE = 5600;

const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
/*
 * The reel. Both ends of this curve have to be flat.
 *
 * The obvious choice for a thing that stops is a hard ease-out, and the first pass used one:
 * cubic-bezier(0.16, 0.92, ...), whose slope at zero is nearly six. That means the first frame
 * of the spin jumps most of a pane, which no amount of blur disguises and which is most of
 * what makes motion read as cheap. Leading with y1 = 0 starts the reel from rest and lets it
 * build, and x2 = 0.1 spends the back three quarters of the duration settling.
 */
const REEL = "cubic-bezier(0.34, 0, 0.1, 1)";

/* Start two in, so the reel opens with work already above the middle. Starting at zero leaves
   the top half of the column empty, which reads as a bug rather than as the head of a queue. */
const FIRST = 2;
const WRAP = SESSIONS.length + FIRST;
/* Two copies is the minimum that covers a spin without running off the end: the step never
   exceeds WRAP - 1 before the wrap resets it, and a spin from there needs SPIN + 2 panes
   beyond it. Three would be dead weight under the blur, which repaints the whole track. */
const TRACK = [...SESSIONS, ...SESSIONS];

/* --- one session window ---------------------------------------------------- */

function Pane({ s, on }: { s: Session; on: boolean }) {
  return (
    <div
      className="overflow-hidden rounded-lg border bg-white"
      style={{
        height: PANE,
        borderColor: on ? "var(--s5)" : "var(--line)",
        boxShadow: on ? "0 16px 34px -20px rgba(18,23,26,0.34)" : "none",
        transition: `border-color 420ms ${EASE}, box-shadow 420ms ${EASE}`,
      }}
    >
      <div
        className="flex h-[23px] items-center gap-2.5 border-b px-3"
        style={{
          borderColor: on ? "color-mix(in srgb, var(--s5) 22%, transparent)" : "var(--line)",
          background: on
            ? "color-mix(in srgb, var(--s5) 5%, #fff)"
            : "color-mix(in srgb, var(--paper) 62%, #fff)",
          transition: `background 420ms ${EASE}, border-color 420ms ${EASE}`,
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
              style={{ background: c, transition: `background 420ms ${EASE}` }}
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
            style={{ color: on ? "var(--s5)" : "var(--ink-3)", transition: `color 420ms ${EASE}` }}
          >
            {s.bar}
          </span>
        </span>
      </div>

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

/* --- the instrument -------------------------------------------------------- */

export function RouterFlow() {
  const [step, setStep] = useState(FIRST);
  /* bumped once per cycle, and the key the wire animations restart from. Separate from `step`
     so that resetting the track at the wrap cannot replay them. */
  const [tick, setTick] = useState(0);
  /* 0 spinning, 1 settled on a pane, 2 routed */
  const [phase, setPhase] = useState(0);
  /* Which session the board is reporting. Distinct from the landed pane, because the scores
     belong to the work and must not change until the reel has actually stopped on it. */
  const [shown, setShown] = useState(FIRST);
  /* strictly "the track is moving", which is not the same instant as "the pane lights up" */
  const [spinning, setSpinning] = useState(false);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);
  /* true for one frame at the wrap, to move the track back without animating it */
  const [snap, setSnap] = useState(false);
  const raf = useRef(0);
  /* The phase timeline needs the current step at the moment the reel lands, but must not
     depend on it: the wrap changes the step mid-cycle, and restarting the timeline there would
     replay the whole sequence against a half-drawn route. */
  const stepRef = useRef(FIRST);
  stepRef.current = step;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      setPhase(2);
      return;
    }
    setLive(true);
    const t = window.setTimeout(() => setOpen(true), 200);
    const id = window.setInterval(() => {
      setStep((s) => s + SPIN);
      setTick((n) => n + 1);
    }, CYCLE);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  /*
   * The phases of one cycle, restarted whenever the reel is kicked. The board re-scores at the
   * landing rather than at the kick: the numbers belong to a piece of work, and swapping them
   * while the reel is still moving would show the reading for a session that has not arrived.
   */
  useEffect(() => {
    if (!live) return;
    setPhase(0);
    if (tick > 0) setSpinning(true);
    const a = window.setTimeout(() => setSpinning(false), STOP_AT);
    const b = window.setTimeout(() => {
      setPhase(1);
      setShown(stepRef.current % SESSIONS.length);
    }, LAND_AT);
    const c = window.setTimeout(() => setPhase(2), ROUTE_AT);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [tick, live]);

  /*
   * The wrap, taken while the reel is still dark. Subtracting one full list leaves the centred
   * pane and both its neighbours showing the same sessions, so with transitions off nothing
   * visible happens. Doing it before the pane lights matters: moving the highlight to a
   * different element while it is mid-transition shows as a flicker at the middle.
   *
   * The frame that clears `snap` is held in a ref rather than cancelled by this effect's
   * cleanup. Setting the step re-runs the effect, and a cleanup that cancelled the frame would
   * cancel the one it had just scheduled, leaving the track stuck with transitions off.
   */
  useEffect(() => {
    if (!live || step < WRAP) return;
    const t = window.setTimeout(() => {
      setSnap(true);
      setStep((s) => s - SESSIONS.length);
      raf.current = window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => setSnap(false)),
      );
    }, SNAP_AT);
    return () => clearTimeout(t);
  }, [step, live]);

  const session = SESSIONS[shown];
  const routed = routeFor(session);
  const e = open ? 1 : 0;

  /* A drawn line, or a plain one where motion is unwelcome. Under reduced motion the global
     stylesheet flattens the duration but leaves the delay, so an animated wire would sit
     invisible for a second and a half before appearing; simpler to not animate it at all. */
  const drawn = (delay: number, ms: number) =>
    live
      ? {
          strokeDasharray: 1,
          animation: `wire-draw ${ms}ms ${EASE} ${delay}ms both`,
        }
      : undefined;

  return (
    /* Capped and centred rather than run to the full measure. The session lines are short, and
       across a 950px column the panes read as empty bars with a word in them. */
    <div className="mx-auto max-w-[1080px] select-none">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px_286px] lg:gap-0">
        {/* --- the reel ----------------------------------------------------------------- */}
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
              /* Blur in fast and out slow. The reel is at its quickest early and spends the
                 back of the curve settling, so a symmetric fade would clear the blur while the
                 panes are still visibly moving. */
              transition: live && !snap
                ? `transform ${SPIN_MS}ms ${REEL}, filter ${spinning ? 220 : 620}ms ease-out`
                : "none",
              filter: spinning ? "blur(1.1px)" : "blur(0)",
              willChange: "transform",
            }}
          >
            {TRACK.map((s, i) => {
              const on = phase > 0 && i === step;
              return (
                <div
                  key={i}
                  style={{
                    /* everything that is not taking its turn steps back */
                    opacity: on ? 1 : 0.4,
                    transform: `scale(${on ? 1 : 0.975})`,
                    transition: live ? `opacity 420ms ${EASE}, transform 420ms ${EASE}` : "none",
                  }}
                >
                  <Pane s={s} on={on} />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- the fan, and the mark behind its throat ---------------------------------- */}
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

            {/* the ring the lines stop short of */}
            <circle
              cx={CX}
              cy={MID}
              r={RING}
              fill="none"
              stroke="var(--line-2)"
              strokeWidth="1"
              opacity="0.55"
            />

            {/*
              The route, keyed on the cycle so it clears when the reel is kicked and redraws
              when it settles. Incoming first, then outgoing, then one packet down the length
              of both: the line arrives before the model is picked, which is the order the
              decision actually happens in.
            */}
            <g key={tick}>
              {/* The route, held back so the packet running over it is the bright thing. A route
                  line at full strength and a packet at full strength are the same colour, and
                  the flow stops reading as movement. */}
              <path
                d={wireIn(MID)}
                fill="none"
                stroke="var(--s5)"
                strokeWidth="1.6"
                opacity="0.4"
                pathLength={1}
                style={drawn(IN_AT, IN_MS)}
              />
              <path
                d={wireOut(modelY(routed))}
                fill="none"
                stroke="var(--s5)"
                strokeWidth="1.6"
                opacity="0.4"
                pathLength={1}
                style={drawn(OUT_AT, OUT_MS)}
              />
              {live && (
                <>
                  <path
                    d={wireIn(MID)}
                    fill="none"
                    stroke="var(--s5)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    pathLength={1}
                    style={{
                      ["--dash" as string]: DASH,
                      strokeDasharray: "var(--dash) 3",
                      animation: `wire-flow-in ${FLOW_MS}ms linear ${FLOW_AT}ms infinite both`,
                    }}
                  />
                  <path
                    d={wireOut(modelY(routed))}
                    fill="none"
                    stroke="var(--s5)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    pathLength={1}
                    style={{
                      ["--dash" as string]: DASH,
                      strokeDasharray: "var(--dash) 3",
                      animation: `wire-flow-out ${FLOW_MS}ms linear ${FLOW_AT}ms infinite both`,
                    }}
                  />
                </>
              )}
            </g>
          </svg>

          <div
            className="absolute z-10"
            style={{
              left: CX - HUB,
              top: MID - HUB,
              width: HUB * 2,
              height: HUB * 2,
              opacity: e,
              transform: `scale(${e ? 1 : 0.8})`,
              transition: `opacity 560ms ${EASE} 260ms, transform 680ms ${EASE} 260ms`,
            }}
          >
            {/* fires as the incoming line lands, not on a loop of its own */}
            <span
              key={tick}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--s5)",
                animation: live ? `hub-ring 1.5s ease-out ${RING_AT}ms both` : "none",
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
            const on = phase > 1 && i === routed;
            return (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-lg border px-3.5"
                style={{
                  height: M_CARD,
                  borderColor: on ? "var(--s5)" : "var(--line)",
                  background: on ? "color-mix(in srgb, var(--s5) 7%, #fff)" : "var(--white)",
                  transition: live
                    ? `border-color 460ms ${EASE}, background 460ms ${EASE}`
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
                {/* The other half of the comparison the route is decided by, re-read for the
                    work that just landed. Keyed on the session so it replays, staggered down
                    the board so the column reads as being scored rather than swapped. */}
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-4">
                    scores
                  </span>
                  <span
                    key={shown}
                    className="tabular block font-mono text-[12px]"
                    style={{
                      color: on ? "var(--t3)" : "var(--ink-4)",
                      animation: live ? `score-in 380ms ${EASE} ${i * 45}ms backwards` : "none",
                    }}
                  >
                    {session.scores[i]}
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
                    transition: `opacity 420ms ${EASE}`,
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
