"use client";

import { useEffect, useRef } from "react";

/*
 * Reveal-on-scroll.
 *
 * The hidden state lives in CSS behind a `data-reveal` attribute that this component
 * sets, so content is visible by default and only becomes animatable once JS has run.
 * If the observer never runs — no JS, an error, a crawler — the page still reads.
 * One-shot: we unobserve after the first entry so scrolling back up doesn't re-trigger.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-reveal", "in");
      return;
    }

    el.setAttribute("data-reveal", "out");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-reveal", "in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error - polymorphic ref across the small tag union is safe here
    <Tag ref={ref} className={className} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
