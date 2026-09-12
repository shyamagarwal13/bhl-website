/*
 * The product surface, as three products rather than a list of twelve capabilities.
 *
 * The twelve-item version was accurate and unbuyable: a reader cannot hold twelve things,
 * and a flat list gives them no way to decide which one is for them. Both serious
 * competitors publish three or four named products with a page each, and that is the right
 * shape — the capabilities still exist, they just live inside something a person can point
 * at and say "that one".
 *
 * Each card links to its own page. The human-layer capabilities are folded into engineering
 * intelligence rather than sold separately, because they are not a bolt-on: the claim is
 * that this is what engineering intelligence should have been measuring all along.
 */

import Link from "next/link";
import { Reveal } from "./reveal";
import { SectionHead } from "./section-head";

type Product = {
  name: string;
  tag?: string;
  band: string;
  lead: string;
  body: string;
  inside: string[];
  href: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Engineering intelligence",
    band: "var(--s1)",
    lead: "Whether the work was any good.",
    body: "Delivery, review, quality and DORA — plus the two readings that separate work someone thought about from work that merely merged.",
    inside: [
      "Slop Index",
      "Judgment Rate",
      "Taste capture",
      "DORA and delivery",
      "Code intelligence",
      "Benchmarks",
    ],
    href: "/products/engineering-intelligence",
  },
  {
    name: "Token intelligence",
    band: "var(--s3)",
    lead: "Every AI dollar, and what it bought.",
    body: "Spend traced from the provider invoice to the change it produced, then to what that change cost you to keep. The second half is the part no invoice contains.",
    inside: [
      "Three-method attribution",
      "Agent observability",
      "Cost per surviving change",
      "Per-team and per-initiative",
      "Net return",
      "Finance export",
    ],
    href: "/products/token-intelligence",
  },
  {
    name: "Router",
    tag: "New",
    band: "var(--s5)",
    lead: "One beam in. A spectrum out.",
    body: "Each request goes to the cheapest model that still clears your quality bar, with the bar measured on your repositories rather than a public leaderboard.",
    inside: [
      "Per-request difficulty",
      "Switch-cost pricing",
      "Quota-aware routing",
      "Quality proof on your work",
      "Self-hosted option",
      "Policy rollback",
    ],
    href: "/products/router",
  },
];

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-[var(--maxw)] px-6 py-24">
      <SectionHead
          label="The platform"
          width="wide"
          title={<>Three products. Everything the category does.</>}
          lead={<>You should not have to give up routing, review or spend attribution to get a measurement you can trust. You don&apos;t.</>}
        />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 90}>
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-line-2 hover:lift sm:p-8"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: p.band }} />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                  {p.name}
                </span>
                {p.tag && (
                  <span className="rounded bg-s4 px-1.5 py-px text-[9px] font-extrabold uppercase tracking-wide text-ink">
                    {p.tag}
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-balance text-[1.25rem] font-bold leading-snug text-ink">
                {p.lead}
              </h3>
              <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-3">{p.body}</p>

              <div className="mt-auto pt-7">
                <ul className="flex flex-wrap gap-1.5 border-t border-line pt-6">
                  {p.inside.map((x) => (
                    <li
                      key={x}
                      className="rounded-full bg-paper px-2.5 py-1 text-[11.5px] text-ink-2"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink">
                  Explore
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
