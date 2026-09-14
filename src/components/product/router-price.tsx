"use client";

import { useEffect, useState } from "react";
import { MODELS, SESSIONS, routeFor } from "../router-data";

/*
 * The routing decision as a price list, sized to sit beside a paragraph.
 *
 * The Optimization page carries the full instrument: a reel of sessions, a fan into the mark,
 * a packet running out to the model that won. That thing wants a thousand pixels and it earns
 * them. This is the same argument at a quarter of the size, for the walkthrough on the home
 * page, and it keeps only what the argument actually needs: the bar the work sets, the six
 * models in price order, and the cheapest one that clears it.
 *
 * It reads the same table as the reel rather than carrying its own, so the two figures cannot
 * end up showing different answers to the same question on two different pages.
 *
 * All figures illustrative.
 */

const CYCLE = 3600;
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

export function RouterPriceArt() {
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setLive(true);
    const id = window.setInterval(() => setI((n) => (n + 1) % SESSIONS.length), CYCLE);
    return () => clearInterval(id);
  }, []);

  const s = SESSIONS[i];
  const routed = routeFor(s);

  return (
    <div className="rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm lift">
      {/* the request, and what it demands */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="min-w-0 flex-1 truncate font-mono text-[12px] text-ink">
          <span className="text-ink-4">&#10095;</span> {s.cmd}
        </p>
        <span className="shrink-0 font-mono text-[10px] text-ink-4">
          bar <span className="tabular font-bold text-s5">{s.bar}</span>
        </span>
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-line">
        {MODELS.map((m, k) => {
          const on = k === routed;
          return (
            <li
              key={m.name}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              style={{ transition: live ? `opacity 420ms ${EASE}` : "none" }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: on ? "var(--s5)" : "var(--line-2)",
                  transition: live ? `background 420ms ${EASE}` : "none",
                }}
              />
              <span
                className="min-w-0 flex-1 truncate text-[13px]"
                style={{
                  color: on ? "var(--ink)" : "var(--ink-3)",
                  fontWeight: on ? 700 : 500,
                }}
              >
                {m.name}
              </span>

              {/* The two numbers the decision is made from, so a reader can check it: the
                  route is the first model down this list whose score clears the bar above. */}
              <span
                className="tabular w-8 shrink-0 text-right font-mono text-[12px]"
                style={{ color: on ? "var(--t3)" : "var(--ink-4)" }}
              >
                {s.scores[k]}
              </span>
              <span
                className="tabular w-12 shrink-0 text-right font-mono text-[12px]"
                style={{ color: on ? "var(--ink-2)" : "var(--ink-4)" }}
              >
                {m.cost}
              </span>
              <span
                className="w-[44px] shrink-0 text-right font-mono text-[8.5px] uppercase tracking-[0.14em]"
                style={{
                  color: "var(--s5)",
                  opacity: on ? 1 : 0,
                  transition: live ? `opacity 380ms ${EASE}` : "none",
                }}
              >
                routed
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-4">
        The cheapest model that clears the bar this piece of work sets. Most work never needs
        the frontier tier, and the saving only counts if the bar held.
      </p>
    </div>
  );
}
