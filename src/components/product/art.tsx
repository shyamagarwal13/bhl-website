/*
 * One signature instrument per product page.
 *
 * Drawn rather than screenshotted, animated in CSS on transform and opacity only, and
 * switched off wholesale by the reduced-motion block in globals.css. Each one has to carry
 * the product's idea on its own, because it is what a reader looks at before reading.
 *
 * The router is the important one. Behold's identity is a prism — one undifferentiated beam
 * split into a spectrum you can act on — and a model router is literally that: one stream of
 * requests, separated by difficulty, sent to different models. The metaphor was already in
 * the design system waiting for the product that needed it, and no competitor can borrow it
 * without abandoning their own mark.
 */

/* --- Router: one beam in, a spectrum out ---------------------------------- */

const LANES = [
  { model: "haiku", share: "62%", cost: "$", band: "var(--s3)", dur: "2.2s", d: 0 },
  { model: "sonnet", share: "31%", cost: "$$", band: "var(--s2)", dur: "2.7s", d: 420 },
  { model: "opus", share: "7%", cost: "$$$", band: "var(--s1)", dur: "3.2s", d: 900 },
];

export function RouterArt() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      <div className="flex items-center gap-3">
        {/* the incoming beam: undifferentiated, one colour */}
        <div className="w-[62px] shrink-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">In</p>
          <p className="tabular mt-1 text-[15px] font-extrabold tracking-tight text-ink">1,284</p>
          <p className="text-[10px] leading-tight text-ink-4">req / hr</p>
        </div>

        <div className="relative h-8 min-w-[24px] flex-[0.8] overflow-hidden" aria-hidden="true">
          <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-line" />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="packet absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ink-3"
              style={{ ["--d" as string]: `${i * 520}ms`, ["--dur" as string]: "2.1s" }}
            />
          ))}
        </div>

        {/* the prism */}
        <div className="relative shrink-0" aria-hidden="true">
          <svg width="46" height="52" viewBox="0 0 46 52" fill="none">
            <defs>
              <linearGradient id="prismface" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--s1)" stopOpacity="0.22" />
                <stop offset="50%" stopColor="var(--s3)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--s5)" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              d="M23 3 L43 47 H3 Z"
              fill="url(#prismface)"
              stroke="var(--line-2)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* the exit face, lighting as each beam passes */}
            <path
              className="seam"
              d="M23 3 L43 47"
              stroke="var(--s1)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ transformOrigin: "33px 25px" }}
            />
          </svg>
        </div>

        {/* the spectrum: three lanes, each its own band */}
        <div className="flex min-w-0 flex-[1.5] flex-col gap-2.5">
          {LANES.map((l) => (
            <div key={l.model} className="flex items-center gap-1.5">
              <div className="relative h-3 min-w-[18px] flex-1 overflow-hidden" aria-hidden="true">
                <span
                  className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full"
                  style={{ background: `color-mix(in srgb, ${l.band} 30%, transparent)` }}
                />
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className="packet absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                    style={{
                      background: l.band,
                      ["--d" as string]: `${l.d + i * 1100}ms`,
                      ["--dur" as string]: l.dur,
                    }}
                  />
                ))}
              </div>
              <span className="w-[44px] shrink-0 font-mono text-[10px] text-ink-3">{l.model}</span>
              <span className="tabular w-[30px] shrink-0 text-right text-[11px] font-bold text-ink">
                {l.share}
              </span>
              <span
                className="w-[22px] shrink-0 text-right font-mono text-[10px]"
                style={{ color: l.band }}
              >
                {l.cost}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
        Same quality bar. Seven per cent of traffic actually needs the expensive model.
      </p>
    </div>
  );
}

/* --- Engineering intelligence: every change, sorted ----------------------- */

/*
 * An 8×14 field where each cell is one merged change. Most are unremarkable. A few are
 * slop and a few carry real judgment, and the whole product is the claim that those are
 * different things and that we can tell them apart.
 *
 * The pattern is fixed rather than random so the page renders identically on the server and
 * the client — a Math.random() field hydrates into a different arrangement and React will
 * complain about it.
 */
const COLS = 14;
const ROWS = 8;
const SLOP = new Set([3, 9, 17, 24, 31, 38, 46, 52, 59, 67, 71, 80, 88, 93, 101, 108]);
const JUDGED = new Set([6, 14, 22, 35, 44, 57, 63, 76, 85, 97, 104]);

export function EngArt() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
          Merged this quarter
        </span>
        <span className="tabular text-[13px] font-extrabold text-ink">112</span>
      </div>

      <div
        className="mt-4 grid gap-[5px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const slop = SLOP.has(i);
          const judged = JUDGED.has(i);
          return (
            <span
              key={i}
              className="fill-x aspect-square rounded-[3px]"
              style={{
                background: slop
                  ? "var(--s5)"
                  : judged
                    ? "var(--t3)"
                    : "var(--paper-2)",
                ["--d" as string]: `${(i % COLS) * 26 + Math.floor(i / COLS) * 40}ms`,
                transformOrigin: "center",
              }}
            />
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
        {[
          { c: "var(--s5)", t: "Slop", v: "16" },
          { c: "var(--t3)", t: "Real judgment", v: "11" },
          { c: "var(--paper-2)", t: "Unremarkable", v: "85" },
        ].map((l) => (
          <li key={l.t} className="flex items-center gap-2 text-[11.5px] text-ink-2">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: l.c }} />
            {l.t}
            <span className="tabular font-mono text-[10px] text-ink-4">{l.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- Token intelligence: the bill, refracted ------------------------------ */

const SPEND = [
  { k: "Claude Code", v: "$21,480", pct: 100, band: "var(--s1)" },
  { k: "Cursor", v: "$12,905", pct: 60, band: "var(--s2)" },
  { k: "Copilot", v: "$7,640", pct: 36, band: "var(--s3)" },
  { k: "Agents (API)", v: "$4,312", pct: 20, band: "var(--s4)" },
  { k: "Everything else", v: "$1,877", pct: 9, band: "var(--s5)" },
];

export function TokenArt() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
            AI spend, this month
          </p>
          <p className="tabular mt-1 text-[1.75rem] font-extrabold tracking-tight text-ink">
            $48,214
          </p>
        </div>
        <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[10px] text-ink-3">
          5 sources
        </span>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {SPEND.map((s, i) => (
          <li key={s.k} className="flex items-center gap-3">
            <span className="w-[92px] shrink-0 truncate text-[11.5px] text-ink-2">{s.k}</span>
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-paper-2">
              <span
                className="fill-x block h-full rounded-full"
                style={{
                  width: `${s.pct}%`,
                  background: s.band,
                  ["--d" as string]: `${i * 110}ms`,
                }}
              />
            </span>
            <span className="tabular w-[58px] shrink-0 text-right font-mono text-[10.5px] text-ink-3">
              {s.v}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
        Then the part no invoice contains: what each of those dollars cost you to keep.
      </p>
    </div>
  );
}
