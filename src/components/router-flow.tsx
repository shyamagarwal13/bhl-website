"use client";

import { useEffect, useState } from "react";
import { Logomark } from "./brand";

/*
 * The router, shown working.
 *
 * Three attempts to get here. A prism, then two scrolling lists, then a single large terminal
 * — the last of which worked but was recognisably the shape the reference used, and one big
 * window is also the wrong picture: a router does not sit behind one session, it sits behind
 * all of them at once.
 *
 * So: many small sessions on the left, all of them real work, fanning into the mark. One is
 * live at a time, and the two fans carry it — every session has a faint line into the router
 * and every model has a faint line out of it, because all of them are always candidates. The
 * lit path is the one this piece of work actually took, and both of its ends move: a different
 * session, a different model, every few seconds.
 *
 * The fans live in a fixed-width column. An SVG stretched across a fluid column distorts its
 * own control points and the curves stop being curves.
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
  { cwd: "~/acme/web", prompt: "Rename the billing props", note: "4 files, 61 lines", need: 68 },
  { cwd: "~/acme/ledger", prompt: "Why is the payments test flaky?", note: "bisected 9 runs", need: 70 },
  { cwd: "~/acme/web", prompt: "Add a /changelog page from MDX", note: "2 routes, RSS 2.0", need: 74 },
  { cwd: "~/acme/api", prompt: "Write the migration for orders", note: "reversible, 1 index", need: 81 },
  { cwd: "~/acme/auth", prompt: "Refactor the session module", note: "11 call sites", need: 87 },
  { cwd: "~/acme/platform", prompt: "Design the caching layer", note: "write-through, 90s TTL", need: 94 },
];

/* the cheapest model that clears the bar, which is the whole of the routing policy */
const routeFor = (need: number) => {
  const i = MODELS.findIndex((m) => m.q >= need);
  return i === -1 ? MODELS.length - 1 : i;
};

const S_CARD = 60;
const S_GAP = 10;
const M_CARD = 60;
const M_GAP = 10;
const BOARD = MODELS.length * M_CARD + (MODELS.length - 1) * M_GAP;
const S_BLOCK = SESSIONS.length * S_CARD + (SESSIONS.length - 1) * S_GAP;
const S_TOP = (BOARD - S_BLOCK) / 2;

const FAN_W = 168;
const HUB = 26;
const MID = BOARD / 2;
const CYCLE = 3400;
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

const sessionY = (i: number) => S_TOP + i * (S_CARD + S_GAP) + S_CARD / 2;
const modelY = (i: number) => i * (M_CARD + M_GAP) + M_CARD / 2;

/* In: from a session on the left edge to the mark. Out: from the mark to a model. */
const wireIn = (y: number) =>
  `M 0 ${y} C ${FAN_W * 0.45} ${y}, ${FAN_W * 0.3} ${MID}, ${FAN_W / 2 - HUB} ${MID}`;
const wireOut = (y: number) =>
  `M ${FAN_W / 2 + HUB} ${MID} C ${FAN_W * 0.7} ${MID}, ${FAN_W * 0.55} ${y}, ${FAN_W} ${y}`;

export function RouterFlow() {
  const [active, setActive] = useState(2);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }
    setLive(true);
    const t = window.setTimeout(() => setOpen(true), 200);
    const id = window.setInterval(() => setActive((a) => (a + 1) % SESSIONS.length), CYCLE);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const session = SESSIONS[active];
  const routed = routeFor(session.need);
  const e = open ? 1 : 0;

  return (
    /* Capped and centred rather than run to the full measure. The session lines are short, and
       across a 950px column the cards read as empty bars with a word in them. */
    <div className="mx-auto max-w-[980px] select-none">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_168px_286px] lg:gap-0">
        {/* --- the sessions ------------------------------------------------------------ */}
        <div
          className="flex flex-col lg:block lg:relative"
          style={{
            gap: S_GAP,
            opacity: e,
            transform: `translateX(${(1 - e) * -26}px)`,
            transition: `opacity 700ms ${EASE} 80ms, transform 800ms ${EASE} 80ms`,
          }}
        >
          <div className="hidden lg:block" style={{ height: BOARD }} />
          {SESSIONS.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.prompt}
                className="overflow-hidden rounded-lg border bg-white lg:absolute lg:inset-x-0"
                style={{
                  top: sessionY(i) - S_CARD / 2,
                  height: S_CARD,
                  borderColor: on ? "var(--s5)" : "var(--line)",
                  opacity: on ? 1 : 0.42,
                  boxShadow: on ? "0 14px 30px -18px rgba(18,23,26,0.3)" : "none",
                  transition: live ? `all 560ms ${EASE}` : "none",
                }}
              >
                <div className="flex h-full items-center gap-3 px-3.5">
                  {/* a window, at the size a window can be when there are six of them */}
                  <span className="flex shrink-0 gap-1">
                    <span className="h-[5px] w-[5px] rounded-full bg-line-2" />
                    <span className="h-[5px] w-[5px] rounded-full bg-line-2" />
                    <span className="h-[5px] w-[5px] rounded-full bg-line-2" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate font-mono text-[11.5px]"
                      style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
                    >
                      <span className="text-ink-4">&#10095; </span>
                      {s.prompt}
                    </p>
                    <p className="truncate font-mono text-[10px] text-ink-4">
                      {s.cwd} · {s.note}
                    </p>
                  </div>
                  {/* The bar this task sets. Printed on the card so the reader can check the
                      routing themselves: it lands on the first model to the right that clears
                      this number, and never on one that does not. */}
                  <span className="shrink-0 text-right">
                    <span
                      className="block font-mono text-[8.5px] uppercase tracking-[0.14em]"
                      style={{ color: "var(--ink-4)" }}
                    >
                      bar
                    </span>
                    <span
                      className="tabular block font-mono text-[12px]"
                      style={{ color: on ? "var(--s5)" : "var(--ink-4)" }}
                    >
                      {s.need}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- the two fans, and the mark between them --------------------------------- */}
        <div className="relative hidden lg:block" style={{ height: BOARD }}>
          <svg
            width={FAN_W}
            height={BOARD}
            viewBox={`0 0 ${FAN_W} ${BOARD}`}
            className="absolute inset-0"
            aria-hidden="true"
            style={{ opacity: e, transition: `opacity 600ms ${EASE} 380ms` }}
          >
            {SESSIONS.map((s, i) => (
              <path
                key={`in-${s.prompt}`}
                d={wireIn(sessionY(i))}
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

            {/* the path this piece of work took, both ends moving */}
            <path
              d={wireIn(sessionY(active))}
              fill="none"
              stroke="var(--s5)"
              strokeWidth="1.7"
              style={{ transition: live ? `d 620ms ${EASE}` : "none" }}
            />
            <path
              d={wireOut(modelY(routed))}
              fill="none"
              stroke="var(--s5)"
              strokeWidth="1.7"
              style={{ transition: live ? `d 620ms ${EASE} 120ms` : "none" }}
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
            <span
              key={active}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--s5)",
                animation: live ? "hub-ring 3.4s ease-out" : "none",
              }}
            />
            <span className="relative flex h-full w-full items-center justify-center rounded-full border border-line bg-white lift">
              <Logomark size={13} />
            </span>
          </div>
        </div>

        {/* --- the model board --------------------------------------------------------- */}
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
                {/* Same stack as the bar on the left, so the two numbers the route is decided
                    by are set the same way and can be read against each other. */}
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
