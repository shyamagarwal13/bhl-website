import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { DemoForm } from "@/components/demo-form";
import { ReconciliationPlate } from "@/components/engraving";
import { Reveal } from "@/components/reveal";
import { NumberIsNotAnAnswer } from "@/components/philosophy";
import { SectionHead } from "@/components/section-head";
import { Instruments } from "@/components/instruments";
import { Platform } from "@/components/platform";
import { HowWeSee } from "@/components/how-we-see";
import { Ledger } from "@/components/ledger";
import { Showcase } from "@/components/showcase";
import { StatementArtifact } from "@/components/statement-artifact";

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

/*
 * Bare type on a flat field.
 *
 * What was here before was a checklist of the things a generated AI landing page does: a
 * pill badge quoting the tagline, two highlighter marks in one paragraph, a handwritten
 * squiggle-arrow pointing at the button, an aurora gradient wash, and a browser-chrome
 * product shot underneath. Individually each is defensible. Stacked, they are a genre, and
 * the genre is the opposite of the claim this company is making.
 *
 * The sentence is good enough to carry the screen alone, so it does. Everything else is
 * removed, the field is flat, and the first thing under the fold is the argument rather
 * than a screenshot of a dashboard.
 */
function Hero() {
  return (
    <div className="bg-paper">
      <Section className="relative grid items-center gap-16 pb-20 pt-24 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-20">
        <div className="max-w-4xl">
          <Reveal>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">
              Creativity is the new productivity
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display mt-10 text-[2.5rem] sm:text-[3.6rem] lg:text-[4.4rem]">
              <span className="block text-balance">Every dashboard says you shipped more.</span>
              <span className="lean block text-balance text-ink-3">
                We tell you if it was worth shipping.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-10 max-w-xl text-[1.15rem] leading-[1.72] text-ink-2">
              When writing is free, volume stops being an achievement. Behold measures the
              judgment behind the work: what it costs you to keep the slop, and where a person
              is still the most valuable thing in the room. All of it priced.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <a
              href="#demo"
              className="mt-12 inline-flex items-baseline gap-3 border-b border-ink pb-2 text-[1.25rem] text-ink transition-opacity hover:opacity-70"
            >
              <span className="h2">Request a reading</span>
              <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        {/* the signature object, occupying the half that was empty paper */}
        <Reveal delay={320} className="min-w-0">
          <ReconciliationPlate />
        </Reveal>
      </Section>
    </div>
  );
}

/* --- CTA ------------------------------------------------------------------ */

function Cta() {
  return (
    <div>
      <Reveal>
        {/*
          No aurora. A rainbow glow bleeding from the corner of a dark closing panel is the
          single most reused move in AI-era SaaS, and it was the one place this page reverted
          to the genre it spends the rest of its length arguing against.

          The close instead repeats the page's own grammar: the ink column from the ledger,
          the hairline rules, and a rust figure — so the last thing a reader sees is the same
          instrument they were shown at the top.
        */}
        <div className="relative overflow-hidden bg-ink px-6 py-20 sm:px-14 sm:py-24">
          <div className="mx-auto grid max-w-[var(--maxw)] gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-20">
            <div>
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/45">
                  The next conversation
                </span>
                <span className="h-px flex-1 bg-white/15" />
              </div>
              <h2 className="h2 mt-8 max-w-[16ch] text-[2.3rem] text-white sm:text-[3rem]">
                Bring evidence to the next budget conversation.
              </h2>
              <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-white/60">
                We are a small team of researchers, early in this, and working with a few
                engineering organisations to get it right. If the argument above sounds like
                your quarter, we would like to hear about it.
              </p>
            </div>

            <div>
              <dl className="border-t border-white/12">
                {[
                  ["Organisations we work with at a time", "A handful"],
                  ["What the first conversation costs", "Nothing"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-6 border-b border-white/12 py-5"
                  >
                    <dt className="text-[13px] text-white/70">{k}</dt>
                    <dd className="figure text-[2rem] text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <div id="demo" className="mt-9 scroll-mt-32">
                <DemoForm tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <Nav />
      {/*
        Seven sections, not eleven.

        The previous order ran eight consecutive blocks of eyebrow → heading → card grid,
        which flattened the hierarchy: the two proprietary metrics landed with exactly the
        same visual weight as a throwaway use-case grid. Sections that repeated an argument
        already made (the product showcase, the standalone statement card) are gone rather
        than restyled, and what remains alternates in *kind* — a split ledger, a ticker, a
        three-lens comparison, two full-bleed instruments, a product grid, a reading list —
        so no two adjacent sections are the same shape.
      */}
      <main>
        <Hero />
        <Ledger />
        <HowWeSee />
        <Instruments />
        <StatementArtifact />
        <Platform />

        {/* What we are building, shown rather than described. Kept after the product list and
            explicitly labelled in progress: a consultancy this early should show the shape of
            the tools without implying they are sitting there switched on. */}
        <Section className="pb-24">
          <SectionHead
            label="What we are building"
            width="wide"
            title={<>The instruments, as they are taking shape.</>}
            lead={
              <>
                In development with our design partners. We would rather show you the honest
                state of it than a rendering of something finished.
              </>
            }
          />
          <div className="mt-12">
            <Showcase />
          </div>
        </Section>
        <NumberIsNotAnAnswer />
        <Cta />
      </main>

      <Footer />
    </>
  );
}
