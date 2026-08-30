import { Reveal } from "./reveal";

/*
 * Research.
 *
 * These are the team's own peer-reviewed papers, not a reading list — which is the whole
 * point of the section and why the heading says "we wrote" rather than "backed by".
 * Titles, author lists, venues and identifiers are taken from the papers themselves;
 * nothing here is paraphrased into a stronger claim than the abstract supports.
 */

type Paper = {
  title: string;
  venue: string;
  year: string;
  authors: string;
  finding: string;
  stat?: { v: string; l: string };
  href: string;
  band: string;
  term: string;
};

const PAPERS: Paper[] = [
  {
    title: "AI Writes Faster Than Humans Can Review: A Longitudinal Study of an Enterprise “2×” Mandate",
    venue: "Preprint",
    year: "arXiv:2607.01904",
    authors: "He, Agarwal, Denisov-Blanch, Azaletskiy, Koyejo, Vasilescu",
    finding:
      "A mandated doubling of merged pull requests per engineer was reached — and review restructured around automation, with per-reviewer load roughly doubling.",
    stat: { v: "2.09×", l: "throughput, 802 devs · 196,212 PRs" },
    href: "https://arxiv.org/abs/2607.01904",
    band: "var(--t5)",
    term: "E, R, T",
  },
  {
    title:
      "Speed at the Cost of Quality: How Cursor AI Increases Short-Term Velocity and Long-Term Complexity in Open-Source Projects",
    venue: "MSR",
    year: "2026",
    authors: "He, Miller, Agarwal, Kästner",
    finding:
      "Adoption caused a large but transient velocity gain alongside a substantial and persistent rise in static-analysis warnings and complexity — which then drove long-term slowdown.",
    stat: { v: "L(t)", l: "measured: debt that compounds" },
    href: "https://doi.org/10.1145/3793302.3793349",
    band: "var(--t4)",
    term: "L(t)",
  },
  {
    title: "A Few Pages of Markdown: Committed AI Configuration and Lower Quality Cost after Coding-Agent Adoption",
    venue: "ASE",
    year: "2026",
    authors: "Denisov-Blanch, Agarwal, Azaletskiy, He, Schaeffer, Miranda, Vasilescu, Koyejo",
    finding:
      "Average effects across adopters hide wide differences between teams. A maturity model built from committed configuration artifacts separates teams that pay a quality cost from those that don't.",
    stat: { v: "RAMP", l: "4-level repository maturity profile" },
    href: "https://doi.org/10.1145/3832783.3837546",
    band: "var(--t1)",
    term: "L(t), E",
  },
  {
    title: "AI IDEs or Autonomous Agents? Measuring the Impact of Coding Agents on Software Development",
    venue: "MSR",
    year: "2026",
    authors: "Agarwal, He, Vasilescu",
    finding:
      "A longitudinal causal study separating autonomous coding agents from IDE-based assistants — they are not the same intervention and do not carry the same cost.",
    stat: { v: "P", l: "production cost by tool class" },
    href: "https://doi.org/10.1145/3793302.3793589",
    band: "var(--t2)",
    term: "P",
  },
];

export function Research() {
  return (
    <div className="border-y border-line bg-paper/60">
      <section id="research" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="spectrum-rule mb-7 w-16" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              We didn&apos;t read the research. We wrote it.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Every term in that equation is something our team has measured in the field and
              published on, at Carnegie Mellon and Stanford. Peer-reviewed, with the data and the
              limitations stated — which is a different thing from a vendor benchmark.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PAPERS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 90}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="rounded-md px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-white"
                    style={{ background: p.band }}
                  >
                    {p.venue} {p.year !== "2026" ? "" : p.year}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
                    informs {p.term}
                  </span>
                  <span className="ml-auto text-ink-4 transition-transform group-hover:translate-x-0.5">
                    ↗
                  </span>
                </div>

                <h3 className="mt-4 text-balance text-[1.05rem] font-bold leading-snug text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-[12.5px] text-ink-4">{p.authors}</p>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-ink-3">{p.finding}</p>

                {p.stat && (
                  <div className="mt-6 flex items-baseline gap-3 border-t border-line pt-4">
                    <span
                      className="font-mono text-[1.5rem] font-extrabold leading-none"
                      style={{ color: p.band }}
                    >
                      {p.stat.v}
                    </span>
                    <span className="text-[12.5px] text-ink-3">{p.stat.l}</span>
                  </div>
                )}

                {p.year !== "2026" && (
                  <p className="mt-3 font-mono text-[10px] text-ink-4">{p.year}</p>
                )}
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/*
 * The engagement model. This is the section that says Behold is not only software — and
 * it is grounded in a specific published finding rather than an assertion: averages across
 * adopters hide wide differences between teams, so a single benchmark is the wrong tool.
 */
export function YourTeam() {
  const cols = [
    {
      k: "01",
      t: "Your constraints, not an average",
      d: "A regulated bank and a consumer startup do not share a cost function. We fit the model to your codebase, review culture and risk tolerance, rather than scoring you against a benchmark drawn from companies you have nothing in common with.",
      band: "var(--t1)",
    },
    {
      k: "02",
      t: "Agents that work the terms",
      d: "Custom-built agents run against your repositories to find where the money is going and what would move it — rework loops, review bottlenecks, the files quietly accruing liability. Measurement is the start of the job, not the whole of it.",
      band: "var(--t3)",
    },
    {
      k: "03",
      t: "Researchers on your case",
      d: "The people who published the studies above look at your data directly. You get a read on what is actually happening in your org, with the caveats stated — not a dashboard and a wish of good luck.",
      band: "var(--t5)",
    },
  ];
  return (
    <section className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <Reveal>
        <div className="max-w-2xl">
          <div className="spectrum-rule mb-7 w-16" />
          <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
            Every team has a different cost function.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
            Published effects of AI coding tools are averages, and averages hide the thing you
            need — the spread between teams. Which term dominates your equation is specific to
            your org, so the work of moving it has to be too.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cols.map((c, i) => (
          <Reveal key={c.k} delay={i * 90}>
            <div className="h-full rounded-2xl border border-line bg-white p-7">
              <span
                className="block h-[3px] w-9 rounded-full"
                style={{ background: c.band }}
              />
              <h3 className="mt-5 text-[1.05rem] font-bold text-ink">{c.t}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-3">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
