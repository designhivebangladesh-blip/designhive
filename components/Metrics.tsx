"use client";

import { Sparkles, Rocket, Users, Award, TrendingUp, Star, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { StatBadgeResult } from "@/sanity/lib/queries";
import { fadeOnly, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion/variants";

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  rocket: Rocket,
  users: Users,
  award: Award,
  "trending-up": TrendingUp,
  star: Star,
};

const FALLBACK_METRICS: StatBadgeResult[] = [
  { icon: "trending-up", value: "98%", label: "Client satisfaction score" },
  { icon: "rocket", value: "250+", label: "Digital products launched" },
  { icon: "users", value: "20+", label: "Countries served worldwide" },
  { icon: "award", value: "10+", label: "Years crafting digital growth" },
];

interface MetricsProps {
  metrics?: StatBadgeResult[];
  eyebrow?: string;
  title?: string;
}

export default function Metrics({
  metrics,
  eyebrow = "Results That Speak",
  title = "Measurable impact for global brands",
}: MetricsProps) {
  const prefersReducedMotion = useReducedMotion();
  const items = metrics?.length ? metrics.slice(0, 4) : FALLBACK_METRICS;
  const itemVariant = prefersReducedMotion ? fadeOnly : fadeUp;

  return (
    <section aria-label="Results metrics" className="relative overflow-hidden bg-ink py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={fadeOnly}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-400">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
            {title}
          </h2>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4"
        >
          {items.map((metric, i) => {
            const Icon = ICON_MAP[metric.icon] ?? Sparkles;
            return (
              <motion.div
                key={`${metric.label}-${i}`}
                variants={itemVariant}
                className="hover-zoom flex flex-col items-center gap-3 rounded-2xl border border-gold-400/15 bg-ink-soft/70 px-5 py-8 text-center backdrop-blur-sm sm:py-10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-ink">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl font-bold tracking-tight text-parchment sm:text-4xl">
                  {metric.value}
                </span>
                <span className="text-xs leading-snug text-parchment/60 sm:text-sm">
                  {metric.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
