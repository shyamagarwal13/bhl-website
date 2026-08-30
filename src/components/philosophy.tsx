import Image from "next/image";
import { Reveal } from "./reveal";

/*
 * The argument that sets up the model, and the one that follows it.
 *
 * `Position` is the copy that opens the measurement section: the pull quote, the story of
 * how the industry un-learned and then re-learned a bad metric, and a plain statement of
 * what we measure instead. It sits above the equation pane so a reader knows why a new
 * measurement is needed before being shown one.
 *
 * `NumberIsNotAnAnswer` follows the pane: two panels for the two things you actually buy —
 * the platform that produces the measurement, and the researchers who decide what to do
 * about it — then the papers as evidence for the second one. The paper images are real
 * first pages rendered from the PDFs; a screenshot of the actual paper is harder to fake
 * than a citation, which is the point.
 */

// The two things a customer actually receives. Kept as separate panels rather than one
// paragraph because the whole claim is that they are different purchases — a competitor
// sells the left one alone, and blurring them would give that away for free.
const HALVES = [
  {
    eyebrow: "The platform",
    band: "var(--t1)",
    lead: "Our dashboards and tools get you the measurement.",
    body: "Agents read your repositories, provider billing and tool data directly, so every term in the model is computed from systems rather than assembled by hand — and recomputed as the work changes, not reconstructed for a quarterly deck.",
    points: [
      "AI and engineering cost attributed to teams and initiatives",
      "Delivery, review and quality effects — not acceptance rates",
      // we do ask people things; the use-cases section says so, and claiming a fully
      // passive pipeline on the page arguing for measurement rigour would be the worst
      // possible place to overstate
      "Where a signal only exists in people's heads, we ask — briefly, and rarely",
    ],
  },
  {
    eyebrow: "The people",
    band: "var(--t3)",
    lead: "Our experts design the strategy around your constraints.",
    body: "The researchers who published the work below read your numbers themselves, with the caveats stated. A regulated bank and a consumer startup do not share a cost function, and no dashboard can tell you which of six terms is the one to move this quarter.",
    points: [
      "The model calibrated to your codebase and review culture",
      "Interventions ranked by what they are worth to you, not to a benchmark",
      "Findings you can take to a board, with the limits named",
    ],
  },
];

const PAPERS = [
  {
    img: "/papers/review-mandate.png",
    t: "AI Writes Faster Than Humans Can Review",
    venue: "Preprint · arXiv:2607.01904",
    find: "A mandated doubling of merged pull requests was reached — and per-reviewer load roughly doubled with it.",
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
];

/** Opens the measurement section, above the equation pane. */
export function Position() {
  return (
    <>
      {/*
        The quote is set as an object rather than a second headline. Two display-weight
        statements stacked — the h2 and this — were competing for the same job; giving the
        quote a card, a lighter weight and a hanging quote mark makes it read as a
        quotation and lets the heading stay the heading.
      */}
      <Reveal delay={60}>
        <figure className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-white px-7 py-8 lift sm:px-10 sm:py-10">
          <span
            aria-hidden="true"
            // fully inside the card: at -top-6 the overflow clip sliced it and it read as
            // a rendering artifact rather than a quote mark
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

      {/*
        Two columns, so the argument reads as a turn rather than a wall: what went wrong on
        the left, what we do instead on the right. It also halves the line length, which at
        one full-width measure was uncomfortably long.
      */}
      <Reveal delay={110}>
        <div className="mt-10 grid gap-8 text-[15.5px] leading-relaxed text-ink-3 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              What happened
            </p>
            <p className="mb-4">
              For four decades the industry agreed that counting lines was a poor way to
              measure software. Dijkstra called it a costly measuring unit. Tom DeMarco
              retracted his own “you can&apos;t control what you can&apos;t measure.” Kent Beck
              filed it under inputs — use it only if you have nothing else. The argument was
              settled and the metric was retired.
            </p>
            <p>
              Then AI arrived and the same number came back wearing a new name. Share of code
              written by AI. Tokens consumed. Suggestions accepted. Every one of them counts the
              act of writing —{" "}
              <span className="font-semibold text-ink">
                at the exact moment writing stopped being the expensive part
              </span>
              . Worse, a metric that was merely gameable when a human had to type it is
              unbounded when a machine does.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              What we do instead
            </p>
            <p>
              Lines of code. Pull requests merged. Tokens burned. Each is a real number, and
              each is an incomplete picture — they describe what was produced, never what it
              was worth or what it cost to keep. We measure what happened afterwards.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                "What the work was worth",
                "What it cost to get",
                "What survived review",
                "What quietly compounded",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--t3)" }}
                  />
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-4">Six terms, every one of them priced.</p>
          </div>
        </div>
      </Reveal>
    </>
  );
}

/** Follows the equation pane. */
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
          <div className="mt-16 flex items-center gap-4">
            <p className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              Selected work
            </p>
            <span className="h-px flex-1 bg-line" />
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {PAPERS.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 80}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift"
              >
                {/* the paper itself — a first page is harder to fake than a citation */}
                <div className="relative h-[156px] overflow-hidden border-b border-line bg-paper">
                  <Image
                    src={p.img}
                    alt={`First page of ${p.t}`}
                    width={1347}
                    height={800}
                    className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
                      {p.venue}
                    </span>
                    <span className="ml-auto text-ink-4 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  <h4 className="mt-2 text-balance text-[1rem] font-bold leading-snug text-ink">
                    {p.t}
                  </h4>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">{p.find}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
