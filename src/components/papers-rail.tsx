/*
 * Selected work, set as catalogue cards.
 *
 * The page's numbered-row register was being used for six different sections, at which point
 * it stops being a system and becomes wallpaper. This is the same paper stock and the same
 * hairlines, but a structurally different object: a two-column plan-chest of index cards,
 * each ruled at the head like a catalogue slip, with the venue as the filing line.
 *
 * Not rounded, not lifted, no icon. A card here is a physical card — square corners, one
 * hairline border, a ruled header — which is a different thing from the soft container that
 * every SaaS template reaches for.
 */

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
      <div className="flex items-baseline gap-5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
          Selected work
        </span>
        <span className="rule mb-1 flex-1" />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-4">
          Peer-reviewed and preprint
        </span>
      </div>

      {/* Citation entries, not cards. A bibliography in a printed report is ruled and
          numbered; boxing each paper in a bordered rectangle was the one component on the
          page with no print identity at all. */}
      <ol className="mt-10">
        {papers.map((p, i) => (
          <li key={p.t}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group grid items-baseline gap-x-8 gap-y-2 border-t border-line py-6 transition-colors hover:bg-white/60 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto]"
            >
              <span className="figure text-[1.05rem] text-ink-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h4 className="h2 text-[1.25rem] text-ink sm:text-[1.4rem]">{p.t}</h4>
                <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink-3">{p.find}</p>
              </div>
              <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-4">
                {p.venue}
              </span>
            </a>
          </li>
        ))}
        <li className="grid gap-x-8 border-t border-line py-6 sm:grid-cols-[2.75rem_minmax(0,1fr)]">
          <span />
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-ink-4">
            Every number on this page is computed the way these papers describe. We publish the
            method, not just the finding — so if you want to argue with it, the argument is in
            print.
          </p>
        </li>
      </ol>
      <div className="border-t border-line" />
    </div>
  );
}
