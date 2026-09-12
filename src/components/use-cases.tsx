/*
 * What it gets bought to do, as a list rather than a grid.
 *
 * This was six pastel icon cards in Title Case, which is the single most template-looking
 * component a marketing page can own — and it broke the sentence-case voice the rest of the
 * page keeps, so it read like a different and worse website spliced in.
 *
 * A reference section is a list. Set as one, with the decision on the left and the mechanism
 * on the right, it is faster to scan than a grid, costs a third of the height, and the
 * hairlines tie it to the rest of the page instead of introducing a fourth card style.
 *
 * The numbering is not decoration: these are ordered by how often they are the reason
 * somebody first calls, which is a real ranking and worth showing.
 */

import { Reveal } from "./reveal";

const CASES: { t: string; d: string }[] = [
  {
    t: "Prove the AI budget is buying something",
    d: "Set spend against work that survived, not work that merged, and take the difference to the people who approve the renewal.",
  },
  {
    t: "Find where the rework is coming from",
    d: "Locate the teams and repositories where merged work comes back, and what it costs you each quarter that it does.",
  },
  {
    t: "Decide where humans still belong",
    d: "See which classes of work carry real judgment and which are being waved through, then move review attention to where it pays.",
  },
  {
    t: "Route spend without losing the bar",
    d: "Send each request to the cheapest model that still clears your quality threshold, measured on your own repositories.",
  },
];

export function UseCases() {
  return (
    <div className="border-y border-line bg-paper-2/60">
      <section id="use-cases" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div>
            <span className="rule block" />
            <h2 className="h2 mt-8 max-w-[16ch] text-[2.1rem] sm:text-[2.7rem]">
              What it is bought to do.
            </h2>
          </div>
        </Reveal>

        <dl className="mt-14">
          {CASES.map((c, i) => (
            <Reveal key={c.t} delay={i * 60}>
              <div className="grid items-baseline gap-x-10 gap-y-2 border-t border-line py-7 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.15fr)]">
                <span className="figure text-[1.1rem] text-ink-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <dt className="h2 text-[1.3rem] text-ink sm:text-[1.5rem]">{c.t}</dt>
                <dd className="text-[14.5px] leading-relaxed text-ink-3">{c.d}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>
    </div>
  );
}
