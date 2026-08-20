import { Check, Sparkles, ArrowRight, X, Target, RefreshCw, Users } from "lucide-react";
import Link from "next/link";
import type { SectionHeadingResult, PricingPlanResult } from "@/sanity/lib/queries";

const ENGAGEMENT_MODELS = [
  {
    icon: Target,
    title: "Fixed Scope Project",
    description:
      "A defined deliverable, timeline, and price — ideal when you know exactly what you need to launch or relaunch.",
  },
  {
    icon: RefreshCw,
    title: "Monthly Design Retainer",
    description:
      "Ongoing design and development capacity billed monthly, so your product keeps shipping without a fresh proposal every time.",
  },
  {
    icon: Users,
    title: "Dedicated Product Team",
    description:
      "A ring-fenced squad of designers and engineers embedded with your team for continuous, long-term product growth.",
  },
];

const FALLBACK_HEADING = {
  eyebrow: "Transparent Investment",
  title: "Flexible plans built for ambitious growth",
  description:
    "Straight-talking investment models with clear deliverables. Tailored for startups, scaling companies, and market leaders.",
};

const DEFAULT_PLANS: PricingPlanResult[] = [
  {
    _id: "starter",
    name: "Starter Hive",
    price: "$1,499",
    priceSuffix: "/project",
    description: "Essential UX/UI & Web Foundation for emerging startups looking for rapid market validation.",
    badge: "Startup Launch",
    features: [
      "Custom Homepage & 3 Inner Pages",
      "Responsive Mobile Optimization",
      "Brand Style Guide & Assets",
      "SEO & Metadata Foundation",
      "Sanity CMS Setup",
      "2 Rounds of Revisions",
    ],
    highlighted: false,
    cta: {
      label: "Choose Starter",
      href: "#contact",
    },
  },
  {
    _id: "growth",
    name: "Growth Engine",
    price: "$3,299",
    priceSuffix: "/project",
    description: "Comprehensive end-to-end digital experience designed for high-growth scaling brands.",
    badge: "Most Popular",
    features: [
      "Full Custom Website (Up to 10 Pages)",
      "Interactive Animations & Micro-interactions",
      "Headless Sanity CMS Integration",
      "Advanced CWV 100/100 Performance Optimization",
      "Multi-Language i18n Ready",
      "Custom Lead/Quote Form Integration",
      "Priority Direct Studio Director Support",
    ],
    highlighted: true,
    cta: {
      label: "Start Growth Plan",
      href: "#contact",
    },
  },
  {
    _id: "enterprise",
    name: "Custom Enterprise",
    price: "Custom",
    priceSuffix: "",
    description: "Bespoke digital architecture and continuous design partnership for industry leaders.",
    badge: "Bespoke Retainer",
    features: [
      "Unlimited Bespoke Page Layouts",
      "Custom Web Application & API Integration",
      "Dedicated Studio Design Director",
      "Full Design System & Component Library",
      "SLA & Priority Support",
      "Quarterly Strategy & UX Audits",
    ],
    highlighted: false,
    cta: {
      label: "Contact Sales",
      href: "#contact",
    },
  },
];

const COMPARISON_ROWS = [
  { feature: "Custom UI/UX Design", starter: "Included", growth: "Included", enterprise: "Bespoke System" },
  { feature: "Sanity CMS Integration", starter: "Basic", growth: "Advanced", enterprise: "Custom Schema + Workflow" },
  { feature: "Mobile Responsive Stack", starter: true, growth: true, enterprise: true },
  { feature: "Performance CWV 100", starter: true, growth: true, enterprise: true },
  { feature: "Direct Founder Access", starter: false, growth: true, enterprise: true },
  { feature: "Ongoing Retainer SLA", starter: false, growth: false, enterprise: true },
];

interface PricingProps {
  heading?: SectionHeadingResult;
  plans?: PricingPlanResult[];
}

