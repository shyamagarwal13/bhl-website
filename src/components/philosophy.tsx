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
 * `NumberIsNotAnAnswer` follows the pane: measurement alone doesn't decide anything, and
 * the papers are the evidence for that claim rather than a separate credentials section.
 * The paper images are real first pages rendered from the PDFs — a screenshot of the
 * actual paper is harder to fake than a citation, which is the point.
 */

const ROLES = [
  {
    t: "Our agents produce the measurement",
    d: "Custom-built agents run against your repositories and tool data to compute every term continuously — no survey, no timesheet, no self-reporting.",
  },
  {
    t: "Our researchers say what it means",
    d: "The people who published the work below read your numbers directly, with the caveats stated. A dashboard cannot tell you which of six terms is the one to move this quarter.",
  },
  {
    t: "Fitted to your constraints",
    d: "A regulated bank and a consumer startup do not share a cost function. The model is calibrated to your codebase, review culture and risk tolerance — not to a benchmark of companies you have nothing in common with.",
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
      <Reveal delay={60}>
        <blockquote className="mt-9 border-l-2 border-ink pl-6 sm:pl-8">
          <p className="h2 text-balance text-[1.55rem] leading-[1.25] sm:text-[1.95rem]">
            The industry spent forty years learning not to count lines. Then it started
            counting again.
          </p>
        </blockquote>
      </Reveal>

      <Reveal delay={110}>
        <div className="mt-8 flex max-w-2xl flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-3">
          <p>
            Then AI arrived and the same number came back wearing a new name. Share of code
            written by AI. Tokens consumed. Suggestions accepted. Every one of them counts the
            act of writing —{" "}
            <span className="font-semibold text-ink">
              at the exact moment writing stopped being the expensive part
            </span>
            . Worse, a metric that was merely gameable when a human had to type it is unbounded
            when a machine does.
          </p>
          <p>
            So everyone else is still counting inputs: code produced, tokens burned, suggestions
            taken. We measure what happened afterwards —{" "}
            <span className="font-semibold text-ink">
              what the work was worth, what it cost to get, what survived review, and what
              quietly compounded
            </span>
            . Six terms, every one of them priced.
          </p>
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
              A number is not an answer.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Our own research found that average effects across adopters hide wide differences
              between teams — so a benchmark built from other companies tells you very little
              about yours. Tooling can produce the measurement. Deciding what it means for your
              org is a research problem, and we staff it as one.
            </p>
          </div>
        </Reveal>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.t} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="font-mono text-[11px] text-ink-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1rem] font-bold text-ink">{r.t}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="mt-16 max-w-2xl">
            <h3 className="h2 text-balance text-[1.7rem] sm:text-[2.05rem]">
              We didn&apos;t read this research. We wrote it.
            </h3>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-3">
              Peer-reviewed at Carnegie Mellon and Stanford, with the data and the limitations
              stated — which is a different thing from a vendor benchmark.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {PAPERS.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 80}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift"
              >
                {/* the paper itself — a first page is harder to fake than a citation */}
                <div className="relative h-[188px] overflow-hidden border-b border-line bg-paper">
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
