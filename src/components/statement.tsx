"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The statement band: text fills in word by word as the section scrolls past.
 *
 * Deep indigo rather than ink — the page already ends on an ink CTA, and two identical
 * black bands read as the same section appearing twice. Sized at 170vh with a 68vh panel
 * so it's a beat in the page rather than a full-screen takeover you have to scroll out of.
 *
 * Both figures are attributed and checked, not paraphrased from memory: adoption from
 * Google's DORA via our own 2× mandate paper, returns from MIT's 2025 enterprise study.
 * The claim we build on top of them — that the gap is fit, not tooling — is ours, and is
 * marked as ours by sitting in a different sentence.
 */
const LEAD = "A single metric cannot tell you how your engineering organization is performing.";
const BODY =
  "You need to know what the work was worth, what it cost to get, and what it left behind — read against your own constraints. Every company has different requirements and different limits. There is no one size that fits, and the same number means different things in different organizations. Around 90% of developers now use AI tools, yet MIT found 95% of enterprise GenAI pilots returned nothing measurable. That gap is not a tooling problem. We are researchers and industry practitioners with more than a decade in developer productivity and software engineering, and closing it is our work.";

const WORDS = `${LEAD} ${BODY}`.split(" ");
const LEAD_COUNT = LEAD.split(" ").length;

export function Statement() {
  const outer = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(WORDS.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = outer.current;
    if (!el) return;

    setLit(0);
    let raf = 0;
    const apply = () => {
      raf = 0;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return setLit(WORDS.length);
      const passed = window.scrollY - el.offsetTop;
      // complete before the band leaves, so the last words aren't read while still dim
      const p = Math.max(0, Math.min(1, passed / travel)) / 0.72;
      setLit(Math.min(1, p) * WORDS.length);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={outer}
      style={{
        height: "170vh",
        background:
          "linear-gradient(165deg, #1c1946 0%, #14132f 52%, #100f26 100%)",
      }}
    >
      <div className="sticky top-0 flex min-h-[68vh] items-center py-20">
        <div className="relative mx-auto w-full max-w-[var(--maxw)] px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 15% 0%, rgba(129,140,248,0.16), transparent 70%)",
            }}
          />
          <p className="relative mx-auto max-w-4xl text-balance text-[1.35rem] font-semibold leading-[1.5] tracking-[-0.015em] sm:text-[1.7rem] lg:text-[1.95rem]">
            {WORDS.map((w, i) => (
              <span
                key={i}
                style={{
                  opacity: Math.max(0.16, Math.min(1, lit - i)),
                  color: i < LEAD_COUNT ? "#ffffff" : "rgba(255,255,255,0.9)",
                  transition: "opacity 120ms linear",
                }}
              >
                {w}{" "}
              </span>
            ))}
          </p>

          <p className="relative mx-auto mt-9 max-w-4xl font-mono text-[10.5px] leading-relaxed text-white/35">
            Adoption: Google DORA, 2025. Returns: MIT Media Lab / Project NANDA, “The GenAI
            Divide — State of AI in Business,” 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
