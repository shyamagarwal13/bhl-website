/*
 * The measured row.
 *
 * All that survives of an earlier gradient "grade scale" plate, which the critique was right
 * to call a recoloured speedometer: it was the only saturated gradient object on the site and
 * it broke the flat-ink system on sight. What is left is the useful half — a ruled field with
 * graduations and a hatched fill, so a bar on this page looks like something measured on paper
 * rather than a progress component.
 */

/**
 * The grade scale at row size.
 *
 * The page previously carried four unrelated chart idioms — a gradient plate, a plain text
 * table, dot-matrix progress bars and bare numerals — which share no texture, no ticks and
 * no colour logic, so the data never cohered into a language. This is the plate's vocabulary
 * reduced to one line: the same hatching, the same graduations, the same pointer. Every
 * figure on the page now sits on one.
 */
export function Scale({
  value,
  tone = "var(--s5)",
  height = 34,
}: {
  /** 0–100 */
  value: number;
  tone?: string;
  height?: number;
}) {
  const W = 300;
  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`h${Math.round(value * 100)}`}
          width="4"
          height="4"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink)" strokeWidth="1.1" opacity="0.34" />
        </pattern>
      </defs>
      {/* ruled track: a hairline box rather than a grey capsule, so it reads as a measured
          field on paper instead of as a progress component */}
      <rect
        x="0.5"
        y="2.5"
        width={W - 1}
        height={height - 11}
        fill="none"
        stroke="var(--line-2)"
        strokeWidth="1"
      />
      <rect x="1" y="3" width={(value / 100) * (W - 2)} height={height - 12} fill={tone} />
      <rect
        x="1"
        y="3"
        width={(value / 100) * (W - 2)}
        height={height - 12}
        fill={`url(#h${Math.round(value * 100)})`}
      />
      {/* graduations every ten, so a row is readable without an axis label */}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={i}
          x1={(i / 10) * W}
          y1={height - 7}
          x2={(i / 10) * W}
          y2={height - (i % 5 === 0 ? 0 : 3)}
          stroke="var(--line-2)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
