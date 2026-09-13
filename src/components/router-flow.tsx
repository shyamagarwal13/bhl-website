"use client";

import { useEffect, useState } from "react";

/*
 * The router, shown working.
 *
 * Two earlier attempts failed the same way: they showed routing as an abstraction — a prism,
 * then two scrolling lists — when the thing a reader actually recognises is their own
 * terminal. An agent session is concrete. A list of task names is a diagram of one.
 *
 * So the left is a deck of real sessions with the front one live, and the right is the model
 * board. Faint lines run from the session to every model on the board at all times, because
 * every one of them was a candidate; the live line is the route this particular piece of work
 * actually took. The deck cycles — the front session recedes, the next comes forward, and the
 * live line redraws to a different model.
 *
 * The middle column exists only to hold the wire, at a fixed width. That is what keeps the
 * curve honest: an SVG stretched across a fluid column distorts its own control points.
 *
 * All figures illustrative.
 */

type Step = { label: string; model: string; detail: string };
type Session = {
  cwd: string;
  prompt: string;
  steps: Step[];
  /** index into MODELS — the route this session took */
  routed: number;
};

const MODELS = [
  { name: "Haiku", sub: "4.5", q: 71, cost: "$0.80" },
  { name: "GLM-5.2", sub: "Z.ai", q: 76, cost: "$4.40" },
  { name: "Gemini", sub: "3.1 Pro", q: 83, cost: "$12" },
  { name: "Sonnet", sub: "4.6", q: 89, cost: "$15" },
  { name: "GPT-5.5", sub: "Codex", q: 92, cost: "$30" },
  { name: "Opus", sub: "4.8", q: 96, cost: "$75" },
];

const SESSIONS: Session[] = [
  {
    cwd: "~/acme/web",
    prompt: "Add a /changelog page that renders MDX from /content, newest first.",
    steps: [
      {
        label: "Add the route and MDX loader",
        model: "glm-5.2",
        detail: "app/changelog/page.tsx · 64 lines",
      },
      { label: "Generate the RSS feed", model: "glm-5.2", detail: "app/feed.xml/route.ts · RSS 2.0" },
    ],
    routed: 1,
  },
  {
    cwd: "~/acme/ledger",
    prompt: "Work out why the payments reconciliation test is flaky.",
    steps: [
      { label: "Read the failing test and its fixtures", model: "haiku", detail: "3 files · 210 lines" },
      { label: "Bisect the last nine runs", model: "haiku", detail: "found: clock skew in setup" },
    ],
    routed: 0,
  },
  {
    cwd: "~/acme/platform",
    prompt: "Design the caching layer for the ledger service.",
    steps: [
      { label: "Map read paths and invalidation", model: "opus-4.8", detail: "14 call sites" },
      { label: "Draft the eviction policy", model: "opus-4.8", detail: "write-through, 90s TTL" },
    ],
    routed: 5,
  },
];

const CARD = 62;
const GAP = 10;
const PITCH = CARD + GAP;
const BOARD = MODELS.length * CARD + (MODELS.length - 1) * GAP;
const WIRE_W = 112;
const CYCLE = 4200;
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const WIN_H = 344;
/** the deck is centred against the board, so the wire leaves at the board's midline */
const WIN_TOP = (BOARD - WIN_H) / 2;
const OUT_Y = BOARD / 2;
/*
 * Each card back in the deck is both offset down and scaled. Scaling from the top edge pulls
 * the bottom up by (1 - scale) * height, which for the first version cancelled the offset
 * almost exactly and left the deck looking like a single window. The offset has to clear that
 * shrink before any of the stack is visible.
 */
const SHRINK = 0.03;
const DECK_STEP = Math.round(SHRINK * WIN_H) + 11;

const wire = (y: number) =>
  `M 0 ${OUT_Y} C ${WIRE_W * 0.55} ${OUT_Y}, ${WIRE_W * 0.45} ${y}, ${WIRE_W} ${y}`;

