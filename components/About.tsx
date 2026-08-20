import { Target, Zap, ShieldCheck, Sparkles, Layers, Globe, ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { AboutSectionResult, FeatureCardResult } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  zap: Zap,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  layers: Layers,
  globe: Globe,
};

const FALLBACK_ABOUT = {
  eyebrow: "About Designhive",
  headlineLine: "Where vision meets",
  headlineHighlight: "digital mastery",
  body: "Designhive is a premier full-service digital studio based in Dhaka, Bangladesh. We partner with ambitious brands worldwide to craft unforgettable web experiences, bespoke brand identities, and high-impact digital products.",
  cta: { label: "Start a Conversation", href: "#contact" },
  featureCards: [
    {
      icon: "target",
      title: "Strategic Precision",
      description:
        "We fuse data-driven user insights with striking visual aesthetics to build digital platforms that drive measurable outcomes and market impact.",
    },
    {
      icon: "zap",
      title: "High-Performance Craft",
      description:
        "Engineered with cutting-edge web technologies, micro-interactions, and pixel-perfect responsiveness for lightning-fast digital experiences.",
    },
    {
      icon: "shield-check",
      title: "Uncompromised Quality",
      description:
        "Every animation, layout line, and typography pairing undergoes rigorous quality assurance to deliver flawless digital excellence.",
    },
  ] as FeatureCardResult[],
};

interface AboutProps {
  data?: AboutSectionResult;
}

export default function About({ data }: AboutProps) {
  const eyebrow = data?.eyebrow || FALLBACK_ABOUT.eyebrow;
  const headlineLine = data?.headlineLine || FALLBACK_ABOUT.headlineLine;
  const headlineHighlight = data?.headlineHighlight || FALLBACK_ABOUT.headlineHighlight;
  const body = data?.body || FALLBACK_ABOUT.body;
  const ctaLabel = data?.cta?.label || FALLBACK_ABOUT.cta.label;
  const ctaHref = data?.cta?.href || FALLBACK_ABOUT.cta.href;
  const featureCards = data?.featureCards?.length ? data.featureCards : FALLBACK_ABOUT.featureCards;

  return (
    <section
      id="about"
      className="honeycomb-outline relative overflow-hidden bg-ink py-28 text-parchment lg:py-36"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute left-[-10%] top-1/3 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10%] bottom-10 h-[28rem] w-[28rem] rounded-full bg-gold-300/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Top Header & Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="hover-zoom-sm inline-flex items-center gap-2 rounded-full border border-gold-400/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
            {eyebrow}
          </span>

          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {headlineLine} <span className="text-shimmer">{headlineHighlight}</span>
          </h2>

          <p className="mt-6 text-base leading-relaxed text-parchment/70 sm:text-lg lg:text-xl">
            {body}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? Target;
            return (
              <article
                key={feature.title}
                className="hover-zoom group relative overflow-hidden rounded-2xl border border-gold-400/20 bg-ink-soft/80 p-8 shadow-gold backdrop-blur-md transition-all duration-300 hover:border-gold-400/50"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="hex-clip flex h-12 w-12 shrink-0 items-center justify-center bg-gold-gradient text-ink transition-transform duration-500 group-hover:rotate-[12deg]"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-parchment">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-parchment/65">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Founder's Note */}
        <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-gold-400/25 bg-white/5 p-8 backdrop-blur-md sm:p-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
            Founder&apos;s Note
          </span>
          <p className="mt-5 font-display text-xl leading-relaxed text-parchment/90 sm:text-2xl">
            &ldquo;We started Designhive on a simple belief: that a small, senior team working
            directly with founders will always outperform a bloated agency process. Every
            engagement we take on gets our full strategic attention, our best design thinking,
            and engineering built to last — not just to launch. That&apos;s the partnership we
            promise every client, no matter where in the world they&apos;re building.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-gold-400/15 pt-5">
            <span className="hex-clip flex h-10 w-10 shrink-0 items-center justify-center bg-gold-gradient text-ink">
              <span className="font-display text-sm font-bold">TH</span>
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-parchment">Tahsin Habib</p>
              <p className="text-xs text-parchment/50">Founder &amp; Lead Designer, Designhive</p>
            </div>
          </div>
        </div>

        {/* Bottom Call-To-Action */}
        <div className="mt-12 flex justify-center">
          <Link
            href={ctaHref}
            className="hover-zoom group flex items-center gap-2.5 rounded-full bg-gold-gradient px-8 py-4 text-sm font-semibold text-ink shadow-gold transition-all duration-300 hover:shadow-gold-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-ink"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
