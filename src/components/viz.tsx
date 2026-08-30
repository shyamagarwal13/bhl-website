/*
 * Stage visuals — drawn, not screenshotted. They stay sharp, theme with the brand, and
 * can't go stale the way a screenshot of a shipping product does.
 *
 * These express the proposition directly: one AI invoice, traced through the stages of
 * delivery, with a dollar figure on each. The four stage totals sum to $48,214 — the same
 * figure in the hero product shot, because a demo whose numbers don't reconcile is the
 * exact failure this product exists to fix.
 *
 * Illustrative sample data.
 */

function Card({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 lift">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <span className="text-sm font-bold text-ink">{title}</span>
        {meta && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink-4">
            {meta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export const STAGES = [
  { name: "Plan", amount: 6214, band: "var(--s1)" },
  { name: "Build", amount: 24_760, band: "var(--s2)" },
  { name: "Review", amount: 9680, band: "var(--s3)" },
  { name: "Release", amount: 7560, band: "var(--s4)" },
];

const TOTAL = STAGES.reduce((n, s) => n + s.amount, 0);
const money = (n: number) => `$${(n / 1000).toFixed(1)}k`;

/** The signature visual: one invoice refracted into stages. */
export function StageSplit({ active = -1 }: { active?: number }) {
  return (
    <Card title="Where the AI dollar goes" meta={`$${TOTAL.toLocaleString()} · 12 mo`}>
      {/* the prism itself — one bar, split by stage */}
      <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full">
        {STAGES.map((s, i) => (
          <div
            key={s.name}
            className="h-full rounded-full transition-opacity duration-500"
            style={{
              width: `${(s.amount / TOTAL) * 100}%`,
              background: s.band,
              opacity: active === -1 || active === i ? 1 : 0.28,
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {STAGES.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-3 transition-opacity duration-500"
            style={{ opacity: active === -1 || active === i ? 1 : 0.4 }}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.band }} />
            <span className="w-16 shrink-0 text-[13px] font-medium text-ink-2">{s.name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${(s.amount / TOTAL) * 100}%`, background: s.band }}
              />
            </div>
            <span className="tabular w-12 shrink-0 text-right font-mono text-xs font-semibold text-ink">
              {money(s.amount)}
            </span>
            <span className="tabular w-8 shrink-0 text-right font-mono text-[11px] text-ink-4">
              {Math.round((s.amount / TOTAL) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Build — the stage that eats half the budget, priced per unit actually shipped. */
export function BuildCost() {
  const rows = [
    { team: "Platform", cost: "$9.4k", pct: 92, per: "$54" },
    { team: "Payments", cost: "$6.1k", pct: 61, per: "$71" },
    { team: "Growth", cost: "$5.0k", pct: 49, per: "$44" },
    { team: "Mobile", cost: "$2.6k", pct: 26, per: "$118" },
    { team: "Data", cost: "$1.7k", pct: 17, per: "$96" },
  ];
  return (
    <Card title="Build — cost per merged pull request" meta="$24.8k · by team">
      <div className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <div key={r.team} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-[13px] text-ink-2">{r.team}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-s2 to-s3"
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <span className="tabular w-11 shrink-0 text-right font-mono text-xs text-ink-3">
              {r.cost}
            </span>
            <span className="tabular w-11 shrink-0 text-right font-mono text-xs font-semibold text-ink">
              {r.per}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-3">
        Mobile costs <span className="font-semibold text-ink">2.7×</span> more per merged change
        than Growth — worth a conversation, not a reprimand.
      </p>
    </Card>
  );
}

/** Review — the stage nobody budgets for. */
export function ReviewCost() {
  const rounds = [
    { r: "Merged on first review", share: 58, cost: "$3.9k", first: true },
    { r: "One revision round", share: 27, cost: "$3.1k", first: false },
    { r: "Two rounds", share: 11, cost: "$1.8k", first: false },
    { r: "Three or more", share: 4, cost: "$0.9k", first: false },
  ];
  return (
    <Card title="Review — the cost of going around again" meta="$9.7k · by rounds">
      <div className="flex flex-col gap-3.5">
        {rounds.map((x) => (
          <div key={x.r} className="flex items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{x.r}</span>
            <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-paper-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${x.share}%`, background: x.first ? "var(--s3)" : "var(--s4)" }}
              />
            </div>
            <span className="tabular w-8 shrink-0 text-right font-mono text-[11px] text-ink-4">
              {x.share}%
            </span>
            <span className="tabular w-11 shrink-0 text-right font-mono text-xs font-semibold text-ink">
              {x.cost}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-3">
        <span className="font-semibold text-ink">$5.8k</span> — 60% of review spend — went on
        changes that needed a second look.
      </p>
    </Card>
  );
}

/** Release — what the money actually produced, including what it didn't. */
export function ReleaseOutcome() {
  const rows = [
    { l: "Shipped and still live", pct: 71, cost: "$5.4k", band: "var(--s3)" },
    { l: "Abandoned before merge", pct: 18, cost: "$1.4k", band: "var(--s4)" },
    { l: "Merged, then reverted", pct: 11, cost: "$0.8k", band: "var(--s5)" },
  ];
  return (
    <Card title="Release — what the money produced" meta="$7.6k · outcomes">
      <div className="mb-5 flex h-3 w-full gap-1 overflow-hidden rounded-full">
        {rows.map((r) => (
          <div
            key={r.l}
            className="h-full rounded-full"
            style={{ width: `${r.pct}%`, background: r.band }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3.5">
        {rows.map((r) => (
          <div key={r.l} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.band }} />
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{r.l}</span>
            <span className="tabular w-8 shrink-0 text-right font-mono text-[11px] text-ink-4">
              {r.pct}%
            </span>
            <span className="tabular w-11 shrink-0 text-right font-mono text-xs font-semibold text-ink">
              {r.cost}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-3">
        <span className="font-semibold text-ink">29%</span> of this stage bought nothing that is
        still running. That is the number worth acting on.
      </p>
    </Card>
  );
}
