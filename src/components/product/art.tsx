/*
 * The signature instrument for the engineering intelligence page.
 *
 * Drawn rather than screenshotted, animated in CSS on transform and opacity only, and switched
 * off wholesale by the reduced-motion block in globals.css. It has to carry the product's idea
 * on its own, because it is what a reader looks at before reading.
 *
 * Two others used to live here and have been replaced by instruments that needed more room
 * than a card: the router by the reel in router-flow.tsx, and the token spend breakdown by the
 * decay plot in spend-decay.tsx. A spend breakdown is the one chart every competitor can draw,
 * because the invoice is the one dataset everybody already has.
 */

/* --- Engineering intelligence: every change, sorted ----------------------- */

/*
 * An 8x14 field where each cell is one merged change, and a horizon that sweeps it.
 *
 * The still version of this said the useful half: most changes are unremarkable, a few are
 * slop, a few carry real judgment, and the product is the claim that those are different
 * things. What it could not say is the half that actually matters, which is that none of it is
 * knowable on the day the change merges. The verdict arrives weeks later, in what gets
 * rewritten and what survives.
 *
 * So the field is read by a horizon. Cells ahead of it are pale: merged, too recent to judge.
 * As it crosses a column the cells in that column take their verdict, top to bottom, and hold
 * it for the rest of the lap. Nothing resets, because the horizon is on a loop rather than a
 * run: the pale band is always the newest work, wherever it currently is.
 *
 * It is the same idiom as the decay plot on the token page, and deliberately so. Both products
 * are arguments about the same thing, which is that the reading you want is not available at
 * the moment you want it.
 *
 * All of it runs on two sets of keyframes and a per-cell custom property. No timers, no state,
 * nothing per frame from JavaScript.
 *
 * The pattern is fixed rather than random so the page renders identically on the server and
 * the client: a Math.random() field hydrates into a different arrangement and React complains.
 */
const COLS = 14;
const ROWS = 8;
const CELLS = COLS * ROWS;
const SLOP = new Set([3, 9, 17, 24, 31, 38, 46, 52, 59, 67, 71, 80, 88, 93, 101, 108]);
const JUDGED = new Set([6, 14, 22, 35, 44, 57, 63, 76, 85, 97, 104]);
const LAP = 7200;

const verdictOf = (i: number) =>
  SLOP.has(i) ? "var(--s5)" : JUDGED.has(i) ? "var(--t3)" : "var(--paper-2)";

export function EngArt({ note = true }: { note?: boolean } = {}) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
          Merged this quarter
        </span>
        <span className="tabular text-[13px] font-extrabold text-ink">{CELLS}</span>
      </div>

      <div className="relative mt-4">
        <div
          className="grid gap-[5px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {Array.from({ length: CELLS }, (_, i) => {
            /*
             * Column-major, so time runs left to right the way it does on every other chart on
             * this site rather than wrapping line by line like text.
             *
             * The delay is negative and counted back from a full lap, which is what puts the
             * horizon in front of the colour instead of behind it: at `-(1 - p)` a cell is one
             * tick past its own zero exactly as the horizon reaches its column, so colour
             * follows the line and pale leads it.
             */
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const p = (col * ROWS + row) / CELLS;
            const verdict = verdictOf(i);
            return (
              <span
                key={i}
                className="aspect-square rounded-[3px]"
                style={{
                  backgroundColor: verdict,
                  ["--verdict" as string]: verdict,
                  animation: `cell-verdict ${LAP}ms linear infinite`,
                  animationDelay: `${-(1 - p) * LAP}ms`,
                }}
              />
            );
          })}
        </div>

        {/* the horizon */}
        <span
          aria-hidden="true"
          className="field-head pointer-events-none absolute -inset-y-1 w-px"
          style={{
            background: "var(--ink-4)",
            animation: `field-scan ${LAP}ms linear infinite`,
          }}
        >
          {/* the same head the decay plot carries, so the two instruments read as one family */}
          <span
            className="absolute -top-1 h-1.5 w-1.5 -translate-x-[3px] rounded-full"
            style={{ background: "var(--ink-4)" }}
          />
        </span>
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

      {note && (
        <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
          None of this is knowable on the day the change merges. Every verdict on this page
          arrives weeks later, in what gets rewritten and what survives.
        </p>
      )}
    </div>
  );
}
