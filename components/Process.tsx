"use client";

import { Search, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeOnly, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion/variants";

interface ProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const STEPS: ProcessStep[] = [
  {
    icon: Search,
    step: "01",
    title: "Discover & Audit",
    description:
      "We start with a deep audit of your brand, market, and competitors — plus a free website/SEO health check to find quick wins.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design & Prototype",
    description:
      "Wireframes, UX flows, and high-fidelity UI in Figma. You review and approve every screen before a line of code is written.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Build & Integrate",
    description:
      "Production-grade Next.js and Sanity CMS development — fast, accessible, SEO-structured, and fully editable by your team.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Launch & Grow",
    description:
      "We ship, monitor Core Web Vitals, and hand off with documentation — plus optional ongoing retainer support as you scale.",
  },
];

export default function Process() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariant = prefersReducedMotion ? fadeOnly : fadeUp;

  return (
    <section
      id="process"
      aria-label="Our process"
      className="honeycomb-outline relative overflow-hidden bg-ink py-28 text-parchment lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/4 h-[30rem] w-[30rem] rounded-full bg-gold-500/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={fadeOnly}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-400">
            How We Work
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            A proven process, built for global teams
          </h2>
          <p className="mt-4 text-base leading-relaxed text-parchment/70 sm:text-lg">
            From first audit to launch and beyond, every DesignHive engagement follows
            the same transparent, four-stage process — no matter your time zone.
          </p>
        </motion.div>

        <motion.ol
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.step}
                variants={itemVariant}
                className="hover-zoom relative flex flex-col gap-4 rounded-2xl border border-gold-400/20 bg-ink-soft/70 p-7 backdrop-blur-sm"
              >
                <span className="font-mono text-xs font-semibold text-gold-400/60">
                  {s.step}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient text-ink">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-semibold text-parchment">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-parchment/60">
                  {s.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
