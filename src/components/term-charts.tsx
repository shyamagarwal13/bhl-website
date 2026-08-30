/*
 * One product panel per equation term.
 *
 * The section claims we measure all six terms. These are the instruments that back the
 * claim — each term gets the actual view you'd open in the app, so the model stops being
 * a diagram and becomes a product tour. Drawn in SVG/CSS for the same reasons as the hero
 * shot: sharp at any size, themed with the brand, no image bandwidth, can't go stale.
 *
 * Illustrative sample data, kept consistent with the $48,214 figure used elsewhere on
 * the page — P's panel sums to it, so a reader who adds up the site doesn't catch us out.
 */

function Frame({
  title,
  filter,
  value,
  unit,
  delta,
  deltaGood,
  band,
  children,
}: {
  title: string;
  filter: string;
  value: string;
  unit: string;
  delta?: string;
  deltaGood?: boolean;
  band: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {/* a hairline of the term's colour along the top edge ties the window to the
          variable it belongs to without repeating the letter a third time */}
      <div className="h-[3px] w-full" style={{ background: band }} />
      <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2">
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
        </span>
        <span className="ml-1.5 truncate font-mono text-[9.5px] text-ink-4">{title}</span>
        <span className="ml-auto shrink-0 rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[9px] text-ink-4">
          {filter}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="tabular text-[1.6rem] font-extrabold leading-none tracking-tight text-ink">
              {value}
            </div>
            <div className="mt-1.5 truncate text-[11.5px] text-ink-3">{unit}</div>
          </div>
          {delta && (
            <span
              className="tabular shrink-0 rounded-md px-2 py-1 font-mono text-[11px] font-bold"
              style={{
                color: deltaGood ? "var(--pos)" : "var(--neg)",
                background: deltaGood
                  ? "color-mix(in srgb, var(--pos) 11%, transparent)"
                  : "color-mix(in srgb, var(--neg) 11%, transparent)",
              }}
            >
              {delta}
            </span>
          )}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

const H = 108; // shared chart height so every panel is the same size when swapped

function Bars({
  data,
  band,
  labels,
  ghost,
}: {
  data: number[];
  band: string;
  labels?: string[];
  ghost?: number[];
}) {
  const max = Math.max(...data, ...(ghost ?? [0]));
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: H }}>
        {data.map((v, i) => (
          <div key={i} className="relative flex-1">
            {ghost && (
              <div
                className="absolute bottom-0 w-full rounded-[3px] bg-paper-2"
                style={{ height: (ghost[i] / max) * H }}
              />
            )}
            <div
              className="absolute bottom-0 w-full rounded-[3px]"
              style={{ height: (v / max) * H, background: band }}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-1.5 flex gap-1.5">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center font-mono text-[8.5px] text-ink-4">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Line({
  pts,
  band,
  threshold,
  labels,
}: {
  pts: number[];
  band: string;
  threshold?: number;
  labels?: string[];
}) {
  const w = 300;
  const max = Math.max(...pts) * 1.12;
  const min = 0;
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = H - ((p - min) / (max - min)) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const ty = threshold !== undefined ? H - (threshold / (max - min)) * H : null;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${H}`} className="w-full" style={{ height: H }} aria-hidden="true">
        <defs>
          <linearGradient id={`tc-${band.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={band} stopOpacity="0.2" />
            <stop offset="100%" stopColor={band} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ty !== null && (
          <line
            x1="0"
            y1={ty}
            x2={w}
            y2={ty}
            stroke="var(--line-2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        )}
        <path d={`${d} L${w},${H} L0,${H} Z`} fill={`url(#tc-${band.replace(/\W/g, "")})`} />
        <path d={d} fill="none" stroke={band} strokeWidth="2" strokeLinecap="round" />
        <circle
          cx={w}
          cy={H - ((pts[pts.length - 1] - min) / (max - min)) * H}
          r="3"
          fill={band}
        />
      </svg>
      {labels && (
        <div className="mt-1.5 flex">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center font-mono text-[8.5px] text-ink-4">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Rows({ rows, band }: { rows: { l: string; v: string; pct: number }[]; band: string }) {
  return (
    <div className="flex flex-col gap-2.5" style={{ minHeight: H }}>
      {rows.map((r) => (
        <div key={r.l} className="flex items-center gap-2.5">
          <span className="w-24 shrink-0 truncate text-[11.5px] text-ink-2">{r.l}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full"
              style={{ width: `${r.pct}%`, background: band }}
            />
          </div>
          <span className="tabular w-11 shrink-0 text-right font-mono text-[11px] font-semibold text-ink">
            {r.v}
          </span>
        </div>
      ))}
    </div>
  );
}

const MONTHS = ["J", "F", "M", "A", "M", "J"];

export function TermChart({ k, band }: { k: string; band: string }) {
  if (k === "F") {
    return (
      <Frame
        title="app.beholdlabs.com/value"
        filter="Last 2 quarters"
        value="$4.1M"
        unit="ARR shipped"
        delta="+18%"
        deltaGood
        band={band}
      >
        <Rows
          band={band}
          rows={[
            { l: "Billing rebuild", v: "$1.6M", pct: 92 },
            { l: "Self-serve onboard", v: "$1.1M", pct: 64 },
            { l: "Mobile checkout", v: "$0.9M", pct: 52 },
            { l: "Search relevance", v: "$0.5M", pct: 29 },
          ]}
        />
      </Frame>
    );
  }
  if (k === "T") {
    return (
      <Frame
        title="app.beholdlabs.com/delivery"
        filter="Last 6 months"
        value="9.4"
        unit="days, idea → production"
        delta="−31%"
        deltaGood
        band={band}
      >
        <Line
          pts={[21, 19, 17.5, 14, 12, 9.4]}
          band={band}
          threshold={12}
          labels={MONTHS}
        />
      </Frame>
    );
  }
  if (k === "P") {
    return (
      <Frame
        title="app.beholdlabs.com/ai-spend"
        filter="Last 6 months"
        value="$24,760"
        unit="build-stage spend"
        delta="+12%"
        deltaGood={false}
        band={band}
      >
        <Rows
          band={band}
          rows={[
            { l: "Platform", v: "$9.4k", pct: 92 },
            { l: "Payments", v: "$6.1k", pct: 61 },
            { l: "Growth", v: "$5.0k", pct: 49 },
            { l: "Mobile", v: "$2.6k", pct: 26 },
          ]}
        />
      </Frame>
    );
  }
  if (k === "L") {
    return (
      <Frame
        title="app.beholdlabs.com/code-health"
        filter="Since adoption"
        value="+41%"
        unit="complexity in changed files"
        delta="12 hotspots"
        deltaGood={false}
        band={band}
      >
        <Line pts={[100, 106, 115, 121, 132, 141]} band={band} labels={MONTHS} />
      </Frame>
    );
  }
  if (k === "E") {
    return (
      <Frame
        title="app.beholdlabs.com/review"
        filter="Last 5 months"
        value="58%"
        unit="merged on first review"
        delta="−14pts"
        deltaGood={false}
        band={band}
      >
        {/* filled = caught at first review, ghost = needed another round */}
        <Bars
          band={band}
          data={[78, 74, 69, 63, 58]}
          ghost={[100, 100, 100, 100, 100]}
          labels={["Jan", "Feb", "Mar", "Apr", "May"]}
        />
      </Frame>
    );
  }
  return (
    <Frame
      title="app.beholdlabs.com/review-load"
      filter="Last 6 months"
      value="41"
      unit="PRs per reviewer, median"
      delta="+96%"
      deltaGood={false}
      band={band}
    >
      <Bars band={band} data={[21, 24, 27, 31, 36, 41]} labels={MONTHS} />
    </Frame>
  );
}
