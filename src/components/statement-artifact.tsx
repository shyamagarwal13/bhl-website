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
      {/* corner registration marks: cheap, and they sell the conceit */}
      {[
        "left-6 top-6",
        "right-6 top-6",
        "bottom-6 left-6",
        "bottom-6 right-6",
      ].map((pos) => (
        <span key={pos} className={`pointer-events-none absolute ${pos} opacity-20`} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#fff" strokeWidth="1" />
            <line x1="7" y1="0" x2="7" y2="14" stroke="#fff" strokeWidth="1" />
          </svg>
        </span>
      ))}

      <div className="mx-auto grid max-w-[var(--maxw)] items-center gap-14 px-6 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
        {/* --- the sheet --- */}
        <Reveal className="min-w-0">
          <div
            className="relative isolate"
            style={{ filter: "drop-shadow(26px 34px 46px rgba(0,0,0,0.55))" }}
          >
            <div
              className="relative bg-[#eeece2] bg-cover bg-center px-7 pb-16 pt-8 sm:px-11 sm:pb-20 sm:pt-11"
              style={{ backgroundImage: "url(/paper/sheet.jpg)", backgroundSize: "cover", backgroundPosition: "center top" }}
            >
              {/* letterhead */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#14150f]/45 pb-3">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#14150f]/75">
                  Quarterly statement · engineering
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#14150f]/50">
                  Ref BHL·0413 — Q3
                </span>
              </div>

              <h2 className="h2 mt-8 max-w-[16ch] text-[1.9rem] text-[#14150f] sm:text-[2.4rem]">
                This is what we hand you.
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
                      Charged to slop this quarter
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
                Illustrative statement · method overleaf · figures recomputed at each close
              </p>
            </div>
          </div>
        </Reveal>

        {/* --- the annotation, on the dark ground beside the object --- */}
        <Reveal delay={140} className="min-w-0">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              Method
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              Computed per the procedure in{" "}
              <span className="text-white/85">arXiv:2607.01904</span> and{" "}
              <span className="text-white/85">MSR 2026</span>. Sampling frame, exclusions and
              sensitivity are printed with every statement.
            </p>

            <p className="mt-10 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              Read by
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              A named researcher, not a scheduled job. The caveats come from the person who
              would have to defend them.
            </p>

            <p className="mt-10 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/40">
              Issued
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              Fourteen days after quarter close, on paper if you want it on paper.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
