"use client";

import { useState } from "react";

/*
 * The engineering value equation, as an annotated figure.
 *
 * Two earlier attempts got this wrong in instructive ways. The scroll version put six
 * full-width cards down a column, so a term and the equation were never on screen
 * together. The tab version fixed that but hid five terms behind clicks and dimmed five
 * of seven variables to 26%, which made the formula — the thing the section exists to
 * teach — unreadable at a glance.
 *
 * So: the equation is always fully legible, every variable at full strength, and every
 * term is on screen at once. Nothing is behind an interaction.
 *
 * The layout carries the argument. `(F × T)` is what the work was worth; the bracket is
 * what it cost. Splitting the terms into those two groups is the whole insight, and the
 * asymmetry is the point — two terms create value, four consume it, and most tools
 * measure exactly one of the six. Hover is a bonus focus, never a requirement.
 *
 * Colour uses the bright bands; the darkened text stops exist to clear contrast on white
 * and go muddy on ink.
 */

type Term = {
  k: string;
  sym: string;
  name: string;
  unit: string;
  band: string;
  side: "value" | "cost";
  body: string;
  drivers: { good: boolean; text: string }[];
  cite?: { short: string; href: string };
};

const TERMS: Term[] = [
  {
    k: "F",
    sym: "F",
    name: "Feature value delivered",
    unit: "$ revenue / ARR impact",
    band: "#2dd4bf",
    side: "value",
    body: "What the work was worth to the business. Everything to the right of it is what you paid to get it — so this is the term that makes the others mean anything.",
    drivers: [
      { good: true, text: "Shipping what customers actually pay for" },
      { good: false, text: "Work that never reaches production" },
    ],
  },
  {
    k: "T",
    sym: "T",
    name: "Time multiplier",
    unit: "1 on time · < 1 late",
    band: "#38bdf8",
    side: "value",
    body: "Value decays when it arrives late. A feature worth $1M shipped two quarters after the window is not worth $1M, and no velocity dashboard prices that gap.",
    drivers: [
      { good: true, text: "Faster cycle time, earlier feedback" },
      { good: false, text: "Queueing, rework loops, review backlog" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
  {
    k: "P",
    sym: "P",
    name: "Production cost",
    unit: "$",
    band: "#818cf8",
    side: "cost",
    body: "Everything it takes to produce the code: salaries, AI tooling and model spend, hiring, onboarding. The lever every team pulls first, because it's the only one they can currently see.",
    drivers: [
      { good: true, text: "Agents producing working code faster" },
      { good: false, text: "Headcount, model spend, onboarding" },
    ],
    cite: { short: "Agents vs. AI IDEs", href: "https://doi.org/10.1145/3793302.3793589" },
  },
  {
    k: "L",
    sym: "L(t)",
    name: "Liability",
    unit: "$, compounding",
    band: "#fbbf24",
    side: "cost",
    body: "Rework and harm — and the reason this term carries a t. The cost of low-quality code isn't paid when it's written. It accrues, and it lands in a later quarter than the one that booked the saving.",
    drivers: [
      { good: false, text: "Lower quality — more harm, more rework" },
      { good: true, text: "Committed AI configuration, tests, proofs" },
    ],
    cite: {
      short: "Speed at the Cost of Quality",
      href: "https://doi.org/10.1145/3793302.3793349",
    },
  },
  {
    k: "E",
    sym: "E",
    name: "Review effectiveness",
    unit: "%",
    band: "#fb7185",
    side: "cost",
    body: "How much liability review actually catches. It multiplies against L, so a small drop is expensive — and effectiveness falls exactly when volume rises.",
    drivers: [
      { good: false, text: "Productivity pressure on reviewers" },
      { good: false, text: "Deceptive plausibility of generated code" },
      { good: false, text: "Cognitive debt from unfamiliar changes" },
    ],
    cite: {
      short: "AI writes faster than humans review",
      href: "https://arxiv.org/abs/2607.01904",
    },
  },
  {
    k: "R",
    sym: "R",
    name: "Review cost",
    unit: "$",
    band: "#fb7185",
    side: "cost",
    body: "What it costs to run review at all: reviewer hours, automated checks, CI. Doubling merged output doesn't leave this term alone — it roughly doubles the load on whoever is reading.",
    drivers: [
      { good: true, text: "Automated review that catches real defects" },
      { good: false, text: "More merged changes per reviewer" },
    ],
    cite: { short: "2× mandate study", href: "https://arxiv.org/abs/2607.01904" },
  },
];

type Tok = { s: string; t?: string };

// Split so the two halves can be rendered as distinct groups rather than one string.
const LHS: Tok[] = [
  { s: "(" },
  { s: "F", t: "F" },
  { s: "×" },
  { s: "T", t: "T" },
  { s: ")" },
];
const RHS: Tok[] = [
  { s: "[" },
  { s: "P", t: "P" },
  { s: "+" },
  { s: "L(t)", t: "L" },
  { s: "×" },
  { s: "(1−" },
  { s: "E", t: "E" },
  { s: ")" },
  { s: "+" },
  { s: "R", t: "R" },
  { s: "]" },
];

function bandOf(k?: string) {
  return TERMS.find((t) => t.k === k)?.band ?? "#ffffff";
}

function Arrow({ good }: { good: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {good ? <path d="M4 4l8 8M12 12H6M12 12V6" /> : <path d="M4 12L12 4M12 4H6M12 4v6" />}
    </svg>
  );
}

/** One token of the rendered equation. Dims only while another term is hovered. */
function Token({ tok, focus }: { tok: Tok; focus: string | null }) {
  const isVar = !!tok.t;
  const dim = isVar && focus !== null && focus !== tok.t && tok.t !== "V";
  return (
    <span
      className="font-mono font-bold transition-all duration-300"
      style={{
        color: isVar ? (tok.t === "V" ? "#fff" : bandOf(tok.t)) : "rgba(255,255,255,0.32)",
        opacity: dim ? 0.3 : 1,
        fontSize: "clamp(1.1rem, 3.1vw, 2.35rem)",
        textShadow:
          isVar && focus === tok.t ? `0 0 26px ${bandOf(tok.t)}88` : "none",
      }}
    >
      {tok.s}
    </span>
  );
}

function TermRow({
  t,
  focus,
  setFocus,
}: {
  t: Term;
  focus: string | null;
  setFocus: (k: string | null) => void;
}) {
  const on = focus === t.k;
  return (
    <div
      onMouseEnter={() => setFocus(t.k)}
      onMouseLeave={() => setFocus(null)}
      onFocus={() => setFocus(t.k)}
      onBlur={() => setFocus(null)}
      tabIndex={0}
      className="group relative rounded-xl px-4 py-4 outline-none transition-colors duration-300"
      style={{ background: on ? "rgba(255,255,255,0.045)" : "transparent" }}
    >
      {/* the term's colour as a rail, so each row is identifiable without a legend */}
      <span
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-opacity duration-300"
        style={{ background: t.band, opacity: on ? 1 : 0.42 }}
      />
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-[1.35rem] font-extrabold leading-none"
          style={{ color: t.band }}
        >
          {t.sym}
        </span>
        <span className="text-[15px] font-bold text-white">{t.name}</span>
        <span className="ml-auto shrink-0 font-mono text-[10.5px] text-white/35">{t.unit}</span>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{t.body}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {t.drivers.map((d) => (
          <span
            key={d.text}
            className="inline-flex items-center gap-1.5 text-[12px] text-white/60"
          >
            <span style={{ color: d.good ? "#34d399" : "#fb7185" }}>
              <Arrow good={d.good} />
            </span>
            {d.text}
          </span>
        ))}
      </div>

      {t.cite && (
        <a
          href={t.cite.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          Our research: {t.cite.short} ↗
        </a>
      )}
    </div>
  );
}

function GroupHead({ label, sub, tokens, focus }: { label: string; sub: string; tokens: Tok[]; focus: string | null }) {
  return (
    <div className="border-b border-white/10 pb-5">
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        {tokens.map((tok, i) => (
          <Token key={i} tok={tok} focus={focus} />
        ))}
      </div>
      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-[13px] text-white/45">{sub}</p>
    </div>
  );
}

export function EquationPanel() {
  const [focus, setFocus] = useState<string | null>(null);
  const value = TERMS.filter((t) => t.side === "value");
  const cost = TERMS.filter((t) => t.side === "cost");

  return (
    <div
      className="relative overflow-hidden rounded-[26px] bg-ink px-5 py-8 sm:px-10 sm:py-11"
      style={{ boxShadow: "0 40px 90px -44px rgba(14,17,22,0.6)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% -18%, rgba(129,140,248,0.16), transparent 70%)",
        }}
      />

      <div className="relative">
        {/* the whole equation, always legible */}
        <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-2 sm:gap-x-2.5">
          <Token tok={{ s: "V", t: "V" }} focus={focus} />
          <Token tok={{ s: "=" }} focus={focus} />
          {LHS.map((t, i) => (
            <Token key={`l${i}`} tok={t} focus={focus} />
          ))}
          <Token tok={{ s: "−" }} focus={focus} />
          {RHS.map((t, i) => (
            <Token key={`r${i}`} tok={t} focus={focus} />
          ))}
        </div>

        {/* the two sides, side by side */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <section>
            <GroupHead
              label="What it was worth"
              sub="The only reason any of the rest matters."
              tokens={LHS}
              focus={focus}
            />
            <div className="mt-3 flex flex-col">
              {value.map((t) => (
                <TermRow key={t.k} t={t} focus={focus} setFocus={setFocus} />
              ))}
            </div>

            {/*
              The two-against-four asymmetry is the argument, so the note that names it
              sits in the space that asymmetry creates. Previously this was a centered
              caption under the equation and the column below it just ended, leaving a
              few hundred pixels of empty panel.
            */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[14px] leading-relaxed text-white/60">
                Two terms create value. Four consume it. Most tools measure exactly one of the
                six — and it is almost always{" "}
                <span className="font-mono font-bold" style={{ color: "#818cf8" }}>
                  P
                </span>
                , because it is the only one that arrives as an invoice.
              </p>
            </div>
          </section>

          <section>
            <GroupHead
              label="What it cost to get"
              sub="Including the part that arrives two quarters late."
              tokens={RHS}
              focus={focus}
            />
            <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
              {cost.map((t) => (
                <TermRow key={t.k} t={t} focus={focus} setFocus={setFocus} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
