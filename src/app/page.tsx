import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import { ProductShot } from "@/components/product-shot";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { Scrollytelling, type Step } from "@/components/scrollytelling";
import { EquationScroll } from "@/components/equation";
import { Research, YourTeam } from "@/components/research";
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
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            {/* The category term as a chip rather than a stretched mono eyebrow — the
                phrase is too long to survive 0.16em tracking at 11px, which is what made
                it look cramped. A pill gives it a shape and lets it sit in sentence case. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 py-1.5 pl-2 pr-3.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              <span className="text-[12.5px] font-semibold tracking-tight text-ink-2">
                AI unit economics for software delivery
              </span>
            </span>
          </Reveal>

          <Reveal delay={80}>
            {/* Sized to hold each sentence on a single line from lg up; it still wraps
                on narrow screens, where two balanced lines read better than 20px type. */}
            <h1 className="display mx-auto mt-6 max-w-[19ch] text-[2.05rem] sm:max-w-none sm:text-[2.6rem] lg:text-[2.85rem]">
              <span className="block text-balance">Where&apos;s your AI budget going?</span>
              <span className="refract block text-balance">
                Full-spectrum accounting of your AI bill.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            {/*
                Two marks, not four: the action and the unit. Marking the middle clauses
                too made the paragraph read as a page of someone else's revision notes —
                when everything is emphasized, nothing is.

                Both in the same amber. A real highlighter is one color; two different
                ones in a single paragraph reads as a color-coding system the reader is
                expected to decode, and there's nothing to decode here.
            */}
            <p className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-[1.95] text-ink-3">
              <span
                className="mark whitespace-nowrap font-semibold text-ink"
                style={{ background: "color-mix(in srgb, var(--s4) 32%, transparent)" }}
              >
                Trace and optimize
              </span>{" "}
              every AI dollar through your entire SDLC. Behold turns your developer and AI tool
              data into one honest picture: what you put in, what you got out, all in{" "}
              <span
                className="mark whitespace-nowrap font-extrabold text-ink"
                style={{ background: "color-mix(in srgb, var(--s4) 32%, transparent)" }}
              >
                $$$
              </span>
              .
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex justify-center">
              {/* The relative box wraps only the form. Put it on the flex row instead and
                  `left-full` resolves against the full container width, which pushes the
                  note off the right edge where the section's overflow-hidden silently
                  eats it — no layout overflow to warn you, just missing content. */}
              <div className="relative">
                <DemoForm />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 items-center gap-2 lg:flex"
                >
                  {/*
                    Hand-drawn arrow pointing back at the button. The head is built from
                    two barbs rotated ±30° off the *reverse* of the curve's end tangent —
                    the previous one had a barb on the wrong side, which is why it read
                    as a tick rather than an arrowhead.
                  */}
                  <svg width="50" height="30" viewBox="0 0 50 30" fill="none">
                    <path
                      d="M48 23.5C37.5 26.5 15.5 23 4.5 10.5"
                      stroke="var(--ink-4)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4.5 10.5 7 18.6M4.5 10.5 12.6 13"
                      stroke="var(--ink-4)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="hand whitespace-nowrap text-[1.15rem] text-ink-3">
                    we reply within a day
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
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

/* --- the model ------------------------------------------------------------ */

function Model() {
  return (
    <div className="border-y border-line bg-paper">
      <Section id="model" className="py-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
            <h2 className="h2 text-balance text-[2.25rem] sm:text-[2.9rem]">
              We measure every term.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3">
              Engineering value is not throughput and it is not spend. It is what the work was
              worth, minus everything it cost to get there — including the costs that arrive
              late. Six terms. We instrument all of them.
            </p>
          </div>
        </Reveal>

        <div className="mt-14">
          <EquationScroll />
        </div>
      </Section>
    </div>
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
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
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
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
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
          <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
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
            <div className="mb-7 h-[3px] w-12 rounded-full bg-ink" />
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
              We&apos;re working with a small number of engineering organizations to get this
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
        <Model />
        <Story />
        <Research />
        <YourTeam />
        <How />
        <Integrations />
        <Security />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
