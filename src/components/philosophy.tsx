import { PapersRail } from "./papers-rail";
import { Reveal } from "./reveal";

/*
 * The two things you actually buy, and the evidence for the second one.
 *
 * Two panels: the platform that produces the measurement, and the researchers who decide
 * what to do about it. Then the papers. The paper images are real first pages rendered from
 * the PDFs, because a screenshot of the actual paper is harder to fake than a citation.
 *
 * The consulting half is not a garnish on the product, it is the answer to the obvious
 * objection to this whole position. Once you claim to measure judgment rather than output,
 * a reader is entitled to ask who decides what good judgment looks like — so the names and
 * the institutions have to be on the page, and the published work has to be one click away.
 *
 * Note that academic credibility is contested ground in this category rather than a
 * differentiator on its own: at least one competitor leads with a Stanford affiliation. The
 * defensible version is not "we are researchers" but "here is the work, read it".
 */

// The two things a customer actually receives. Kept as separate panels rather than one
// paragraph because the whole claim is that they are different purchases — a competitor
// sells the left one alone, and blurring them would give that away for free.
const HALVES = [
  {
    eyebrow: "The platform",
    band: "var(--t1)",
    lead: "Our dashboards and tools get you the measurement.",
    body: "Agents read your repositories, provider billing and tool data directly, so every number you see is computed from your systems and recomputed as the work changes. Nothing waits for a quarterly spreadsheet.",
    points: [
      "AI and engineering cost attributed to teams and initiatives",
      // the one negation kept in this section: every assistant dashboard on the market
      // reports acceptance rates, so the reader would assume it of us too
      "Delivery, review and quality effects, not acceptance rates",
      // we do ask people things; the use-cases section says so, and claiming a fully
      // passive pipeline on the page arguing for measurement rigour would be the worst
      // possible place to overstate
      "Where a signal only exists in people's heads, we ask briefly and rarely",
    ],
  },
  {
    eyebrow: "The people",
    band: "var(--t3)",
    lead: "Our experts design the strategy around your constraints.",
    body: "Researchers from Carnegie Mellon, Microsoft and Google who published the work below read your numbers themselves, with the caveats stated. A regulated bank and a consumer startup do not share a cost function, and no dashboard can tell you which number is the one to move this quarter.",
    points: [
      "A cost model calibrated to your codebase and review culture",
      "Interventions ranked by what they are worth to you",
      "Findings you can take to a board, with the limits named",
    ],
  },
];

const PAPERS = [
  {
    img: "/papers/review-mandate.png",
    t: "AI Writes Faster Than Humans Can Review",
    venue: "Preprint · arXiv:2607.01904",
    find: "The mandate to double merged pull requests worked. Reviewer load roughly doubled with it.",
    href: "https://arxiv.org/abs/2607.01904",
  },
  {
    img: "/papers/speed-quality.png",
    t: "Speed at the Cost of Quality",
    venue: "MSR 2026",
    find: "A large but transient velocity gain, alongside a persistent rise in complexity that drove the later slowdown.",
    href: "https://doi.org/10.1145/3793302.3793349",
  },
  {
    img: "/papers/ramp.png",
    t: "A Few Pages of Markdown",
    venue: "ASE 2026",
    find: "Averages across adopters hide wide differences between teams. Repositories without committed AI configuration showed roughly twice the rise in cognitive complexity.",
    href: "https://doi.org/10.1145/3832783.3837546",
  },
  {
    img: "/papers/agents-vs-ides.png",
    t: "AI IDEs or Autonomous Agents?",
    venue: "MSR 2026",
    find: "Agents and IDE assistants are not the same intervention and do not carry the same cost.",
    href: "https://doi.org/10.1145/3793302.3793589",
  },
  {
    img: "/papers/opinions-3100.png",
    t: "3100 Opinions on Code Review in an AI World",
    venue: "Preprint · arXiv:2607.07980",
    // the finding that matters here is the instability, not the headcount of documents:
    // it is the strongest available argument that a surface metric read once is not
    // evidence, which is the whole reason this page exists
    find: "Agent-authored pull requests are reviewed less often and merged several times faster, yet the direction of those trends flips under equally defensible analysis choices.",
    href: "https://arxiv.org/abs/2607.07980",
  },
];

/** Follows the product showcase. */
export function NumberIsNotAnAnswer() {
  return (
    <div className="border-y border-line bg-paper/60">
      <section id="approach" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              You don&apos;t just get a dashboard. You get experts.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              The measurement is automated. What to do about it is not.
            </p>
          </div>
        </Reveal>

        {/* the two halves of what you buy, stated separately so neither absorbs the other */}
        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
          {HALVES.map((h, i) => (
            <Reveal key={h.eyebrow} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-8 sm:p-9">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: h.band }} />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                    {h.eyebrow}
                  </span>
                </div>
                <h3 className="mt-5 text-balance text-[1.2rem] font-bold leading-snug text-ink sm:text-[1.35rem]">
                  {h.lead}
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-ink-3">{h.body}</p>
                {/* mt-auto on the wrapper, so the rule lands at the same height in both
                    cards even when one body runs a line longer */}
                <div className="mt-auto pt-7">
                  <ul className="flex flex-col gap-2.5 border-t border-line pt-6">
                    {h.points.map((x) => (
                      <li key={x} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
                        <span
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: h.band }}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="mt-16">
            <PapersRail papers={PAPERS} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
