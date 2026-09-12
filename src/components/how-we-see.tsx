/*
 * Why a third instrument is needed at all.
 *
 * Telemetry vendors read events, and an event stream cannot contain a judgment — only its
 * residue. Survey vendors read self-report, which lags a quarter and measures how the work
 * felt rather than what it was worth. Saying so plainly is fair comment and the clearest way
 * to explain what we do instead, which is to read the artifact.
 *
 * Set as three ruled entries in one table rather than three cards, so the comparison reads
 * as one instrument list with ours at the bottom — and so the page's grid survives. The
 * pull quote above them is a real pull quote now: hanging rule, no container, no decorative
 * glyph. A quotation in a rounded box with a floating 72px curly quote is the most templated
 * component in generated marketing sites, and it was sitting on the best sentence here.
 */

import { Reveal } from "./reveal";

const LENSES = [
  {
    n: "01",
    eyebrow: "Telemetry",
    who: "Most of this category",
    lead: "Reads the events.",
    body: "Commits, pull requests, tokens, agent runs, incidents. An excellent record of what happened and a poor one of whether it should have. Judgment leaves almost no trace in it.",
    us: false,
  },
  {
    n: "02",
    eyebrow: "Surveys",
    who: "The developer-experience tools",
    lead: "Reads the feelings.",
    body: "Ask people how the work went. Honest, useful, and lagging by a quarter. It captures how the work felt to do, which is not what the work was worth to keep.",
    us: false,
  },
  {
    n: "03",
    eyebrow: "The work itself",
    who: "Behold",
    lead: "Reads the artifact.",
    body: "What was rejected and why. What was quietly rewritten six weeks later. Where a reviewer changed the direction rather than the wording. Judgment does leave a trace, just not in the event log.",
    us: true,
  },
];

export function HowWeSee() {
  return (
    <section id="how-we-see" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <Reveal>
        <div className="flex items-baseline gap-5">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
            Why a third instrument
          </span>
          <span className="rule mb-1 flex-1" />
        </div>
      </Reveal>

      {/* the pull quote, hung on a rule rather than boxed */}
      <Reveal delay={60}>
        <figure className="mt-14 border-t border-ink pt-10">
          <blockquote>
            <p className="h2 max-w-[22ch] text-[2.4rem] leading-[1.08] text-ink sm:text-[3.4rem]">
              The industry spent forty years learning not to count lines. Then it started
              counting again.
            </p>
          </blockquote>
        </figure>
      </Reveal>

      <Reveal delay={110}>
        <div className="mt-12 grid gap-8 text-[15.5px] leading-relaxed text-ink-3 lg:grid-cols-2 lg:gap-16">
          <p>
            For four decades the industry agreed that counting lines was a poor way to measure
            software. It rewards volume, and the engineers you most want to keep are the ones
            who remove volume. A rewrite that deletes two thousand lines and a feature that adds
            two thousand score as opposites, when the first is often worth more. The argument
            was settled and the metric was retired.
          </p>
          <p>
            Then AI arrived and the same number came back wearing a new name. Share of code
            written by AI. Tokens consumed. Suggestions accepted. Pull requests merged. Every
            one of them counts the act of writing, and that too{" "}
            <span className="font-semibold text-ink">
              at the exact moment writing stopped being the expensive part
            </span>
            . A metric that was merely gameable when a human had to type it is unbounded when a
            machine does.
          </p>
        </div>
      </Reveal>

      {/* three instruments, one table, ours last */}
      <div className="mt-16">
        {LENSES.map((l, i) => (
          <Reveal key={l.eyebrow} delay={i * 70}>
            <div
              className={`grid items-baseline gap-x-10 gap-y-3 border-t py-8 lg:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)] ${
                l.us ? "border-ink" : "border-line"
              }`}
            >
              <span className={`figure text-[1.3rem] ${l.us ? "text-ink" : "text-ink-4"}`}>
                {l.n}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      l.us ? "text-ink-2" : "text-ink-4"
                    }`}
                  >
                    {l.eyebrow}
                  </span>
                  <span className="font-mono text-[10px] text-ink-4">{l.who}</span>
                </div>
                <h3
                  className={`h2 mt-3 text-[1.5rem] sm:text-[1.75rem] ${
                    l.us ? "text-ink" : "text-ink-3"
                  }`}
                >
                  {l.lead}
                </h3>
              </div>

              <p
                className={`text-[14.5px] leading-relaxed ${l.us ? "text-ink-2" : "text-ink-3"}`}
              >
                {l.body}
              </p>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
