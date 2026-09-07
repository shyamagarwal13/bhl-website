"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bars, Frame, Line, Rows } from "./chart-kit";

/*
 * What we actually sell, as a rotating set of product windows.
 *
 * Replaces the equation and its scroll-driven rail. The rail made the reader do work to
 * advance it, and what it advanced through was a model rather than a product. A reader who
 * wants to know what they get should not have to scrub a scrollbar to find out.
 *
 * Advances on a timer instead: the panels arrive without being asked for, and the tabs stay
 * clickable for anyone who wants a specific one. The timer stops when the section is out of
 * view, when a pointer is over it, when focus is inside it, and when the visitor has asked
 * for reduced motion. Each of those is a case where advancing would either waste work or
 * move something out from under someone.
 *
 * The last panel is deliberately not a chart. "And more" as a fifth tab would read as
 * padding; a panel that names real things we have built for other teams reads as the
 * custom-work offer it is.
 */

const ROTATE_MS = 6000;
const MONTHS = ["J", "F", "M", "A", "M", "J"];

type Pane = {
  key: string;
  tab: string;
  blurb: string;
  band: string;
  panel: React.ReactNode;
};

const PANES: Pane[] = [
  {
    key: "engineering",
    tab: "Engineering analytics",
    blurb:
      "Delivery measured end to end, from the moment work is picked up to the moment it is in front of a customer.",
    band: "var(--t2)",
    panel: (
      <Frame
        title="app.beholdlabs.com/engineering"
        filter="Last 6 months"
        value="9.4"
        unit="days, idea → production"
        delta="−31%"
        deltaGood
        band="var(--t2)"
      >
        <Line pts={[21, 19, 17.5, 14, 12, 9.4]} band="var(--t2)" threshold={12} labels={MONTHS} />
      </Frame>
    ),
  },
  {
    key: "tokens",
    tab: "Token analytics",
    blurb:
      "Every dollar of model spend attributed to the team, the repository and the piece of work that caused it.",
    band: "var(--t1)",
    panel: (
      <Frame
        title="app.beholdlabs.com/ai-spend"
        filter="Last 12 months"
        value="$48,214"
        unit="AI spend, attributed"
        delta="+12%"
        deltaGood={false}
        band="var(--t1)"
      >
        <Rows
          band="var(--t1)"
          rows={[
            { l: "Platform", v: "$18.2k", pct: 92 },
            { l: "Payments", v: "$12.1k", pct: 61 },
            { l: "Growth", v: "$9.8k", pct: 49 },
            { l: "Mobile", v: "$8.1k", pct: 41 },
          ]}
        />
      </Frame>
    ),
  },
  {
    key: "devex",
    tab: "Developer experience",
    blurb:
      "Where the week actually goes, priced. Friction is measured in hours and then in dollars, not in a satisfaction score.",
    band: "var(--t5)",
    panel: (
      <Frame
        title="app.beholdlabs.com/devex"
        filter="Per engineer, per week"
        value="6.2"
        unit="hours lost to friction"
        delta="+0.9h"
        deltaGood={false}
        band="var(--t5)"
      >
        <Rows
          band="var(--t5)"
          rows={[
            { l: "Waiting on review", v: "2.4h", pct: 78 },
            { l: "Flaky tests", v: "1.6h", pct: 52 },
            { l: "Local env", v: "1.3h", pct: 42 },
            { l: "Build times", v: "0.9h", pct: 29 },
          ]}
        />
      </Frame>
    ),
  },
  {
    key: "routing",
    tab: "Routing optimisation",
    blurb:
      "The cheapest model that still passes your bar for the task, chosen per request and checked against the outcome.",
    band: "var(--t3)",
    panel: (
      <Frame
        title="app.beholdlabs.com/routing"
        filter="Since routing enabled"
        value="31%"
        unit="spend cut at equal pass rate"
        delta="−$14.9k"
        deltaGood
        band="var(--t3)"
      >
        <Bars
          band="var(--t3)"
          data={[100, 92, 81, 74, 69, 69]}
          ghost={[100, 100, 100, 100, 100, 100]}
          labels={MONTHS}
        />
      </Frame>
    ),
  },
  {
    key: "custom",
    tab: "And more",
    blurb:
      "The measurement your question needs. Most of what we build starts as something a team could not get anywhere else.",
    band: "var(--t4)",
    panel: (
      <Frame
        title="app.beholdlabs.com/custom"
        filter="Built to order"
        value="Your question"
        unit="instrumented, then priced"
        band="var(--t4)"
      >
        <ul className="flex flex-col gap-2.5" style={{ minHeight: 108 }}>
          {[
            "Review load and reviewer burnout risk",
            "Code health and quality debt by service",
            "Agent evaluation against your own test suite",
            "Software capitalisation and R&D tax reporting",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-ink-2">
              <span
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--t4)" }}
              />
              {x}
            </li>
          ))}
        </ul>
      </Frame>
    ),
  },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Only run the timer while the section is on screen. Rotating a panel nobody is looking
  // at means a visitor who scrolls back finds it somewhere they didn't leave it.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = inView && !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % PANES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [running]);

  /*
   * Keep the active tab in view inside the strip. On a phone the tabs overflow, so the
   * timer regularly selects one that is scrolled off to the right and the control appears
   * to have nothing selected.
   *
   * scrollLeft rather than scrollIntoView: the latter scrolls every scrollable ancestor,
   * so advancing a tab would drag the whole page.
   */
  useEffect(() => {
    const list = tabs.current[active]?.parentElement;
    const tab = tabs.current[active];
    if (!list || !tab) return;
    const left = tab.offsetLeft - list.offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < list.scrollLeft) {
      list.scrollTo({ left: left - 16, behavior: "smooth" });
    } else if (right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: right - list.clientWidth + 16, behavior: "smooth" });
    }
  }, [active]);

  // Arrow keys move between tabs, which is what the tablist pattern promises and what a
  // keyboard user will try first.
  const onKey = useCallback((e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    setActive((i) => {
      const next = (i + delta + PANES.length) % PANES.length;
      tabs.current[next]?.focus();
      return next;
    });
  }, []);

  return (
    <div
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="overflow-hidden rounded-3xl border border-line bg-white"
    >
      {/* the tabs scroll rather than wrap: five labels wrapping to two rows on a phone
          turns the control into a paragraph */}
      <div
        role="tablist"
        aria-label="What we build"
        onKeyDown={onKey}
        className="flex gap-2 overflow-x-auto border-b border-line bg-paper px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PANES.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`showcase-tab-${p.key}`}
              aria-selected={on}
              aria-controls={`showcase-panel-${p.key}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 overflow-hidden rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                on
                  ? "border-transparent bg-ink text-white"
                  : "border-line bg-white text-ink-3 hover:text-ink"
              }`}
            >
              {p.tab}
              {/* the timer, made visible: a tab that is about to change should say so */}
              {on && running && (
                <span
                  key={`${p.key}-${active}`}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-white/45"
                  style={{ animation: `showcase-progress ${ROTATE_MS}ms linear forwards` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
        <div className="lg:pl-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
            {String(active + 1).padStart(2, "0")} / {String(PANES.length).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-balance text-[1.35rem] font-bold leading-snug text-ink sm:text-[1.6rem]">
            {PANES[active].tab}
          </h3>
          <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-3">
            {PANES[active].blurb}
          </p>
        </div>

        {PANES.map((p, i) => (
          <div
            key={p.key}
            role="tabpanel"
            id={`showcase-panel-${p.key}`}
            aria-labelledby={`showcase-tab-${p.key}`}
            hidden={i !== active}
            // the panel is the second grid column; hidden panels leave the grid entirely
            className={i === active ? "min-w-0 lg:col-start-2 lg:row-start-1" : ""}
          >
            {i === active && (
              <div key={`${p.key}-in`} className="showcase-in">
                {p.panel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
