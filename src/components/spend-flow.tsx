/*
 * The prism flow — the proposition as a diagram.
 *
 * One bill enters, gets split by a prism, and leaves as priced outcomes. It's the visual
 * form of the subhead: what you put in, what you got out, both in dollars.
 *
 * The outcome figures sum to the input exactly ($34.1k + $8.9k + $5.2k = $48.2k), and the
 * input matches the total in the product shot and the stage cards. A demo whose numbers
 * don't reconcile is the precise failure this product exists to fix, and the buyer will
 * add them up.
 */

const OUT = [
  { label: "Shipped, still live", amount: "$34.1k", pct: 71, band: "var(--s3)" },
  { label: "Abandoned before merge", amount: "$8.9k", pct: 18, band: "var(--s4)" },
  { label: "Merged, then reverted", amount: "$5.2k", pct: 11, band: "var(--s5)" },
];

function Prism() {
  return (
    <svg width="86" height="78" viewBox="0 0 86 78" fill="none" aria-hidden="true">
      {/* incoming beam */}
      <path d="M0 39h22" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round" />
      {/* the glass */}
      <path
        d="M43 12 66 56H20L43 12Z"
        fill="url(#glass)"
        stroke="var(--line-2)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* the split — five bands leaving at spreading angles */}
      {[
        { y: 26, c: "var(--s1)" },
        { y: 33, c: "var(--s2)" },
        { y: 40, c: "var(--s3)" },
        { y: 47, c: "var(--s4)" },
        { y: 54, c: "var(--s5)" },
      ].map((b, i) => (
        <path
          key={i}
          d={`M56 ${b.y} H86`}
          stroke={b.c}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      <defs>
        <linearGradient id="glass" x1="20" y1="12" x2="66" y2="56">
          <stop offset="0%" stopColor="var(--s1)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--s4)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SpendFlow() {
  return (
    <div className="rounded-2xl border border-line bg-white/80 p-6 backdrop-blur-sm lift sm:p-8">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
        {/* in */}
        <div className="shrink-0 text-center md:text-left">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">
            AI bill · 12 months
          </div>
          <div className="tabular mt-1.5 text-[2rem] font-extrabold tracking-tight text-ink">
            $48,214
          </div>
          <div className="mt-0.5 text-[12.5px] text-ink-3">One line on an invoice</div>
        </div>

        {/* the prism — rotated a quarter turn when the layout stacks */}
        <div className="shrink-0 rotate-90 md:rotate-0">
          <Prism />
        </div>

        {/* out */}
        <div className="w-full min-w-0 flex-1">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-4">
            What it bought
          </div>
          <div className="flex flex-col gap-2.5">
            {OUT.map((o) => (
              <div key={o.label} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: o.band }}
                />
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink-2">
                  {o.label}
                </span>
                <div className="hidden h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-paper-2 sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${o.pct}%`, background: o.band }}
                  />
                </div>
                <span className="tabular w-11 shrink-0 text-right font-mono text-[13px] font-bold text-ink">
                  {o.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-3">
        <span className="font-semibold text-ink">$14.1k — 29%</span> of this bill bought nothing
        that is still running. No invoice will ever tell you that.
      </p>
    </div>
  );
}
