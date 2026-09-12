/*
 * The argument the whole repositioning rests on.
 *
 * Every competitor in this category leads with output: units of work, PRs merged, tokens
 * spent, agent runs. That framing made sense when producing was the expensive part. It
 * isn't any more, and counting production when production is free doesn't merely measure
 * nothing — it scores slop as achievement. A team flooding a codebase with plausible,
 * unreviewed, AI-authored work looks *excellent* on every other dashboard on the market.
 *
 * So the section is built as two readings of one quarter, side by side, and the reader is
 * meant to notice that both are true. The left panel is not a strawman: those numbers are
 * real, they are what the tools report, and they are what gets taken to a board. The right
 * panel is the same quarter measured for what it cost to keep.
 *
 * Deliberately NOT a dollar-waste breakdown. The nearest competitor already runs one
 * ("only $0.18 of every dollar reaches production"), and arriving second at someone else's
 * visual argument reads as an answer to them rather than a position of our own. The axis
 * here is judgment, not waste.
 *
 * All figures are illustrative sample data, labelled as such.
 */

import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

type Row = { label: string; value: string; note: string };

const SEEN: Row[] = [
  { label: "Pull requests merged", value: "2.1×", note: "vs. same quarter last year" },
  { label: "Throughput per engineer", value: "+41%", note: "sustained over 11 weeks" },
  { label: "AI adoption", value: "78%", note: "of engineers, weekly active" },
  { label: "Cost per merged PR", value: "−34%", note: "spend down, output up" },
];

const HAPPENED: Row[] = [
  { label: "Merged work rewritten within 90 days", value: "31%", note: "up from 9%" },
  { label: "Review time per reviewer", value: "2.4×", note: "the cost moved, it did not vanish" },
  { label: "Changes no author could explain", value: "1 in 6", note: "sampled at review" },
  { label: "Cognitive complexity", value: "+27%", note: "compounding, not transient" },
];

function Panel({
  eyebrow,
  title,
  rows,
  tone,
  note,
}: {
  eyebrow: string;
  title: string;
  rows: Row[];
  tone: "seen" | "real";
  note: string;
}) {
  const good = tone === "seen";
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-7 sm:p-8 ${
        good ? "border-line bg-white" : "border-ink/10 bg-ink text-white"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: good ? "var(--pos)" : "var(--s5)" }}
        />
        <span
          className={`font-mono text-[10.5px] uppercase tracking-[0.16em] ${
            good ? "text-ink-4" : "text-white/45"
          }`}
        >
          {eyebrow}
        </span>
      </div>

      <h3
        className={`mt-4 text-balance text-[1.25rem] font-bold leading-snug sm:text-[1.4rem] ${
          good ? "text-ink" : "text-white"
        }`}
      >
        {title}
      </h3>

      <ul className={`mt-7 flex flex-col ${good ? "divide-y divide-line" : "divide-y divide-white/10"}`}>
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline gap-4 py-3.5 first:pt-0">
            <div className="min-w-0 flex-1">
              <p className={`text-[13.5px] font-medium ${good ? "text-ink-2" : "text-white/80"}`}>
                {r.label}
              </p>
              <p className={`mt-0.5 text-[11.5px] ${good ? "text-ink-4" : "text-white/40"}`}>
                {r.note}
              </p>
            </div>
            <span
              className="tabular shrink-0 text-[1.35rem] font-extrabold tracking-tight"
              style={{ color: good ? "var(--pos)" : "var(--s5)" }}
            >
              {r.value}
            </span>
          </li>
        ))}
      </ul>

      <p
        className={`mt-auto pt-7 text-[13px] leading-relaxed ${
          good ? "text-ink-3" : "text-white/60"
        }`}
      >
        {note}
      </p>
    </div>
  );
}

export function TwoDashboards() {
  return (
    <div className="border-y border-line bg-paper-2">
      <section id="slop" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <SectionHead
          label="The contradiction"
          width="wide"
          title="Same team. Same quarter. Two dashboards."
          lead="Both of these are accurate. One of them is what your tooling reports and what gets taken to the board. The other is what the quarter actually cost you."
        />

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
          <Reveal>
            <Panel
              eyebrow="What every dashboard sees"
              title="A breakout quarter."
              rows={SEEN}
              tone="seen"
              note="Nothing here is wrong. Every number is real, and every tool in this category will show you some version of it."
            />
          </Reveal>
          <Reveal delay={110}>
            <Panel
              eyebrow="What actually happened"
              title="A bill that arrives later."
              rows={HAPPENED}
              tone="real"
              note="None of it appears in a throughput chart, because none of it is production. It is the cost of keeping what was produced."
            />
          </Reveal>
        </div>

        {/*
          The turn. Set as a margin note in the hand face rather than another paragraph of
          company voice: this is the reader's realisation, and the page should sound like it
          is pointing at something rather than announcing it.
        */}
        <Reveal delay={180}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <p className="hand text-[1.5rem] leading-snug text-ink-3 sm:text-[1.7rem]">
              measuring output rewards whoever produces the most of it
            </p>
            <span className="hidden h-px flex-1 bg-line-2 sm:block" />
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-7 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-2">
            When writing was expensive, volume was a reasonable proxy for effort. It is not one
            any more. The scarce input is no longer production, it is{" "}
            <span
              className="mark font-semibold text-ink"
              style={{ background: "color-mix(in srgb, var(--s4) 32%, transparent)" }}
            >
              judgment
            </span>{" "}
            — knowing what to build, what to keep, what to throw away, and where a person still
            has to be the one deciding.
          </p>
        </Reveal>

        <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          Illustrative figures
        </p>
      </section>
    </div>
  );
}
