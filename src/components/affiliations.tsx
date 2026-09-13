/*
 * Where the people came from, stated as a byline above the research.
 *
 * Deliberately type rather than logos. We have no licence to the Carnegie Mellon, Google or
 * Microsoft marks, redrawing them is a trademark risk, and three third-party logos in their
 * own brand colours would tear a hole in a page built on one ink and one paper. Set in the
 * display face they read as a byline, which is also the more honest shape: a logo implies a
 * customer or a partner, a named affiliation says only that people have worked there.
 *
 * Sits directly above the papers, so the claim and its evidence are one block. The list is
 * explicitly open-ended — "like … and more" — because these three are examples rather than
 * the full set, and a closed list would be the narrower claim.
 */

import { Reveal } from "./reveal";

const PLACES = ["Carnegie Mellon University", "Google", "Microsoft"];

export function Affiliations() {
  return (
    <Reveal>
      <div>
        <p className="text-[1.0625rem] text-ink-3">
          AI experts from the world&apos;s leading organizations like
        </p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-10 gap-y-3">
          {PLACES.map((place, i) => (
            <span
              key={place}
              className="term-in h2 text-[1.7rem] text-ink sm:text-[2.3rem]"
              style={{ ["--d" as string]: `${i * 150}ms` }}
            >
              {place}
            </span>
          ))}

          {/* Set smaller and lighter so it trails the list rather than reading as a fourth
              institution. One ellipsis, not a row of periods — the rest of the page is too
              carefully set to carry five full stops. */}
          <span
            className="term-in h2 text-[1.3rem] text-ink-4 sm:text-[1.6rem]"
            style={{ ["--d" as string]: "460ms" }}
          >
            and more&#8230;
          </span>
        </div>
      </div>
    </Reveal>
  );
}
