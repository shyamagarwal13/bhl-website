import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import { ProductShot } from "@/components/product-shot";
import { AttributionSplit, DxSignals, HotspotTable, SpendBreakdown } from "@/components/viz";

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
    <div className="relative">
      <Section className="relative pb-0 pt-16 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="display rise text-balance text-[2.6rem] text-white sm:text-[3.75rem]"
            style={{ animationDelay: "40ms" }}
          >
            The intelligence layer for AI-native engineering
          </h1>
          <p
            className="rise mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/80"
            style={{ animationDelay: "110ms" }}
          >
            Behold turns your developer and AI tool data into one honest picture — what you
            spend, what ships, and whether the two are moving together.
          </p>
          <div className="rise mt-9 flex justify-center" style={{ animationDelay: "180ms" }}>
            <DemoForm tone="dark" />
          </div>
        </div>

        <div className="rise mt-14 sm:mt-16" style={{ animationDelay: "260ms" }}>
          <ProductShot />
        </div>
      </Section>
    </div>
  );
}

/* --- value strip ---------------------------------------------------------- */

function ValueStrip() {
  const items = [
    {
      t: "Prove AI ROI",
      d: "Connect model spend to merged work, so the budget conversation has a number in it.",
    },
    {
      t: "Accelerate adoption",
      d: "See real diffusion across teams and find where enablement worked — and where it stalled.",
    },
    {
      t: "Unblock developer flow",
      d: "Locate the friction taxing every sprint, ranked by the hours it is actually costing.",
    },
    {
      t: "Control the AI-SDLC",
      d: "Watch complexity and rework so speed today doesn't become a rewrite next quarter.",
    },
  ];
  return (
    <Section className="pt-14">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i, n) => (
          <div key={i.t} className="bg-white p-6">
            <div className="mb-3 h-1 w-8 rounded-full" style={{ background: ["var(--indigo)", "var(--violet)", "var(--rose)", "var(--amber)"][n] }} />
            <h3 className="text-[15px] font-bold text-ink">{i.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{i.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --- integrations strip (honest stand-in for a customer logo cloud) -------- */

function ReadsFrom() {
  const names = [
    "GitHub",
    "GitLab",
    "Claude Code",
    "Copilot",
    "Cursor",
    "Anthropic",
    "OpenAI",
    "Bedrock",
    "Jira",
    "Linear",
  ];
  return (
    <Section className="py-16">
      <p className="text-center text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-4">
        Reads from the systems you already run
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
        {names.map((n) => (
          <span key={n} className="text-[15px] font-bold text-ink-4">
            {n}
          </span>
        ))}
      </div>
    </Section>
  );
}

/* --- use cases ------------------------------------------------------------ */

const USE_CASES = [
  {
    t: "Optimise AI investment",
    d: "See where AI spend and engineering effort actually go, across any team or category, so the next dollar lands where it works.",
    c: "var(--indigo)",
  },
  {
    t: "Prove business impact",
    d: "Connect spend, effort and delivery outcomes to understand what AI is producing — and whether it is meaningfully changing what you ship.",
    c: "var(--violet)",
  },
  {
    t: "Mature your metrics",
    d: "Define engineering metrics that survive scrutiny, with the formula shown next to every number so nobody has to take it on faith.",
    c: "var(--rose)",
  },
  {
    t: "Improve AI workflows",
    d: "Understand how engineers actually work with agents across the lifecycle, and which behaviours consistently produce better outcomes.",
    c: "var(--amber)",
  },
  {
    t: "Improve developer experience",
    d: "Pair system signals with short, targeted surveys to find the friction worth fixing and prove the fix landed.",
    c: "var(--teal)",
  },
  {
    t: "Report to finance",
    d: "Unit economics your CFO will accept without a translation layer: cost per merged change, by team, reconciled to the invoice.",
    c: "var(--indigo)",
  },
];

function UseCases() {
  return (
    <div className="dawn-soft border-y border-line">
      <Section id="platform" className="py-24">
        <p className="eyebrow text-indigo">Platform use cases</p>
        <h2 className="h2 mt-4 max-w-2xl text-balance text-[2.25rem] sm:text-[2.9rem]">
          Engineering intelligence <span className="text-gradient">across your SDLC</span>
        </h2>
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-3">
          Spend without output is a bill. Output without spend is a vanity chart. Behold reads
          both from the same source of truth, so the link between them is evidence rather than
          an argument.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <div
              key={u.t}
              className="group rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:lift"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb, ${u.c} 12%, transparent)` }}
              >
                <span className="h-3 w-3 rounded-md" style={{ background: u.c }} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold text-ink">{u.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{u.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* --- feature deep dives --------------------------------------------------- */

function Feature({
  eyebrow,
  title,
  body,
  points,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
        <p className="eyebrow text-indigo">{eyebrow}</p>
        <h3 className="h2 mt-4 text-balance text-[1.9rem] sm:text-[2.3rem]">{title}</h3>
        <p className="mt-4 text-[15.5px] leading-relaxed text-ink-3">{body}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[14.5px] text-ink-2">
              <svg
                className="mt-[3px] shrink-0 text-indigo"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="8" fill="currentColor" fillOpacity="0.1" />
                <path
                  d="M4.5 8.2l2.4 2.4L11.5 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>{visual}</div>
    </div>
  );
}

function Features() {
  return (
    <Section className="flex flex-col gap-28 py-24">
      <Feature
        eyebrow="Spend → outcome"
        title="Cost per merged pull request, not cost per seat."
        body="Seat counts and token totals describe activity. They don't tell you what shipped. Behold attributes model and tool spend down to the change it produced, so you can compare teams honestly and defend the budget with a number."
        points={[
          "Attribution by team, repository, branch and pull request",
          "Reconciled against provider billing, so totals match finance",
          "Cost of abandoned and reverted work, separated from delivered work",
          "Trends that survive a headcount change or a pricing change",
        ]}
        visual={<SpendBreakdown />}
      />
      <Feature
        flip
        eyebrow="Adoption & attribution"
        title="Know which work is agent-assisted — without watching anyone."
        body="Adoption reported by tool vendors counts logins. Behold measures what reached the main branch, so you can see real diffusion across teams and spot where enablement is working and where it stalled."
        points={[
          "Agent-assisted share of merged changes, tracked over time",
          "Diffusion by team, so you can find your internal champions",
          "Metrics only — we never ingest prompts, completions or source content",
          "Aggregate by default; individual surveillance is not a supported use case",
        ]}
        visual={<AttributionSplit />}
      />
      <Feature
        eyebrow="Developer experience"
        title="Find the friction quietly taxing every sprint."
        body="A slow build is a tax charged to every engineer, every day, and it never appears on an invoice. Behold combines system telemetry with short, targeted surveys to locate friction precisely enough to fix it."
        points={[
          "A DX index you can trend, benchmark and act on",
          "System signals paired with developer sentiment for the why",
          "Ranked by estimated hours lost, so remediation gets prioritised",
          "Survey fatigue avoided by asking few questions, rarely",
        ]}
        visual={<DxSignals />}
      />
      <Feature
        flip
        eyebrow="Code health"
        title="Watch the debt that fast delivery leaves behind."
        body="Shipping faster is only a win if the codebase survives it. Behold reads the code itself — complexity, duplication, secrets, dependency risk — and weights it by change frequency, because complex code nobody touches is not the problem."
        points={[
          "Hotspots ranked by complexity × churn, not raw complexity",
          "Committed secrets found across full git history",
          "Known vulnerabilities in the dependencies you actually ship",
          "Findings overlaid on hotspots, so remediation starts in the right file",
        ]}
        visual={<HotspotTable />}
      />
    </Section>
  );
}

/* --- how it works --------------------------------------------------------- */

function How() {
  const steps = [
    {
      n: "01",
      t: "Connect",
      d: "Read-only access to your Git provider and model providers — a GitHub or GitLab app, an admin API key, and any AI gateway you already run.",
      f: "Under 30 minutes",
    },
    {
      n: "02",
      t: "Measure",
      d: "We ingest pull requests, reviews, commits and usage, then compute every metric from that source data, with the formula shown beside the number.",
      f: "Insights the same day",
    },
    {
      n: "03",
      t: "Act",
      d: "Composable dashboards for each audience, benchmarks against comparable orgs, and reporting your finance team will accept as-is.",
      f: "Board-ready by first review",
    },
  ];
  return (
    <div className="border-y border-line bg-paper">
      <Section id="how" className="py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-indigo">How it works</p>
          <h2 className="h2 mt-4 text-balance text-[2.25rem] sm:text-[2.75rem]">
            Connected in an afternoon. Useful the same day.
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-line bg-white p-7">
              <span className="font-mono text-xs font-bold text-indigo">{s.n}</span>
              <h3 className="mt-3 text-[17px] font-bold text-ink">{s.t}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-3">{s.d}</p>
              <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] font-semibold text-teal">
                {s.f}
              </p>
            </li>
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
      <div className="max-w-2xl">
        <p className="eyebrow text-indigo">Integrations</p>
        <h2 className="h2 mt-4 text-balance text-[2.25rem] sm:text-[2.75rem]">
          Connects to what you have.
        </h2>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
          Read-only, least-privilege scopes throughout. If you already route model traffic
          through a gateway, that one connection covers most of your spend picture on day one.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.g} className="rounded-2xl border border-line bg-white p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4">
              {g.g}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((i) => (
                <li
                  key={i}
                  className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[13px] font-medium text-ink-2"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
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
    <div className="border-y border-line bg-paper">
      <Section id="security" className="py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-indigo">Security & privacy</p>
          <h2 className="h2 mt-4 text-balance text-[2.25rem] sm:text-[2.75rem]">
            Built to pass the review before you have to ask.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
            Engineering telemetry is sensitive and measurement tools have earned scepticism. Our
            answer is to collect as little as possible: the numbers, and nothing readable.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.t} className="rounded-2xl border border-line bg-white p-6">
              <h3 className="text-[15px] font-bold text-ink">{i.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{i.d}</p>
            </div>
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
      <div className="dawn grain relative overflow-hidden rounded-3xl px-8 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <h2 className="display text-balance text-[2.4rem] text-white sm:text-[3rem]">
            Bring evidence to the next budget conversation.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-white/80">
            We&apos;re working with a small number of engineering organisations to get this right.
            Connect a repository and see your own numbers — no slide deck required.
          </p>
          <div id="demo" className="mt-9 flex justify-center scroll-mt-32">
            <DemoForm tone="dark" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="relative">
      {/*
        The gradient is anchored to the top of the PAGE, not the top of the hero, so it
        sits behind the floating nav — which is what lets the nav be transparent with
        white type. Anchored to the hero instead, the nav rendered white-on-white.
        It stops short of the product shot so the panel reads as emerging from the
        colour rather than sitting on a coloured box.

        No negative z-index here: the body's white background paints at the canvas layer,
        so `-z-10` hides the gradient behind it completely. Being first in DOM order with
        positioned siblings after it is enough.
      */}
      <div className="dawn grain dawn-fade absolute inset-x-0 top-0 h-[940px]" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <ValueStrip />
        <ReadsFrom />
        <UseCases />
        <Features />
        <How />
        <Integrations />
        <Security />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
