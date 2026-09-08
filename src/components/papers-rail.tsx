"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Selected work, as a horizontal rail.
 *
 * A 2×2 grid of large cards gave four papers as much vertical space as the argument above
 * them, which put the evidence ahead of the claim it supports. A rail keeps every paper one
 * gesture away and gives the section back its proportions.
 *
 * Native overflow scrolling with snap points does the work: it is already correct for
 * touch, trackpads and screen readers, and it degrades to a plain scrollable list if the
 * script never runs. The buttons exist because a mouse user on a desktop has no obvious way
 * to scroll a horizontal region, and they hide themselves at each end rather than sitting
 * there disabled.
 *
 * It advances on its own so a reader who never touches it still sees past the third card,
 * and wraps back to the start rather than stopping, since a rail that halts at the end
 * looks broken. Three cards to a screen on desktop, two on tablet, one and a peek on a
 * phone. The timer stops on hover, on focus, off screen, and under reduced motion: the
 * cards are links, and a link that moves while you aim at it is a trap.
 */

type Paper = {
  img: string;
  t: string;
  venue: string;
  find: string;
  href: string;
};

const ADVANCE_MS = 4200;

export function PapersRail({ papers }: { papers: Paper[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    // 2px of slack: sub-pixel widths mean scrollLeft rarely lands exactly on the end
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    measure();
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

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
      const el = rail.current;
      if (!el) return;
      const card = el.querySelector("a");
      const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
      // wrap instead of stopping; 2px of slack because sub-pixel widths mean scrollLeft
      // rarely lands exactly on the end
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduced]);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // one card plus its gap, so a click always lands on a snap point
    const card = el.querySelector("a");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-3 transition-colors hover:border-line-2 hover:text-ink disabled:pointer-events-none disabled:opacity-0";

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
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Previous papers"
            className={arrow}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="More papers"
            className={arrow}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/*
        The negative margin plus matching padding lets cards bleed to the section edge on a
        phone while the first one still lines up with the text above it. Without the padding
        the leading card sits flush against the viewport and reads as cut off.
      */}
      <div
        ref={rail}
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {papers.map((p) => (
          <a
            key={p.t}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            /* basis is computed from the gap so three sit exactly in the frame at lg,
               two at sm, and one plus a peek on a phone, which is what tells a reader
               the row continues */
            className="group flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]"
          >
            {/* the paper itself: a first page is harder to fake than a citation */}
            <div className="relative h-[150px] overflow-hidden border-b border-line bg-paper">
              <Image
                src={p.img}
                alt={`First page of ${p.t}`}
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
