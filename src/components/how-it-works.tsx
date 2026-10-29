/*
 * How the agents get from a question to an answer, walked through one real case.
 *
 * Two halves that read as cause and effect: on the left, the four things the agents do; on
 * the right, the one thing that comes back. The right half is drawn as the answer itself
 * (question, verdict, three readings, what to change) rather than as a comparison chart,
 * because the claim of this section is that the output is an answer, not a dashboard.
 *
 * The card is set in plain sentence-case type. Mono caps labels on every block, a struck-
 * through figure and coloured bullets made it read as a generated template rather than
 * something a person wrote; the hierarchy comes from weight and colour instead.
 *
 * The case is an enterprise's 2x AI mandate (802 developers, 196K pull requests) from our
 * own paper (arXiv:2607.01904). Every figure in the card is real.
 */

import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

const STEPS = [
  { t: "Connect", d: "Read-only access to repos, issue tracker, CI and AI tool usage." },
  { t: "Map", d: "Learn how each team works: its AI tools, rules and review paths." },
  { t: "Analyze", d: "Causal analysis against comparison teams, with trends controlled for." },
  { t: "Answer", d: "The effect, the evidence behind it, and what to change." },
];

const READINGS = [
  { label: "Dashboard", value: "+42%", note: "output, before vs. after", muted: true },
  { label: "Causal estimate", value: "+14%", note: "against matched teams" },
  { label: "Reviewer load", value: "2.0×", note: "PRs up 3.1×, reviewers 1.5×" },
];

function Steps() {
  return (
    <ol>
      {STEPS.map((s, i) => (
        <Reveal key={s.t} delay={i * 80}>
          <li className="relative flex gap-5 py-4">
            {/* each step draws the thread down to the next dot, so it ends at the last one */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-4 left-[13px] top-[43px] w-px bg-line-2"
              />
            )}
            <span className="relative z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full border border-line-2 bg-paper text-[12px] font-semibold text-ink-3">
              {i + 1}
            </span>
            <div className="pt-0.5">
              <h3 className="text-[1.05rem] font-bold text-ink">{s.t}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-3">{s.d}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

function AnswerCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white lift-lg">
      <div className="border-b border-line bg-paper/60 px-6 py-5 sm:px-8">
        <p className="text-[1.1rem] font-semibold text-ink">
          &ldquo;Is our 2× AI mandate working?&rdquo;
        </p>
      </div>

      <div className="px-6 py-7 sm:px-8">
        <p className="text-balance text-[1.3rem] font-bold leading-snug tracking-[-0.01em] text-ink">
          Yes, but by far less than it looks, and review is now the bottleneck.
        </p>

        <div className="mt-6 grid grid-cols-3 divide-x divide-line rounded-xl border border-line">
          {READINGS.map((r) => (
            <div key={r.label} className="px-3 py-4 sm:px-4">
              <p className="text-[12px] text-ink-3">{r.label}</p>
              <p
                className={`tabular mt-1 text-[1.3rem] font-extrabold tracking-tight sm:text-[1.6rem] ${
                  r.muted ? "text-ink-4" : "text-ink"
                }`}
              >
                {r.value}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-4">{r.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[14.5px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">What to change:</span> check that AI pull
          requests are really being reviewed, and move reviewers to the teams the mandate loaded
          most.
        </p>
      </div>

      <p className="border-t border-line px-6 py-3.5 text-[12px] text-ink-4 sm:px-8">
        A real case: 802 developers and 196K pull requests, Jan 2024 to Apr 2026.
      </p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <SectionHead
        width="wide"
        title="From a question to an answer you can act on."
        lead="A real example: an enterprise of 802 developers, a year into a mandate to double output with AI."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Steps />
        <Reveal delay={200}>
          <AnswerCard />
        </Reveal>
      </div>
    </section>
  );
}
