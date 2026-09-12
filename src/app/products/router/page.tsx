import type { Metadata } from "next";
import { RouterArt } from "@/components/product/art";
import {
  AlsoSee,
  Band,
  Bar,
  Card,
  ProductCta,
  ProductHero,
  Signal,
} from "@/components/product/kit";

export const metadata: Metadata = {
  title: "Router",
  description:
    "One beam in, split by difficulty. Behold's router sends each request to the cheapest model that still clears your quality bar, and proves the bar was cleared.",
};

export default function Page() {
  return (
    <>
      <ProductHero
        eyebrow="Router"
        title="One beam in. A spectrum out."
        lead="Most requests do not need the expensive model. The hard part is not saving money, it is proving that quality held while you did — which requires measuring the work, not just the latency."
        stats={[
          { k: "Status", v: "In development" },
          { k: "Design partners", v: "A handful" },
          { k: "Measured on", v: "Your repos" },
        ]}
        art={<RouterArt />}
      />

      <Band>
        <Signal
          eyebrow="How it decides"
          title="Four questions, asked per request."
          body="A router that only asks how hard the prompt looks will send everything expensive the moment it is unsure. Ours prices the decision: the cost of switching, the odds the cheap model finishes without a retry, and which of your subscriptions has quota left before it spends anything on the API."
          points={[
            "How hard is this turn, given the repository it is acting on?",
            "Would switching cost more in retries than it saves in tokens?",
            "Is the cheaper model actually finishing this class of task?",
            "Which subscription has quota before we pay API rates?",
          ]}
          panel={
            <Card title="Routing decision" meta="live sample">
              <ul className="flex flex-col divide-y divide-line">
                {[
                  ["Difficulty", "0.21", "low · single-file edit"],
                  ["Switch cost", "$0.004", "below retry threshold"],
                  ["Completion odds", "97.2%", "haiku, this task class"],
                  ["Quota", "available", "team subscription"],
                ].map(([k, v, n]) => (
                  <li key={k} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-ink-2">{k}</span>
                      <span className="tabular font-mono text-[12px] font-bold text-ink">{v}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-ink-4">{n}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--s3)" }} />
                <span className="text-[12px] text-ink-2">
                  Routed to <span className="font-mono font-bold text-ink">haiku</span>
                </span>
                <span className="ml-auto font-mono text-[11px] text-pos">saved $0.31</span>
              </div>
            </Card>
          }
        />
      </Band>

      <Band tone="paper">
        <Signal
          flip
          eyebrow="Proof"
          band="var(--t3)"
          title="Cheaper is easy. Cheaper at the same bar is the product."
          body="Any router can cut your bill by sending everything to a small model. The reason to trust this one is that the quality bar is measured on your work rather than on a public benchmark, using the same machinery that computes your Slop Index — so a saving that quietly raised your rework rate shows up as a loss, not a win."
          points={[
            "Quality measured on your repositories, not a leaderboard",
            "Savings reported net of retries, rework and review drag",
            "Per task class, so you can route aggressively where it is safe",
            "Roll back a routing policy the moment the bar moves",
          ]}
          panel={
            <Card title="What we watch" meta="illustrative">
              <ul className="flex flex-col gap-3">
                <Bar label="Spend" pct={64} value="down" band="var(--t3)" />
                <Bar label="Pass rate" pct={92} value="held" band="var(--s1)" delay={100} />
                <Bar label="Retries" pct={14} value="watch" band="var(--s4)" delay={200} />
                <Bar label="Rework" pct={10} value="watch" band="var(--paper-2)" delay={300} />
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-4">
                The fourth bar is the one that matters. A router that cuts the bill and raises
                rework has not saved anything.
              </p>
            </Card>
          }
        />
      </Band>

      <Band>
        <Signal
          eyebrow="Setup"
          band="var(--s2)"
          title="Your tools stay exactly as they are."
          body="The router is a base URL. Point your existing agents and IDEs at it, keep your own provider keys, and nothing else in your workflow changes. Self-hosting is available if your requests cannot leave your network, which for several of the organisations we work with is not negotiable."
          points={[
            "Drop-in base URL, OpenAI-compatible",
            "Bring your own keys, we never hold provider credentials",
            "Self-hosted deployment for regulated environments",
            "Per-policy rollback, and a kill switch that reverts to frontier",
          ]}
          panel={
            <Card title="Three steps" meta="about five minutes">
              <ol className="flex flex-col divide-y divide-line">
                {[
                  ["1", "Get a router key", "From the console, scoped per team."],
                  ["2", "Change one line", "Point the base URL at Behold."],
                  ["3", "Work as usual", "Readings appear within a day."],
                ].map(([n, t, d]) => (
                  <li key={n} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper font-mono text-[11px] font-bold text-ink-2">
                      {n}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-ink">{t}</p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <pre className="mt-5 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-[11px] leading-relaxed text-white/80">
                <code>{`base_url = "https://router.beholdlabs.com/v1"`}</code>
              </pre>
            </Card>
          }
        />
      </Band>

      <ProductCta line="Put your traffic through it and see." />
      <AlsoSee current="router" />
    </>
  );
}
