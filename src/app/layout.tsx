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

const title = "Behold: AI agents that tell engineering leaders what's actually working";
const description =
  "Existing dashboards measure what you shipped, which is just more AI slop. Behold's agents learn how your team works, measure value-oriented metrics, and run causal, science-backed analysis on your own data, so every answer comes with what to change. Built by Carnegie Mellon researchers.";

export const metadata: Metadata = {
  metadataBase: new URL("https://beholdlabs.dev"),
  title: {
    default: title,
    template: "%s · Behold",
  },
  description,
  keywords: [
    "AI impact measurement",
    "engineering intelligence",
    "AI coding ROI",
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
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
