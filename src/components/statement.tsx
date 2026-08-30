"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The dark statement band: text fills in word by word as the section scrolls past.
 *
 * The figures are from our own ASE '26 paper rather than a borrowed industry statistic —
 * verifiable, and the point of the whole positioning. The caption keeps the paper's own
 * caveat: the contrast is observational and published as hypothesis-generating, so the
 * copy says "showed" and not "caused". Overstating it here would undercut the section two
 * screens down that argues for stated limitations.
 *
 * Words are pre-split at module scope so the array identity is stable across renders.
 */
const LEAD = "The problem isn't AI. It's implementation.";
const BODY =
  "In our own study of repositories adopting coding agents, those without committed AI configuration showed roughly twice the rise in cognitive complexity as those with it — 53% against 27%. Same tools. Very different outcomes. We are researchers and industry practitioners with more than a decade in developer productivity and software engineering, and closing that gap is the work.";

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
      // finish a little before the section leaves, so the last words aren't read
      // while they're still dim
      const p = Math.max(0, Math.min(1, passed / travel)) / 0.78;
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
    <div ref={outer} style={{ height: "260vh" }} className="bg-ink">
      <div className="sticky top-0 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-[var(--maxw)] px-6">
          <p className="mx-auto max-w-4xl text-balance text-[1.5rem] font-semibold leading-[1.45] tracking-[-0.02em] sm:text-[2.1rem] lg:text-[2.4rem]">
            {WORDS.map((w, i) => (
              <span
                key={i}
                style={{
                  // each word crosses from dim to lit over roughly one word of travel
                  opacity: Math.max(0.18, Math.min(1, lit - i)),
                  color: i < LEAD_COUNT ? "#ffffff" : "rgba(255,255,255,0.92)",
                  transition: "opacity 120ms linear",
                }}
              >
                {w}{" "}
              </span>
            ))}
          </p>

          <p className="mx-auto mt-8 max-w-4xl font-mono text-[11px] leading-relaxed text-white/35">
            A Few Pages of Markdown — Committed AI Configuration and Lower Quality Cost after
            Coding-Agent Adoption. ASE 2026. The contrast is observational and reported as
            hypothesis-generating.
          </p>
        </div>
      </div>
    </div>
  );
}
