"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppWindow, Panel } from "./app-window";
import { Bars, Line, Rows } from "./chart-kit";

/*
 * What we sell, as a product tour.
 *
 * Replaces the equation and its scroll-driven rail. The rail made the reader do work to
 * advance it, and what it advanced through was a model rather than a product.
 *
 * Each pane is a full application window rather than a chart in a box, and every pane
 * shares the frame the hero shot uses, so the section reads as five views of one product.
 * The tabs sit above it and the window gets the whole width.
 *
 * Advances on a timer. It stops when the section is off screen, when a pointer is over it,
 * when focus is inside it, and under prefers-reduced-motion: each is a case where advancing
 * would either waste work or move something out from under someone.
 *
 * The last pane is deliberately not another chart set. "And more" as a bare tab would read
 * as padding; a window showing instruments we have actually built for other teams reads as
 * the custom-work offer it is.
 */

const ROTATE_MS = 7000;
const M12 = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const M6 = ["J", "F", "M", "A", "M", "J"];

type Pane = {
  key: string;
  tab: string;
  title: string;
  blurb: string;
  window: React.ReactNode;
};

/* Consistent two-column body: one tall panel, two stacked beside it. Every pane uses it so
   switching does not resize the frame under the reader. */
function Body({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:min-h-[386px]">
      {left}
      <div className="flex flex-col gap-3">{right}</div>
    </div>
  );
}

