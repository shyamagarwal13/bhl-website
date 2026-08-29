import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import {
  AttributionSplit,
  DxSignals,
  HeroConsole,
  HotspotTable,
  SpendBreakdown,
} from "@/components/viz";

/* --- small shared bits ---------------------------------------------------- */

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display mt-4 text-balance text-[2.25rem] leading-[1.12] text-text sm:text-[2.75rem]">
      {children}
    </h2>
  );
}

/* --- hero ----------------------------------------------------------------- */

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="grid-rule pointer-events-none absolute inset-0" />

      <Section className="relative pb-20 pt-36 sm:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <div
              className="rise inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3 py-1.5"
              style={{ animationDelay: "40ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal live-dot" />
              <span className="font-mono text-[11px] tracking-wide text-text-muted">
                Now in private beta
              </span>
            </div>

            <h1
              className="font-display rise mt-6 text-balance text-[2.9rem] leading-[1.06] text-text sm:text-[3.6rem]"
              style={{ animationDelay: "90ms" }}
            >
              See what your AI investment is{" "}
              <span className="relative whitespace-nowrap text-gold">
                actually doing
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="7"
                  viewBox="0 0 200 7"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5.2C42 2.1 92 1.4 199 3.6"
                    stroke="var(--gold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.55"
                  />
                </svg>
              </span>
              .
            </h1>

            <p
              className="rise mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-text-muted"
              style={{ animationDelay: "150ms" }}
            >
              Behold Labs connects what you spend on AI to what your engineers actually ship.
              Cost per merged pull request, adoption by team, developer experience, and delivery
              impact — measured from your own systems, not estimated from a survey.
            </p>

            <div className="rise mt-8" style={{ animationDelay: "210ms" }}>
              <DemoForm />
            </div>
          </div>

          <div className="rise lg:pl-4" style={{ animationDelay: "260ms" }}>
            <HeroConsole />
          </div>
        </div>

        {/* Reads as social proof without borrowing anyone's logo we haven't earned. */}
        <div
          className="rise mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-7"
          style={{ animationDelay: "320ms" }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-faint">
            Reads from
          </span>
          {["GitHub", "GitLab", "Claude Code", "Copilot", "Cursor", "Anthropic", "OpenAI", "Bedrock", "Jira", "Linear"].map(
            (n) => (
              <span key={n} className="text-sm text-text-muted">
                {n}
              </span>
            ),
          )}
        </div>
      </Section>
    </div>
  );
}

/* --- the problem ---------------------------------------------------------- */

function Problem() {
  const gaps = [
    {
      q: "“What are we getting for it?”",
      a: "Provider invoices tell you the total. They can't tell you which team, which repository, or which shipped feature it paid for.",
    },
    {
      q: "“Is it actually making us faster?”",
      a: "Velocity dashboards count commits and pull requests. Neither knows whether an agent wrote the change or whether it survived review.",
    },
    {
      q: "“What is it costing us later?”",
      a: "Code arrives faster than it is understood. Complexity and rework accumulate quietly, and show up two quarters after the spend.",
    },
  ];
  return (
    <Section className="py-24">
      <div className="max-w-2xl">
        <Eyebrow>The gap</Eyebrow>
        <H2>
          Every engineering org just added a significant line item nobody can defend with data.
        </H2>
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
        {gaps.map((g) => (
          <div key={g.q} className="bg-surface p-7">
            <p className="font-display text-[1.35rem] leading-snug text-text">{g.q}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{g.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --- platform pillars ----------------------------------------------------- */

const PILLARS = [
  {
    k: "01",
    t: "AI spend intelligence",
    d: "Every dollar mapped to a team, a repository, and a pull request. Model, tool, and provider costs reconciled in one place.",
    m: ["Cost per merged PR", "Spend by team & repo", "Provider reconciliation", "Budget forecasting"],
  },
  {
    k: "02",
    t: "Engineering output",
    d: "Throughput, review depth, and delivery measured from your source systems — never self-reported, never gameable.",
    m: ["Merged throughput", "Review coverage & latency", "Lead time to production", "Human / agent attribution"],
  },
  {
    k: "03",
    t: "Developer experience",
    d: "Where friction actually lives, combining system signals with lightweight surveys so the fix is specific, not a vibe.",
    m: ["DX index", "Build & test speed", "Deep work time", "Onboarding time"],
  },
  {
    k: "04",
    t: "Code health",
    d: "The debt AI velocity leaves behind. Complexity, duplication, and the files where risk and rework concentrate.",
    m: ["Complexity × churn hotspots", "Duplication rate", "Committed secrets", "Dependency risk"],
  },
];

function Platform() {
  return (
    <Section id="platform" className="py-24">
      <div className="max-w-2xl">
        <Eyebrow>The platform</Eyebrow>
        <H2>Four measurements that answer the question together.</H2>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-text-muted">
          Spend without output is a bill. Output without spend is a vanity chart. Behold reads
          both from the same source of truth, so the connection between them is evidence rather
          than an argument.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <div
            key={p.k}
            className="group rounded-2xl border border-hairline bg-surface p-7 transition-colors hover:border-hairline-strong"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-gold">{p.k}</span>
              <h3 className="text-lg font-semibold text-text">{p.t}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{p.d}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.m.map((m) => (
                <li
                  key={m}
                  className="rounded-md border border-hairline bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-muted"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
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
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className={flip ? "lg:order-2" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="font-display mt-4 text-balance text-[1.85rem] leading-tight text-text sm:text-[2.15rem]">
          {title}
        </h3>
        <p className="mt-4 leading-relaxed text-text-muted">{body}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-sm text-text-muted">
              <svg
                className="mt-1 shrink-0 text-teal"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 8.5l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function Features() {
  return (
    <div className="border-y border-hairline bg-ink-2">
      <Section className="flex flex-col gap-24 py-24">
        <Feature
          eyebrow="Spend → outcome"
          title="Cost per merged pull request, not cost per seat."
          body="Seat counts and token totals describe activity. They don't tell you what shipped. Behold attributes model and tool spend down to the change it produced, so you can compare teams honestly and defend the budget with a number."
          points={[
            "Attribution by team, repository, branch and pull request",
            "Reconciled against provider billing so totals match finance",
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
            "Metrics only — we never ingest prompts, completions, or source content",
            "Aggregate by default; individual surveillance is not a supported use case",
          ]}
          visual={<AttributionSplit />}
        />
        <Feature
          eyebrow="Developer experience"
          title="Find the friction that is quietly taxing every sprint."
          body="A slow build is a tax charged to every engineer, every day, and it never appears on an invoice. Behold combines system telemetry with short, targeted surveys to locate the friction precisely enough to fix it."
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
    </div>
  );
}

/* --- how it works --------------------------------------------------------- */

function How() {
  const steps = [
    {
      n: "01",
      t: "Connect",
      d: "Read-only access to your Git provider and your model providers. A GitHub or GitLab app, an admin API key, and any AI gateway you already run.",
      foot: "Typically under 30 minutes.",
    },
    {
      n: "02",
      t: "Measure",
      d: "We ingest pull requests, reviews, commits and usage, then compute every metric from that source data — with the formula shown next to the number.",
      foot: "First insights the same day.",
    },
    {
      n: "03",
      t: "Act",
      d: "Composable dashboards for each audience, benchmarks against comparable orgs, and reporting your finance team will accept without a translation layer.",
      foot: "Board-ready by the first review.",
    },
  ];
  return (
    <Section id="how" className="py-24">
      <div className="max-w-2xl">
        <Eyebrow>How it works</Eyebrow>
        <H2>Connected in an afternoon. Useful the same day.</H2>
      </div>
      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="relative rounded-2xl border border-hairline bg-surface p-7">
            <span className="font-mono text-xs text-gold">{s.n}</span>
            <h3 className="mt-3 text-lg font-semibold text-text">{s.t}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{s.d}</p>
            <p className="mt-5 border-t border-hairline pt-4 font-mono text-[11px] text-teal">
              {s.foot}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* --- audiences ------------------------------------------------------------ */

function Audiences() {
  const who = [
    {
      r: "Engineering leadership",
      q: "Is this investment paying off, and where should the next dollar go?",
    },
    {
      r: "Platform & DevEx teams",
      q: "Which friction is costing the most engineering hours right now?",
    },
    { r: "Finance & FinOps", q: "What is the real unit cost of shipping, by team?" },
    { r: "Developers", q: "Is the tooling helping me, and is my team's context understood?" },
  ];
  return (
    <Section className="py-24">
      <div className="max-w-2xl">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <H2>One set of numbers, four different questions.</H2>
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
        {who.map((w) => (
          <div key={w.r} className="bg-surface p-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
              {w.r}
            </div>
            <p className="font-display mt-3 text-[1.3rem] leading-snug text-text">{w.q}</p>
          </div>
        ))}
      </div>
    </Section>
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
    { g: "Delivery & alerting", items: ["Jenkins", "CircleCI", "GitHub Actions", "PagerDuty", "Slack"] },
  ];
  return (
    <Section id="integrations" className="py-24">
      <div className="max-w-2xl">
        <Eyebrow>Integrations</Eyebrow>
        <H2>Reads the systems you already run.</H2>
        <p className="mt-5 leading-relaxed text-text-muted">
          Read-only, least-privilege scopes throughout. If you already route model traffic through
          a gateway, that single connection covers most of your spend picture on day one.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.g} className="rounded-xl border border-hairline bg-surface p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
              {g.g}
            </div>
            <ul className="mt-3.5 flex flex-wrap gap-2">
              {g.items.map((i) => (
                <li
                  key={i}
                  className="rounded-md border border-hairline bg-surface-2 px-2.5 py-1 text-[13px] text-text-muted"
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
      d: "Individual-level views are off unless an admin deliberately enables them. This is not a surveillance tool.",
    },
    {
      t: "SSO and SCIM",
      d: "SAML single sign-on and directory provisioning, with role-based access control.",
    },
    {
      t: "Your deployment, if needed",
      d: "Self-hosted and VPC options for teams whose policy won't allow a third-party clone.",
    },
  ];
  return (
    <div className="border-y border-hairline bg-ink-2">
      <Section id="security" className="py-24">
        <div className="max-w-2xl">
          <Eyebrow>Security & privacy</Eyebrow>
          <H2>Built to pass the review before you have to ask for it.</H2>
          <p className="mt-5 leading-relaxed text-text-muted">
            Engineering telemetry is sensitive, and measurement tools have earned scepticism. Our
            answer is to collect as little as possible: the numbers, and nothing readable.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.t} className="rounded-xl border border-hairline bg-surface p-6">
              <h3 className="text-sm font-semibold text-text">{i.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{i.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-mono text-xs text-text-faint">
          SOC 2 Type II in progress · DPA and sub-processor list available on request
        </p>
      </Section>
    </div>
  );
}

/* --- closing CTA ---------------------------------------------------------- */

function Cta() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora pointer-events-none absolute inset-0" />
      <Section id="demo" className="relative py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Private beta</Eyebrow>
          <h2 className="font-display mt-4 text-balance text-[2.4rem] leading-[1.1] text-text sm:text-[3rem]">
            Bring evidence to the next budget conversation.
          </h2>
          <p className="mt-5 leading-relaxed text-text-muted">
            We&apos;re working with a small number of engineering organisations to get this right.
            Connect a repository and see your own numbers — no slide deck required.
          </p>
          <div className="mt-9 flex justify-center">
            <DemoForm />
          </div>
        </div>
      </Section>
    </div>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="rule-fade" />
        <Problem />
        <Platform />
        <Features />
        <How />
        <Audiences />
        <Integrations />
        <Security />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
