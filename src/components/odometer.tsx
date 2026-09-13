"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The Correction.
 *
 * The one piece of motion on this site, and it is an argument rather than a flourish. Every
 * headline figure first lands on the number a dashboard would report — the flattering one —
 * holds just long enough to be believed, and then mechanically re-rolls to what the quarter
 * actually was. The page says "every dashboard measures how much more you shipped; that's
 * just more AI slop" and then the numbers do exactly that in front of you.
 *
 * Built as an odometer because the physical reference matters: a counter that turns is a
 * machine correcting a reading, where a number that simply fades to another number is a UI
 * swapping a value. Each digit is a 0–9 strip translated on the Y axis, so the whole thing is
 * one transform per digit — no animation loop, no layout thrash.
 *
 * Accessibility: the settled value is the only thing in the accessibility tree. Screen
 * readers never hear the false reading, because it is a visual argument and announcing a
 * wrong number would be actively harmful. Reduced motion skips the correction entirely and
 * renders the true figure from the start.
 */

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/*
 * One 0–9 strip.
 *
 * Sized in `lh` rather than `em`, which is what makes the digits sit on the same baseline as
 * the characters beside them. An inline-block with `overflow: hidden` takes its baseline from
 * its bottom margin edge, so a 1em-tall reel puts the digit a descender's height above the
 * surrounding text — measured at ~4px against the per-cent sign, and visible. Making each
 * cell exactly one line box and aligning the mask to the top of the line box removes the
 * discrepancy without a font-specific magic number.
 */
function Reel({ to, delay, moving }: { to: number; delay: number; moving: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block overflow-hidden"
      style={{ height: "1lh", width: "0.62em", verticalAlign: "top" }}
    >
      <span
        className="absolute left-0 top-0 flex flex-col"
        style={{
          transform: `translateY(calc(${-to} * 1lh))`,
          transition: moving
            ? `transform 900ms cubic-bezier(0.16, 0.84, 0.26, 1) ${delay}ms`
            : "none",
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block text-center" style={{ height: "1lh" }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({
  /** what the tooling would report — the figure the reader is meant to believe first */
  from,
  /** what it actually was */
  to,
  className = "",
  /** how long the false reading is allowed to stand */
  hold = 850,
}: {
  from: string;
  to: string;
  className?: string;
  hold?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string>(to);
  const [moving, setMoving] = useState(false);
  /*
   * The reels only exist after mount, and only when motion is welcome. Server-rendered
   * markup, the first client render, and every reduced-motion session are the plain figure —
   * so a crawler, a reader with stylesheets disabled, or anyone hitting a CSS failure sees
   * "31%" rather than a strip of every digit from zero to nine, which is what a masked
   * odometer degrades into once the mask is gone.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Reduced motion never gets the reels at all. Leaving them mounted but stationary would
    // put twenty hidden digits in the DOM for a reader who asked for less, to no purpose.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;

    let t1: number, t2: number;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // land on the flattering figure with no transition, then correct
        setShown(from);
        t1 = window.setTimeout(() => setMoving(true), 40);
        t2 = window.setTimeout(() => setShown(to), hold);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [from, to, hold, mounted]);

  /*
   * Both readings are padded to one shape so the reels never change count mid-correction —
   * a digit appearing or vanishing halfway through reads as a glitch rather than a machine.
   * Padding is on the left with a non-advancing blank so "9%" and "31%" occupy one width.
   */
  const width = Math.max(from.length, to.length);
  const padded = shown.padStart(width, " ");

  if (!mounted) {
    return (
      <span ref={ref} className={className}>
        {to}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {/* the settled figure, and the only thing announced */}
      <span className="sr-only">{to}</span>
      {/*
        Inline layout, deliberately not flex. In a flex container `vertical-align` is ignored
        and items are aligned by `align-items`, which takes the reel's baseline from its bottom
        margin edge — leaving every digit sitting a descender's height above the per-cent sign
        next to it. Inline layout is what makes `vertical-align: top` on a 1lh reel line up
        with the characters around it.
      */}
      <span aria-hidden="true" className="whitespace-nowrap tabular-nums">
        {padded.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <Reel key={i} to={Number(ch)} delay={i * 55} moving={moving} />
          ) : (
            <span key={i} style={{ opacity: ch === " " ? 0 : 1 }}>
              {ch === " " ? "0" : ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