export default function Pricing({ heading, plans }: PricingProps) {
  const eyebrow = heading?.eyebrow || FALLBACK_HEADING.eyebrow;
  const title = heading?.title || FALLBACK_HEADING.title;
  const description = heading?.description || FALLBACK_HEADING.description;
  const activePlans = plans?.length ? plans : DEFAULT_PLANS;

  return (
    <section id="pricing" className="honeycomb-field relative bg-parchment-dim py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
            {description}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {activePlans.map((plan) => {
            const isHighlighted = plan.highlighted;
            const ctaLabel = plan.cta?.label || "Choose Plan";
            const ctaHref = plan.cta?.href || "#contact";
            const ribbonText = plan.badge || (isHighlighted ? "Most Popular" : undefined);

            return (
              <article
                key={plan._id}
                className={`hover-zoom relative flex flex-col justify-between rounded-3xl p-8 lg:p-10 transition-all duration-300 ${
                  isHighlighted
                    ? "bg-ink text-parchment border-2 border-gold-400/60 shadow-gold-lg lg:-translate-y-4"
                    : "bg-white/80 text-ink border border-gold-400/25 shadow-sm backdrop-blur-sm"
                }`}
              >
                {/* Ribbon Badge */}
                {ribbonText && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink shadow-gold">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      {ribbonText}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Description */}
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`font-display text-2xl font-semibold ${
                        isHighlighted ? "text-parchment" : "text-ink"
                      }`}
                    >
                      {plan.name}
                    </h3>
                  </div>

                  {plan.description && (
                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        isHighlighted ? "text-parchment/70" : "text-ink/60"
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}

                  {/* Price Display */}
                  <div className="mt-8 flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${
                        isHighlighted ? "text-gold-300" : "text-ink"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.priceSuffix && (
                      <span
                        className={`text-sm font-medium ${
                          isHighlighted ? "text-parchment/60" : "text-ink/50"
                        }`}
                      >
                        {plan.priceSuffix}
                      </span>
                    )}
                  </div>

                  <div
                    className={`mt-8 border-t ${
                      isHighlighted ? "border-gold-400/20" : "border-gold-400/15"
                    }`}
                  />

                  {/* Feature Checklist */}
                  {plan.features?.length ? (
                    <ul className="mt-8 space-y-4" aria-label={`Features included in ${plan.name}`}>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isHighlighted
                                ? "bg-gold-400/20 text-gold-300"
                                : "bg-gold-400/15 text-gold-600"
                            }`}
                            aria-hidden="true"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                          <span
                            className={isHighlighted ? "text-parchment/85" : "text-ink/75"}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* Card CTA Button */}
                <div className="mt-10 pt-4">
                  <Link
                    href={ctaHref}
                    className={`group flex w-full items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                      isHighlighted
                        ? "bg-gold-gradient text-ink shadow-gold hover:shadow-gold-lg"
                        : "border border-gold-400/40 bg-transparent text-ink hover:bg-gold-400/10"
                    }`}
                  >
                    <span>{ctaLabel}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Engagement Models */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
              Engagement Models
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Choose how you want to work with us
            </h3>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ENGAGEMENT_MODELS.map((model) => {
              const Icon = model.icon;
              return (
                <div
                  key={model.title}
                  className="hover-zoom flex flex-col rounded-2xl border border-gold-400/25 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-ink">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 font-display text-lg font-semibold text-ink">
                    {model.title}
                  </h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                    {model.description}
                  </p>
                  <Link
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-ink"
                  >
                    Discuss this model
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div className="mt-24 rounded-3xl border border-gold-400/25 bg-white/70 p-8 shadow-sm backdrop-blur-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-display text-2xl font-semibold text-ink">
              Feature Comparison Matrix
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-gold-600 mt-1">
              Detailed Plan Capabilities
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink">
              <thead>
                <tr className="border-b border-gold-400/20 font-display text-base text-ink">
                  <th className="py-4 px-4 font-semibold">Features & Capabilities</th>
                  <th className="py-4 px-4 font-semibold text-center">Starter Hive</th>
                  <th className="py-4 px-4 font-semibold text-center text-gold-700 font-bold">Growth Engine</th>
                  <th className="py-4 px-4 font-semibold text-center">Custom Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-400/15">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gold-400/5 transition-colors">
                    <td className="py-4 px-4 font-medium text-ink/90">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-ink/70">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <Check className="h-5 w-5 text-gold-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-ink/30 mx-auto" />
                        )
                      ) : (
                        row.starter
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-gold-700 bg-gold-400/10">
                      {typeof row.growth === "boolean" ? (
                        row.growth ? (
                          <Check className="h-5 w-5 text-gold-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-ink/30 mx-auto" />
                        )
                      ) : (
                        row.growth
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-ink/70">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <Check className="h-5 w-5 text-gold-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-ink/30 mx-auto" />
                        )
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