const PANES: Pane[] = [
  {
    key: "engineering",
    tab: "Engineering analytics",
    title: "Engineering analytics",
    blurb:
      "Delivery measured end to end, from the moment work is picked up to the moment a customer can use it, with the time each stage actually consumed.",
    window: (
      <AppWindow
        url="app.beholdlabs.com/delivery"
        active="Delivery"
        tabs={["Last 6 months", "By team", "By stage"]}
      >
        <Body
          left={
            <Panel title="Idea → production" meta="median" value="9.4 days">
              <div className="mt-3">
                <Line pts={[21, 19, 17.5, 14, 12, 9.4]} band="var(--t2)" threshold={12} labels={M6} />
              </div>
            </Panel>
          }
          right={
            <>
              <Panel title="Merged PRs / engineer" meta="per month" value="18.6" sub="+22%">
                <div className="mt-3">
                  <Bars data={[12, 13, 14, 16, 17, 18.6]} band="var(--t2)" labels={M6} />
                </div>
              </Panel>
              <Panel title="Where the time goes" meta="days">
                <div className="mt-3">
                  <Rows
                    band="var(--t2)"
                    rows={[
                      { l: "Review", v: "3.8", pct: 92 },
                      { l: "Coding", v: "2.1", pct: 51 },
                      { l: "QA", v: "1.9", pct: 46 },
                      { l: "Release", v: "1.6", pct: 39 },
                    ]}
                  />
                </div>
              </Panel>
            </>
          }
        />
      </AppWindow>
    ),
  },
  {
    key: "tokens",
    tab: "Token analytics",
    title: "Token analytics",
    blurb:
      "Every dollar of model spend attributed to the team, the repository and the piece of work that caused it, then broken down by which model did the work.",
    window: (
      <AppWindow
        url="app.beholdlabs.com/ai-spend"
        active="AI Spend"
        tabs={["Last 12 months", "By model", "By repo"]}
      >
        <Body
          left={
            <Panel title="AI spend" meta="12 mo" value="$48,214" sub="+12%" subBad>
              <div className="mt-3">
                <Bars
                  data={[38, 46, 41, 58, 64, 72, 69, 88, 94, 86, 108, 121]}
                  band="var(--t1)"
                  labels={M12}
                />
              </div>
            </Panel>
          }
          right={
            <>
              <Panel title="Tokens processed" meta="12 mo" value="1.24B" sub="+18%" subBad>
                <div className="mt-3">
                  <Line pts={[52, 58, 61, 70, 76, 84, 88, 97, 104, 112, 118, 124]} band="var(--t1)" />
                </div>
              </Panel>
              <Panel title="Spend by model" meta="share">
                <div className="mt-3">
                  <Rows
                    band="var(--t1)"
                    rows={[
                      { l: "Sonnet class", v: "$21.4k", pct: 88 },
                      { l: "GPT class", v: "$12.8k", pct: 53 },
                      { l: "Local / OSS", v: "$7.8k", pct: 32 },
                      { l: "Haiku class", v: "$6.2k", pct: 26 },
                    ]}
                  />
                </div>
              </Panel>
            </>
          }
        />
      </AppWindow>
    ),
  },
  {
    key: "devex",
    tab: "Developer experience",
    title: "Developer experience",
    blurb:
      "Where the week actually goes, priced. Friction is measured in hours and then converted to dollars, so it competes for budget against everything else.",
    window: (
      <AppWindow
        url="app.beholdlabs.com/devex"
        active="DevEx"
        tabs={["Per engineer / week", "By team", "Trend"]}
      >
        <Body
          left={
            <Panel title="Hours lost to friction" meta="per week" value="6.2 h" sub="+0.9h" subBad>
              <div className="mt-3">
                <Rows
                  band="var(--t5)"
                  rows={[
                    { l: "Waiting on review", v: "2.4h", pct: 78 },
                    { l: "Flaky tests", v: "1.6h", pct: 52 },
                    { l: "Local env", v: "1.3h", pct: 42 },
                    { l: "Build times", v: "0.9h", pct: 29 },
                  ]}
                />
              </div>
            </Panel>
          }
          right={
            <>
              <Panel title="Priced" meta="per quarter" value="$31,400" sub="+14%" subBad>
                <div className="mt-3">
                  <Bars data={[21, 23, 25, 27, 29, 31.4]} band="var(--t5)" labels={M6} />
                </div>
              </Panel>
              <Panel title="Trend" meta="hours / week">
                <div className="mt-3">
                  <Line pts={[4.4, 4.8, 5.1, 5.6, 5.9, 6.2]} band="var(--t5)" labels={M6} />
                </div>
              </Panel>
            </>
          }
        />
      </AppWindow>
    ),
  },
  {
    key: "routing",
    tab: "Routing optimization",
    title: "Routing optimization",
    blurb:
      "The cheapest model that still clears your bar for the task, chosen per request. Spend falls and the pass rate does not, which is the only version of this worth shipping.",
    window: (
      <AppWindow
        url="app.beholdlabs.com/routing"
        active="Routing"
        tabs={["Since enabled", "By task", "By model"]}
        action="Configure"
      >
        <Body
          left={
            <Panel title="Spend per task" meta="indexed" value="lower">
              <div className="mt-3">
                <Bars
                  data={[100, 92, 81, 74, 69, 69]}
                  ghost={[100, 100, 100, 100, 100, 100]}
                  band="var(--t3)"
                  labels={M6}
                />
              </div>
            </Panel>
          }
          right={
            <>
              <Panel title="Pass rate" meta="held flat" value="held">
                <div className="mt-3">
                  <Line pts={[96.5, 96.6, 96.3, 96.5, 96.4, 96.4]} band="var(--t3)" labels={M6} />
                </div>
              </Panel>
              <Panel title="Model mix after routing" meta="share of tasks">
                <div className="mt-3">
                  <Rows
                    band="var(--t3)"
                    rows={[
                      { l: "Haiku class", v: "58%", pct: 58 },
                      { l: "Sonnet class", v: "31%", pct: 31 },
                      { l: "Opus class", v: "11%", pct: 11 },
                    ]}
                  />
                </div>
              </Panel>
            </>
          }
        />
      </AppWindow>
    ),
  },
  {
    key: "custom",
    tab: "And more",
    title: "Built for your question",
    blurb:
      "Most of what we ship started as something a team could not get anywhere else. If the measurement you need does not exist yet, that is the interesting case.",
    window: (
      <AppWindow
        url="app.beholdlabs.com/custom"
        active="Custom"
        tabs={["Built to order", "Live", "Draft"]}
        action="New"
      >
        <Body
          left={
            <Panel title="Instruments built for other teams" meta="selected">
              <ul className="mt-3 flex flex-col gap-2.5">
                {[
                  "Review load and reviewer burnout risk",
                  "Code health and quality debt by service",
                  "Agent evaluation against your own test suite",
                  "Software capitalisation and R&D tax reporting",
                  "Abandoned work as a share of engineering spend",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-2">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-t4" />
                    {x}
                  </li>
                ))}
              </ul>
            </Panel>
          }
          right={
            <>
              <Panel title="Time to first instrument" meta="typical" value="2 weeks" />
              <Panel title="How it works">
                <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
                  You describe the decision you are trying to make. We instrument the systems
                  that already hold the evidence, price the terms, and state the caveats.
                </p>
              </Panel>
              {/* statuses, not proportions: a progress bar at 100% four times over reads
                  as a chart of nothing */}
              <Panel title="Reads from" meta="no new tooling">
                <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
                  {["Repositories", "Provider bills", "CI", "Review history"].map((x) => (
                    <span key={x} className="flex items-center gap-1.5 text-[11px] text-ink-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pos" />
                      {x}
                    </span>
                  ))}
                </div>
              </Panel>
            </>
          }
        />
      </AppWindow>
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
      threshold: 0.25,
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

  const pane = PANES[active];

  return (
    <div
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* the tabs scroll rather than wrap: five labels wrapping to two rows on a phone
          turns the control into a paragraph */}
      <div
        role="tablist"
        aria-label="What we build"
        onKeyDown={onKey}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
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
              aria-controls="showcase-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative shrink-0 overflow-hidden rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                on
                  ? "border-transparent bg-ink text-white"
                  : "border-line bg-white text-ink-3 hover:text-ink"
              }`}
            >
              {p.tab}
              {/* the timer, made visible: a tab about to change should say so */}
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

      <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
        <h3 className="shrink-0 text-[1.25rem] font-bold tracking-tight text-ink sm:text-[1.4rem]">
          {pane.title}
        </h3>
        <p className="max-w-xl text-[14px] leading-relaxed text-ink-3">{pane.blurb}</p>
      </div>

      {/*
        One live panel rather than five hidden ones. The window is heavy enough that keeping
        four spare copies mounted costs real layout work on every resize, and a tabpanel
        that is `hidden` is still parsed by assistive tech as present.
      */}
      <div
        id="showcase-panel"
        role="tabpanel"
        aria-labelledby={`showcase-tab-${pane.key}`}
        className="mt-5"
      >
        <div key={pane.key} className="showcase-in">
          {pane.window}
        </div>
      </div>
    </div>
  );
}
