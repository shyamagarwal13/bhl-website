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
 * An 8x14 field where each cell is one merged change, turning over to show its verdict.
 *
 * The still version said the useful half: most changes are unremarkable, a few are slop, a few
 * carry real judgment, and the product is the claim that those are different things. What it
 * could not say is the half that actually matters, which is that none of it is knowable on the
 * day the change merges. So the field starts grey, which is everything anyone knows at merge
 * time, and the cells turn over one by one to show what was underneath. The field stands
 * complete for a beat, turns back to grey, and goes again: work does not stop merging at the
 * end of a quarter, and the same cycle of fill, hold and clear runs on the token page next
 * door.
 *
 * The order is scattered rather than swept. An earlier pass ran a horizon across the grid, and
 * a straight line crossing a field says the verdicts arrive in column order, which is a claim
 * about the calendar rather than about the work. Verdicts on unrelated changes arrive whenever
 * the rewriting happens to catch up with them.
 *
 * Both the pattern and the scatter are arithmetic rather than random, so the server and the
 * client render the same field: a Math.random() anywhere in here hydrates into a different
 * arrangement, and a float hash built on Math.sin can differ between engines. Integer
 * multiplication and a modulo cannot.
 */
const COLS = 14;
const ROWS = 8;
const CELLS = COLS * ROWS;
const SLOP = new Set([3, 9, 17, 24, 31, 38, 46, 52, 59, 67, 71, 80, 88, 93, 101, 108]);
const JUDGED = new Set([6, 14, 22, 35, 44, 57, 63, 76, 85, 97, 104]);

/*
 * One lap: the field fills, stands, clears and goes again.
 *
 * STAGGER has to stay well under the span the keyframes hold the verdict for, or no two cells
 * are ever showing their verdict at the same time and the whole thing decays into a shimmer
 * with no settled state. A fifth of the lap is comfortably inside it.
 */
const LAP = 6400;
const STAGGER = 1280;
const LEAD_IN = 120;

const verdictOf = (i: number) =>
  SLOP.has(i) ? "var(--s5)" : JUDGED.has(i) ? "var(--t3)" : "var(--paper-2)";

/* Knuth's multiplicative hash, kept in integers the whole way. i * 2654435761 stays under
   2^53 for a field this size, so the result is exact and identical wherever it runs. */
const turnAt = (i: number) =>
  LEAD_IN + Math.round((((i + 1) * 2654435761) % 4294967296) / 4294967296 * STAGGER);

export function EngArt({ note = true }: { note?: boolean } = {}) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
          Merged this quarter
        </span>
        <span className="tabular text-[13px] font-extrabold text-ink">{CELLS}</span>
      </div>

      <div
        className="mt-4 grid gap-[5px]"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          /* enough for the turn to have a near edge and a far one, not so much that a 38px
             square looks like it is falling away from the reader */
          perspective: "420px",
        }}
        aria-hidden="true"
      >
        {Array.from({ length: CELLS }, (_, i) => {
          const verdict = verdictOf(i);
          return (
            <span
              key={i}
              className="cell-flip aspect-square rounded-[3px]"
              style={{
                /* the settled state, and what anyone without the animation sees */
                backgroundColor: verdict,
                ["--verdict" as string]: verdict,
                ["--start" as string]: "var(--paper-2)",
                ["--d" as string]: `${turnAt(i)}ms`,
                ["--lap" as string]: `${LAP}ms`,
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

      {note && (
        <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
          None of this is knowable on the day the change merges. Every verdict on this page
          arrives weeks later, in what gets rewritten and what survives.
        </p>
      )}
    </div>
  );
}
