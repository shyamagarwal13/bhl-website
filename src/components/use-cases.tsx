import { Reveal } from "./reveal";

/*
 * Use cases.
 *
 * A card grid, deliberately: this is a reference section a reader skims, not a narrative.
 * The page already has one scroll-driven section, and a second turns a list into six
 * screens you have to sit through to reach the one that applies to you.
 *
 * Every vendor in the category runs a six-card grid here, so the differentiator can't be
 * the format — it's what the cards say. Each names a decision a leader is already making
 * and states the mechanism plainly, in one sentence.
 *
 * No "Learn more" links: the reference has pages behind theirs and we don't. Six links to
 * nowhere would undo the credibility the research section is building.
 */

type Case = {
  t: string;
  d: string;
  band: string;
  icon: React.ReactNode;
};

const S = { w: 20, h: 20, viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.7 } as const;

const CASES: Case[] = [
  {
    t: "Align AI Spend With What Matters",
    d: "See exactly how AI and engineering effort maps to the initiatives you care about, so leaders can confirm investment is flowing to the highest-priority work, not just the loudest.",
    band: "var(--t1)",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    t: "Show the Real ROI of AI",
    d: "Tie AI costs and engineering activity directly to shipped outcomes. Know what your AI adoption is actually delivering, and whether it's genuinely accelerating how fast you ship.",
    band: "var(--t3)",
    icon: (
      <>
        <path d="M3 17.5l5.5-5.5 3.5 3.5L20.5 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    t: "Build a Smarter Metrics Practice",
    d: "Design flexible metrics spanning delivery, investment, and day-to-day workflows, with AI that reads the data for you and highlights what deserves attention next.",
    band: "var(--t2)",
    icon: (
      <>
        <path d="M4 20V11M9.5 20V4M15 20v-6M20.5 20v-9" strokeLinecap="round" />
      </>
    ),
  },
  {
    t: "Elevate How Teams Use AI",
    d: "See how engineers actually prompt, iterate, and weave AI into the development lifecycle. Spot the patterns and habits that reliably lead to better results, and spread them across teams.",
    band: "var(--t5)",
    icon: (
      <>
        <circle cx="6" cy="7" r="2.2" />
        <circle cx="18" cy="7" r="2.2" />
        <circle cx="12" cy="17.5" r="2.2" />
        <path d="M7.6 8.6l3 7M16.4 8.6l-3 7M8.2 7h7.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    t: "Remove Friction From Developer Workflows",
    d: "Capture structured feedback from your engineers to pinpoint what's slowing them down, then act on it to lift productivity and satisfaction.",
    band: "var(--t4)",
    icon: (
      <>
        <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" strokeLinecap="round" />
        <circle cx="9" cy="7.5" r="2.1" fill="var(--white)" />
        <circle cx="15.5" cy="12" r="2.1" fill="var(--white)" />
        <circle cx="7.5" cy="16.5" r="2.1" fill="var(--white)" />
      </>
    ),
  },
  {
    t: "Simplify Compliance and Financial Reporting",
    d: "Replace manual time tracking with automated, audit-ready reports for software capitalization and R&D tax credits.",
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
              Each of these is a decision already being made, usually without the evidence to
              settle it.
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
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">{c.d}</p>

              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
