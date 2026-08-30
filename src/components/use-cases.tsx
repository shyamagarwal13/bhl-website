import { Reveal } from "./reveal";

/*
 * Use cases.
 *
 * Every vendor in this category runs a six-card grid here, so the differentiator can't be
 * the format — it has to be what the cards say. Each one names a question a leader can't
 * currently answer, and tags which terms of the equation it moves. That ties the section
 * back to the model instead of listing capabilities in a vacuum, and it's a claim only a
 * company with the model can make.
 *
 * Deliberately no "Learn more" links: there is nothing behind them yet, and a grid of six
 * dead links is worse than a grid of six honest statements.
 */

type Case = {
  q: string;
  d: string;
  terms: string[];
  band: string;
  icon: React.ReactNode;
};

const S = { w: 20, h: 20, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.7 } as const;

const CASES: Case[] = [
  {
    q: "Attribute AI Spend to Delivered Work",
    d: "Resolve provider invoices and tool costs down to the team, repository and merged change they produced, so investment decisions rest on unit economics rather than a total and an assumption.",
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
    q: "Quantify Rework and Abandoned Investment",
    d: "Separate work that shipped and remained in production from work abandoned before merge or reverted after it, and price each independently. Both consumed the same budget; only one returned anything.",
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
    q: "Monitor Review Capacity and Effectiveness",
    d: "Track the proportion of changes merged on first review alongside reviewer load, so declining review depth is visible as a trend rather than discovered through a production incident.",
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
    q: "Locate and Price Developer Friction",
    d: "Combine delivery telemetry with targeted developer input to identify where time is lost across the lifecycle, ranked by the hours each source of friction costs the organisation.",
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
    q: "Benchmark Teams on Comparable Terms",
    d: "Normalise unit cost for the work each team actually performs, so comparisons between a payments platform and a growth surface hold up to scrutiny from the teams being compared.",
    terms: ["P", "T"],
    band: "var(--t3)",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20v-11" strokeLinecap="round" />,
  },
  {
    q: "Produce Audit-Ready Engineering Economics",
    d: "Report unit economics reconciled to provider billing, with the derivation attached to every figure — suitable for capitalisation, R&D claims and board reporting without a translation layer.",
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
            <Reveal key={c.q} delay={(i % 3) * 80}>
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
                  {c.q}
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
