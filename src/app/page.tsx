import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import { ProductShot } from "@/components/product-shot";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { EquationPanel } from "@/components/equation";
import { UseCases } from "@/components/use-cases";
import { NumberIsNotAnAnswer, Position } from "@/components/philosophy";

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
              Scientific measurement of your engineering value.
            </h2>
          </div>
        </Reveal>

        <Position />

        <div className="mt-12">
          <EquationPanel />
        </div>
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
        <UseCases />
        <NumberIsNotAnAnswer />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
