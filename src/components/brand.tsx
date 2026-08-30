import Link from "next/link";

/*
 * BHL monogram.
 *
 * Drawn as geometry rather than set in a typeface: a logo that depends on a webfont
 * flashes or falls back, and can't be trusted at favicon size. These are blocky, squared
 * letterforms built on a single 8-unit stem module — the same instrument-panel register
 * as the rest of the identity, and it makes the four vertical stems of B-H-L line up as
 * a rhythm, which is what the spectrum rule underneath answers to.
 *
 * Geometry: stem 8, cap height 42, letters on an 8-unit rhythm. The B's lower bowl is
 * deliberately wider than the upper one — with equal bowls a squared B reads as an 8,
 * which is the classic failure of a geometric monogram and exactly what the first cut
 * of this did.
 */

const CAP = 42;
const W = 98;
const BANDS = ["--s1", "--s2", "--s3", "--s4", "--s5"];

function Letters({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      {/* B — stem, three arms, and two bowls of deliberately different width */}
      <rect x="0" y="0" width="8" height={CAP} rx="1" />
      <rect x="0" y="0" width="25" height="8" rx="1" />
      <rect x="17" y="0" width="8" height="17" rx="1" />
      <rect x="0" y="17" width="30" height="8" rx="1" />
      <rect x="22" y="25" width="8" height="17" rx="1" />
      <rect x="0" y="34" width="30" height="8" rx="1" />
      {/* H — two stems, one crossbar on the same waistline as the B */}
      <rect x="38" y="0" width="8" height={CAP} rx="1" />
      <rect x="58" y="0" width="8" height={CAP} rx="1" />
      <rect x="46" y="17" width="12" height="8" rx="1" />
      {/* L — stem and foot, sharing the B's baseline arm */}
      <rect x="74" y="0" width="8" height={CAP} rx="1" />
      <rect x="74" y="34" width="24" height="8" rx="1" />
    </g>
  );
}

/**
 * The mark: BHL over the spectrum rule. `rule={false}` drops the spectrum for anywhere
 * too small to resolve five bands.
 */
export function Logomark({
  size = 30,
  tone = "ink",
  rule = true,
}: {
  size?: number;
  tone?: "ink" | "white";
  rule?: boolean;
}) {
  const fill = tone === "white" ? "#ffffff" : "var(--ink)";
  const h = rule ? 56 : CAP;
  return (
    <svg
      width={(size * W) / h}
      height={size}
      viewBox={`0 0 ${W} ${h}`}
      fill="none"
      role="img"
      aria-label="BHL"
    >
      <Letters fill={fill} />
      {rule &&
        BANDS.map((c, i) => (
          <rect
            key={c}
            x={i * (W / 5)}
            y="49"
            width={W / 5}
            height="6"
            rx="1"
            fill={`var(${c})`}
          />
        ))}
    </svg>
  );
}

/**
 * Square tile for favicons and app icons. The full mark is a wide horizontal lockup and
 * vanishes when squeezed into a square, so the tile is its own composition: letters
 * centered on ink with the spectrum along the bottom, where it still resolves at 32px.
 */
export function LogoTile({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="BHL">
      <rect width="100" height="100" rx="22" fill="var(--ink)" />
      <g transform="translate(12 30) scale(0.78)">
        <Letters fill="#ffffff" />
      </g>
      {BANDS.map((c, i) => (
        <rect key={c} x={12 + i * 15.3} y="72" width="15.3" height="5.5" rx="1" fill={`var(${c})`} />
      ))}
    </svg>
  );
}

/** Nav / footer lockup: the mark, with the full name set beside it. */
export function Wordmark({
  size = 26,
  tone = "ink",
  href = "/" as string | null,
}: {
  size?: number;
  tone?: "ink" | "white";
  href?: string | null;
}) {
  const inner = (
    <span className="flex items-center gap-3">
      <Logomark size={size} tone={tone} />
      <span
        className={`h-6 w-px shrink-0 ${tone === "white" ? "bg-white/25" : "bg-line-2"}`}
        aria-hidden="true"
      />
      <span
        className={`whitespace-nowrap text-[0.9375rem] font-semibold tracking-tight ${
          tone === "white" ? "text-white/70" : "text-ink-2"
        }`}
      >
        Behold Labs
      </span>
    </span>
  );
  return href ? (
    <Link href={href} className="inline-flex" aria-label="Behold Labs — home">
      {inner}
    </Link>
  ) : (
    inner
  );
}
