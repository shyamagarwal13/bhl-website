import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

// Statements only — headlines and section openers. Single weight by design.
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Anything that behaves like an instrument reading: labels, metrics, deltas.
const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

const title = "Behold Labs — See what your AI engineering investment is actually doing";
const description =
  "Behold Labs connects AI spend to engineering output. Measure cost per merged pull request, agent adoption, developer experience, and delivery impact — in one instrument panel.";

export const metadata: Metadata = {
  metadataBase: new URL("https://beholdlabs.com"),
  title: {
    default: title,
    template: "%s — Behold Labs",
  },
  description,
  keywords: [
    "AI spend monitoring",
    "engineering intelligence",
    "developer productivity",
    "developer experience",
    "AI ROI",
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
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
