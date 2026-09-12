import type { Metadata } from "next";
import { AppWindow, Panel } from "@/components/app-window";
import { TokenArt } from "@/components/product/art";
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
  title: "Token intelligence",
  description:
    "Every AI dollar traced from provider invoice to the change it produced, then to what that change cost to keep. Agent observability, per-team attribution and ROI that survives a finance review.",
};

export default function Page() {
  return (
    <>
      <ProductHero
        eyebrow="Token intelligence"
        title="Every AI dollar, and what it actually bought."
        lead="Your provider can tell you what you spent. Nobody but you can tell you what it was worth, because the return shows up somewhere the invoice never looks: in what the work cost to keep."
        stats={[
          { k: "Design partners", v: "A handful" },
          { k: "Attribution methods", v: "Three" },
          { k: "Status", v: "In development" },
        ]}
        art={<TokenArt />}
      />

      <Band>
        <Signal
          eyebrow="Attribution"
          title="Three methods, so every dollar lands somewhere."
          body="Some spend is clean: a provider API gives you the user, the model and the cost. Most is not. Seat licences, shared keys and background agents all resist attribution, and a tool that only reports the easy half leaves the biggest line item unexplained. We say which method produced each figure and how confident it is."
          points={[
            "Verified: native provider API, user and model resolved",
            "Inferred: commit and session metadata joined to spend windows",
            "Modelled: time-series allocation where nothing else is available",
            "Every figure carries its method and a confidence band",
          ]}
          panel={
            <Card title="Attribution coverage" meta="last 30d">
              <ul className="flex flex-col gap-3">
                <Bar label="Verified" pct={64} value="64%" band="var(--t3)" />
                <Bar label="Inferred" pct={27} value="27%" band="var(--s2)" delay={100} />
                <Bar label="Modelled" pct={9} value="9%" band="var(--s4)" delay={200} />
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-4">
                No bucket called &ldquo;other&rdquo;. If we cannot attribute a dollar we say
                which method failed and why.
              </p>
            </Card>
          }
        />
      </Band>

      <Band tone="paper">
        <Signal
          flip
          eyebrow="Agent observability"
          band="var(--s2)"
          title="Every agent run, and what survived contact with review."
          body="Background agents are the fastest-growing line on the bill and the least legible. A run that opens a pull request nobody merges still costs full price. We record what each run touched, what it cost, and what happened to the output afterwards, which turns agent spend from a mystery into a unit economic."
          points={[
            "Cost, duration and token count per run",
            "What the run touched, and what it opened",
            "Merge, revert and rewrite outcomes, followed for ninety days",
            "Cost per surviving change, by agent and by task type",
          ]}
          panel={
            <AppWindow url="app.beholdlabs.com/agents" active="AI Spend" tabs={["Runs", "By agent"]}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Panel title="Runs this week" meta="all agents" value="3,910" sub="+22%" />
                <Panel title="Cost per run" meta="mean" value="$1.24" sub="−9%" />
                <Panel title="Opened a PR" meta="share" value="41%" />
                <Panel title="Still live at 90d" meta="of merged" value="69%" sub="−11pt" subBad />
              </div>
            </AppWindow>
          }
        />
      </Band>

      <Band>
        <Signal
          eyebrow="Return"
          band="var(--s5)"
          title="ROI that survives someone checking it."
          body="The honest version of return is not spend divided by pull requests. It is spend set against what the resulting work was worth, minus what it cost to keep, and the second term is where most of the answer lives. This is the same Slop Index from engineering intelligence, pointed at the bill."
          points={[
            "Spend against surviving work, not merged work",
            "Net of the rework and review burden the spend created",
            "By team, initiative, repository and model",
            "Exportable for finance, with the method stated",
          ]}
          panel={
            <Card title="Net return" meta="Q3 · engineering">
              <ul className="flex flex-col divide-y divide-line">
                {[
                  ["AI spend", "−$144,642", "text-ink-2"],
                  ["Work delivered", "+$1,930,000", "text-ink-2"],
                  ["Cost to keep it", "−$412,000", "text-neg"],
                ].map(([k, v, cls]) => (
                  <li key={k} className="flex items-baseline justify-between gap-3 py-3 first:pt-0">
                    <span className="text-[13px] text-ink-3">{k}</span>
                    <span className={`tabular text-[14px] font-bold ${cls}`}>{v}</span>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-3 pt-4">
                  <span className="text-[13px] font-bold text-ink">Net</span>
                  <span className="tabular text-[1.35rem] font-extrabold tracking-tight text-ink">
                    $1.37M
                  </span>
                </li>
              </ul>
              <p className="mt-4 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-4">
                A 9.5× return, and a third of the gross eaten by work that should not have
                merged.
              </p>
            </Card>
          }
        />
      </Band>

      <ProductCta line="Find out what a third of your AI bill is buying." />
      <AlsoSee current="token" />
    </>
  );
}
