"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Selected work, as an endless horizontal rail.
 *
 * A 2×2 grid of large cards gave the papers as much vertical space as the argument they
 * support, which put the evidence ahead of the claim. A rail keeps every paper one gesture
 * away and gives the section back its proportions.
 *
 * Infinite by duplication rather than by animation. The list is rendered three times and
 * the scroll position is kept inside the middle copy, shifted by exactly one set width
 * whenever it leaves. Because the copies are identical the correction is invisible, and
 * parking in the middle leaves a full set of runway in both directions, so a backwards
 * swipe never hits a wall the way it would with two copies resting at zero.
 *
 * That buys a loop with no ends while keeping everything native scrolling already does
 * correctly: swipe on touch, two-finger scroll on a trackpad, snap points, and links you
 * can click. A CSS transform marquee would have been fewer lines and would have cost all
 * of it.
 *
 * The correction runs only once motion has settled. Assigning scrollLeft during an in-flight
 * smooth scroll cancels it, which would stutter at the seam; waiting until the rail is
 * stationary means the reader never sees it happen.
 *
 * It advances on its own, and stops on hover, on focus, off screen, and under reduced
 * motion. The cards are links, and a link that slides away while you aim at it is a trap.
 */

type Paper = {
  img: string;
  t: string;
  venue: string;
  find: string;
  href: string;
};

const ADVANCE_MS = 4200;
const GAP = 20; // matches gap-5, and a step is one card plus one gap

export function PapersRail({ papers }: { papers: Paper[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const settle = useRef<number | undefined>(undefined);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  /** Width of one full set of cards, including the gap that follows the last one. */
  const setWidth = useCallback(() => {
    const el = rail.current;
    if (!el) return 0;
    return el.scrollWidth / 3;
  }, []);

  const step = useCallback(() => {
    const el = rail.current;
    if (!el) return 0;
    const card = el.querySelector("a");
    return card ? card.getBoundingClientRect().width + GAP : el.clientWidth * 0.8;
  }, []);

  // Keep the position inside the middle copy. Both corrections are instant and land on
  // identical content, so neither is visible.
  const reseat = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const w = setWidth();
    if (w <= 0) return;
    if (el.scrollLeft >= 2 * w) el.scrollLeft -= w;
    else if (el.scrollLeft < w) el.scrollLeft += w;
  }, [setWidth]);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    // start in the middle copy, so there is a full set of runway in both directions from
    // the first paint
    el.scrollLeft = setWidth();

    const onScroll = () => {
      window.clearTimeout(settle.current);
      settle.current = window.setTimeout(reseat, 160);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle.current);
    };
  }, [reseat, setWidth]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const id = window.setInterval(() => {
      rail.current?.scrollBy({ left: step(), behavior: "smooth" });
    }, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduced, step]);

  const nudge = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-3 transition-colors hover:border-line-2 hover:text-ink";

  // Three passes over the list; only the middle one is real. Hiding the outer two from
  // assistive tech and from the tab order is what stops the section claiming fifteen
  // papers instead of five.
  const cards = [0, 1, 2].flatMap((pass) =>
    papers.map((p) => ({ p, clone: pass !== 1 })),
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-4 flex items-center gap-4">
        <p className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
          Selected work
        </p>
        <span className="h-px flex-1 bg-line" />
        {/* never disabled: the rail has no ends any more */}
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous papers" className={arrow}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="More papers" className={arrow}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/*
        The negative margin plus matching padding lets cards bleed to the section edge on a
        phone while the first one still lines up with the text above it.

        snap-proximity rather than snap-mandatory: with mandatory, the seam correction
        occasionally landed between two snap points and the browser yanked it to the nearer
        one, which is the one moment the reader could see the loop.
      */}
      <div
        ref={rail}
        className="-mx-6 flex snap-x snap-proximity gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map(({ p, clone }, i) => (
          <a
            key={`${p.t}-${i}`}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            aria-hidden={clone || undefined}
            tabIndex={clone ? -1 : undefined}
            /* width computed from the gap so three sit exactly in the frame at lg, two at
               sm, and one plus a peek on a phone, which is what says the row continues */
            className="group flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]"
          >
            {/* the paper itself: a first page is harder to fake than a citation */}
            <div className="relative h-[150px] overflow-hidden border-b border-line bg-paper">
              <Image
                src={p.img}
                alt={clone ? "" : `First page of ${p.t}`}
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
    </div>
  );
}
