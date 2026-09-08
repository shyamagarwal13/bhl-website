/*
 * The app frame, shared by the hero shot and the showcase.
 *
 * One window chrome, one sidebar, one panel card. The hero and the showcase used to draw
 * these separately, which meant the "screenshot" at the top of the page and the
 * "screenshots" halfway down were subtly different products. Sharing the frame is what
 * makes five panes read as five views of one application rather than five charts.
 *
 * Built in HTML and SVG rather than captured: sharp on any display, themed with the brand
 * tokens, weighs nothing next to a 2× PNG, and cannot drift out of date the way a
 * screenshot of a shipping product does. All figures are illustrative sample data.
 */

export const NAV = [
  "Overview",
  "AI Spend",
  "Delivery",
  "DevEx",
  "Code health",
  "Routing",
  "Custom",
] as const;

export function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold ${
        active ? "bg-s1/10 text-s1" : "text-ink-4"
      }`}
    >
      {label}
    </span>
  );
}

export function Panel({
  title,
  meta,
  value,
  sub,
  subBad,
  children,
  className = "",
}: {
  title: string;
  meta?: string;
  value?: string;
  sub?: string;
  subBad?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line bg-white p-3 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-ink-2">{title}</span>
        {meta && <span className="shrink-0 font-mono text-[9px] text-ink-4">{meta}</span>}
      </div>
      {value && (
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="tabular text-[19px] font-extrabold tracking-tight text-ink">
            {value}
          </span>
          {sub && (
            <span className={`font-mono text-[10px] ${subBad ? "text-neg" : "text-pos"}`}>
              {sub}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function AppWindow({
  url,
  active,
  tabs,
  action = "Export",
  children,
}: {
  url: string;
  /** which sidebar entry is lit; must be a member of NAV */
  active: string;
  tabs: string[];
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white lift-lg sm:rounded-2xl">
      <div className="flex items-center gap-2 border-b border-line bg-paper px-3 py-2 sm:px-4">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
        </span>
        <span className="ml-2 hidden truncate rounded-md bg-white px-2.5 py-1 font-mono text-[10px] text-ink-4 sm:block">
          {url}
        </span>
      </div>

      <div className="flex">
        {/* Hidden below lg. At tablet width the sidebar takes a third of the frame and the
            charts stop being legible, which defeats the point of showing them. */}
        <aside className="hidden w-[132px] shrink-0 border-r border-line bg-paper/60 p-3 lg:block">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-4 w-4 rounded bg-ink" />
            <span className="text-[11px] font-bold tracking-tight text-ink">Behold</span>
          </div>
          {NAV.map((n) => (
            <div
              key={n}
              className={`mb-0.5 rounded-md px-2 py-1.5 text-[11px] ${
                n === active ? "bg-white font-semibold text-s1 lift" : "text-ink-3"
              }`}
            >
              {n}
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 bg-paper/40 p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-1.5 overflow-hidden">
            {tabs.map((t, i) => (
              <Tab key={t} label={t} active={i === 0} />
            ))}
            <span className="ml-auto hidden shrink-0 rounded-md bg-s1 px-2.5 py-1 text-[10px] font-semibold text-white sm:block">
              {action}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
