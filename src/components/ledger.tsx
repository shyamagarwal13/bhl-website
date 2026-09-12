/*
 * The page's one idea, used as its structure.
 *
 * The argument is that any quarter has two readings: the one the tooling reports, and the
 * one that arrives later as cost. That was previously a single section wedged halfway down
 * the page, which meant the best thing here was also the most easily missed. It is now the
 * hero, and the seam it draws — light on the left, ink on the right, a hairline between —
 * becomes the grammar every later section answers to.
 *
 * No cards. A card is a container you reach for when you have not decided what the shape of
 * the content is; this content has a shape, which is two columns of one account. Full bleed
 * to the window edges so the division reads as the page being split rather than as two
 * panels sitting next to each other.
 *
 * All figures are illustrative.
 */

import { Reveal } from "./reveal";

type Row = { label: string; value: string; note: string };

const REPORTED: Row[] = [
  { label: "Pull requests merged", value: "2.1×", note: "against the same quarter last year" },
  { label: "Throughput per engineer", value: "+41%", note: "sustained over eleven weeks" },
  { label: "AI adoption", value: "78%", note: "of engineers, weekly active" },
  { label: "Cost per merged pull request", value: "−34%", note: "spend down, output up" },
];

const ACTUAL: Row[] = [
  { label: "Merged work rewritten inside 90 days", value: "31%", note: "up from nine" },
  { label: "Review time per reviewer", value: "2.4×", note: "the cost moved, it did not vanish" },
  { label: "Changes no author could explain", value: "1 in 6", note: "sampled at review" },
  { label: "Cognitive complexity", value: "+27%", note: "compounding, not transient" },
];

function Column({
  side,
  head,
  rows,
  close,
  dark,
}: {
  side: string;
  head: string;
  rows: Row[];
  close: string;
  dark: boolean;
}) {
  return (
    <div
      className={`px-6 py-14 sm:px-10 lg:px-14 lg:py-20 ${
        dark ? "bg-ink text-white" : "bg-paper text-ink"
      }`}
    >
      <div className={`mx-auto w-full ${dark ? "max-w-[520px]" : "ml-auto max-w-[520px]"}`}>
        <div className="flex items-baseline gap-4">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
              dark ? "text-white/45" : "text-ink-4"
            }`}
          >
            {side}
          </span>
          <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-line-2"}`} />
        </div>

        <h2
          className={`h2 mt-6 flex min-h-[92px] items-start text-[1.75rem] sm:text-[2.05rem] ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {head}
        </h2>

        <dl className="mt-10">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`flex min-h-[104px] items-center gap-6 border-t py-5 ${
                dark ? "border-white/12" : "border-line"
              }`}
            >
              <div className="min-w-0 flex-1">
                <dt className={`text-[13.5px] ${dark ? "text-white/85" : "text-ink-2"}`}>
                  {r.label}
                </dt>
                <dd className={`mt-1 text-[11.5px] ${dark ? "text-white/40" : "text-ink-4"}`}>
                  {r.note}
                </dd>
              </div>
              {/* the figure is the subject: serif, large, and the only colour in the column */}
              <span
                className="figure shrink-0 text-[2.1rem] sm:text-[2.4rem]"
                style={{ color: dark ? "var(--s5)" : "var(--s3)" }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </dl>

        <div className={`mt-8 border-t pt-6 ${dark ? "border-white/12" : "border-line"}`}>
          <p className={`text-[13px] leading-relaxed ${dark ? "text-white/55" : "text-ink-3"}`}>
            {close}
          </p>
          {/* the disclaimer lives in the corner of the panel it applies to, at plate-caption
              size, rather than floating in the layout at eyebrow size where it reads as a
              section label */}
          <p
            className={`mt-6 font-mono text-[9px] uppercase tracking-[0.16em] ${
              dark ? "text-white/30" : "text-ink-4"
            }`}
          >
            Illustrative
          </p>
        </div>
      </div>
    </div>
  );
}

export function Ledger() {
  return (
    <section id="slop" className="border-y border-line">
      {/* The seam. One grid, no gap, no radius — the point is that these are two readings of
          a single account, not two things placed beside each other. */}
      <div className="grid lg:grid-cols-2">
        <Reveal>
          <Column
            side="As reported"
            head="A breakout quarter."
            rows={REPORTED}
            close="Nothing here is false. Every figure is real, and every tool in this category will show you a version of it."
            dark={false}
          />
        </Reveal>
        <Reveal delay={140}>
          <Column
            side="As it arrived"
            head="A bill that comes later."
            rows={ACTUAL}
            close="None of this appears in a throughput chart, because none of it is production. It is what keeping the production cost."
            dark
          />
        </Reveal>
      </div>

      {/* The turn, spanning the seam. Set in the margin-note hand because it is the reader's
          realisation rather than the company's announcement. */}
      {/*
        The hinge of the whole argument, and it was previously the quietest thing on the page:
        a small italic line on a beige so close to the ground that the band read as a
        rendering artifact. If one sentence has to survive the scroll, it is this one, so it
        gets the largest type on the page and the full measure to itself.
      */}
      <div className="border-t border-line bg-paper px-6 py-20 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-[var(--maxw)]">
            {/* hand-broken: left to wrap, "true." orphans onto a line of its own */}
            <p className="h2 text-[3rem] leading-[1.02] text-ink sm:text-[4.5rem]">
              <span className="block">Both of these</span>
              <span className="block">are true.</span>
            </p>
            <p className="mt-10 max-w-2xl text-[1.125rem] leading-[1.7] text-ink-2">
              When writing was expensive, volume was a fair proxy for effort. It is not one now.
              The scarce input is no longer production, it is{" "}
              <span className="lean font-semibold text-ink">judgment</span> — knowing what to
              build, what to keep, what to throw away, and where a person still has to be the one
              deciding.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
