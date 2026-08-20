"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import QuoteForm from "./QuoteForm";
import { useQuoteModal } from "./QuoteModalProvider";

/**
 * Popup modal for the "Start Project" CTA. Renders the simplified
 * inquiry form without ever navigating away from the current page.
 * - Backdrop blur
 * - ESC key closes
 * - Click outside closes
 * - Focus trapped while open, focus restored on close
 * - Mobile-friendly width: calc(100vw - 2rem)
 */
export default function ProjectInquiryModal() {
  const { isOpen, close } = useQuoteModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portals need a real document, so only render one after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [isOpen, close]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            aria-hidden="true"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-inquiry-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold-400/25 bg-ink p-6 shadow-gold-lg sm:p-8"
            style={{ width: "min(32rem, calc(100vw - 2rem))" }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="project-inquiry-title" className="font-display text-2xl font-semibold text-parchment">
                  Start Your Project
                </h2>
                <p className="mt-1 text-sm text-parchment/50">
                  Tell us the basics — we&apos;ll follow up within one business day.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/25 text-parchment/70 transition-colors hover:border-gold-400/50 hover:text-gold-300"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <QuoteForm compact onSuccess={() => setTimeout(close, 1800)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
