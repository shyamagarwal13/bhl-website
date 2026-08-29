import { Wordmark } from "./brand";

const COLUMNS = [
  {
    h: "Platform",
    links: [
      { l: "AI spend intelligence", href: "#platform" },
      { l: "Engineering output", href: "#platform" },
      { l: "Developer experience", href: "#platform" },
      { l: "Code health", href: "#platform" },
    ],
  },
  {
    h: "Product",
    links: [
      { l: "How it works", href: "#how" },
      { l: "Integrations", href: "#integrations" },
      { l: "Security", href: "#security" },
      { l: "Request a demo", href: "#demo" },
    ],
  },
  {
    h: "Company",
    links: [
      { l: "About", href: "#" },
      { l: "Careers", href: "#" },
      { l: "Contact", href: "mailto:hello@beholdlabs.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-[var(--maxw)] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark tone="white" />
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/50">
              The intelligence layer for AI-native engineering. See what your AI investment is
              actually doing.
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.h}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                {c.h}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.l}>
                    <a
                      href={l.href}
                      className="text-[13.5px] text-white/65 transition-colors hover:text-white"
                    >
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Behold Labs. All rights reserved.
          </p>
          <div className="flex gap-6 sm:ml-auto">
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">
              Terms
            </a>
            <a
              href="mailto:hello@beholdlabs.com"
              className="text-xs text-white/40 transition-colors hover:text-white/70"
            >
              hello@beholdlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
