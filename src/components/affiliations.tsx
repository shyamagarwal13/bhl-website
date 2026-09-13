/*
 * Where the people came from, set as a signed line above the research.
 *
 * Type rather than logos, deliberately. We have no licence to the Carnegie Mellon, Google or
 * Microsoft marks, redrawing them is a trademark risk, and three third-party logos in their
 * own brand colours would tear a hole in a page built on one ink and one paper. Set in the
 * display face they read as a byline, which is also the more honest shape: a logo implies a
 * customer or a partner, a named affiliation says only that people have worked there.
 *
 * The motion is the whole design. Each name arrives and is then underscored by a rule that
 * draws left to right, in sequence, the way a hand ruling a register would do it. The last
 * rule does not stop at the last word: it carries past "and more" and runs out to the margin,
 * which is the sentence's actual meaning drawn rather than written.
 *
 * Sits directly above the papers, so the claim and its evidence are one block. The list is
 * explicitly open-ended, because these three are examples rather than the full set and a
 * closed list would be the narrower claim.
 */

import { Reveal } from "./reveal";

const PLACES = ["Carnegie Mellon University", "Google", "Microsoft"];

/* one name, then its rule, then the next: the underscore trails its own word */
const NAME_STEP = 170;
const RULE_LAG = 300;
const TAIL = PLACES.length * NAME_STEP + RULE_LAG;

export function Affiliations() {
  return (
    <Reveal>
      <div>
        <p className="max-w-xl text-[1.0625rem] leading-snug text-ink-3">
          AI experts from the world&apos;s leading organizations like
        </p>

        <div className="mt-7 flex flex-wrap items-baseline gap-x-10 gap-y-6">
          {PLACES.map((place, i) => (
            /* inline-block so the reveal's translate applies, relative so the rule can hang
               off the name at a fixed distance instead of riding the line box */
            <span key={place} className="relative inline-block">
              <span
                className="term-in h2 block text-[1.7rem] leading-none text-ink sm:text-[2.4rem]"
                style={{ ["--d" as string]: `${i * NAME_STEP}ms` }}
              >
                {place}
              </span>
              <span
                aria-hidden="true"
                className="fill-x absolute inset-x-0 -bottom-2 block h-px"
                style={{
                  background: "var(--s5)",
                  ["--d" as string]: `${i * NAME_STEP + RULE_LAG}ms`,
                }}
              />
            </span>
          ))}

          {/* Smaller and lighter so it trails the list rather than reading as a fourth
              institution. One ellipsis, not a row of periods: the rest of the page is too
              carefully set to carry five full stops. */}
          <span
            className="term-in h2 text-[1.25rem] leading-none text-ink-4 sm:text-[1.55rem]"
            style={{ ["--d" as string]: `${TAIL}ms` }}
          >
            and more&#8230;
          </span>

          {/* The rule that keeps going, which is what the sentence says.
              Built around an invisible name rather than aligned by hand: baseline arithmetic
              against three different type sizes is exactly the sort of thing that drifts by two
              pixels on a font swap, and this rule has to sit on the same line as the underlines
              or it reads as a stray hairline instead of a continuation. */}
          <span
            aria-hidden="true"
            className="relative hidden min-w-[80px] flex-1 sm:inline-block"
          >
            <span className="h2 invisible block text-[1.7rem] leading-none sm:text-[2.4rem]">
              &nbsp;
            </span>
            <span
              className="fill-x absolute inset-x-0 -bottom-2 block h-px"
              style={{
                background:
                  "linear-gradient(90deg, var(--s5), color-mix(in srgb, var(--s5) 0%, transparent))",
                ["--d" as string]: `${TAIL + 180}ms`,
              }}
            />
          </span>
        </div>
      </div>
    </Reveal>
  );
}
