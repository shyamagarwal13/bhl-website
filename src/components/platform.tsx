/*
 * The parity grid.
 *
 * Strategically this is the least original section on the page and the one that cannot be
 * skipped. Every serious competitor publishes a dense product surface — routing, review,
 * agent observability, spend attribution, a natural-language agent, benchmarks — and a
 * buyer comparing three tabs will discard the one that appears to do less, however much
 * better its argument is. So the table stakes are stated plainly, in the buyer's own
 * vocabulary, and the differentiated column is placed first rather than hidden among them.
 *
 * Written as three groups rather than one flat list of twelve, because a flat twelve reads
 * as a feature dump and gives the reader no way to hold it. The order is the argument: what
 * only we do, what measures the work, what acts on it.
 */

import { Reveal } from "./reveal";

type Item = { t: string; d: string };
type Group = { eyebrow: string; band: string; note: string; items: Item[] };

const GROUPS: Group[] = [
  {
    eyebrow: "The human layer",
    band: "var(--s5)",
    note: "Only here.",
    items: [
      {
        t: "Slop Index",
        d: "What plausible-looking output costs after it merges, priced per team and per quarter.",
      },
      {
        t: "Judgment Rate",
        d: "Where a person changed the direction of the work rather than its syntax.",
      },
      {
        t: "Taste capture",
        d: "Your review standards turned into context the agents actually receive, so the same correction is not made twice.",
      },
      {
        t: "Human leverage map",
        d: "Which work is worth a person's attention, which is not, and what that reallocation is worth.",
      },
    ],
  },
  {
    eyebrow: "Measure",
    band: "var(--s1)",
    note: "Table stakes, done properly.",
    items: [
      {
        t: "Engineering intelligence",
        d: "Delivery, review, quality and DORA, attributed to teams and initiatives.",
      },
      {
        t: "Token intelligence",
        d: "Every dollar of AI spend traced by model, tool, repository and engineer.",
      },
      {
        t: "Agent observability",
        d: "Every agent run: what it touched, what it cost, what survived review.",
      },
      {
        t: "Code intelligence",
        d: "Complexity, health and drift, read from the source rather than inferred from metadata.",
      },
    ],
  },
  {
    eyebrow: "Act",
    band: "var(--t3)",
    note: "Measurement that does something.",
    items: [
      {
        t: "Model routing",
        d: "Route each request to the cheapest model that still clears your quality bar.",
      },
      {
        t: "Review",
        d: "Automated review on every pull request, tuned to the standards your reviewers actually enforce.",
      },
      {
        t: "Ask",
        d: "Put a question to your engineering data in plain language and get the query behind the answer.",
      },
      {
        t: "Benchmarks",
        d: "Where you stand against comparable organisations, with the comparison set named.",
      },
    ],
  },
];

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-3xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              Everything the category does. Plus the part it doesn&apos;t.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              You should not have to give up routing, review or spend attribution to get a
              measurement you can trust. You don&apos;t.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.eyebrow} delay={gi * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 sm:p-8">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: g.band }} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                    {g.eyebrow}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-ink-4">{g.note}</span>
                </div>

                <ul className="mt-6 flex flex-col divide-y divide-line">
                  {g.items.map((it) => (
                    <li key={it.t} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-[14.5px] font-bold text-ink">{it.t}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{it.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
        ))}
      </div>
    </section>
  );
}
