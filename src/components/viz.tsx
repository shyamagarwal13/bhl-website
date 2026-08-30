/*
 * Feature visuals — drawn, not screenshotted. Same reasoning as the hero product shot:
 * they stay sharp, theme with the brand, and can't go stale. Illustrative sample data.
 */

function Card({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 lift">
      <div className="mb-5 flex items-baseline justify-between">
        <span className="text-sm font-bold text-ink">{title}</span>
        {meta && <span className="font-mono text-[10px] uppercase tracking-wide text-ink-4">{meta}</span>}
      </div>
      {children}
    </div>
  );
}

export function SpendBreakdown() {
  const rows = [
    { team: "Platform", cost: "$18.4k", pct: 92, per: "$54" },
    { team: "Payments", cost: "$12.1k", pct: 61, per: "$71" },
    { team: "Growth", cost: "$9.8k", pct: 49, per: "$44" },
    { team: "Mobile", cost: "$5.2k", pct: 26, per: "$118" },
    { team: "Data", cost: "$2.7k", pct: 14, per: "$96" },
  ];
  return (
    <Card title="Spend by team" meta="cost / merged PR">
      <div className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <div key={r.team} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-[13px] text-ink-2">{r.team}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-s1 to-s3"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="tabular w-12 shrink-0 text-right font-mono text-xs text-ink-3">
              {r.cost}
            </span>
            <span className="tabular w-11 shrink-0 text-right font-mono text-xs font-semibold text-s1">
              {r.per}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Explicit pixel heights: a percentage height on a flex child whose parent has no
// resolved height collapses to zero and silently empties the chart.
const COL_H = 140;

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
    <Card title="Human / agent attribution" meta="share of merged changes">
      <div className="flex items-end gap-2.5" style={{ height: COL_H }}>
        {weeks.map((w, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-1">
            <div
              className="grow rounded-t-md bg-gradient-to-b from-s1 to-s2"
              style={{ height: (COL_H - 4) * (w.a / 100), animationDelay: `${i * 60}ms` }}
            />
            <div
              className="rounded-b-md bg-paper-2"
              style={{ height: (COL_H - 4) * (w.h / 100) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5">
        <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
          <span className="h-2.5 w-2.5 rounded-sm bg-s1" /> Agent-assisted
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
          <span className="h-2.5 w-2.5 rounded-sm bg-paper-2" /> Human-only
        </span>
      </div>
    </Card>
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
    <Card title="Developer experience signals" meta="DX index 78">
      <div className="flex flex-col gap-3.5">
        {signals.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-[13px] text-ink-2">{s.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div
                className={`h-full rounded-full ${
                  s.score >= 70 ? "bg-s3" : s.score >= 50 ? "bg-s4" : "bg-s5"
                }`}
                style={{ width: `${s.score}%` }}
              />
            </div>
            <span className="tabular w-6 shrink-0 text-right font-mono text-xs font-semibold text-ink">
              {s.score}
            </span>
            <span
              className={`tabular w-7 shrink-0 text-right font-mono text-[11px] ${
                s.delta.startsWith("+") ? "text-pos" : "text-neg"
              }`}
            >
              {s.delta}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function HotspotTable() {
  const rows = [
    { f: "billing/invoice_engine.py", s: 100, n: 3 },
    { f: "auth/session.ts", s: 74, n: 1 },
    { f: "api/graph/resolvers.ts", s: 62, n: 2 },
    { f: "core/scheduler.go", s: 41, n: 0 },
  ];
  return (
    <Card title="Risk hotspots" meta="complexity × churn">
      <div className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <div key={r.f} className="flex items-center gap-3">
            {/* min-w-0 is load-bearing: a flex item defaults to min-width:auto, so the
                filename refuses to shrink and drags the whole grid track past the
                viewport on small screens. `truncate` alone doesn't save you. */}
            <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink-2">
              {r.f}
            </span>
            {r.n > 0 && (
              <span className="shrink-0 rounded-full bg-s5/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-s5">
                {r.n} finding{r.n > 1 ? "s" : ""}
              </span>
            )}
            <div className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-s4 to-s5"
                style={{ width: `${r.s}%` }}
              />
            </div>
            <span className="tabular w-6 shrink-0 text-right font-mono text-xs text-ink-3">
              {r.s}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
