# Behold Labs — website

Marketing site for Behold Labs. Next.js 16 (App Router) + Tailwind v4, deployed on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
```

## Design

Single-theme by intent. The name is about seeing clearly and the product is an instrument
panel, so the site reads as one: a dark observatory ground with two signal colours doing
distinct jobs — warm gold for insight, teal for data and positive movement. Tokens live in
`src/app/globals.css` and are inherited from the product's own palette so the site and the
app feel like one company.

Type is a designed pair: **Instrument Serif** for statements, **Instrument Sans** for the
work, **JetBrains Mono** for anything that behaves like an instrument reading.

## Structure

```
src/app/page.tsx          all sections, composed
src/app/layout.tsx        fonts + metadata
src/components/viz.tsx    the product visuals
src/components/nav.tsx    header (the only stateful component besides the form)
src/components/demo-form.tsx
```

`viz.tsx` deserves a note: the product imagery is **drawn, not screenshotted**. Real SVG
and CSS charts built from real arrays — they scale, they theme, they cost no image
bandwidth, and they can't go stale the way a screenshot of a shipping product does. The
numbers in them are illustrative sample data, chosen to be plausible rather than
flattering.

Two things there are load-bearing and easy to break:

- Charts sharing an axis take an explicit `domain`. Letting each series normalise to its
  own min/max makes their relative position meaningless — the wrong kind of chart for a
  company that sells measurement.
- Bar heights are in pixels, not percentages. A percentage height on a flex child whose
  parent has no resolved height collapses to zero and silently empties the chart.

## Content honesty

There are deliberately **no customer logos and no testimonials** — we don't have permission
for any yet, and inventing them is the fastest way to lose a technical buyer. The hero
strip lists integrations, which is a true statement. `SOC 2 Type II in progress` is
likewise accurate; update it when it isn't.

## Wiring left to do

- **Demo form** composes a `mailto:` draft so it works with no backend. Swap the submit
  handler in `demo-form.tsx` for a POST when there's a CRM; the markup won't change.
- **Domain** — `metadataBase` in `layout.tsx` assumes `beholdlabs.com`.
- **Legal** — Privacy and Terms in the footer are placeholders.
- **Sign in** points at `#demo` until the app has a public login URL.
