"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The statement, as a contained dark card on the light page.
 *
 * Previously a full-bleed band that pinned for a screen and a half. As a card it uses the
 * language the page already has — the CTA is a rounded ink panel with the prism glow — and
 * costs no extra page height, because the reveal is driven by the card's own travel
 * through the viewport rather than by a tall spacer holding it pinned.
 *
 * Words light as the card rises, with a faint halo on the lit ones so the sentence reads
 * as filling with light rather than only changing opacity.
 *
 * No citation line: the card no longer quotes a figure, only characterises the situation,
 * so a source note under it read as a footnote to nothing. The adoption claim is backed by
 * Google's DORA (as cited in our own 2x mandate paper) if it is ever challenged.
 */
const LEAD =
  "AI adoption in SDLC workflows is near-universal, but most organizations have no way to study how it is impacting their software.";
const BODY =
  "That gap is not a tooling problem. Every organization has different constraints, and no single metric can tell you how yours is performing. We are researchers and practitioners with more than a decade in developer productivity and software engineering. Closing that gap is our work.";

const WORDS = `${LEAD} ${BODY}`.split(" ");
const LEAD_COUNT = LEAD.split(" ").length;

export function Statement() {
  const card = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(WORDS.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = card.current;
    if (!el) return;

    setLit(0);
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      // fills as the card travels from just-entered (85% down the viewport) to
      // comfortably read (about 18% down)
      const p = (vh * 0.85 - top) / (vh * 0.67);
      setLit(Math.max(0, Math.min(1, p)) * WORDS.length);
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
    <section className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      {/* narrower than the page container: at full width it read as another section band,
          and the text measure left a third of the card empty on the right */}
      <div
        ref={card}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-ink px-6 py-12 shadow-[0_30px_80px_-40px_rgba(11,12,16,0.55)] sm:px-14 sm:py-20"
      >
        {/* the prism glow the CTA carries, so both dark moments read as one system */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "conic-gradient(from 198deg at 26% -22%, transparent 0deg, color-mix(in srgb, var(--s1) 32%, transparent) 14deg, color-mix(in srgb, var(--s2) 26%, transparent) 22deg, color-mix(in srgb, var(--s3) 22%, transparent) 29deg, color-mix(in srgb, var(--s4) 20%, transparent) 36deg, transparent 47deg)",
            opacity: 0.6,
          }}
        />

        {/* smaller on phones on purpose: at 1.35rem the measure fell to ~19 characters and
            the card ran well past a screen and a half */}
        <p className="relative text-balance text-[1.1rem] font-semibold leading-[1.42] tracking-[-0.02em] sm:text-[1.7rem] lg:text-[1.9rem]">
          {WORDS.map((w, i) => {
            const on = Math.max(0, Math.min(1, lit - i));
            return (
              <span
                key={i}
                style={{
                  opacity: Math.max(0.15, on),
                  color: i < LEAD_COUNT ? "#ffffff" : "rgba(255,255,255,0.92)",
                  textShadow: on > 0.9 ? "0 0 22px rgba(255,255,255,0.16)" : "none",
                  transition: "opacity 140ms linear, text-shadow 240ms linear",
                }}
              >
                {w}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
