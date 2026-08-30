import { Reveal } from "./reveal";

/*
 * Use cases.
 *
 * A card grid, deliberately: this is a reference section a reader skims, not a narrative.
 * The page already has one scroll-driven section, and a second turns a list into six
 * screens you have to sit through to reach the one that applies to you.
 *
 * Every vendor in the category runs a six-card grid here, so the differentiator can't be
 * the format — it's what the cards say. Each names a decision a leader is already making,
 * states the mechanism plainly, and tags the terms of the model it moves. That last part
 * ties the section back to the equation, and is the piece nobody without the model can
 * copy.
 *
 * No "Learn more" links: the reference has pages behind theirs and we don't. Six links to
 * nowhere would undo the credibility the research section is building.
 */

type Case = {
  t: string;
  d: string;
  terms: string[];
  band: string;
  icon: React.ReactNode;
};

const S = { w: 20, h: 20, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.7 } as const;

const CASES: Case[] = [
  {
    t: "Connect AI Spend to Delivered Software",
    d: "Attribute model, tool and seat costs to the teams, repositories and merged changes they produced, so investment decisions rest on measured unit cost rather than an invoice total.",
    terms: ["P", "F"],
    band: "var(--t1)",
    icon: (
      <>
        <path d="M12 3v18" strokeLinecap="round" />
        <path d="M16.5 7.5A3.5 3.5 0 0 0 13 5h-2a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-2a3.5 3.5 0 0 1-3.5-2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    t: "Measure the Cost of Rework and Waste",
    d: "Separate work that shipped and stayed in production from work abandoned before merge or reverted afterwards, and cost each independently, so the share of spend that produced nothing becomes visible.",
    terms: ["L(t)", "P"],
    band: "var(--t4)",
    icon: (
      <>
        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
        <path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" strokeLinecap="round" />
      </>
    ),
  },
  {
    t: "Track Review Capacity and Effectiveness",
    d: "Monitor first-pass review rates alongside reviewer load, so a decline in review depth is identified as a trend and addressed before the consequences reach production.",
    terms: ["E", "R"],
    band: "var(--t5)",
    icon: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
  },
  {
    t: "Identify and Quantify Developer Friction",
    d: "Combine delivery telemetry with targeted developer feedback to locate where engineering time is lost, quantified in hours so remediation can be prioritized against other work.",
    terms: ["T"],
    band: "var(--t2)",
    icon: (
      <>
        <path d="M14.5 4.5a4.5 4.5 0 0 0 5.9 5.9L12 18.8 5.2 12l8.4-8.4a4.5 4.5 0 0 0 .9.9Z" strokeLinejoin="round" />
        <path d="M5.2 12 3 20l8-2.2" strokeLinejoin="round" />
      </>
    ),
  },
  {
    t: "Benchmark Teams on Comparable Metrics",
    d: "Normalize unit cost for the composition of work each team performs, so cross-team comparisons stay defensible when the teams being measured review the results.",
    terms: ["P", "T"],
    band: "var(--t3)",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" strokeLinecap="round" />,
  },
  {
    t: "Report Engineering Economics to Finance",
    d: "Deliver unit-cost reporting reconciled to provider billing with the full derivation attached, suitable for software capitalization, R&D tax credits and board-level reporting.",
    terms: ["F", "P"],
    band: "var(--t1)",
    icon: (
      <>
        <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
        <path d="M8 11h8M8 15h5" strokeLinecap="round" />
      </>
    ),
  },
];

export function UseCases() {
  return (
    <div className="border-y border-line bg-paper/60">
      <section id="use-cases" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              What engineering leaders use it for.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Each of these is a decision already being made without the evidence to settle it.
              The tag on every card names the terms of the model that decision moves.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.t} delay={(i % 3) * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `color-mix(in srgb, ${c.band} 28%, transparent)`,
                    background: `color-mix(in srgb, ${c.band} 8%, transparent)`,
                    color: c.band,
                  }}
                >
                  <svg {...S} stroke="currentColor" aria-hidden="true">
                    {c.icon}
                  </svg>
                </span>

                <h3 className="mt-5 text-balance text-[1.05rem] font-bold leading-snug text-ink">
                  {c.t}
                </h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-ink-3">{c.d}</p>

                <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4">
                    Moves
                  </span>
                  {c.terms.map((t) => (
                    <span
                      key={t}
                      className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold"
                      style={{
                        color: c.band,
                        background: `color-mix(in srgb, ${c.band} 10%, transparent)`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
