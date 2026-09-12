/*
 * Selected work, as a continuously drifting rail.
 *
 * A 2×2 grid of large cards gave the papers as much vertical space as the argument they
 * support, which put the evidence ahead of the claim. A rail gives the section back its
 * proportions and keeps every paper in front of a reader who never touches it.
 *
 * Same mechanism as the logos marquee: two identical copies in one track translated by
 * exactly -50%, so the loop point lands where the second copy is pixel-aligned with the
 * first and there is no jump. The duplicate is hidden from assistive tech so the section
 * offers five papers rather than ten.
 *
 * It pauses under the pointer and on keyboard focus. That is not decoration here the way
 * it would be on the logo strip: these cards are links, and a link that slides out from
 * under the cursor cannot be clicked.
 *
 * No arrows and no scroll container. Both were here when the rail stepped card by card,
 * and neither survives constant motion: there is nothing to be at the end of.
 */

import Image from "next/image";

type Paper = {
  img: string;
  t: string;
  venue: string;
  find: string;
  href: string;
};

export function PapersRail({ papers }: { papers: Paper[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <p className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
          Selected work
        </p>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/*
        Full-bleed on the left and right of the section so cards drift in and out of the
        page edge rather than appearing inside a box. The mask fades both ends so nothing
        is ever hard-cut mid-card.
      */}
      <div
        className="relative -mx-6 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        <div className="papers-track flex w-max gap-5 px-6">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-5" aria-hidden={copy === 1}>
              {papers.map((p) => (
                <a
                  key={p.t}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift sm:w-[330px]"
                >
                  {/* the paper itself: a first page is harder to fake than a citation */}
                  <div className="relative h-[150px] overflow-hidden border-b border-line bg-paper">
                    <Image
                      src={p.img}
                      alt={copy === 1 ? "" : `First page of ${p.t}`}
                      width={1347}
                      height={800}
                      className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
                        {p.venue}
                      </span>
                      <span className="ml-auto shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </div>
                    <h4 className="mt-2 text-balance text-[0.95rem] font-bold leading-snug text-ink">
                      {p.t}
                    </h4>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{p.find}</p>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
