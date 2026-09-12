/*
 * The product-page kit.
 *
 * Three pages share one template, because three pages that each invent their own layout
 * read as three separate products bought from three companies. The competitors both run a
 * strict template here and it is the right call: hero, a stack of "signal" sections each
 * pairing a claim with a real panel, a spec block, and one CTA.
 *
 * The hero is a three-column composition — headline, instrument, claim with figures —
 * rather than the centred hero the home page uses. A product page is read by someone
 * comparing tabs, and the left-to-right arrangement lets the eye take the claim and the
 * numbers without scrolling.
 */

import Link from "next/link";
import { Reveal } from "../reveal";

/* --- hero ----------------------------------------------------------------- */

export function ProductHero({
  eyebrow,
  title,
  lead,
  stats,
  art,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  stats: { k: string; v: string }[];
  art: React.ReactNode;
}) {
  return (
    <div className="refraction grain relative overflow-hidden border-b border-line">
      <section className="mx-auto max-w-[var(--maxw)] px-6 pb-20 pt-16 sm:pt-20">
        {/* The middle column carries the instrument and needs the most room; the outer two
            are text and wrap happily. `minmax(0,…)` on all three so a wide child cannot
            blow the track out past the container. */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.32fr)_minmax(0,0.88fr)] lg:gap-9">
          <Reveal>
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="display mt-5 text-balance text-[2.3rem] sm:text-[2.9rem] lg:text-[3rem]">
                {title}
              </h1>
            </div>
          </Reveal>

          {/* the instrument. Order is pulled below the headline on narrow screens, where a
              three-column composition collapses and the art would otherwise separate the
              headline from its own supporting claim. */}
          <Reveal delay={120} className="order-last min-w-0 lg:order-none">
            {art}
          </Reveal>

          <Reveal delay={80}>
            <div>
              <p className="text-[1.0625rem] font-semibold leading-relaxed text-ink-2">{lead}</p>
              <dl className="mt-6 flex flex-col divide-y divide-line border-t border-line">
                {stats.map((s) => (
                  <div key={s.k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[13px] text-ink-3">{s.k}</dt>
                    <dd className="tabular text-[1.05rem] font-extrabold tracking-tight text-ink">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* --- a signal section ------------------------------------------------------ */

/**
 * One claim, one panel. `flip` alternates which side the copy sits on so a stack of these
 * does not read as a column of identical rows.
 */
export function Signal({
  eyebrow,
  title,
  body,
  points,
  panel,
  flip = false,
  band = "var(--s1)",
}: {
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  panel: React.ReactNode;
  flip?: boolean;
  band?: string;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* `min-w-0` on both tracks. Grid items default to `min-width: auto`, so a panel
          containing anything unbreakable — a code block, a long URL — sizes its track to
          that content's min-content width and pushes the whole page sideways, which is
          exactly what the router page's base-URL snippet did at 390px. */}
      <Reveal className={`min-w-0 ${flip ? "lg:order-last" : ""}`}>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full" style={{ background: band }} />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
              {eyebrow}
            </span>
          </div>
          <h2 className="h2 mt-5 text-balance text-[1.7rem] sm:text-[2.1rem]">{title}</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink-3">{body}</p>
          {points && (
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6">
              {points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                  <span
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: band }}
                  />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
      <Reveal delay={100} className="min-w-0">
        {panel}
      </Reveal>
    </div>
  );
}

/** Section wrapper with an optional paper band, so pages can alternate grounds. */
export function Band({
  children,
  tone = "white",
  id,
}: {
  children: React.ReactNode;
  tone?: "white" | "paper";
  id?: string;
}) {
  const inner = (
    <section id={id} className="mx-auto max-w-[var(--maxw)] px-6 py-20 sm:py-24">
      {children}
    </section>
  );
  return tone === "paper" ? (
    <div className="border-y border-line bg-paper">{inner}</div>
  ) : (
    inner
  );
}

/* --- shared panel chrome --------------------------------------------------- */

/** A product card the signal sections hang their visuals in. */
export function Card({
  title,
  meta,
  children,
  className = "",
}: {
  title?: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-6 lift sm:p-7 ${className}`}>
      {title && (
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-bold text-ink">{title}</span>
          {meta && <span className="font-mono text-[10px] text-ink-4">{meta}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/** A labelled bar that fills when its section scrolls in. */
export function Bar({
  label,
  pct,
  value,
  band,
  delay = 0,
}: {
  label: string;
  pct: number;
  value: string;
  band: string;
  delay?: number;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-[104px] shrink-0 truncate text-[12.5px] font-medium text-ink-2">
        {label}
      </span>
      <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-paper-2">
        <span
          className="fill-x block h-full rounded-full"
          style={{ width: `${pct}%`, background: band, ["--d" as string]: `${delay}ms` }}
        />
      </span>
      <span className="tabular w-12 shrink-0 text-right font-mono text-[11px] text-ink-4">
        {value}
      </span>
    </li>
  );
}

/* --- closing CTA ----------------------------------------------------------- */

export function ProductCta({ line }: { line: string }) {
  return (
    <Band>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "conic-gradient(from 200deg at 50% -10%, transparent 0deg, color-mix(in srgb, var(--s1) 55%, transparent) 14deg, color-mix(in srgb, var(--s2) 48%, transparent) 22deg, color-mix(in srgb, var(--s3) 42%, transparent) 29deg, color-mix(in srgb, var(--s4) 40%, transparent) 36deg, color-mix(in srgb, var(--s5) 34%, transparent) 43deg, transparent 54deg)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="display text-balance text-[2rem] text-white sm:text-[2.5rem]">
              {line}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#demo"
                className="rounded-full bg-white px-6 py-3 text-[14px] font-bold text-ink transition-transform hover:scale-[1.03]"
              >
                Get in touch
              </Link>
              <Link
                href="/#platform"
                className="rounded-full border border-white/25 px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-white/10"
              >
                See the whole platform
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Band>
  );
}

/** The other two products, at the foot of each page. */
export function AlsoSee({ current }: { current: "eng" | "token" | "router" }) {
  const ALL = [
    {
      k: "eng",
      t: "Engineering intelligence",
      d: "What the work was worth, and whether anyone exercised judgment producing it.",
      href: "/products/engineering-intelligence",
    },
    {
      k: "token",
      t: "Token intelligence",
      d: "Every AI dollar traced to the work it bought, and to what that work cost to keep.",
      href: "/products/token-intelligence",
    },
    {
      k: "router",
      t: "Router",
      d: "One beam in, split by difficulty. The cheapest model that still clears your bar.",
      href: "/products/router",
    },
  ].filter((p) => p.k !== current);

  return (
    <Band tone="paper">
      <p className="eyebrow mb-7">The rest of the platform</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {ALL.map((p, i) => (
          <Reveal key={p.k} delay={i * 90}>
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[1.05rem] font-bold text-ink">{p.t}</span>
                <span className="text-ink-4 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">{p.d}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}
