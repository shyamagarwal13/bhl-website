import Link from "next/link";

/*
 * Behold logomark — a prism aperture.
 *
 * Blades opening around a lit centre, each blade carrying one band of the spectrum:
 * the instrument you look through, and the thing it does (one beam in, measurable
 * bands out). Pure SVG, so it stays crisp at any size and needs no asset pipeline.
 */
export function Logomark({ size = 28, tone = "color" }: { size?: number; tone?: "color" | "white" }) {
  const bands =
    tone === "white"
      ? ["#fff", "#fff", "#fff", "#fff"]
      : ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)"];
  const op = tone === "white" ? [0.95, 0.7, 0.5, 0.32] : [1, 1, 1, 0.95];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5.5a10.5 10.5 0 0 1 9.09 5.25L16 16Z" fill={bands[0]} fillOpacity={op[0]} />
      <path d="M25.09 10.75A10.5 10.5 0 0 1 21.7 25.05L16 16Z" fill={bands[1]} fillOpacity={op[1]} />
      <path d="M21.7 25.05A10.5 10.5 0 0 1 6.9 21.3L16 16Z" fill={bands[2]} fillOpacity={op[2]} />
      <path d="M6.9 21.3A10.5 10.5 0 0 1 16 5.5L16 16Z" fill={bands[3]} fillOpacity={op[3]} />
      <circle cx="16" cy="16" r="3.2" fill={tone === "white" ? "#fff" : "var(--white)"} />
    </svg>
  );
}

export function Wordmark({
  size = 28,
  tone = "color",
  href = "/" as string | null,
}: {
  size?: number;
  tone?: "color" | "white";
  href?: string | null;
}) {
  const inner = (
    <span className="flex items-center gap-2">
      <Logomark size={size} tone={tone} />
      <span
        className={`text-[1.0625rem] font-extrabold tracking-tight ${
          tone === "white" ? "text-white" : "text-ink"
        }`}
      >
        Behold
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
