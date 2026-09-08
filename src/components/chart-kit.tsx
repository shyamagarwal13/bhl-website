/*
 * The chart kit.
 *
 * A product window and the four things we draw inside one. Extracted so the showcase
 * panels and anything added later share one visual language instead of each inventing a
 * frame. Drawn in SVG and CSS rather than shipped as images: sharp at any size, themed
 * with the brand tokens, no image bandwidth, and it cannot go stale the way a screenshot
 * of last quarter's UI does.
 *
 * Sample data throughout, kept internally consistent with the $48,214 used elsewhere on
 * the page so a reader who adds up the site does not catch us out.
 */

export const H = 108; // shared chart height so every panel is the same size when swapped

export function Bars({
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

export function Line({
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

export function Rows({ rows, band }: { rows: { l: string; v: string; pct: number }[]; band: string }) {
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
