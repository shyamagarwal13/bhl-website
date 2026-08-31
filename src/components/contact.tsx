"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LeadDialog } from "./lead-dialog";

/*
 * One contact dialog for the whole page.
 *
 * Previously each pill mounted its own, which meant two copies in the DOM and no way for
 * anything outside a pill — the nav button, say — to open one. A single instance behind a
 * context fixes both.
 *
 * Two ways in, and the difference matters:
 *
 *   openContact(email)  the pill already posted that address, so the dialog shows it
 *                       locked and only collects the rest.
 *   openContact()       the nav button, where nothing has been captured yet. The email
 *                       field is editable and required, and submitting is what creates
 *                       the lead. The PATCH handler already upserts, so this needs no
 *                       server change.
 */

type Open = (email?: string) => void;

const ContactContext = createContext<Open | null>(null);

export function useContact(): Open {
  const open = useContext(ContactContext);
  if (!open) throw new Error("useContact must be used inside <ContactProvider>");
  return open;
}

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; email: string; locked: boolean }>({
    open: false,
    email: "",
    locked: false,
  });

  const openContact = useCallback<Open>((email) => {
    setState({ open: true, email: email ?? "", locked: Boolean(email) });
  }, []);

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  // the provider re-renders on every open/close; without this the callback identity
  // changes and every consumer re-renders with it
  const value = useMemo(() => openContact, [openContact]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      <LeadDialog open={state.open} email={state.email} locked={state.locked} onClose={close} />
    </ContactContext.Provider>
  );
}
