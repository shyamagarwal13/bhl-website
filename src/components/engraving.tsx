/*
 * Security printing.
 *
 * The diagnosis that moved this page was that nothing on it was drawn: every element was a
 * CSS primitive — a 1px hairline, a rectangle with a background colour, a letter-spaced
 * label — and no arrangement of bordered rectangles is memorable. The fix is not more layout
 * tuning, it is presence.
 *
 * The register is banknotes, bond coupons and certificates of analysis, which is not a
 * costume: it is the literal form of what this company sells. The copy was already writing
 * it — "a bill that comes later", "charged to slop this quarter", a reference number and an
 * issue date. Setting that in plain divs was the mismatch.
 *
 * Everything here is generated from its actual mathematics rather than traced. Guilloche is
 * a real epitrochoid family — the lathe pattern on a banknote is what you get when two
 * rotating radii beat against each other — so the rosettes below are the same equation a
 * geometric lathe solves, drawn at 0.35pt. That is why it reads as engraving and not as a
 * decorative SVG someone drew by eye.
 */

/* --- guilloche ------------------------------------------------------------- */

/**
 * One epitrochoid. `R` fixed circle, `r` rolling circle, `d` pen offset; the ratio R/r sets
 * the number of lobes and the whole character of the rosette.
 */
/**
 * One closed epitrochoid.
 *
 * R/r must be an integer or the curve winds many times before closing and the figure packs
 * into a solid disc. Note there is no phase argument: offsetting the phase inside the two
 * cosine terms *deforms* the curve rather than rotating it, which was the bug that turned
 * the first rosette into a grey plate. The repeat is a real rotation applied to the whole
 * path by the caller, which is also what a geometric lathe does.
 */
