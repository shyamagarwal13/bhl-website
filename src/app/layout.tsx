import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// One family doing display and text. Jakarta has enough character at 800 to carry a
// headline and stays quiet at 400, which keeps the page from feeling assembled.
const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

// Eyebrows, metrics, deltas — anything that behaves like an instrument reading.
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
