/*
 * Why a third instrument is needed at all.
 *
 * The competitive set splits cleanly in two, and both halves are blind in the same place.
 * Telemetry vendors read events — commits, pull requests, tokens, agent runs, incidents —
 * and an event stream cannot contain a judgment, only its residue. Survey vendors read
 * self-report, which is lagging, gameable, and measures how the work felt rather than what
 * it was. Saying so plainly is fair comment and it is also the clearest way to explain what
 * we do differently, which is to read the artifact itself.
 *
 * The third column is the only one that gets the ink treatment. Two neutral cards and one
 * dark one is the whole argument in a glance, before a word is read.
 *
 * Opens with the lines-of-code history because it is the same mistake with a new name, and
 * because a reader who has been in the industry for fifteen years has lived it.
 */

import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const LENSES = [
  {
    eyebrow: "Telemetry",
    who: "Most of this category",
    lead: "Reads the events.",
    body: "Commits, pull requests, tokens, agent runs, incidents. An event stream is an excellent record of what happened and a poor one of whether it should have. Judgment leaves almost no trace in it.",
    dark: false,
  },
  {
    eyebrow: "Surveys",
    who: "The developer-experience tools",
    lead: "Reads the feelings.",
    body: "Ask people how the work went. Honest, useful, and lagging by a quarter. It captures how the work felt to do, which is not the same thing as what the work was worth to keep.",
    dark: false,
  },
  {
    eyebrow: "The work itself",
    who: "Behold",
    lead: "Reads the artifact.",
    body: "What was rejected and why. What was quietly rewritten six weeks later. Where a reviewer changed the direction rather than the wording. Judgment does leave a trace — just not in the event log.",
    dark: true,
  },
];

export function HowWeSee() {
  return (
    <section id="how-we-see" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <SectionHead
          label="Why a third instrument"
          width="wide"
          title={<>Two instruments exist. Neither can see this.</>}
        />

      {/* the history, as a quotation rather than a second headline */}
      <Reveal delay={60}>
        <figure className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-white px-7 py-8 lift sm:px-10 sm:py-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-7 top-5 select-none font-mono text-[4.5rem] leading-none text-line"
          >
            &rdquo;
          </span>
          <blockquote className="relative max-w-3xl">
            <p className="text-balance text-[1.45rem] font-semibold leading-[1.32] tracking-[-0.02em] text-ink sm:text-[1.85rem]">
              The industry spent forty years learning not to count lines. Then it started
              counting again.
            </p>
          </blockquote>
        </figure>
      </Reveal>

      <Reveal delay={110}>
        <div className="mt-10 grid gap-8 text-[15.5px] leading-relaxed text-ink-3 lg:grid-cols-2 lg:gap-14">
          <p>
            For four decades the industry agreed that counting lines was a poor way to measure
            software. It rewards volume, and the engineers you most want to keep are the ones
            who remove volume. A rewrite that deletes two thousand lines and a feature that
            adds two thousand score as opposites, when the first is often worth more. The
            argument was settled and the metric was retired.
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

      <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
        {LENSES.map((l, i) => (
          <Reveal key={l.eyebrow} delay={i * 90}>
            <div
              className={`flex h-full flex-col rounded-2xl border p-7 sm:p-8 ${
                l.dark ? "border-ink/10 bg-ink lift" : "border-line bg-white"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-mono text-[10.5px] uppercase tracking-[0.16em] ${
                    l.dark ? "text-white/50" : "text-ink-4"
                  }`}
                >
                  {l.eyebrow}
                </span>
                <span
                  className={`text-right text-[11px] ${l.dark ? "text-white/40" : "text-ink-4"}`}
                >
                  {l.who}
                </span>
              </div>
              <h3
                className={`mt-5 text-[1.15rem] font-bold leading-snug ${
                  l.dark ? "text-white" : "text-ink"
                }`}
              >
                {l.lead}
              </h3>
              <p
                className={`mt-3.5 text-[13.5px] leading-relaxed ${
                  l.dark ? "text-white/65" : "text-ink-3"
                }`}
              >
                {l.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
