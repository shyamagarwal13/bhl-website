/*
 * The two readings that are ours, drawn as accounts.
 *
 * The previous version put the Slop Index on a speedometer, which was a self-own: the page
 * spends its length arguing that dashboards measure the wrong thing, and then presented its
 * flagship number on the most clichéd dashboard widget in existence. A gauge also says the
 * wrong thing about the metric — it implies a dial reading off a live system, when this is a
 * quarter's account of what work cost after it landed.
 *
 * So the Slop Index is a ledger: four charges, ruled, summing to a total, with the index
 * itself as the balance. That is both the honest shape of the number and the page's own
 * visual language rather than a borrowed one.
 *
 * The Judgment Rate is the counter-account, and deliberately does not share the form. It is
 * a count of discrete moments — review that changed direction — so it is tallied in marks,
 * not summed in money. One account of cost, one of attention.
 *
 * Figures are illustrative.
 */

import { Scale } from "./scale";
import { Reveal } from "./reveal";

/* --- 01 · the account of cost --------------------------------------------- */

const CHARGES = [
  { label: "Rework", share: 38, amount: "156,600" },
  { label: "Review drag", share: 27, amount: "111,200" },
  { label: "Complexity added", share: 21, amount: "86,500" },
  { label: "Unaccounted change", share: 14, amount: "57,700" },
];

function SlopAccount() {
  return (
    <div className="w-full max-w-[460px]">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">
          Charges, this quarter
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">USD</span>
      </div>

      <dl>
        {CHARGES.map((c) => (
          <div
            key={c.label}
            className="flex items-baseline gap-5 border-b border-line py-4"
          >
            <dt className="w-[150px] shrink-0 text-[14px] text-ink-2">{c.label}</dt>
            <span className="min-w-0 flex-1">
              <Scale value={c.share} tone="var(--s5)" />
            </span>
            <dd className="figure w-[132px] shrink-0 text-right text-[1.45rem] text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
              {c.amount}
            </dd>
          </div>
        ))}

        {/* the balance, ruled the way a total is ruled */}
        <div className="flex items-baseline gap-5 border-b-[3px] border-double border-ink pb-5 pt-5">
          <dt className="min-w-0 flex-1">
            <span className="text-[14px] font-semibold text-ink">Slop Index</span>
            <span className="ml-2 font-mono text-[11px] text-ink-4">61 / 100</span>
          </dt>
          <dd
            className="figure w-[132px] shrink-0 text-right text-[1.9rem]"
            style={{ color: "var(--s5)", fontVariantNumeric: "tabular-nums" }}
          >
            412,000
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-4">
        Held against your codebase the way an inspector holds a grade card against steel. Every
        line above is work that merged and passed review.
      </p>
    </div>
  );
}

/* --- 02 · the account of attention ---------------------------------------- */

const TEAMS = [
  { team: "Payments", of: 34 },
  { team: "Identity", of: 28 },
  { team: "Ledger", of: 19 },
  { team: "Growth", of: 8 },
];

function JudgmentTally() {
  return (
    <div className="w-full max-w-[460px]">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">
          Review that changed direction
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-3">
          0–100
        </span>
      </div>

      {TEAMS.map((t) => (
          <div key={t.team} className="flex items-center gap-5 border-b border-line py-4">
            <span className="w-[70px] shrink-0 text-[13.5px] text-ink-2">{t.team}</span>
            <span className="min-w-0 flex-1">
              <Scale value={t.of} tone="var(--s3)" />
            </span>
            <span className="figure tabular w-[52px] shrink-0 text-right text-[1.4rem] text-ink">
              {t.of}%
            </span>
          </div>
      ))}

      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-4">
        Growth ships fastest and thinks least. No throughput chart contains that sentence.
      </p>
    </div>
  );
}

/* --- one instrument -------------------------------------------------------- */

function Instrument({
  index,
  name,
  claim,
  claimBreaks,
  body,
  reading,
  priced,
  pricedLabel,
  art,
  flip = false,
  tone,
}: {
  index: string;
  name: string;
  claim: string;
  /** hand-set line breaks; display type is never left to rag on its own */
  claimBreaks?: string[];
  body: string;
  reading: string;
  priced: string;
  pricedLabel: string;
  art: React.ReactNode;
  flip?: boolean;
  tone: string;
}) {
  return (
    <div className="border-t border-line">
      <div className="mx-auto grid max-w-[var(--maxw)] items-start gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <Reveal className={`min-w-0 ${flip ? "lg:order-last" : ""}`}>
          <div>
            <div className="flex items-baseline gap-4">
              <span className="figure text-[1.4rem]" style={{ color: tone }}>
                {index}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">
                {name}
              </span>
              <span className="rule mb-1 flex-1" />
            </div>

            {/* the reading, set as the subject rather than as a stat under the copy */}
            <p className="figure mt-10 text-[5rem] leading-[0.82] text-ink sm:text-[6.5rem]">
              {reading}
            </p>

            <h3 className="h2 mt-9 max-w-[19ch] text-[1.75rem] sm:text-[2.1rem]">{claim}</h3>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-3">{body}</p>

            <div className="mt-8 flex items-baseline gap-4 border-t border-line pt-5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-4">
                {pricedLabel}
              </span>
              <span className="figure text-[1.6rem]" style={{ color: tone }}>
                {priced}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className={`flex ${flip ? "lg:justify-start" : "lg:justify-end"}`}>{art}</div>
        </Reveal>
      </div>
    </div>
  );
}

export function Instruments() {
  return (
    <section id="instruments" className="bg-white">
      <div className="mx-auto max-w-[var(--maxw)] px-6 pt-24">
        <Reveal>
          <div>
            <div className="flex items-baseline gap-5">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
                Our instruments
              </span>
              <span className="rule mb-1 flex-1" />
            </div>
            <h2 className="h2 mt-8 max-w-3xl text-[2.1rem] sm:text-[2.7rem]">
              Two readings nobody else computes.
            </h2>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-3">
              Everything in the next section, every vendor in this category has. These two are
              ours, and they are the reason the rest of it is worth reading.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-16">
        <Instrument
          index="01"
          name="Slop Index"
          tone="var(--s5)"
          reading="61"
          claim="What plausible work costs after it merges."
          body="Computed from what gets rewritten, what drags review, what compounds as complexity, and what nobody can account for three weeks later. Priced, so the conversation happens in a budget meeting rather than a retro."
          priced="$412k"
          pricedLabel="Charged this quarter"
          art={<SlopAccount />}
        />
        <Instrument
          flip
          index="02"
          name="Judgment Rate"
          tone="var(--t3)"
          reading="22%"
          claim="Where a person changed the direction, not the syntax."
          claimBreaks={["Where a person changed", "the direction, not the syntax."]}
          body="Read from the work itself: the rejections, the redirections, the designs thrown away before they cost anything. The only one of our numbers that rises when people think harder, and the only one that cannot be gamed by producing more."
          priced="$780k"
          pricedLabel="Avoided this quarter"
          art={<JudgmentTally />}
        />
      </div>

      <div className="mx-auto max-w-[var(--maxw)] border-t border-line px-6 py-4">
        <p className="text-right font-mono text-[9px] uppercase tracking-[0.16em] text-ink-4">
          Illustrative
        </p>
      </div>
    </section>
  );
}
