import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import { ProductShot } from "@/components/product-shot";
import { Reveal } from "@/components/reveal";
import { SpendFlow } from "@/components/spend-flow";
import { Marquee } from "@/components/marquee";
import { Scrollytelling, type Step } from "@/components/scrollytelling";
import { BuildCost, ReleaseOutcome, ReviewCost, StageSplit } from "@/components/viz";

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[var(--maxw)] px-6 ${className}`}>
      {children}
    </section>
  );
}

/* --- hero ----------------------------------------------------------------- */

function Hero() {
  return (
    <div className="refraction grain relative overflow-hidden">
      <Section className="relative pt-20 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            {/* The category term as a chip rather than a stretched mono eyebrow — the
                phrase is too long to survive 0.16em tracking at 11px, which is what made
                it look cramped. A pill gives it a shape and lets it sit in sentence case. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 py-1.5 pl-2 pr-3.5 backdrop-blur-sm">
              <span className="spectrum-rule w-5" />
              <span className="text-[12.5px] font-semibold tracking-tight text-ink-2">
                AI unit economics for software delivery
              </span>
            </span>
          </Reveal>

          <Reveal delay={80}>
            {/* Each sentence balances on its own. text-balance across the whole heading
                treats it as one block and orphaned "bill." on a line by itself. */}
            <h1 className="display mx-auto mt-6 max-w-3xl text-[2.15rem] sm:text-[3rem]">
              <span className="block text-balance">What is your AI budget actually buying?</span>
              <span className="refract block text-balance">
                Full-spectrum accounting of your AI bill.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-3">
              Trace and optimise every AI dollar through your entire SDLC. Behold turns your
              developer and AI tool data into one honest picture: what you put in, what you got
              out, both in dollars.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex justify-center">
              <DemoForm />
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mx-auto mt-14 max-w-3xl">
            <SpendFlow />
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-16">
            <ProductShot />
          </div>
        </Reveal>
      </Section>
    </div>
  );
}

/* --- marquee -------------------------------------------------------------- */

function ReadsFrom() {
  return (
    <Section className="py-14">
      <p className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-4">
        Reads from the systems you already run
      </p>
      <Marquee
        items={[
          "GitHub",
          "GitLab",
          "Claude Code",
          "GitHub Copilot",
          "Cursor",
          "Anthropic",
          "OpenAI",
          "AWS Bedrock",
          "Google Vertex",
          "LiteLLM",
          "Jira",
          "Linear",
          "Slack",
        ]}
      />
    </Section>
  );
}

/* --- the pinned scroll story ---------------------------------------------- */

const STEPS: Step[] = [
  {
    k: "split",
    title: "One invoice. Four stages.",
    body: "Your provider sends a single figure. Behold refracts it across the delivery lifecycle, so every dollar has a stage attached to it before anyone starts arguing about value.",
    visual: <StageSplit active={0} />,
  },
  {
    k: "build",
    title: "Price the work that shipped.",
    body: "Half the budget lands here. We divide it by what actually reached the main branch, giving a unit cost you can compare across teams without pretending they do the same job.",
    visual: <BuildCost />,
  },
  {
    k: "review",
    title: "Cost the second look.",
    body: "Revision rounds are real spend and nobody budgets for them. When a team's rework cost climbs, that is a signal about the work going in — not about the reviewers.",
    visual: <ReviewCost />,
  },
  {
    k: "release",
    title: "Separate shipped from spent.",
    body: "Work that was abandoned or reverted still cost money. Counting it apart from what survived is the difference between a spend report and an ROI answer.",
    visual: <ReleaseOutcome />,
  },
];

function Story() {
  return (
    <div className="border-y border-line bg-paper/60">
      <Section id="platform" className="py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="spectrum-rule mb-7 w-16" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              Follow the dollar.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Every other tool tells you what your engineers did. The question your board is
              actually asking is what it cost and what came back. That answer only exists if the
              spend is attributed stage by stage — which is the whole product.
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <Scrollytelling steps={STEPS} />
        </div>
      </Section>
    </div>
  );
}

/* --- claims --------------------------------------------------------------- */

function Claims() {
  const rows = [
    {
      h: "Every metric shows its working.",
      b: "Each number carries the formula that produced it and the rows it was computed from. Nobody has to take an engineering metric on faith — least of all the person being measured by it.",
    },
    {
      h: "Aggregate by default.",
      b: "Individual-level views stay off unless an admin deliberately turns them on. A measurement tool that becomes a surveillance tool stops getting honest data, and then it stops being useful.",
    },
    {
      h: "Numbers your CFO will accept.",
      b: "Unit economics reconciled to the invoice: cost per merged change, by team, with abandoned and reverted work separated from what actually shipped.",
    },
  ];
  return (
    <Section className="py-24">
      <div className="flex flex-col">
        {rows.map((r, i) => (
          <Reveal key={r.h} delay={i * 80}>
            <div className="grid gap-6 border-t border-line py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
              <div className="flex items-start gap-5">
                <span
                  className="mt-2.5 h-[3px] w-10 shrink-0 rounded-full"
                  style={{ background: `var(--s${i + 1})` }}
                />
                <h3 className="h2 text-balance text-[1.6rem] sm:text-[1.95rem]">{r.h}</h3>
              </div>
              <p className="text-[15.5px] leading-relaxed text-ink-3">{r.b}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* --- how it works --------------------------------------------------------- */

function How() {
  const steps = [
    {
      t: "Connect",
      d: "Read-only access to your Git provider and model providers — a GitHub or GitLab app, an admin API key, and any AI gateway you already run.",
      f: "Under 30 minutes",
    },
    {
      t: "Measure",
      d: "We ingest pull requests, reviews, commits and usage, then compute every metric from that source data, with the formula shown beside the number.",
      f: "Insights the same day",
    },
    {
      t: "Act",
      d: "Composable dashboards for each audience, benchmarks against comparable orgs, and reporting your finance team will accept as-is.",
      f: "Board-ready by first review",
    },
  ];
  return (
    <div className="border-y border-line bg-paper/60">
      <Section id="how" className="py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="spectrum-rule mb-7 w-16" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.75rem]">
              Connected in an afternoon. Useful the same day.
            </h2>
          </div>
        </Reveal>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 100}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span
                  className="block h-[3px] w-8 rounded-full"
                  style={{ background: `var(--s${i + 1})` }}
                />
                <h3 className="mt-5 text-[17px] font-bold text-ink">{s.t}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-3">{s.d}</p>
                <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] font-semibold text-ink-4">
                  {s.f}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* --- integrations --------------------------------------------------------- */

function Integrations() {
  const groups = [
    { g: "Source control", items: ["GitHub", "GitLab", "Bitbucket", "Azure Repos"] },
    { g: "AI & agents", items: ["Claude Code", "GitHub Copilot", "Cursor", "Codex", "Gemini"] },
    { g: "Model providers", items: ["Anthropic", "OpenAI", "AWS Bedrock", "Google Vertex"] },
    { g: "Gateways", items: ["LiteLLM", "Portkey", "Cloudflare AI Gateway"] },
    { g: "Planning", items: ["Jira", "Linear", "Azure Boards"] },
    { g: "Delivery", items: ["Jenkins", "CircleCI", "GitHub Actions", "PagerDuty", "Slack"] },
  ];
  return (
    <Section id="integrations" className="py-24">
      <Reveal>
        <div className="max-w-2xl">
          <div className="spectrum-rule mb-7 w-16" />
          <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.75rem]">
            Connects to what you have.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
            Read-only, least-privilege scopes throughout. If you already route model traffic
            through a gateway, that one connection covers most of your spend picture on day one.
          </p>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.g} delay={(i % 3) * 80}>
            <div className="h-full rounded-2xl border border-line bg-white p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4">
                {g.g}
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[13px] font-medium text-ink-2"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* --- security ------------------------------------------------------------- */

function Security() {
  const items = [
    {
      t: "Metrics, never content",
      d: "We extract counts, timings and identifiers. Prompts, completions and source code never leave your systems.",
    },
    {
      t: "Read-only by design",
      d: "Least-privilege scopes on every integration. Behold has no write access to your repositories.",
    },
    {
      t: "Encrypted end to end",
      d: "TLS in transit, AES-256 at rest. Provider credentials are encrypted with per-record keys.",
    },
    {
      t: "Aggregate by default",
      d: "Individual-level views stay off unless an admin deliberately enables them. This is not a surveillance tool.",
    },
    { t: "SSO and SCIM", d: "SAML single sign-on and directory provisioning, with role-based access control." },
    {
      t: "Your deployment, if needed",
      d: "Self-hosted and VPC options for teams whose policy won't allow a third-party clone.",
    },
  ];
  return (
    <div className="border-y border-line bg-paper/60">
      <Section id="security" className="py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="spectrum-rule mb-7 w-16" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.75rem]">
              Built to pass the review before you have to ask.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Engineering telemetry is sensitive and measurement tools have earned scepticism. Our
              answer is to collect as little as possible: the numbers, and nothing readable.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i, n) => (
            <Reveal key={i.t} delay={(n % 3) * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-6">
                <h3 className="text-[15px] font-bold text-ink">{i.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{i.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-ink-4">
          SOC 2 Type II in progress · DPA and sub-processor list available on request
        </p>
      </Section>
    </div>
  );
}

/* --- CTA ------------------------------------------------------------------ */

function Cta() {
  return (
    <Section className="py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-20 text-center">
          {/* The prism again, this time as light inside the dark. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "conic-gradient(from 200deg at 50% -10%, transparent 0deg, color-mix(in srgb, var(--s1) 55%, transparent) 14deg, color-mix(in srgb, var(--s2) 48%, transparent) 22deg, color-mix(in srgb, var(--s3) 42%, transparent) 29deg, color-mix(in srgb, var(--s4) 40%, transparent) 36deg, color-mix(in srgb, var(--s5) 34%, transparent) 43deg, transparent 54deg)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="display text-balance text-[2.4rem] text-white sm:text-[3rem]">
              Bring evidence to the next budget conversation.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-white/70">
              We&apos;re working with a small number of engineering organisations to get this
              right. Connect a repository and see your own numbers — no slide deck required.
            </p>
            <div id="demo" className="mt-9 flex scroll-mt-32 justify-center">
              <DemoForm tone="dark" />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ReadsFrom />
        <Story />
        <Claims />
        <How />
        <Integrations />
        <Security />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