function epitrochoid(R: number, r: number, d: number, steps = 1200) {
  const pts: string[] = [];
  const lobes = Math.round(R / r);
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = (R + r) * Math.cos(t) - d * Math.cos((lobes + 1) * t);
    const y = (R + r) * Math.sin(t) - d * Math.sin((lobes + 1) * t);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

/**
 * A banknote lathe rosette: one curve repeated at small phase offsets so the strokes beat
 * against each other and produce the moiré that makes the pattern hard to photocopy.
 */
export function Rosette({
  size = 560,
  strokes = 7,
  stroke = "var(--s1)",
  opacity = 0.5,
  className = "",
}: {
  size?: number;
  strokes?: number;
  stroke?: string;
  opacity?: number;
  className?: string;
}) {
  // Six lobes with the pen at just under half the fixed radius. Tested against denser
  // ratios: anything past about nine repeats closes the ground up and the rosette reads as
  // a grey plate rather than as line-work, which is the failure mode this pattern has.
  const R = 120;
  const r = 20;
  const d = 55;
  const lobes = R / r;
  const one = epitrochoid(R, r, d);
  // spread the copies across a single lobe's worth of rotation; beyond that they land back
  // on top of each other and add density without adding pattern
  const step = 360 / lobes / strokes;
  return (
    <svg
      viewBox="-190 -190 380 380"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <g fill="none" stroke={stroke} strokeWidth="0.4" opacity={opacity}>
        {Array.from({ length: strokes }, (_, i) => (
          <path key={i} d={one} transform={`rotate(${(i * step).toFixed(3)})`} />
        ))}
      </g>
    </svg>
  );
}

/* --- the reconciliation plate ---------------------------------------------- */

/**
 * The hero instrument. Two concentric arcs — what the tooling reported, and what actually
 * survived — over a guilloche ground, with the shortfall hatched. The denomination sits in
 * the middle the way a value sits on a note.
 */
export function ReconciliationPlate({ className = "" }: { className?: string }) {
  const S = 380;
  const outerR = 140;
  const innerR = 118;
  const reported = 1; // full sweep
  const arrived = 0.69;
  const circ = (rr: number) => 2 * Math.PI * rr;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Rosette size={S * 1.34} strokes={7} opacity={0.5} />
      </div>

      <svg viewBox={`0 0 ${S} ${S}`} className="relative w-full" role="img" aria-label="Reconciliation: 69 per cent of reported output survived ninety days">
        <defs>
          <pattern id="eng-hatch" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="var(--s5)" strokeWidth="0.8" opacity="0.85" />
          </pattern>
          <path id="microring" d={`M ${S / 2} ${S / 2} m -${outerR + 22},0 a ${outerR + 22},${outerR + 22} 0 1,1 ${(outerR + 22) * 2},0 a ${outerR + 22},${outerR + 22} 0 1,1 -${(outerR + 22) * 2},0`} fill="none" />
        </defs>

        {/* the shortfall, hatched: the wedge between what was claimed and what lasted */}
        <circle
          cx={S / 2}
          cy={S / 2}
          r={innerR}
          fill="none"
          stroke="url(#eng-hatch)"
          strokeWidth="17"
          strokeDasharray={`${circ(innerR) * (reported - arrived)} ${circ(innerR)}`}
          strokeDashoffset={-circ(innerR) * arrived}
          transform={`rotate(-90 ${S / 2} ${S / 2})`}
        />

        {/* as reported: the full claim, cut first */}
        <circle
          className="draw"
          cx={S / 2}
          cy={S / 2}
          r={outerR}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.4"
          strokeDasharray={circ(outerR)}
          style={{ ["--len" as string]: circ(outerR), ["--d" as string]: "60ms" }}
          transform={`rotate(-90 ${S / 2} ${S / 2})`}
        />
        {/* as it arrived: the shorter cut, staggered behind it so the shortfall opens up */}
        <circle
          className="draw"
          cx={S / 2}
          cy={S / 2}
          r={innerR}
          fill="none"
          stroke="var(--s1)"
          strokeWidth="1.4"
          strokeDasharray={`${circ(innerR) * arrived} ${circ(innerR)}`}
          style={{ ["--len" as string]: circ(innerR) * arrived, ["--d" as string]: "220ms" }}
          transform={`rotate(-90 ${S / 2} ${S / 2})`}
        />

        {/* graduations every five degrees on the outer ring, heavier at the quarters */}
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 - 90) * (Math.PI / 180);
          const major = i % 9 === 0;
          const r0 = outerR + 4;
          const r1 = outerR + (major ? 13 : 8);
          return (
            <line
              key={i}
              x1={S / 2 + Math.cos(a) * r0}
              y1={S / 2 + Math.sin(a) * r0}
              x2={S / 2 + Math.cos(a) * r1}
              y2={S / 2 + Math.sin(a) * r1}
              stroke="var(--ink-3)"
              strokeWidth={major ? 1.1 : 0.5}
            />
          );
        })}

        {/* microtext ring — legible only on zoom, which is the point of microtext */}
        <text fill="var(--ink-4)" style={{ font: "400 4.1px var(--font-mono), monospace", letterSpacing: "0.22em" }}>
          <textPath href="#microring" startOffset="0">
            BEHOLD LABS · RECONCILIATION · ONE QUARTER · BEHOLD LABS · RECONCILIATION · ONE QUARTER · BEHOLD LABS · RECONCILIATION · ONE QUARTER ·
          </textPath>
        </text>

        {/* the denomination */}
        <text
          x={S / 2}
          y={S / 2 + 6}
          textAnchor="middle"
          fill="var(--ink)"
          style={{ font: "400 78px var(--font-display), Georgia, serif" }}
        >
          31%
        </text>
        <text
          x={S / 2}
          y={S / 2 + 30}
          textAnchor="middle"
          fill="var(--ink-3)"
          style={{ font: "500 7.4px var(--font-mono), monospace", letterSpacing: "0.2em" }}
        >
          REWRITTEN INSIDE 90 DAYS
        </text>
        <line x1={S / 2 - 52} y1={S / 2 - 52} x2={S / 2 + 52} y2={S / 2 - 52} stroke="var(--line-2)" strokeWidth="0.6" />
        <text
          x={S / 2}
          y={S / 2 - 62}
          textAnchor="middle"
          fill="var(--ink-3)"
          style={{ font: "500 7.4px var(--font-mono), monospace", letterSpacing: "0.2em" }}
        >
          AS REPORTED · AS IT ARRIVED
        </text>
      </svg>
    </div>
  );
}

