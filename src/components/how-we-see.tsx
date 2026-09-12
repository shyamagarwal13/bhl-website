/*
 * Why measuring this needs more than one instrument — and a person.
 *
 * This section used to set telemetry and surveys up as two rival camps and place us outside
 * both. That was a bad argument for us to be making, because we use both: telemetry is how
 * you establish what happened, surveys are how you learn how it felt, and neither is a
 * competitor. The three-card comparison went with it.
 *
 * What remains is the actual claim. There is a great deal to account for now, each instrument
 * reaches only part of it, and every organisation adopts AI differently enough that a reading
 * from one does not transfer to another — which is where the last term comes in. That lands
 * as an equation because it is one, and it is the only place on this page where type moves.
 */

import { Reveal } from "./reveal";

/* The terms, in the order you would say them. Each carries what it is actually good for, so
   the equation teaches instead of merely asserting. */
const TERMS = [
  { t: "Telemetry", d: "What happened. Commits, pull requests, tokens, agent runs." },
  { t: "Surveys", d: "How it felt to the people doing it, which telemetry never shows." },
  { t: "Experts", d: "What it means here, because no two organisations use this the same way." },
];

export function HowWeSee() {
  return (
    <section id="how-we-see" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <Reveal>
        <span className="rule block" />
      </Reveal>

      {/* The history opens the section directly. It is a better first line than any heading
          we were putting above it, so there is no heading. */}
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
        <div className="mt-10 grid gap-8 text-[15.5px] leading-relaxed text-ink-3 lg:grid-cols-2 lg:gap-16">
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

      <Reveal delay={150}>
        <p className="mt-12 max-w-3xl text-[1.0625rem] leading-[1.8] text-ink-2">
          So there is a great deal to account for now, and no single instrument reaches all of
          it. We use telemetry to establish what happened, and we ask people directly where the
          answer only exists in their heads. Then the part that actually decides the outcome:
          every organisation adopts this differently enough that a reading taken from one does
          not transfer to another.
        </p>
      </Reveal>

      {/* --- the equation -----------------------------------------------------------------
          The one place on this page where type moves. The terms arrive in the order you would
          speak them, the relation lands last and heaviest, and everything animates on
          transform and opacity so the reduced-motion rule switches it off cleanly. */}
      <div className="mt-16 border-t border-line pt-14">
        <Reveal>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {TERMS.map((x, i) => (
                <span key={x.t} className="flex items-baseline gap-x-5">
                  {i > 0 && (
                    <span
                      className="term-in figure text-[2rem] text-ink-4 sm:text-[2.6rem]"
                      style={{ ["--d" as string]: `${i * 190 - 95}ms` }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  )}
                  <span
                    className="term-in h2 text-[2.4rem] text-ink sm:text-[3.4rem]"
                    style={{ ["--d" as string]: `${i * 190}ms` }}
                  >
                    {x.t}
                  </span>
                </span>
              ))}

              <span
                className="term-in figure text-[2.4rem] sm:text-[3.2rem]"
                style={{ ["--d" as string]: "650ms", color: "var(--s5)" }}
                aria-hidden="true"
              >
                &#8811;
              </span>
              <span
                className="term-in h2 text-[2.4rem] text-ink-3 sm:text-[3.4rem]"
                style={{ ["--d" as string]: "730ms" }}
              >
                any one of them
              </span>
            </div>

            {/* what each term is for, set under the term it belongs to */}
            <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
              {TERMS.map((x, i) => (
                <div
                  key={x.t}
                  className="term-in"
                  style={{ ["--d" as string]: `${860 + i * 90}ms` }}
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-4">
                    {x.t}
                  </dt>
                  <dd className="mt-2.5 text-[14px] leading-relaxed text-ink-3">{x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
