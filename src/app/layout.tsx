import type { Metadata } from "next";
import { Archivo, Caveat, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ContactProvider } from "@/components/contact";
import "./globals.css";

/*
 * Three voices, and they are meant to disagree.
 *
 * One family doing everything is what made the old page read as competent and anonymous:
 * a single grotesque at 800 says "software company" and nothing else. The argument here is
 * that measurement is an instrument rather than a dashboard, so the display face is an
 * engraved high-contrast serif — the lettering of a plate, a scale, a scientific
 * instrument — set against a plain working grotesque that carries the reading.
 */
const display = Instrument_Serif({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// The working voice. Archivo is a grotesque with square-ish counters that holds its shape
// at 13px in a dense table, which is most of what this site is.
const sans = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Margin notes only — the one voice on the page that isn't the company talking.
// Used sparingly; a handwriting face doing real work reads as a greetings card.
const hand = Caveat({
  variable: "--font-hand-face",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

// Eyebrows, metrics, deltas — anything that behaves like an instrument reading.
const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

const title = "Behold — creativity is the new productivity";
const description =
  "Every dashboard says you shipped more. Behold measures the judgment behind the work: what plausible-looking output costs after it merges, and where a person is still the most valuable thing in the room. Engineering and token intelligence, routing, review and agent observability included.";

export const metadata: Metadata = {
  metadataBase: new URL("https://beholdlabs.com"),
  title: {
    default: title,
    template: "%s — Behold",
  },
  description,
  keywords: [
    "AI slop",
    "engineering intelligence",
    "AI code quality",
    "developer productivity",
    "AI spend monitoring",
    "agent observability",
    "model routing",
    "software engineering metrics",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Behold Labs",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} ${hand.variable}`}
    >
      <body className="min-h-screen">
        {/* holds the single contact dialog, so the nav can open it without a pill */}
        {/* Filter primitives referenced by globals.css. Zero-size and hidden so they cost
            no layout; they must live in the document for url(#id) to resolve. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <filter id="ink-bleed" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0.55" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
