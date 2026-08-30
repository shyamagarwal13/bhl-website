import Link from "next/link";

/*
 * BHL monogram.
 *
 * Drawn as geometry rather than set in a typeface: a logo that depends on a webfont
 * flashes, falls back, and can't be trusted at favicon size.
 *
 * Monochrome by intent. A mark that needs colour to be recognisable isn't a mark — it
 * has to survive one ink, an embroidered shirt, a fax of a contract. Colour stays where
 * it carries meaning (equation terms, chart series, severity), not on the identity.
 *
 * Proportions: cap 42, stem 7.5 (~18%). Corners are square rather than rounded — the
 * precision reads as instrument, and rounding at this weight reads as a toy. The waist
 * of the B and the crossbar of the H sit slightly above true centre, which is the
 * standard optical correction; sitting them at exact centre makes a letter look
 * bottom-heavy.
 */

const CAP = 42;
const W = 92.5;

/*
 * B is a drawn letter, not stacked rectangles: two bowls on true arcs, the lower one
 * larger, with a waist slightly lighter than the arms. Squared bowls read as pixel art
 * at large sizes — the difference between a constructed monogram and a designed one.
 * H and L stay orthogonal, since they have no curves to draw, and their crossbar and
 * foot align to the B's waist and baseline so the three sit on one system.
 *
 * Sidebearings are optical, not metric. B|H is curve-to-stem: the bowl recedes above and
 * below its widest point, trapping white that a flat edge wouldn't, so that pair is set
 * 5.5 units apart against 8 for the stem-to-stem H|L. Equal numbers there looked like a
 * gap after the B.
 */
const B_PATH =
  // outer silhouette, then the two counters (evenodd knocks them out)
  "M0 0 H16.75 A8.25 8.25 0 0 1 16.75 16.5 H17.25 A12.75 12.75 0 0 1 17.25 42 H0 Z " +
  "M7.5 7.5 H16.75 A3 3 0 0 1 16.75 13.5 H7.5 Z " +
  "M7.5 19.5 H17.25 A7.5 7.5 0 0 1 17.25 34.5 H7.5 Z";

function Letters({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <path d={B_PATH} fillRule="evenodd" />
      {/* H — crossbar centered on the B's waist */}
      <rect x="35.5" y="0" width="7.5" height={CAP} />
      <rect x="54.5" y="0" width="7.5" height={CAP} />
      <rect x="43" y="12.75" width="11.5" height="7.5" />
      {/* L — foot on the B's baseline */}
      <rect x="70" y="0" width="7.5" height={CAP} />
      <rect x="70" y="34.5" width="22.5" height="7.5" />
    </g>
  );
}

/** The horizontal mark. */
export function Logomark({
  size = 26,
  tone = "ink",
}: {
  size?: number;
  tone?: "ink" | "white";
}) {
  return (
    <svg
      width={(size * W) / CAP}
      height={size}
      viewBox={`0 0 ${W} ${CAP}`}
      fill="none"
      role="img"
      aria-label="BHL"
    >
      <Letters fill={tone === "white" ? "#ffffff" : "var(--ink)"} />
    </svg>
  );
}

/**
 * Square tile for favicons and app icons — its own composition, because the wide
 * horizontal mark disappears when squeezed into a square.
 */
export function LogoTile({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label="BHL">
      <rect width="100" height="100" rx="22" fill="var(--ink)" />
      <g transform="translate(17 35) scale(0.72)">
        <Letters fill="#ffffff" />
      </g>
    </svg>
  );
}

/** Nav / footer lockup: the mark, with the full name set beside it. */
export function Wordmark({
  size = 22,
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
        className={`h-5 w-px shrink-0 ${tone === "white" ? "bg-white/25" : "bg-line-2"}`}
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
