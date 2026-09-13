/*
 * Where the people came from, set as a centred byline above the research.
 *
 * The marks rather than the names, in one ink. That is a reversal of what this component used
 * to argue, and the reasoning it replaces is worth stating: three third-party logos in their
 * own brand colours would be the only saturated hues on a page built from one ink and one
 * paper. Reducing them to the page's ink settles that, and a single-ink logo row is the
 * ordinary treatment for this exact claim.
 *
 * The sentence is deliberately about people rather than about customers, and it sits directly
 * above the marks so it cannot be read as a client list. "and more" closes the row underneath,
 * because these three are examples rather than the full set and a closed list would be the
 * narrower claim.
 */

import { CarnegieMellonMark, GoogleMark, MicrosoftMark } from "./logos";
import { Reveal } from "./reveal";

/*
 * Heights come from CSS rather than from the `height` prop so they can step down on a phone.
 * At full size the three marks and their gaps come to about 390px, which wraps to two rows on
 * a 390px screen and leaves one institution stranded on a line of its own; a row of three that
 * breaks 2 + 1 stops reading as a set. The attribute sizes stay as the no-CSS fallback.
 *
 * The marks are optically sized rather than set to one height. Their artwork carries different
 * amounts of internal padding, so three logos at an identical 26px read as three different
 * sizes; these numbers were picked by looking at them side by side.
 */
const MARKS = [
  { key: "cmu", el: <CarnegieMellonMark height={27} className="h-[19px] w-auto sm:h-[27px]" /> },
  { key: "google", el: <GoogleMark height={25} className="h-[18px] w-auto sm:h-[25px]" /> },
  { key: "microsoft", el: <MicrosoftMark height={25} className="h-[17px] w-auto sm:h-[25px]" /> },
];

export function Affiliations() {
  return (
    <Reveal>
      <div className="text-center">
        <p className="mx-auto max-w-2xl text-[1.0625rem] leading-snug text-ink-3">
          AI experts from the world&apos;s leading organizations
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-7 sm:gap-x-16">
          {MARKS.map((m, i) => (
            <span
              key={m.key}
              /* inline-block so the reveal's translate applies to it at all */
              className="term-in inline-block text-ink-2"
              style={{ ["--d" as string]: `${i * 150}ms` }}
            >
              {m.el}
            </span>
          ))}
        </div>

        {/* One ellipsis, not a row of periods: the rest of the page is too carefully set to
            carry five full stops. */}
        <p
          className="term-in h2 mt-8 text-[1.3rem] text-ink-4 sm:text-[1.5rem]"
          style={{ ["--d" as string]: "470ms" }}
        >
          and more&#8230;
        </p>
      </div>
    </Reveal>
  );
}
