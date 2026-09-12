/*
 * The object the company hands you.
 *
 * Previously this was a dark section with ruled divs — accurate, and forgettable, because a
 * statement rendered as a table is just a table. The thing being described is a printed
 * sheet: it has a stock, a fold, a reference number, a total ruled twice, and a stamp
 * across it. So it is built as one.
 *
 * The paper is photographic — a real sheet under raking light, which supplies the luminance
 * gradient, the laid lines and the fold crease that no CSS gradient reproduces convincingly.
 * The type is live HTML set on top, so the words stay ours, stay selectable, stay
 * translatable, and never drift from the copy elsewhere on the page. The stamp is drawn, and
 * drawn badly on purpose: heavy ink on the left, dry and broken on the right, four and a half
 * degrees off square.
 *
 * Figures are illustrative and the sheet says so, in the place a real document would.
 */

import { Reveal } from "./reveal";
import { Stamp } from "./engraving";

const LINES: [string, string, string][] = [
  ["Merged changes assessed", "", "1,284"],
  ["Rewritten inside ninety days", "31%", "398"],
  ["Review hours attributable to rework", "", "612"],
  ["Complexity added, not recovered", "", "+27%"],
];

export function StatementArtifact() {
  return (
    <div className="relative overflow-hidden bg-[#14150f]">
      <div className="mx-auto grid max-w-[var(--maxw)] items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
        {/* --- the sheet --- */}
        <Reveal className="min-w-0">
          <div
            className="relative isolate"
            style={{ filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.45)) drop-shadow(18px 26px 34px rgba(0,0,0,0.42))" }}
          >
            <div
              className="relative bg-[#eeece2] bg-cover bg-center px-7 pb-16 pt-8 sm:px-11 sm:pb-20 sm:pt-11"
              style={{ backgroundImage: "url(/paper/sheet.jpg)", backgroundSize: "cover", backgroundPosition: "center top" }}
            >
              {/* letterhead */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#14150f]/45 pb-3">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#14150f]/75">
                  What a quarter looks like, priced
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#14150f]/50">
                  A worked example
                </span>
              </div>

              <h2 className="h2 mt-8 max-w-[18ch] text-[1.9rem] text-[#14150f] sm:text-[2.4rem]">
                The kind of thing we work out with you.
              </h2>

              <dl className="mt-9">
                {LINES.map(([k, note, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline gap-5 border-b border-[#14150f]/18 py-3.5"
                  >
                    <dt className="min-w-0 flex-1 text-[13px] text-[#14150f]/85">{k}</dt>
                    {note && (
                      <span className="shrink-0 font-mono text-[10.5px] text-[#14150f]/45">
                        {note}
                      </span>
                    )}
                    <dd
                      className="figure w-[104px] shrink-0 text-right text-[1.35rem] text-[#14150f]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {v}
                    </dd>
                  </div>
                ))}

                {/* the total, ruled twice, with the impression across it */}
                <div className="relative mt-1">
                  <div className="flex items-baseline gap-5 border-b-[3px] border-double border-[#14150f]/80 py-5">
                    <dt className="min-w-0 flex-1 text-[13.5px] font-semibold text-[#14150f]">
                      What the quarter cost to keep
                    </dt>
                    <dd
                      className="figure w-[190px] shrink-0 text-right text-[2.3rem] text-[#14150f] sm:text-[2.7rem]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      $412,000
                    </dd>
                  </div>

                  <Stamp
                    line="CHARGED"
                    className="pointer-events-none absolute -top-4 left-[26%] w-[212px] opacity-95 sm:left-[30%] sm:w-[258px]"
                  />
                </div>
              </dl>

              {/* perforation and the tear-off footnote */}
              <div
                className="mt-10 h-[6px] w-full"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 3px 3px, rgba(20,21,15,0.42) 1.4px, transparent 1.6px)",
                  backgroundSize: "9px 6px",
                }}
              />
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#14150f]/45">
                Illustrative figures · a real one is worked from your repositories
              </p>
            </div>
          </div>
        </Reveal>

        {/* --- the annotation, on the dark ground beside the object --- */}
        <Reveal delay={140} className="min-w-0">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              Where this comes from
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              The questions come from our published research. The answers come from your
              repositories, and they take real work to get — this is not a dashboard that
              switches on.
            </p>

            <p className="mt-10 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              Who does it
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              We do, alongside your engineering leads. We are a small team and we work with a
              small number of organisations at a time.
            </p>

            <p className="mt-10 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              What it is not
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              A number we can quote you before we have looked. Every figure above is made up
              to show the shape of the thing.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
