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
      { l: "Book a demo", href: "#demo" },
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
    <footer className="border-t border-hairline bg-ink">
      <div className="mx-auto max-w-[var(--maxw)] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Engineering intelligence for AI-native teams. See what your AI investment is
              actually doing.
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.h}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
                {c.h}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.l}>
                    <a
                      href={l.href}
                      className="text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-text-faint">
            © {new Date().getFullYear()} Behold Labs. All rights reserved.
          </p>
          <div className="flex gap-6 sm:ml-auto">
            <a href="#" className="text-xs text-text-faint transition-colors hover:text-text-muted">
              Privacy
            </a>
            <a href="#" className="text-xs text-text-faint transition-colors hover:text-text-muted">
              Terms
            </a>
            <a
              href="mailto:hello@beholdlabs.com"
              className="text-xs text-text-faint transition-colors hover:text-text-muted"
            >
              hello@beholdlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
