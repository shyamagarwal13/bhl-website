"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EngArt, TokenArt } from "./product/art";
import { RouterPriceArt } from "./product/router-price";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

/*
 * The three products, walked through by scrolling.
 *
 * The section pins for three screens and the reader's scroll moves through the products rather
 * than past them: the list on the left opens onto whichever one is live, and the instrument on
 * the right changes under it. Each instrument is the one from that product's own page, not a
 * stand-in drawn for the home page, so a reader who follows a link recognises what they clicked.
 *
 * Two things about the construction are load-bearing.
 *
 * The three instruments are always in the DOM, stacked into a single grid cell rather than
 * positioned absolutely. The cell takes the height of the tallest, which means the pinned panel
 * never has to be measured or given a hand-tuned height, and nothing jumps when the tallest one
 * is the one on screen.
 *
 * And pinning is opt-in rather than opt-out. Server-rendered markup, the first client render,
 * every reduced-motion session and every screen under 1024px all get the plain stacked version:
 * three blocks, one after another, no scroll maths. A crawler or a reader without JavaScript
 * would otherwise meet a section three screens tall showing one product the whole way down.
 */

const STEPS = [
  {
    k: "eng",
    n: "Engineering intelligence",
    t: "Know whether the work was any good.",
    d: "Throughput tells you a team was busy. It cannot tell you whether anyone exercised judgment, and when producing is free that is the only question left worth asking.",
    href: "/products/engineering-intelligence",
    band: "var(--s1)",
    art: <EngArt />,
  },
  {
    k: "token",
    n: "Token intelligence",
    t: "Every AI dollar, and what it actually bought.",
    d: "Your provider can tell you what you spent. Nobody but you can tell you what it was worth, because the return shows up somewhere the invoice never looks.",
    href: "/products/token-intelligence",
    band: "var(--s3)",
    art: <TokenArt />,
  },
  {
    k: "router",
    n: "Optimization",
    t: "Not every request needs the expensive model.",
    d: "The hard part is not saving money. It is proving that quality held while you did, which takes measuring the work rather than the latency.",
    href: "/products/router",
    band: "var(--s5)",
    art: <RouterPriceArt />,
  },
];

/* --- the copy for one product --------------------------------------------- */

function Entry({
  s,
  on,
  pinned,
}: {
  s: (typeof STEPS)[number];
  on: boolean;
  pinned: boolean;
}) {
  return (
    <div className="relative pl-7">
      {/* the rail marker */}
      <span
        className="absolute left-0 top-[7px] h-2.5 w-2.5 rounded-full border-2 border-paper"
        style={{
          background: on ? s.band : "var(--line-2)",
          transform: `scale(${on ? 1.25 : 1})`,
          transition: "background 420ms ease, transform 420ms ease",
        }}
      />

      <p
        className="text-[1.0625rem] font-bold leading-snug"
        style={{
          color: on ? "var(--ink)" : "var(--ink-4)",
          transition: "color 420ms ease",
        }}
      >
        {s.n}
      </p>

      {/*
        Opened with grid-template-rows rather than max-height. A max-height large enough for the
        longest paragraph makes every shorter one ease at a different apparent speed, and the
        0fr to 1fr transition animates to the content's real height instead.
      */}
      <div
        className="grid"
        style={{
          gridTemplateRows: on || !pinned ? "1fr" : "0fr",
          opacity: on || !pinned ? 1 : 0,
          transition: "grid-template-rows 520ms cubic-bezier(0.22,0.61,0.36,1), opacity 420ms ease",
        }}
      >
        <div className="overflow-hidden">
          <p className="pt-2 text-[1.05rem] leading-snug text-ink-2">{s.t}</p>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-3">{s.d}</p>
          <Link
            href={s.href}
            className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
          >
            {s.n}
            <span className="transition-transform group-hover:translate-x-0.5">&#8594;</span>
          </Link>
        </div>
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

  const head = (
    <SectionHead
      width="wide"
      title={<>Three products, and the work they read.</>}
    />
  );

  if (!pinned) {
    return (
      <section id="products" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
        {head}
        <div className="mt-12 flex flex-col gap-16">
          {STEPS.map((s, k) => (
            <Reveal key={s.k} delay={k * 80}>
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <Entry s={s} on pinned={false} />
                <div className="mx-auto w-full min-w-0 max-w-[620px]">{s.art}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      ref={ref}
      className="relative"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[var(--maxw)] px-6">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
            <div>
              {head}

              {/* the rail: one unbroken hairline, filled to wherever the reader has got to */}
              <div className="relative mt-9 pl-0">
                <span className="absolute left-[4.5px] top-2 h-[calc(100%-1rem)] w-px bg-line" />
                <span
                  className="absolute left-[4.5px] top-2 w-px"
                  style={{
                    height: `calc((100% - 1rem) * ${(i + 1) / STEPS.length})`,
                    background: "var(--ink-4)",
                    transition: "height 520ms cubic-bezier(0.22,0.61,0.36,1)",
                  }}
                />
                <ol className="flex flex-col gap-7">
                  {STEPS.map((s, k) => (
                    <li key={s.k}>
                      <Entry s={s} on={k === i} pinned />
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/*
              All three stacked into one grid cell. The cell is as tall as the tallest of them,
              so the panel has a stable height without anyone measuring anything.

              Wrapped in a Reveal, which this panel needs for a reason that is not decoration:
              the instruments are drawn with `.fill-x`, which parks at scaleX(0) and is only
              released by a `[data-reveal="in"]` ancestor. Without one the merge grid renders as
              an empty card. Capped in width as well, because at the full width of this column
              a fourteen-wide field of squares is seven hundred pixels tall and swamps the copy
              it is meant to illustrate.
            */}
            <Reveal>
              <div className="mx-auto grid w-full min-w-0 max-w-[620px]">
              {STEPS.map((s, k) => {
                const on = k === i;
                return (
                  <div
                    key={s.k}
                    aria-hidden={!on}
                    className="min-w-0"
                    style={{
                      gridArea: "1 / 1",
                      opacity: on ? 1 : 0,
                      transform: `translateY(${on ? 0 : 14}px) scale(${on ? 1 : 0.985})`,
                      pointerEvents: on ? "auto" : "none",
                      transition:
                        "opacity 460ms cubic-bezier(0.22,0.61,0.36,1), transform 560ms cubic-bezier(0.22,0.61,0.36,1)",
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
      </div>
    </section>
  );
}
