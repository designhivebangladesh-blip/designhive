"use client";

import { Globe2, ShieldCheck, Gauge, Wrench, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeOnly, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion/variants";

interface Reason {
  icon: LucideIcon;
  title: string;
  description: string;
}

const REASONS: Reason[] = [
  {
    icon: Globe2,
    title: "Global delivery, real accountability",
    description:
      "We work with startups and businesses across North America, Europe, and Asia — async-first, with a founder directly on every account.",
  },
  {
    icon: Gauge,
    title: "SEO & performance by default",
    description:
      "Every build ships with Core Web Vitals, semantic HTML, and structured data baked in — not bolted on after launch.",
  },
  {
    icon: Wrench,
    title: "A CMS your team can actually use",
    description:
      "Sanity-powered content editing means your marketing team ships updates without waiting on a developer.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent process, fixed scope",
    description:
      "Clear milestones, fixed-scope proposals, and no surprise change orders — you always know what's next and why.",
  },
];

export default function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariant = prefersReducedMotion ? fadeOnly : fadeUp;

  return (
    <section
      id="why-us"
      aria-label="Why choose DesignHive"
      className="honeycomb-field relative bg-parchment py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={viewportOnce}
            variants={fadeOnly}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
              Why DesignHive
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Built for global startups and ambitious teams
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
              DesignHive is a UI/UX, web design, and Next.js development agency
              helping companies worldwide launch faster, rank higher on Google,
              and convert more visitors into customers.
            </p>
          </motion.div>

          <motion.ul
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={viewportOnce}
            variants={staggerContainer(0.08)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {REASONS.map((r) => {
              const Icon = r.icon;
              return (
                <motion.li
                  key={r.title}
                  variants={itemVariant}
                  className="hover-zoom flex flex-col gap-3 rounded-2xl border border-gold-400/25 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-ink">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/65">{r.description}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
