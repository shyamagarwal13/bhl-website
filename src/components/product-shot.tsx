/*
 * The product shot — built, not screenshotted.
 *
 * A real app frame rendered in HTML/CSS/SVG. It stays sharp on every display, themes with
 * the brand, weighs nothing next to a 2x PNG, and can't drift out of date the way a
 * screenshot of a shipping product does. Figures are illustrative sample data.
 */

const SPEND = [38, 46, 41, 58, 64, 72, 69, 88, 94, 86, 108, 121];
const HUMAN = [30, 34, 30, 40, 42, 46, 44, 52, 55, 50, 60, 64];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ${
        active ? "bg-indigo/10 text-indigo" : "text-ink-4"
      }`}
    >
      {label}
    </span>
  );
}

function Panel({
  title,
  meta,
  value,
  sub,
  children,
}: {
  title: string;
  meta?: string;
  value?: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold text-ink-2">{title}</span>
        {meta && <span className="font-mono text-[9px] text-ink-4">{meta}</span>}
      </div>
      {value && (
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="tabular text-[19px] font-extrabold tracking-tight text-ink">
            {value}
          </span>
          {sub && <span className="font-mono text-[10px] text-pos">{sub}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

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
              className="grow relative flex-1 rounded-[3px] bg-indigo"
              style={{ height: h, animationDelay: `${i * 45}ms` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-[3px] bg-violet/45"
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
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#ps-fill)" />
      <path d={d} fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={w} cy={h - ((54 - min) / (max - min)) * h} r="3" fill="var(--teal)" />
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
              className="h-full rounded-full bg-gradient-to-r from-indigo to-rose"
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
    <div className="overflow-hidden rounded-xl border border-line bg-white lift-lg sm:rounded-2xl">
      {/* app chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2 sm:px-4">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
        </span>
        <span className="ml-2 hidden rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-ink-4 sm:block">
          app.beholdlabs.com/ai-spend
        </span>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-[132px] shrink-0 border-r border-line bg-paper/60 p-3 lg:block">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-4 w-4 rounded bg-gradient-to-br from-indigo to-rose" />
            <span className="text-[11px] font-bold tracking-tight text-ink">Behold</span>
          </div>
          {["Overview", "AI Spend", "Delivery", "DevEx", "Code health", "People"].map((n, i) => (
            <div
              key={n}
              className={`mb-0.5 rounded-md px-2 py-1.5 text-[11px] ${
                i === 1 ? "bg-white font-semibold text-indigo lift" : "text-ink-3"
              }`}
            >
              {n}
            </div>
          ))}
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1 bg-paper/40 p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-1.5 overflow-hidden">
            <Tab label="Last 12 months" active />
            <Tab label="By team" />
            <Tab label="By model" />
            <span className="ml-auto hidden rounded-md bg-indigo px-2.5 py-1 text-[10px] font-semibold text-white sm:block">
              Export
            </span>
          </div>

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
        </div>
      </div>
    </div>
  );
}
