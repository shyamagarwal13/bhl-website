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
