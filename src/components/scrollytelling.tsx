"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The "scrolls together" section.
 *
 * Steps scroll normally on the left while the panel on the right stays pinned and swaps
 * as each step becomes active. Built on `position: sticky` plus an IntersectionObserver
 * rather than scroll-position maths: sticky is the browser's own pinning, so it can't
 * drift, judder on momentum scroll, or fight the compositor.
 *
 * Below `lg` the pin is dropped entirely and each step renders with its own visual — a
 * pinned panel on a phone means scrolling past a frozen screen, which is worse than no
 * effect at all.
 */

export type Step = {
  k: string;
  title: string;
  body: string;
  visual: React.ReactNode;
};

export function Scrollytelling({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the pinned panel's center rather than the first
        // intersecting one, so fast scrolling lands on the step you actually stopped at.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const best = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top - window.innerHeight / 2) <
          Math.abs(b.boundingClientRect.top - window.innerHeight / 2)
            ? a
            : b,
        );
        const idx = els.indexOf(best.target as HTMLDivElement);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      {/* steps — min-w-0 because a grid item defaults to min-width:auto, and a card whose
          min-content exceeds the track will push the whole column past the viewport. */}
      <div className="flex min-w-0 flex-col">
        {steps.map((s, i) => (
          <div
            key={s.k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="border-t border-line py-10 first:border-t-0 lg:flex lg:min-h-[52vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-14"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full transition-all duration-500"
                style={{
                  background: `var(--s${i + 1})`,
                  transform: active === i ? "scale(1)" : "scale(0.55)",
                  opacity: active === i ? 1 : 0.35,
                }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-4">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3
              className="h2 mt-4 text-[1.75rem] transition-colors duration-500 sm:text-[2.1rem]"
              style={{ color: active === i ? "var(--ink)" : "var(--ink-4)" }}
            >
              {s.title}
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-3">{s.body}</p>

            {/* On small screens the panel travels with its step instead of pinning. */}
            <div className="mt-6 lg:hidden">{s.visual}</div>
          </div>
        ))}
      </div>

      {/* pinned panel */}
      <div className="hidden min-w-0 lg:block">
        <div className="sticky top-[calc(50vh-230px)]">
          <div className="relative min-h-[340px]">
            {steps.map((s, i) => (
              <div
                key={s.k}
                aria-hidden={active !== i}
                className="transition-all duration-500"
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: i === 0 ? undefined : 0,
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "translateY(0) scale(1)" : "translateY(10px) scale(0.985)",
                  pointerEvents: active === i ? "auto" : "none",
                }}
              >
                {s.visual}
              </div>
            ))}
          </div>

          {/* spectrum progress — the prism filling band by band */}
          <div className="mt-8 flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className="h-[3px] flex-1 rounded-full transition-all duration-500"
                style={{
                  background: i <= active ? `var(--s${i + 1})` : "var(--line)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
