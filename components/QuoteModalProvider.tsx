"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface QuoteModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

/**
 * App-wide provider for the "Start a Project" popup modal. Wraps the
 * locale layout so any client component (Header CTA, Hero CTA, footer
 * links, etc.) can trigger the same modal instance via useQuoteModal(),
 * instead of navigating to a separate /quote page.
 */
export default function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <QuoteModalContext.Provider value={value}>{children}</QuoteModalContext.Provider>;
}

export function useQuoteModal(): QuoteModalContextValue {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) {
    throw new Error("useQuoteModal must be used within a QuoteModalProvider");
  }
  return ctx;
}
