/*
 * Infinite marquee.
 *
 * The track holds two identical copies and translates by exactly -50%, so the loop point
 * lands where the second copy is pixel-aligned with the first — no jump. Duplicated
 * content is hidden from assistive tech so the list isn't read twice.
 */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        // Fade at both ends rather than a hard cut, so items enter and leave the light.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max gap-12">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center gap-12"
            aria-hidden={copy === 1}
          >
            {items.map((n) => (
              <li key={n} className="whitespace-nowrap text-[15px] font-bold text-ink-4">
                {n}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
