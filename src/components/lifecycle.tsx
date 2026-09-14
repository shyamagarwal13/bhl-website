"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EngArt, TokenArt } from "./product/art";
import { Reveal } from "./reveal";
import { RouterFlow } from "./router-flow";
import { SectionHead } from "./section-head";

/*
 * The three products, walked through by scrolling.
 *
 * The section pins for three screens and the reader's scroll moves through the products rather
 * than past them: the copy changes and the instrument changes under it. Each instrument is the
 * one from that product's own page, running its own animation, so a reader who follows a link
 * lands on exactly what they were just looking at.
 *
 * That requirement is what sets the layout. Optimization's instrument is the full reel, which
 * needs about a thousand pixels for its three columns and cannot be squeezed into half a
 * screen beside a paragraph, so the copy sits above the art at full measure rather than next
 * to it. A compact stand-in was built for the earlier two-column version and thrown away: a
 * home page that shows a different figure from the page it links to teaches the reader that
 * the figures are decoration.
 *
 * Three things about the construction are load-bearing.
 *
 * The instruments are always all in the DOM, stacked into a single grid cell rather than
 * positioned absolutely. The cell takes the height of the tallest, so the pinned panel has a
 * stable height without anyone measuring anything.
 *
 * They carry their own width caps rather than sharing one. The reel wants the full measure;
 * a fourteen-wide field of squares given the same width is seven hundred pixels tall and
 * swamps everything around it.
 *
 * And pinning is opt-in rather than opt-out. Server-rendered markup, the first client render,
 * every reduced-motion session and every screen under 1024px get the plain stacked version.
 * A crawler or a reader without JavaScript would otherwise meet a section three screens tall
 * showing one product the whole way down.
 */

const STEPS = [
  {
    k: "eng",
    n: "Engineering intelligence",
    t: "Know whether the work was any good.",
    d: "Throughput tells you a team was busy. It cannot tell you whether anyone exercised judgment, and when producing is free that is the only question left worth asking.",
    href: "/products/engineering-intelligence",
    band: "var(--s1)",
    cap: "max-w-[620px]",
    art: <EngArt />,
  },
  {
    k: "token",
    n: "Token intelligence",
    t: "Every AI dollar, and what it actually bought.",
    d: "Your provider can tell you what you spent. Nobody but you can tell you what it was worth, because the return shows up somewhere the invoice never looks.",
    href: "/products/token-intelligence",
    band: "var(--s3)",
    cap: "max-w-[620px]",
    art: <TokenArt />,
  },
  {
    k: "router",
    n: "Optimization",
    t: "Not every request needs the expensive model.",
    d: "The hard part is not saving money. It is proving that quality held while you did, which takes measuring the work rather than the latency.",
    href: "/products/router",
    band: "var(--s5)",
    /* the reel caps itself at 1080; this only stops it stretching past the measure */
    cap: "max-w-full",
    art: <RouterFlow />,
  },
];

const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

/* --- the copy for one product --------------------------------------------- */

function Copy({ s }: { s: (typeof STEPS)[number] }) {
  return (
    <div className="grid gap-x-14 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end">
      <h3 className="h2 text-balance text-[1.6rem] text-ink sm:text-[1.9rem]">{s.t}</h3>
      <div>
        <p className="text-[13.5px] leading-relaxed text-ink-3">{s.d}</p>
        <Link
          href={s.href}
          className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
        >
          {s.n}
          <span className="transition-transform group-hover:translate-x-0.5">&#8594;</span>
        </Link>
      </div>
    </div>
  );
}

/* --- the section ----------------------------------------------------------- */

export function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [i, setI] = useState(0);

  /* Pinning is only offered to a wide viewport that has not asked for less motion. */
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPinned(wide.matches && !still.matches);
    apply();
    wide.addEventListener("change", apply);
    still.addEventListener("change", apply);
    return () => {
      wide.removeEventListener("change", apply);
      still.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (!pinned) {
      setI(0);
      return;
    }
    /* One read per frame at most. The handler only measures, but scroll fires far faster than
       the screen repaints and there is no reason to do the arithmetic more often than that. */
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = run > 0 ? -r.top / run : 0;
      const k = Math.floor(p * STEPS.length);
      setI(Math.min(STEPS.length - 1, Math.max(0, k)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  /* --- stacked: the fallback, and what a crawler sees --------------------- */

  if (!pinned) {
    return (
      <section id="products" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        <SectionHead width="wide" title={<>Three products, and the work they read.</>} />
        <div className="mt-14 flex flex-col gap-20">
          {STEPS.map((s) => (
            <Reveal key={s.k}>
              <div>
                <div className="flex items-center gap-2.5 pb-4">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.band }} />
                  <span className="text-[13px] font-semibold text-ink">{s.n}</span>
                </div>
                <Copy s={s} />
                <div className={`mt-9 w-full min-w-0 ${s.cap}`}>{s.art}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  /* --- pinned ------------------------------------------------------------- */

  return (
    <section
      id="products"
      ref={ref}
      className="relative"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[var(--maxw)] px-6">
          {/* the rail: the three, with the live one taking the ink */}
          <div className="flex flex-wrap items-center gap-x-9 gap-y-2 border-b border-line pb-4">
            {STEPS.map((s, k) => {
              const on = k === i;
              return (
                <span
                  key={s.k}
                  className="flex items-center gap-2.5 text-[13px] font-semibold"
                  style={{ color: on ? "var(--ink)" : "var(--ink-4)", transition: `color 420ms ease` }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: on ? s.band : "var(--line-2)",
                      transform: `scale(${on ? 1.4 : 1})`,
                      transition: `background 420ms ease, transform 420ms ease`,
                    }}
                  />
                  {s.n}
                </span>
              );
            })}
            <span className="tabular ml-auto font-mono text-[11px] text-ink-4">
              {i + 1} / {STEPS.length}
            </span>
          </div>

          {/*
            Copy and art are two stacks of the same three steps, each collapsed into one grid
            cell so every cell is as tall as its own tallest member. Nothing here is measured
            and nothing moves when the step changes.
          */}
          <div className="mt-8 grid">
            {STEPS.map((s, k) => {
              const on = k === i;
              return (
                <div
                  key={s.k}
                  aria-hidden={!on}
                  style={{
                    gridArea: "1 / 1",
                    opacity: on ? 1 : 0,
                    transform: `translateY(${on ? 0 : 10}px)`,
                    pointerEvents: on ? "auto" : "none",
                    transition: `opacity 400ms ${EASE}, transform 500ms ${EASE}`,
                  }}
                >
                  <Copy s={s} />
                </div>
              );
            })}
          </div>

          {/* Wrapped in a Reveal, which this panel needs for a reason that is not decoration:
              the instruments are drawn with `.fill-x`, which parks at scaleX(0) and is only
              released by a `[data-reveal="in"]` ancestor. Without one the merge grid renders
              as an empty card. */}
          <Reveal>
            <div className="mt-10 grid">
              {STEPS.map((s, k) => {
                const on = k === i;
                return (
                  <div
                    key={s.k}
                    aria-hidden={!on}
                    className={`w-full min-w-0 ${s.cap}`}
                    style={{
                      gridArea: "1 / 1",
                      opacity: on ? 1 : 0,
                      transform: `translateY(${on ? 0 : 14}px) scale(${on ? 1 : 0.985})`,
                      pointerEvents: on ? "auto" : "none",
                      transition: `opacity 460ms ${EASE}, transform 560ms ${EASE}`,
                    }}
                  >
                    {s.art}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
