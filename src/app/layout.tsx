import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ContactProvider } from "@/components/contact";
import "./globals.css";

// One family doing display and text. Jakarta has enough character at 800 to carry a
// headline and stays quiet at 400, which keeps the page from feeling assembled.
const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`}>
      <body className="min-h-screen">
        {/* holds the single contact dialog, so the nav can open it without a pill */}
        <ContactProvider>{children}</ContactProvider>
      </body>
    </html>
  );
}
