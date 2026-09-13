import { Affiliations } from "./affiliations";
import { PapersRail } from "./papers-rail";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

/*
 * The evidence.
 *
 * This used to carry two panels — the platform, and the people — under the heading "You
 * don't just get a dashboard, you get experts." All three said the same thing, and the
 * equation a section earlier now says it better and in four words, so the panels went.
 *
 * What is left is the part that was always doing the work: the papers themselves. The images
 * are real first pages rendered from the PDFs, because a screenshot of the actual paper is
 * harder to fake than a citation.
 *
 * Worth keeping in mind if this section is ever expanded: academic credibility is contested
 * ground here rather than a differentiator on its own, and at least one competitor leads with
 * a Stanford affiliation. The defensible claim is never "we are researchers" — it is "here is
 * the work, read it", which is why the section is now a reading list and nothing else.
 */

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
    <div className="border-y border-line bg-paper-2/60">
      <section id="approach" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Affiliations />

        <div className="mt-16">
          <SectionHead width="wide" title={<>Our selected work.</>} />
        </div>

        <Reveal delay={80}>
          <div className="mt-14">
            <PapersRail papers={PAPERS} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