export function RouterFlow() {
  const [active, setActive] = useState(0);
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
  const e = open ? 1 : 0;
  const cardY = session.routed * PITCH + CARD / 2;

  return (
    <div className="select-none">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_112px_300px] lg:gap-0">
        {/* --- the deck of sessions --------------------------------------------------- */}
        <div className="relative" style={{ height: BOARD }}>
          {SESSIONS.map((s, i) => {
            // how far back in the deck this session currently sits
            const depth = (i - active + SESSIONS.length) % SESSIONS.length;
            const front = depth === 0;
            return (
              <div
                key={s.cwd}
                className="absolute inset-x-0 overflow-hidden rounded-xl border border-line bg-white"
                style={{
                  top: WIN_TOP,
                  height: WIN_H,
                  zIndex: SESSIONS.length - depth,
                  transform: `translateY(${depth * DECK_STEP + (1 - e) * 22}px) scale(${1 - depth * SHRINK})`,
                  transformOrigin: "top center",
                  opacity: front ? e : e * 0.45,
                  boxShadow: front
                    ? "0 2px 6px rgba(18,23,26,0.05), 0 26px 60px -22px rgba(18,23,26,0.26)"
                    : "0 1px 3px rgba(18,23,26,0.04)",
                  transition: live
                    ? `transform 760ms ${EASE}, opacity 760ms ${EASE}, box-shadow 760ms ${EASE}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-2 border-b border-line bg-paper px-3.5 py-2.5">
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-line-2" />
                    <span className="h-2 w-2 rounded-full bg-line-2" />
                    <span className="h-2 w-2 rounded-full bg-line-2" />
                  </span>
                  <span className="ml-2 truncate font-mono text-[10.5px] text-ink-4">
                    agent — behold — zsh
                  </span>
                  {front && (
                    <span className="ml-auto flex shrink-0 items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--t3)" }} />
                      <span className="font-mono text-[10px] text-ink-3">running</span>
                    </span>
                  )}
                </div>

                <div className="px-4 py-4 sm:px-5">
                  <p className="font-mono text-[10.5px] text-ink-4">{s.cwd}</p>
                  <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed text-ink">
                    <span className="text-ink-4">&#10095; </span>
                    {s.prompt}
                  </p>

                  <p className="mt-4 font-mono text-[11.5px] text-ink-3">
                    planning… split into{" "}
                    <span className="font-semibold text-ink">{s.steps.length + 1} steps</span>
                  </p>

                  {s.steps.map((st) => (
                    <div key={st.label} className="mt-3">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[11.5px]" style={{ color: "var(--t3)" }}>
                          ✓
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink-2">
                          {st.label}
                        </span>
                        <span className="shrink-0 font-mono text-[11px]" style={{ color: "var(--s5)" }}>
                          → {st.model}
                        </span>
                      </div>
                      <p className="mt-1 truncate pl-6 font-mono text-[11px] text-ink-4">
                        {st.detail}
                      </p>
                    </div>
                  ))}

                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="font-mono text-[11.5px] text-ink-4">◦</span>
                    <span className="font-mono text-[11.5px] text-ink-4">Build and verify</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- the wire, in a fixed-width column so the curve is never stretched -------- */}
        <div className="relative hidden lg:block" style={{ height: BOARD }}>
          <svg
            width={WIRE_W}
            height={BOARD}
            viewBox={`0 0 ${WIRE_W} ${BOARD}`}
            className="absolute inset-0 overflow-visible"
            aria-hidden="true"
            style={{ opacity: e, transition: `opacity 600ms ${EASE} 420ms` }}
          >
            {/* every model was a candidate, so every route is drawn — held back */}
            {MODELS.map((m, i) => (
              <path
                key={m.name}
                d={wire(i * PITCH + CARD / 2)}
                fill="none"
                stroke="var(--line-2)"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            {/* and the one this session took */}
            <path
              d={wire(cardY)}
              fill="none"
              stroke="var(--s5)"
              strokeWidth="1.7"
              style={{ transition: live ? `d 720ms ${EASE}` : "none" }}
            />
          </svg>
        </div>

        {/* --- the model board --------------------------------------------------------- */}
        <div
          className="flex flex-col"
          style={{
            gap: GAP,
            opacity: e,
            transform: `translateX(${(1 - e) * 32}px)`,
            transition: `opacity 720ms ${EASE} 200ms, transform 820ms ${EASE} 200ms`,
          }}
        >
          {MODELS.map((m, i) => {
            const on = i === session.routed;
            return (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-lg border px-3.5"
                style={{
                  height: CARD,
                  borderColor: on ? "var(--s5)" : "var(--line)",
                  background: on ? "color-mix(in srgb, var(--s5) 7%, #fff)" : "var(--white)",
                  transition: live
                    ? `border-color 620ms ${EASE}, background 620ms ${EASE}`
                    : "none",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13.5px] font-semibold"
                    style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
                  >
                    {m.name}
                  </p>
                  <p className="truncate font-mono text-[10px] text-ink-4">{m.sub}</p>
                </div>
                <span
                  className="tabular shrink-0 font-mono text-[12px]"
                  style={{ color: on ? "var(--t3)" : "var(--ink-4)" }}
                >
                  {m.q}
                </span>
                <span
                  className="tabular w-14 shrink-0 text-right font-mono text-[11.5px]"
                  style={{ color: on ? "var(--ink-2)" : "var(--ink-4)" }}
                >
                  {m.cost}
                </span>
                <span
                  className="w-[46px] shrink-0 pl-1 text-right font-mono text-[8.5px] uppercase tracking-[0.14em]"
                  style={{
                    color: "var(--s5)",
                    opacity: on ? 1 : 0,
                    transition: `opacity 500ms ${EASE}`,
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
