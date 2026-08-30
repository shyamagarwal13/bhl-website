import { Reveal } from "./reveal";

/*
 * Position.
 *
 * The page's argument, placed before the model so a reader knows why a new measurement
 * is needed before being shown one. It absorbs what were three separate sections — the
 * case against input metrics, the research, and the engagement model — because they are
 * one argument: counting is the wrong instrument, here is the evidence, and here is why
 * a number alone still isn't an answer.
 *
 * The quotes are load-bearing, so they are attributed rather than floated as folklore.
 */

const COUNTED = [
  "% of code written by AI",
  "Tokens consumed",
  "Suggestions accepted",
  "Lines added per developer",
  "Seats active this month",
];

const MEASURED = [
  "Cost per merged change",
  "What survived review unchanged",
  "What was abandoned or reverted",
  "Debt that compounded after the fact",
  "Hours lost to friction, priced",
];

const PAPERS = [
  {
    t: "AI Writes Faster Than Humans Can Review",
    sub: "802 developers · 196,212 pull requests",
    find: "Throughput doubled. Per-reviewer load roughly doubled with it.",
    venue: "arXiv:2607.01904",
    href: "https://arxiv.org/abs/2607.01904",
    band: "var(--t5)",
  },
  {
    t: "Speed at the Cost of Quality",
    sub: "Cursor adopters vs. matched controls",
    find: "A large but transient velocity gain, and a persistent rise in complexity that drove later slowdown.",
    venue: "MSR 2026",
    href: "https://doi.org/10.1145/3793302.3793349",
    band: "var(--t4)",
  },
  {
    t: "A Few Pages of Markdown",
    sub: "Repository AI maturity, four levels",
    find: "Average effects across adopters hide wide differences between teams.",
    venue: "ASE 2026",
    href: "https://doi.org/10.1145/3832783.3837546",
    band: "var(--t1)",
  },
  {
    t: "AI IDEs or Autonomous Agents?",
    sub: "Longitudinal causal study",
    find: "Agents and IDE assistants are not the same intervention and do not carry the same cost.",
    venue: "MSR 2026",
    href: "https://doi.org/10.1145/3793302.3793589",
    band: "var(--t2)",
  },
];

const ROLES = [
  {
    t: "Agents produce the measurement",
    d: "Custom-built agents run against your repositories and tool data to compute every term, continuously, without anyone filling in a survey or a timesheet.",
  },
  {
    t: "Researchers say what it means",
    d: "The people who published the work above read your numbers directly, with the caveats stated. A dashboard cannot tell you which of six terms is the one to move this quarter.",
  },
  {
    t: "Fitted to your constraints",
    d: "A regulated bank and a consumer startup do not share a cost function. The model is calibrated to your codebase, review culture and risk tolerance — not to a benchmark of companies you have nothing in common with.",
  },
];

export function Philosophy() {
  return (
    <div className="border-y border-line bg-paper/60">
      <section id="position" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-3xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              The industry spent forty years learning not to count lines. Then it started
              counting again.
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-3">
              <p>
                Dijkstra called lines of code “a very costly measuring unit” because it rewards
                writing more of them. Tom DeMarco, who gave us “you can&apos;t control what you
                can&apos;t measure,” retracted it in 2009. Kent Beck filed the metric under
                inputs: use it only if you have nothing else. That argument was settled.
              </p>
              <p>
                Then AI arrived and the same number came back wearing a new name. Share of code
                written by AI. Tokens consumed. Suggestions accepted. Every one of them counts
                the act of writing —{" "}
                <span className="font-semibold text-ink">
                  at the exact moment writing stopped being the expensive part
                </span>
                . Worse, a metric that was merely gameable when a human had to type it is
                unbounded when a machine does.
              </p>
            </div>
          </div>
        </Reveal>

        {/* the contrast */}
        <Reveal delay={80}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2">
            <div className="bg-white p-7 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                  Counted today
                </span>
                <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-ink-4">
                  Inputs
                </span>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {COUNTED.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[14.5px] text-ink-4">
                    <span className="h-px w-4 shrink-0 bg-line-2" />
                    <span className="line-through decoration-line-2">{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-4">
                All of these end at the moment the code is written. None survives contact with
                what happened next.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink">
                  What we measure
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide"
                  style={{
                    color: "var(--t3)",
                    background: "color-mix(in srgb, var(--t3) 11%, transparent)",
                  }}
                >
                  Outcomes
                </span>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {MEASURED.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[14.5px] font-medium text-ink">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--t3)" }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-3">
                Every one of these is only knowable after the fact. That is what makes them
                harder to collect — and what makes them worth collecting.
              </p>
            </div>
          </div>
        </Reveal>

        {/* a number is not an answer */}
        <Reveal delay={120}>
          <div className="mt-16 max-w-3xl">
            <h3 className="h2 text-balance text-[1.7rem] sm:text-[2.05rem]">
              A number is not an answer.
            </h3>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-3">
              Our own research found that average effects across adopters hide wide differences
              between teams — which means a benchmark built from other companies tells you very
              little about yours. Tooling can produce the measurement. Deciding what it means for
              your org is a research problem, and we staff it as one.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.t} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="font-mono text-[11px] text-ink-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-3 text-[1rem] font-bold text-ink">{r.t}</h4>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the evidence */}
        <Reveal delay={100}>
          <div className="mt-16 max-w-3xl">
            <h3 className="h2 text-balance text-[1.7rem] sm:text-[2.05rem]">
              We didn&apos;t read this research. We wrote it.
            </h3>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-3">
              Peer-reviewed at Carnegie Mellon and Stanford, with the data and the limitations
              stated — which is a different thing from a vendor benchmark.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PAPERS.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 80}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full gap-4 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift"
              >
                <span
                  className="mt-1 h-full w-[3px] shrink-0 rounded-full"
                  style={{ background: p.band }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
                      {p.venue}
                    </span>
                    <span className="text-ink-4 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  <h4 className="mt-2 text-balance text-[15px] font-bold leading-snug text-ink">
                    {p.t}
                  </h4>
                  <p className="mt-1 font-mono text-[11px] text-ink-4">{p.sub}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">{p.find}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
