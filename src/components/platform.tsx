/*
 * The three products, as ruled entries rather than cards.
 *
 * This was three white rounded cards carrying nine grey pill tags between them and an
 * "Explore →" affordance — indistinguishable from any Tailwind template, and it was the
 * point where the page abandoned its own ruled editorial grid and never came back.
 *
 * Rebuilt on the same hairlines as the ledger above it: an index numeral, the name, the
 * claim, and one mono index line naming what is inside. Three items per product, not six —
 * a feature dump does not become a feature list by being set in pills.
 */

import Link from "next/link";
import { Reveal } from "./reveal";

type Product = {
  n: string;
  name: string;
  tag?: string;
  tone: string;
  lead: string;
  body: string;
  inside: string;
  href: string;
};

const PRODUCTS: Product[] = [
  {
    n: "01",
    name: "Engineering intelligence",
    tone: "var(--s1)",
    lead: "Whether the work was any good.",
    body: "Delivery, review, quality and DORA, plus the two readings that separate work someone thought about from work that merely merged.",
    inside: "Slop Index · Judgment Rate · Taste capture · DORA · Benchmarks",
    href: "/products/engineering-intelligence",
  },
  {
    n: "02",
    name: "Token intelligence",
    tone: "var(--s3)",
    lead: "Every AI dollar, and what it bought.",
    body: "Spend traced from the provider invoice to the change it produced, then to what that change cost you to keep. The second half is the part no invoice contains.",
    inside: "Attribution · Agent observability · Cost per surviving change · Net return",
    href: "/products/token-intelligence",
  },
  {
    n: "03",
    name: "Router",
    tag: "New",
    tone: "var(--s5)",
    lead: "One beam in. A spectrum out.",
    body: "Each request goes to the cheapest model that still clears your quality bar, with the bar measured on your repositories rather than a public leaderboard.",
    inside: "Per-request difficulty · Switch-cost pricing · Quality proof · Self-hosted",
    href: "/products/router",
  },
];

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      {/* a folio opener rather than the ruled eyebrow: the same device stamped on every
          section is what made the page metronomic, and a count suits a list of three */}
      <Reveal>
        <div>
          <div>
            <h2 className="h2 max-w-3xl text-[2.1rem] sm:text-[2.7rem]">
              Three products. Everything the category does.
            </h2>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-3">
              You should not have to give up routing, review or spend attribution to get a
              measurement you can trust. You don&apos;t.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-14">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 70}>
            <Link
              href={p.href}
              className="group grid items-baseline gap-x-10 gap-y-4 border-t border-line py-9 transition-colors hover:bg-white/70 lg:grid-cols-[3rem_minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <span className="figure text-[1.3rem]" style={{ color: p.tone }}>
                {p.n}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
                    {p.name}
                  </span>
                  {p.tag && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-s5">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="h2 mt-3 text-[1.5rem] text-ink sm:text-[1.75rem]">{p.lead}</h3>
              </div>

              <div className="min-w-0">
                <p className="text-[14.5px] leading-relaxed text-ink-3">{p.body}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
                  {p.inside}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
                  Explore
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
