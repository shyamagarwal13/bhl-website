/*
 * The two instruments that carry the wedge.
 *
 * "Creativity", "taste" and "the human layer" are the position, but a position stated in
 * adjectives loses a bake-off to a competitor holding a number. Weave sells "one
 * standardised unit of work"; P10Y sells "output units". So the claim has to arrive as an
 * instrument with a reading, a unit and a dollar value, or the page reads as a manifesto.
 *
 * Two, not one, and deliberately a pair: a cost and a return. The Slop Index is what the
 * other dashboards score as productivity. The Judgment Rate is the thing they cannot see at
 * all, because it lives in what got rejected, redirected and thrown away rather than in
 * what got merged.
 *
 * Both are drawn in HTML and SVG against the brand tokens rather than captured, for the
 * same reason as the rest of the product shots: sharp anywhere, weighs nothing, cannot go
 * stale. All figures illustrative.
 */

import { Reveal } from "./reveal";

/* --- Slop Index: a segmented meter ---------------------------------------- */

// what the index decomposes into, in the order it is computed
const SLOP_PARTS = [
  { label: "Rework", pct: 38, band: "var(--s5)" },
  { label: "Review burden", pct: 27, band: "var(--s4)" },
  { label: "Complexity added", pct: 21, band: "var(--s1)" },
  { label: "Unexplained change", pct: 14, band: "var(--s2)" },
];

function SlopMeter() {
  return (
    <div>
      {/* the reading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="tabular text-[3.2rem] font-extrabold leading-none tracking-tight text-ink">
              61
            </span>
            <span className="font-mono text-[12px] text-ink-4">/ 100</span>
          </div>
          <p className="mt-2 text-[13px] text-ink-3">
            Up from 24 before assisted authoring
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4">
            Priced
          </p>
          <p className="tabular mt-1 text-[1.5rem] font-extrabold tracking-tight text-ink">
            $412k
          </p>
          <p className="text-[11.5px] text-ink-4">per quarter</p>
        </div>
      </div>

      {/* the decomposition — a single bar, because the parts sum to the reading */}
      <div className="mt-7 flex h-3 w-full overflow-hidden rounded-full">
        {SLOP_PARTS.map((p) => (
          <span key={p.label} style={{ width: `${p.pct}%`, background: p.band }} />
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5">
        {SLOP_PARTS.map((p) => (
          <li key={p.label} className="flex items-center gap-2 text-[12.5px] text-ink-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: p.band }}
            />
            <span className="min-w-0 flex-1 truncate">{p.label}</span>
            <span className="tabular shrink-0 font-mono text-[11px] text-ink-4">{p.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Judgment Rate: where humans changed the direction -------------------- */

// each bar is a team; the filled portion is the share of human interventions that changed
// what was being built rather than how it was written
const TEAMS = [
  { team: "Payments", pct: 34 },
  { team: "Identity", pct: 28 },
  { team: "Ledger", pct: 19 },
  { team: "Growth", pct: 8 },
];

function JudgmentBars() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="tabular text-[3.2rem] font-extrabold leading-none tracking-tight text-ink">
              22
            </span>
            <span className="font-mono text-[12px] text-ink-4">%</span>
          </div>
          <p className="mt-2 text-[13px] text-ink-3">
            Of human review changed direction, not syntax
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4">
            Avoided
          </p>
          <p className="tabular mt-1 text-[1.5rem] font-extrabold tracking-tight text-ink">
            $780k
          </p>
          <p className="text-[11.5px] text-ink-4">per quarter</p>
        </div>
      </div>

      <ul className="mt-7 flex flex-col gap-3.5">
        {TEAMS.map((t) => (
          <li key={t.team} className="flex items-center gap-3">
            <span className="w-[70px] shrink-0 text-[12.5px] font-medium text-ink-2">
              {t.team}
            </span>
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-paper-2">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(t.pct / 34) * 100}%`, background: "var(--t3)" }}
              />
            </span>
            <span className="tabular w-9 shrink-0 text-right font-mono text-[11px] text-ink-4">
              {t.pct}%
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-4">
        Growth ships fastest and thinks least. That is the finding, and no throughput chart
        contains it.
      </p>
    </div>
  );
}

/* --- section -------------------------------------------------------------- */

const CARDS = [
  {
    name: "Slop Index",
    band: "var(--s5)",
    lead: "What plausible-looking work costs you after it merges.",
    body: "Computed from what gets rewritten, what drags review, what compounds as complexity, and what nobody can account for three weeks later. Priced, so it can be argued about in a budget meeting rather than a retro.",
    chart: <SlopMeter />,
  },
  {
    name: "Judgment Rate",
    band: "var(--t3)",
    lead: "Where a person changed the direction rather than the syntax.",
    body: "Read from the work itself: the rejections, the redirections, the designs that were thrown away before they cost anything. It is the only one of our numbers that goes up when people think harder, and it cannot be gamed by producing more.",
    chart: <JudgmentBars />,
  },
];

export function Instruments() {
  return (
    <div className="border-y border-line bg-paper">
      <section id="instruments" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <Reveal>
        <div className="max-w-3xl">
          <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
          <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
            Two numbers nobody else computes.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
            Everything in the next section, every vendor in this category has. These two are
            ours, and they are the reason the rest of it is worth reading.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
        {CARDS.map((c, i) => (
          <Reveal key={c.name} delay={i * 110}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 lift sm:p-9">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: c.band }} />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                  {c.name}
                </span>
              </div>
              {/* Fixed-height copy block rather than `mt-auto` on the chart. Bottom-aligning
                  two charts of different heights leaves their headline figures on different
                  baselines, and two big numbers that nearly line up read as a mistake. */}
              <div className="lg:min-h-[196px]">
                <h3 className="mt-5 text-balance text-[1.2rem] font-bold leading-snug text-ink sm:text-[1.35rem]">
                  {c.lead}
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-ink-3">{c.body}</p>
              </div>
              <div className="pt-2">{c.chart}</div>
            </div>
          </Reveal>
        ))}
      </div>

        <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          Illustrative figures
        </p>
      </section>
    </div>
  );
}
