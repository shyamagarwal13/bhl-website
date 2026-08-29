import Link from "next/link";

/*
 * Behold logomark — an aperture. Blades opening around a lit centre: the instrument you
 * look through. Pure SVG, so it stays crisp at any size and needs no asset pipeline.
 * `tone` lets it sit on the gradient (white) or on paper (full colour).
 */
export function Logomark({ size = 28, tone = "color" }: { size?: number; tone?: "color" | "white" }) {
  if (tone === "white") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="12" fill="#fff" fillOpacity="0.16" />
        <path d="M16 5.5a10.5 10.5 0 0 1 9.09 5.25L16 16Z" fill="#fff" fillOpacity="0.95" />
        <path d="M25.09 10.75A10.5 10.5 0 0 1 21.7 25.05L16 16Z" fill="#fff" fillOpacity="0.62" />
        <path d="M21.7 25.05A10.5 10.5 0 0 1 6.9 21.3L16 16Z" fill="#fff" fillOpacity="0.4" />
        <circle cx="16" cy="16" r="3.4" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#4f3ddb" fillOpacity="0.08" />
      <path d="M16 5.5a10.5 10.5 0 0 1 9.09 5.25L16 16Z" fill="#4f3ddb" />
      <path d="M25.09 10.75A10.5 10.5 0 0 1 21.7 25.05L16 16Z" fill="#8b5cf6" />
      <path d="M21.7 25.05A10.5 10.5 0 0 1 6.9 21.3L16 16Z" fill="#f0568f" />
      <path d="M6.9 21.3A10.5 10.5 0 0 1 16 5.5L16 16Z" fill="#ffb020" fillOpacity="0.9" />
      <circle cx="16" cy="16" r="3.4" fill="#fff" />
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
