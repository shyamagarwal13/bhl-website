/*
 * The hero product shot.
 *
 * The frame, sidebar and panel card come from app-window so this and the showcase panes
 * are visibly the same application. Only the contents of the main area are specific to
 * the hero. Figures are illustrative sample data.
 */

import { AppWindow, Panel } from "./app-window";

const SPEND = [38, 46, 41, 58, 64, 72, 69, 88, 94, 86, 108, 121];
const HUMAN = [30, 34, 30, 40, 42, 46, 44, 52, 55, 50, 60, 64];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/** Stacked bars: total spend, with the human-authored share underneath. */
const BAR_H = 168; // matches the stacked right-hand column so the row reads as one block

function SpendBars() {
  const max = Math.max(...SPEND);
  return (
    <div className="mt-3">
      <div className="flex items-end gap-[5px]" style={{ height: BAR_H }}>
        {SPEND.map((v, i) => {
          const h = (v / max) * BAR_H;
          const hh = (HUMAN[i] / max) * BAR_H;
          return (
            <div
              key={i}
              className="grow relative flex-1 rounded-[3px] bg-s1"
              style={{ height: h, animationDelay: `${i * 45}ms` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-[3px] bg-s2/45"
                style={{ height: hh }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-[5px]">
        {MONTHS.map((m, i) => (
          <span key={i} className="flex-1 text-center font-mono text-[8px] text-ink-4">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Cost per merged PR — the number the whole product is arguing about. */
function CostLine() {
  const pts = [92, 88, 84, 79, 74, 71, 68, 64, 61, 58, 56, 54];
  const w = 240;
  const h = 62;
  const min = 40;
  const max = 100;
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-[62px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="ps-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--s3)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--s3)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#ps-fill)" />
      <path d={d} fill="none" stroke="var(--s3)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={w} cy={h - ((54 - min) / (max - min)) * h} r="3" fill="var(--s3)" />
    </svg>
  );
}

function TeamRows() {
  const rows = [
    { t: "Platform", v: 92, c: "$54" },
    { t: "Payments", v: 64, c: "$71" },
    { t: "Growth", v: 48, c: "$44" },
    { t: "Mobile", v: 27, c: "$118" },
  ];
  return (
    <div className="mt-3 flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.t} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[10px] text-ink-3">{r.t}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-s1 to-s3"
              style={{ width: `${r.v}%` }}
            />
          </div>
          <span className="tabular w-8 shrink-0 text-right font-mono text-[10px] text-ink-2">
            {r.c}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProductShot() {
  return (
    <AppWindow
      url="app.beholdlabs.com/ai-spend"
      active="AI Spend"
      tabs={["Last 12 months", "By team", "By model"]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="AI spend" meta="12 mo" value="$48,214" sub="+12%">
          <SpendBars />
        </Panel>
        <div className="flex flex-col gap-3">
          <Panel title="Cost per merged PR" meta="trailing" value="$54" sub="−34%">
            <CostLine />
          </Panel>
          <Panel title="Spend by team" meta="cost / PR">
            <TeamRows />
          </Panel>
        </div>
      </div>
    </AppWindow>
  );
}
