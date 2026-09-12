import { Reveal } from "./reveal";

/*
 * The opening of every section.
 *
 * Replaces a floating 12px stub rule that every section carried. A stub is a decoration:
 * it marks that something is starting without saying anything. This is structure — a
 * hairline across the full measure with a label sitting on it, the way a specimen is
 * labelled on a bench or a plate is captioned in a technical monograph.
 *
 * The label is the section's job in two or three words, set in mono because mono is this
 * page's voice for anything that behaves like an instrument reading. The heading below it
 * is the engraved serif, and the two are deliberately far apart in character: the label is
 * the apparatus, the heading is the finding.
 */
export function SectionHead({
  label,
  title,
  lead,
  width = "narrow",
}: {
  /** Optional. Most sections do without: a mono caption above every heading became
      wallpaper, and none of them told the reader anything the heading did not. */
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** how far the heading is allowed to run before it wraps */
  width?: "narrow" | "wide";
}) {
  return (
    <Reveal>
      <div>
        {/* rule and label span the whole measure; the heading below is constrained, which
            is what produces the stepped, opening-out feel as you descend the page */}
        {label ? (
          <div className="flex items-baseline gap-5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
              {label}
            </span>
            <span className="rule mb-1 flex-1" />
          </div>
        ) : (
          <span className="rule block" />
        )}

        <h2
          className={`h2 mt-8 text-balance text-[2.1rem] sm:text-[2.7rem] ${
            width === "wide" ? "max-w-4xl" : "max-w-2xl"
          }`}
        >
          {title}
        </h2>

        {lead && (
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-3">{lead}</p>
        )}
      </div>
    </Reveal>
  );
}
