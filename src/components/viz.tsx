/*
 * Product visuals, drawn rather than screenshotted.
 *
 * A landing page for a measurement company should show measurement. These are real
 * SVG charts built from real arrays — they scale, they theme, they cost no image
 * bandwidth, and they can't go stale the way a screenshot does. Everything here is a
 * server component; no client JS ships for any of it.
 *
 * The figures are illustrative sample data, chosen to be plausible rather than flattering.
 */

/* --- primitives ----------------------------------------------------------- */

/*
 * `domain` is required when two series share a chart. Letting each series normalize to
 * its own min/max makes their relative position meaningless — the lines would cross
 * wherever the maths happened to put them, which is exactly the kind of chart this
 * company exists to argue against.
 */
function path(points: number[], w: number, h: number, domain: [number, number], pad = 2) {
  const [min, max] = domain;
  const span = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  return points
    .map((p, i) => {
      const x = pad + i * step;
      const y = pad + (h - pad * 2) * (1 - (p - min) / span);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AreaLine({
  points,
  domain,
  w = 520,
  h = 150,
  color = "var(--teal)",
  fill = true,
  id,
}: {
  points: number[];
  domain: [number, number];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
  id: string;
}) {
  const d = path(points, w, h, domain);
  const area = `${d} L${w - 2},${h} L2,${h} Z`;
  return (
    <>
      {fill && (
        <>
          <defs>
            <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.26" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#g-${id})`} />
        </>
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw"
        style={{ ["--len" as string]: "1400" }}
      />
    </>
  );
}

function GridLines({ w, h, rows = 4 }: { w: number; h: number; rows?: number }) {
  return (
    <g stroke="var(--hairline)" strokeWidth="1">
      {Array.from({ length: rows }, (_, i) => {
        const y = ((i + 1) * h) / (rows + 1);
        return <line key={i} x1="0" y1={y} x2={w} y2={y} opacity="0.55" />;
      })}
    </g>
  );
}

export function Delta({ value, good = true }: { value: string; good?: boolean }) {
  return (
    <span
      className={`font-mono text-[11px] tabular ${good ? "text-teal" : "text-danger"}`}
    >
      {value}
    </span>
  );
}

/* --- hero console --------------------------------------------------------- */

// Both indexed to 100 at week 1, so the shared scale is meaningful: output pulls away
// from spend, which is the whole claim the panel is making.
const SPEND = [12, 18, 24, 31, 40, 48, 56, 62, 68, 72, 76, 79];
const OUTPUT = [13, 20, 29, 38, 52, 66, 81, 94, 106, 119, 133, 148];
const DOMAIN: [number, number] = [0, 160];

export function HeroConsole() {
  const w = 560;
  const h = 168;
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface/85 shadow-2xl shadow-black/40 backdrop-blur">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-hairline bg-surface-2/60 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-teal live-dot" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-faint">
          Engineering intelligence · last 12 weeks
        </span>
        <span className="ml-auto font-mono text-[11px] text-text-faint">acme / platform</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
        {[
          { l: "AI spend", v: "$48.2k", d: "+12%", good: false },
          { l: "Cost / merged PR", v: "$61", d: "−34%", good: true },
          { l: "Agent-assisted", v: "62%", d: "+9pts", good: true },
          { l: "DX index", v: "78", d: "+4", good: true },
        ].map((k) => (
          <div key={k.l} className="bg-surface px-4 py-3.5">
            <div className="text-[11px] text-text-muted">{k.l}</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-semibold tabular text-text">{k.v}</span>
              <Delta value={k.d} good={k.good} />
            </div>
          </div>
        ))}
      </div>

      {/* chart */}
      <div className="px-4 pb-4 pt-5">
        <div className="mb-3 flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
            <span className="h-[2px] w-3 rounded bg-gold" /> Spend
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
            <span className="h-[2px] w-3 rounded bg-teal" /> Merged output
          </span>
          <span className="ml-auto font-mono text-[11px] text-teal">output ↑ 2.1× spend</span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-[168px] w-full"
          role="img"
          aria-label="Chart: AI spend rising steadily while merged engineering output rises faster."
        >
          <GridLines w={w} h={h} />
          <AreaLine points={SPEND} domain={DOMAIN} w={w} h={h} color="var(--gold)" id="spend" />
          <AreaLine points={OUTPUT} domain={DOMAIN} w={w} h={h} color="var(--teal)" id="out" />
        </svg>
      </div>
    </div>
  );
}

/* --- feature visuals ------------------------------------------------------ */

export function SpendBreakdown() {
  const rows = [
    { team: "Platform", cost: "$18.4k", pct: 92, per: "$54" },
    { team: "Payments", cost: "$12.1k", pct: 61, per: "$71" },
    { team: "Growth", cost: "$9.8k", pct: 49, per: "$44" },
    { team: "Mobile", cost: "$5.2k", pct: 26, per: "$118" },
    { team: "Data", cost: "$2.7k", pct: 14, per: "$96" },
  ];
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-sm font-medium text-text">Spend by team</span>
        <span className="font-mono text-[11px] text-text-faint">cost / merged PR</span>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.team} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-text-muted">{r.team}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right font-mono text-xs tabular text-text-muted">
              {r.cost}
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-xs tabular text-teal">
              {r.per}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const COL_H = 132;

export function AttributionSplit() {
  const weeks = [
    { h: 62, a: 38 },
    { h: 58, a: 42 },
    { h: 55, a: 45 },
    { h: 49, a: 51 },
    { h: 44, a: 56 },
    { h: 41, a: 59 },
    { h: 38, a: 62 },
  ];
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="mb-1 text-sm font-medium text-text">Human / agent attribution</div>
      <p className="mb-4 font-mono text-[11px] text-text-faint">share of merged changes</p>
      {/* Explicit pixel heights: a percentage height on a flex child whose parent has no
          resolved height collapses to zero, which silently emptied this chart. */}
      <div className="flex items-end gap-2" style={{ height: COL_H }}>
        {weeks.map((w, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-0.5">
            <div
              className="rounded-t bg-teal/80"
              style={{ height: (COL_H - 2) * (w.a / 100) }}
            />
            <div
              className="rounded-b bg-surface-3"
              style={{ height: (COL_H - 2) * (w.h / 100) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
          <span className="h-2 w-2 rounded-sm bg-teal/80" /> Agent-assisted
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
          <span className="h-2 w-2 rounded-sm bg-surface-3" /> Human-only
        </span>
      </div>
    </div>
  );
}

export function DxSignals() {
  const signals = [
    { label: "Deep work time", score: 82, delta: "+6" },
    { label: "Build & test speed", score: 54, delta: "−3" },
    { label: "Code review latency", score: 71, delta: "+11" },
    { label: "Local dev setup", score: 88, delta: "+2" },
    { label: "Documentation", score: 47, delta: "−1" },
  ];
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="mb-4 text-sm font-medium text-text">Developer experience signals</div>
      <div className="flex flex-col gap-3.5">
        {signals.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-sm text-text-muted">{s.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${s.score >= 70 ? "bg-teal" : s.score >= 50 ? "bg-warn" : "bg-danger"}`}
                style={{ width: `${s.score}%` }}
              />
            </div>
            <span className="w-7 shrink-0 text-right font-mono text-xs tabular text-text">
              {s.score}
            </span>
            <span
              className={`w-8 shrink-0 text-right font-mono text-[11px] tabular ${
                s.delta.startsWith("+") ? "text-teal" : "text-danger"
              }`}
            >
              {s.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HotspotTable() {
  const rows = [
    { f: "billing/invoice_engine.py", c: 412, ch: 61, s: 100 },
    { f: "auth/session.ts", c: 288, ch: 47, s: 74 },
    { f: "api/graph/resolvers.ts", c: 201, ch: 52, s: 62 },
    { f: "core/scheduler.go", c: 174, ch: 38, s: 41 },
  ];
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="mb-1 text-sm font-medium text-text">Risk hotspots</div>
      <p className="mb-4 font-mono text-[11px] text-text-faint">complexity × change frequency</p>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.f} className="flex items-center gap-3">
            <span className="flex-1 truncate font-mono text-xs text-text">{r.f}</span>
            <div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gold" style={{ width: `${r.s}%` }} />
            </div>
            <span className="w-7 shrink-0 text-right font-mono text-xs tabular text-text-faint">
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