/* --- the stamp -------------------------------------------------------------- */

/**
 * A rubber stamp impression. The craft is entirely in the failure: real stamps load unevenly,
 * so the ink is heavy on one edge and dry and broken on the other, and the impression never
 * lands square with the printing underneath. A clean, centred, evenly-inked stamp reads as a
 * sticker.
 */
export function Stamp({
  line,
  className = "",
  rotate = -4.5,
}: {
  line: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 340 104"
      className={`press ${className}`}
      style={{ ["--rot" as string]: `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <defs>
        {/* the dry-out: turbulence knocked through the alpha so the right side breaks up */}
        <filter id="stamp-dry" x="-15%" y="-40%" width="130%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feComponentTransfer in="n" result="mask">
            <feFuncA type="linear" slope="1.5" intercept="-0.28" />
          </feComponentTransfer>
          <feComposite in="d" in2="mask" operator="out" />
        </filter>
        <linearGradient id="stamp-load" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9c3f28" stopOpacity="1" />
          <stop offset="55%" stopColor="#9c3f28" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#9c3f28" stopOpacity="0.62" />
        </linearGradient>
      </defs>

      <g filter="url(#stamp-dry)" fill="none" stroke="url(#stamp-load)">
        <rect x="4" y="4" width="332" height="96" strokeWidth="4.5" />
        <rect x="13" y="13" width="314" height="78" strokeWidth="1.6" />
      </g>
      <text
        x="170"
        y="62"
        textAnchor="middle"
        fill="url(#stamp-load)"
        filter="url(#stamp-dry)"
        style={{ font: "700 25px var(--font-mono), monospace", letterSpacing: "0.12em" }}
      >
        {line}
      </text>
    </svg>
  );
}

/* --- furniture -------------------------------------------------------------- */

/** An engraved section rule: hairline with a centred lozenge and terminal ticks. */
export function EngravedRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 12" className={`w-full ${className}`} preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="6" x2="566" y2="6" stroke="var(--line-2)" strokeWidth="1" />
      <line x1="634" y1="6" x2="1200" y2="6" stroke="var(--line-2)" strokeWidth="1" />
      <path d="M600 1 L610 6 L600 11 L590 6 Z" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1="0.5" y1="1" x2="0.5" y2="11" stroke="var(--line-2)" strokeWidth="1" />
      <line x1="1199.5" y1="1" x2="1199.5" y2="11" stroke="var(--line-2)" strokeWidth="1" />
    </svg>
  );
}

/** Blind-deboss seal for the foot of the page: shadow only, no ink. */
export function Seal({ size = 132 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.55]">
        <Rosette size={size * 1.1} strokes={5} stroke="var(--ink-4)" opacity={0.55} />
      </div>
      <svg viewBox="0 0 132 132" className="relative h-full w-full">
        <defs>
          <path id="sealring" d="M66 66 m -47,0 a 47,47 0 1,1 94,0 a 47,47 0 1,1 -94,0" fill="none" />
        </defs>
        <circle cx="66" cy="66" r="52" fill="none" stroke="var(--line-2)" strokeWidth="1" />
        <circle cx="66" cy="66" r="48" fill="none" stroke="var(--line-2)" strokeWidth="0.5" />
        <text fill="var(--ink-4)" style={{ font: "500 7px var(--font-mono), monospace", letterSpacing: "0.26em" }}>
          <textPath href="#sealring" startOffset="2%">
            BEHOLD LABS · ISSUED MMXXVI ·
          </textPath>
        </text>
        <text x="66" y="74" textAnchor="middle" fill="var(--ink-3)" style={{ font: "400 27px var(--font-display), Georgia, serif" }}>
          BHL
        </text>
      </svg>
    </div>
  );
}
