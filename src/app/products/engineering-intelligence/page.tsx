import type { Metadata } from "next";
import { AppWindow, Panel } from "@/components/app-window";
import { EngArt } from "@/components/product/art";
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
  title: "Engineering intelligence",
  description:
    "Delivery, review and quality metrics that separate work someone thought about from work that merely merged. Slop Index, Judgment Rate, DORA and benchmarks, all priced.",
};

export default function Page() {
  return (
    <>
      <ProductHero
        eyebrow="Engineering intelligence"
        title="Know whether the work was any good."
        lead="Throughput tells you a team was busy. It cannot tell you whether anyone exercised judgment, and when producing is free that is the only question left worth asking."
        art={<EngArt />}
      />

      <Band>
        <Signal
          eyebrow="The Slop Index"
          band="var(--s5)"
          title="The number your other dashboard is scoring as productivity."
          body="Slop is work that looks right, passes review, and costs you later. It does not show up in throughput because throughput counts it as a win. We compute it from what happens to a change after it merges, and we price it, so the conversation happens in a budget meeting rather than a retro."
          points={[
            "Rework: merged work rewritten within ninety days",
            "Review drag: reviewer minutes per merged change, by team",
            "Compounding: complexity added that never comes back down",
            "Orphaned change: work no author can account for at sampling",
          ]}
          panel={
            <Card title="Slop Index" meta="Q3 · all teams">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="figure text-[3.2rem] text-ink">
                    61
                  </span>
                  <span className="font-mono text-[11px] text-ink-4">/ 100</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
                    Priced
                  </p>
                  <p className="tabular text-[1.25rem] font-extrabold tracking-tight text-ink">
                    $412k
                  </p>
                </div>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                <Bar label="Rework" pct={78} value="38%" band="var(--s5)" />
                <Bar label="Review drag" pct={56} value="27%" band="var(--s4)" delay={90} />
                <Bar label="Compounding" pct={44} value="21%" band="var(--s1)" delay={180} />
                <Bar label="Orphaned" pct={29} value="14%" band="var(--s2)" delay={270} />
              </ul>
            </Card>
          }
        />
      </Band>

      <Band tone="paper">
        <Signal
          flip
          eyebrow="The Judgment Rate"
          band="var(--t3)"
          title="The only number that goes up when people think harder."
          body="Judgment leaves a trace, just not in the event log. It is in what got rejected, what got redirected, and what was thrown away before it cost anything. We read the artifact rather than the metadata, which is why we can see a reviewer who changed the direction of a change and not merely its wording."
          points={[
            "Redirections: review that changed what was built, not how",
            "Rejections: work stopped before it entered the codebase",
            "Abandoned designs: the cheapest possible failure, counted as a win",
            "Concentration: whether judgment sits with three people or thirty",
          ]}
          panel={
            <Card title="Judgment Rate" meta="by team · rolling 90d">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="figure text-[3.2rem] text-ink">
                    22
                  </span>
                  <span className="font-mono text-[11px] text-ink-4">%</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-4">
                    Avoided
                  </p>
                  <p className="tabular text-[1.25rem] font-extrabold tracking-tight text-ink">
                    $780k
                  </p>
                </div>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                <Bar label="Payments" pct={100} value="34%" band="var(--t3)" />
                <Bar label="Identity" pct={82} value="28%" band="var(--t3)" delay={90} />
                <Bar label="Ledger" pct={56} value="19%" band="var(--t3)" delay={180} />
                <Bar label="Growth" pct={24} value="8%" band="var(--s5)" delay={270} />
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-4">
                Growth ships fastest and thinks least. No throughput chart contains that
                sentence.
              </p>
            </Card>
          }
        />
      </Band>

      <Band>
        <Signal
          eyebrow="Delivery and review"
          title="The standard reporting, done properly."
          body="Delivery, review health, quality and DORA, attributed to teams and initiatives rather than to individuals, and benchmarked against organisations we will name rather than an industry average nobody can audit."
          points={[
            "DORA, with the distribution shown and not just the median",
            "Review as a gate or a bottleneck, per team and per repository",
            "Incidents traced back to the change that introduced them",
            "Benchmarks against a named comparison set",
          ]}
          panel={
            <AppWindow url="app.beholdlabs.com/delivery" active="Delivery" tabs={["Overview", "By team"]}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Panel title="Lead time" meta="p50" value="2.1d" sub="−18%" />
                <Panel title="Change failure" meta="90d" value="7.4%" sub="+2.1pt" subBad />
                <Panel title="Review depth" meta="per PR" value="1.9" sub="−0.6" subBad />
                <Panel title="Deploys" meta="weekly" value="142" sub="+31%" />
              </div>
            </AppWindow>
          }
        />
      </Band>

      <Band tone="paper">
        <Signal
          flip
          eyebrow="Taste capture"
          band="var(--s4)"
          title="Stop making the same correction twice."
          body="Every review comment your team writes is a standard someone is holding in their head. We turn the recurring ones into context the agents actually receive, so the correction is made once rather than every sprint. It is the one feature here that reduces the work instead of reporting on it."
          points={[
            "Recurring review comments clustered into rules",
            "Rules shipped into the agent's context, not a wiki nobody opens",
            "Measured by whether the correction stops recurring",
          ]}
          panel={
            <Card title="Captured standards" meta="12 active">
              <ul className="flex flex-col divide-y divide-line">
                {[
                  ["Error handling at boundaries", "caught 34×", "var(--t3)"],
                  ["No new global state", "caught 21×", "var(--t3)"],
                  ["Migrations must be reversible", "caught 17×", "var(--s4)"],
                  ["Test the failure path", "caught 9×", "var(--s4)"],
                ].map(([t, n, c]) => (
                  <li key={t} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} />
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{t}</span>
                    <span className="shrink-0 font-mono text-[10.5px] text-ink-4">{n}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-4">
                Recurrence down 62% on captured rules since adoption.
              </p>
            </Card>
          }
        />
      </Band>

      <ProductCta line="See what your last quarter actually cost." />
      <AlsoSee current="eng" />
    </>
  );
}
