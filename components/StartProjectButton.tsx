"use client";

import { ArrowRight } from "lucide-react";
import { useQuoteModal } from "./QuoteModalProvider";

interface StartProjectButtonProps {
  label: string;
  className?: string;
}

/** Opens the global project-inquiry modal instead of navigating to a separate page. */
export default function StartProjectButton({ label, className }: StartProjectButtonProps) {
  const { open } = useQuoteModal();

  return (
    <button type="button" onClick={open} className={className}>
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </button>
  );
}
