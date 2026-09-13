/*
 * Where the people came from.
 *
 * The obvious execution is the one every site in this category uses: a dark band with a
 * marquee of greyed-out logos. It is borrowed, it needs logo assets we do not have the right
 * to redraw, and with three names a loop is visibly thin.
 *
 * This page has a better device sitting in it already. Every claim here is backed by
 * published papers, and a paper states exactly this — who did the work and where they are —
 * as a byline with superscript affiliations under the title. So that is what this is: the
 * author block of the research the rest of the page rests on, set at display size.
 *
 * It is honest in a way a logo wall is not. A logo implies a customer or a partner; a
 * superscript affiliation says precisely what is true, which is that the people have worked
 * and published at these institutions.
 */

import { Reveal } from "./reveal";

const PLACES = ["Carnegie Mellon University", "Google", "Microsoft"];

export function Affiliations() {
  return (
    <section className="mx-auto max-w-[var(--maxw)] px-6 py-20 sm:py-24">
      <Reveal>
        <span className="rule block" />
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-10">
          <p className="h2 max-w-[26ch] text-[1.6rem] text-ink-3 sm:text-[1.9rem]">
            AI experts from the world&apos;s leading{" "}
            <span className="lean text-ink">organizations</span>.
          </p>

          {/* The byline. Superscripts are the whole idea: they are what a paper puts next to
              an author's name, and they let the institutions be stated as fact rather than
              implied by a logo. */}
          <ol className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-5">
            {PLACES.map((place, i) => (
              <li
                key={place}
                className="term-in flex items-start gap-1.5"
                style={{ ["--d" as string]: `${i * 160}ms` }}
              >
                <span className="h2 text-[1.9rem] text-ink sm:text-[2.6rem]">{place}</span>
                <span
                  className="mt-1 font-mono text-[11px] text-ink-4 sm:text-[13px]"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-9 max-w-xl border-t border-line pt-6 text-[13.5px] leading-relaxed text-ink-4">
            <span className="font-mono text-[11px]">1,2,3</span>&nbsp;&nbsp;Where our
            researchers and practitioners have worked and published. The papers below carry the
            same affiliations on their title pages.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
