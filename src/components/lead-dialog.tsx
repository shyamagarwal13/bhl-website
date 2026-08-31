"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HEARD_ABOUT, detailsSchema } from "@/lib/leads";

/*
 * The second step, shown after the pill has already banked the email.
 *
 * A native <dialog> opened with showModal(), so focus trapping, Escape, the top layer and
 * inertness of the page behind it come from the platform. Hand-rolled modals get the
 * first two wrong roughly always.
 *
 * Every field except the email is optional, and the dialog says so. The lead is already
 * saved by the time this opens: making people fill boxes to finish something that is
 * finished is how a captured lead becomes an abandoned one.
 */

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
};

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  half?: boolean;
};

const FIELDS: Field[] = [
  { name: "firstName", label: "First name", autoComplete: "given-name", half: true },
  { name: "lastName", label: "Last name", autoComplete: "family-name", half: true },
  { name: "jobTitle", label: "Job title", autoComplete: "organization-title", half: true },
  { name: "companyName", label: "Company", autoComplete: "organization", half: true },
  {
    name: "companyWebsite",
    label: "Company website",
    placeholder: "acme.com",
    autoComplete: "url",
    half: true,
  },
  { name: "personalWebsite", label: "Your website", placeholder: "optional", half: true },
];

// Always the light treatment, including when the pill that opened it sits on the dark CTA
// panel: a dark dialog over a dark panel loses its edges.
export function LeadDialog({ open, email, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  // Both pills on the page mount a dialog, so hardcoded ids appeared twice in the DOM
  // and `for` pointed at whichever input the parser saw first. useId namespaces them.
  const uid = useId();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heard, setHeard] = useState("");

  // showModal() must be called imperatively; the `open` attribute alone renders a
  // non-modal dialog with no focus trap and no backdrop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      // reset, or someone who sends once and then submits a second address is shown the
      // thank-you from the first round
      setDone(false);
      setError(null);
      el.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && el.open) {
      el.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape and the close button both fire `close`; route them through the same handler so
  // the parent's state cannot drift out of sync with the element's.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => {
      document.body.style.overflow = "";
      onClose();
    };
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const payload = {
      email,
      firstName: data.firstName,
      lastName: data.lastName,
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      personalWebsite: data.personalWebsite,
      companyWebsite: data.companyWebsite,
      heardAbout: data.heardAbout === "Other" ? data.heardAboutOther : data.heardAbout,
      website: data.website,
    };

    const parsed = detailsSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Check the fields and try again.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      // same split as the pill: the server's own words when it answered, the network
      // message only when it didn't
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(json?.error ?? `Something went wrong (${res.status}). Please try again.`);
        return;
      }
      setDone(true);
    } catch {
      setError("We couldn't save that. Email hello@beholdlabs.com and we'll pick it up.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[14px] text-ink placeholder:text-ink-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
  const label = "mb-1.5 block text-[12.5px] font-medium text-ink-2";

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${uid}-dialog-title`}
      /*
       * `m-auto` restores the centring the UA stylesheet gives a modal dialog — Tailwind's
       * preflight zeroes every margin, which pins it to the top-left corner.
       *
       * `text-left` because the dialog stays a child of whichever section holds its pill,
       * and both of those are `text-center`; the top layer changes paint order, not
       * inheritance, so every label was centred over its input.
       */
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100vw-2rem,640px)] rounded-3xl border border-line bg-white p-0 text-left text-ink shadow-[0_40px_100px_-30px_rgba(11,12,16,0.45)] backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      {/* the dialog is capped at the viewport height, so a short phone scrolls the body
          rather than clipping the Send button off the bottom */}
      <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-4 transition-colors hover:bg-paper hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        {done ? (
          <div className="py-6 text-center">
            <div className="mb-6 h-[3px] w-12 rounded-full bg-ink" />
            <h2 id={`${uid}-dialog-title`} className="h2 text-balance text-[1.6rem] sm:text-[1.9rem]">
              Thanks — that helps.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-3">
              We reply within a day, from a person who has read what you sent.
            </p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="mt-7 h-11 rounded-full bg-ink px-6 text-[13.5px] font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 h-[3px] w-12 rounded-full bg-ink" />
            <h2 id={`${uid}-dialog-title`} className="h2 text-balance text-[1.6rem] sm:text-[1.9rem]">
              Tell us a little more.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-3">
              You&apos;re on the list either way. This only decides who replies and what
              they&apos;ve looked at first. Every field is optional.
            </p>

            <form onSubmit={submit} className="mt-7">
              {/* honeypot: off-screen rather than display:none, which some bots skip */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor={`${uid}-website`}>Website</label>
                <input
                  id={`${uid}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                <label htmlFor={`${uid}-email`} className={label}>
                  Work email
                </label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  // controlled, not defaultValue: the dialog is never unmounted, so an
                  // uncontrolled input would keep showing the first address submitted
                  value={email}
                  readOnly
                  aria-describedby={`${uid}-email-note`}
                  className={`${input} cursor-default bg-paper text-ink-3`}
                />
                <p id={`${uid}-email-note`} className="mt-1.5 text-[12px] text-ink-4">
                  Already saved. Close this box and we still have it.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                    <label htmlFor={`${uid}-${f.name}`} className={label}>
                      {f.label}
                    </label>
                    <input
                      id={`${uid}-${f.name}`}
                      name={f.name}
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      autoComplete={f.autoComplete}
                      className={input}
                    />
                  </div>
                ))}

                <div className={heard === "Other" ? "" : "sm:col-span-2"}>
                  <label htmlFor={`${uid}-heardAbout`} className={label}>
                    How did you hear about us?
                  </label>
                  <select
                    id={`${uid}-heardAbout`}
                    name="heardAbout"
                    value={heard}
                    onChange={(e) => setHeard(e.target.value)}
                    className={`${input} appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%236b7280' stroke-width='1.8'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <option value="">Select one</option>
                    {HEARD_ABOUT.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {heard === "Other" && (
                  <div>
                    <label htmlFor={`${uid}-heardAboutOther`} className={label}>
                      Where, specifically?
                    </label>
                    <input
                      id={`${uid}-heardAboutOther`}
                      name="heardAboutOther"
                      type="text"
                      className={input}
                    />
                  </div>
                )}
              </div>

              {error && (
                <p role="alert" className="mt-5 text-[13.5px] font-medium text-neg">
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-col-reverse items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => ref.current?.close()}
                  className="text-[13.5px] font-medium text-ink-4 transition-colors hover:text-ink"
                >
                  Not now
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="h-11 w-full rounded-full bg-ink px-6 text-[13.5px] font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:ml-auto sm:w-auto"
                >
                  {busy ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
