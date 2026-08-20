import type { Variants } from "framer-motion";

/**
 * Shared, reusable Framer Motion variants for scroll-reveal animations
 * across the site. Kept subtle (small translate + fade) per the design
 * system's animation rules — no heavy continuous motion. Consumers pass
 * these to `whileInView` with `viewport={{ once: true, margin: "-80px" }}`.
 *
 * Reduced-motion handling: components should read `useReducedMotion()`
 * (from framer-motion) and pass `reducedMotion ? fadeOnly : fadeUp` so
 * users who've asked for less motion still get a content reveal without
 * any transform.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

/** Wraps a list of children with a small stagger between each. */
export function staggerContainer(staggerAmount = 0.08): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerAmount },
    },
  };
}

export const viewportOnce = { once: true, margin: "-80px" } as const;
