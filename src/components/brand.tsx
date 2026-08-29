import Link from "next/link";

/*
 * Behold logomark — an aperture. Blades opening around a lit centre: the instrument
 * you look through, and a nod to the product's Observatory. Pure SVG so it stays crisp
 * at any size and needs no asset pipeline.
 */
export function Logomark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8.5" fill="#11141c" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" stroke="#2b3242" />
      <circle cx="16" cy="16" r="8.75" stroke="#394254" strokeWidth="1.15" />
      <path d="M16 7.5a8.5 8.5 0 0 1 7.36 4.25L16 16Z" fill="#e8a33d" fillOpacity="0.95" />
      <path d="M23.36 11.75A8.5 8.5 0 0 1 20.6 23.3L16 16Z" fill="#e8a33d" fillOpacity="0.5" />
      <path d="M20.6 23.3A8.5 8.5 0 0 1 8.64 20.25L16 16Z" fill="#34c9a4" fillOpacity="0.62" />
      <path d="M8.64 20.25A8.5 8.5 0 0 1 16 7.5L16 16Z" fill="#e8a33d" fillOpacity="0.3" />
      <circle cx="16" cy="16" r="3" fill="#090b10" />
      <circle cx="16" cy="16" r="1.7" fill="#f4b459" />
    </svg>
  );
}

export function Wordmark({ size = 30, href = "/" as string | null }) {
  const inner = (
    <span className="flex items-center gap-2.5">
      <Logomark size={size} />
      <span className="text-[1.0625rem] font-semibold tracking-tight text-text">
        Behold<span className="text-text-faint"> Labs</span>
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
