import {
  LayoutTemplate,
  Code2,
  Award,
  Compass,
  Megaphone,
  Users2,
  ArrowRight,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import type { SectionHeadingResult, ServiceCardResult } from "@/sanity/lib/queries";

const ICON_MAP: Record<string, LucideIcon> = {
  "layout-template": LayoutTemplate,
  "code-2": Code2,
  award: Award,
  compass: Compass,
  megaphone: Megaphone,
  "users-2": Users2,
};

const FALLBACK_HEADING = {
  eyebrow: "Crafted Solutions",
  title: "Tailored services for ambitious digital growth",
  description:
    "Explore our comprehensive suite of innovative design & engineering capabilities, built to elevate your market standing.",
};

const FALLBACK_SERVICES: ServiceCardResult[] = [
  {
    icon: "layout-template",
    title: "UX/UI & Web Design",
    slug: "ux-ui-design",
    description: "Create intuitive, high-converting digital products and brand experiences.",
    deliverables: ["User Research", "Figma Design System", "Interactive Prototypes", "UI Kit"],
    startingPrice: "Starting at $1,499",
    cta: { label: "Request UX Audit", href: "#contact" },
  },
  {
    icon: "code-2",
    title: "Next.js Web Development",
    slug: "web-development",
    description: "Build lightning-fast, SEO-optimized React & Next.js applications.",
    deliverables: ["Next.js App Router", "Sanity CMS Integration", "Tailwind CSS", "CWV 100/100"],
    startingPrice: "Starting at $2,499",
    cta: { label: "Build Your Platform", href: "#contact" },
  },
  {
    icon: "award",
    title: "Brand Identity & Strategy",
    slug: "branding",
    description: "Define a distinct brand identity that commands attention and loyalty.",
    deliverables: ["Logo & Visual System", "Typography & Color Rules", "Brand Guidelines PDF"],
    startingPrice: "Starting at $1,299",
    cta: { label: "Explore Branding", href: "#contact" },
  },
  {
    icon: "compass",
    title: "Digital Growth Strategy",
    slug: "strategy-consulting",
    description: "Chart a clear, data-informed roadmap from vision to revenue.",
    deliverables: ["Competitor Analysis", "Conversion Rate Optimization", "Tech Architecture"],
    startingPrice: "Starting at $999",
    cta: { label: "Book Strategy Call", href: "#contact" },
  },
  {
    icon: "megaphone",
    title: "Performance Marketing UI",
    slug: "marketing",
    description: "High-impact landing pages and ad creative built specifically for conversion.",
    deliverables: ["High-Converting Landing Pages", "A/B Testing Variants", "Analytics Setup"],
    startingPrice: "Starting at $1,199",
    cta: { label: "Scale Conversions", href: "#contact" },
  },
  {
    icon: "users-2",
    title: "Dedicated Studio Retainer",
    slug: "team-alignment",
    description: "Embed our studio team directly into your workflow for ongoing design execution.",
    deliverables: ["Dedicated Lead Designer", "Weekly Sprint Releases", "Direct Slack Access"],
    startingPrice: "Starting at $3,500/mo",
    cta: { label: "Reserve Retainer Slot", href: "#contact" },
  },
];

interface ServicesProps {
  heading?: SectionHeadingResult;
  services?: ServiceCardResult[];
}

export default function Services({ heading, services }: ServicesProps) {
  const eyebrow = heading?.eyebrow || FALLBACK_HEADING.eyebrow;
  const title = heading?.title || FALLBACK_HEADING.title;
  const description = heading?.description || FALLBACK_HEADING.description;
  const items = services?.length ? services : FALLBACK_SERVICES;

  return (
    <section id="services" className="honeycomb-field relative bg-parchment py-28 lg:py-36">
      {/* Section Header */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {description}
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {items.map((service) => {
          const Icon = ICON_MAP[service.icon] ?? LayoutTemplate;
          const ctaLabel = service.cta?.label || "Get Started";
          const ctaHref = service.cta?.href || "#contact";

          return (
            <article
              key={service.slug}
              className="hover-zoom group relative flex flex-col justify-between rounded-3xl border border-gold-400/30 bg-white/80 p-8 shadow-sm transition-all duration-300 hover:border-gold-500 hover:bg-white hover:shadow-gold-lg backdrop-blur-sm"
            >
              <div>
                {/* Header: Icon & Starting Price */}
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-ink shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]">
                    <Icon className="h-7 w-7 stroke-[2]" />
                  </span>
                  {service.startingPrice && (
                    <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 font-mono text-xs font-semibold text-gold-700">
                      {service.startingPrice}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="mt-6 font-display text-2xl font-semibold text-ink group-hover:text-gold-700 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {service.description}
                </p>

                {/* Deliverables Preview Tags */}
                {service.deliverables?.length ? (
                  <div className="mt-6 border-t border-gold-400/15 pt-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                      Key Deliverables
                    </p>
                    <ul className="mt-3 space-y-2" aria-label={`Deliverables for ${service.title}`}>
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-ink/80">
                          <CheckCircle className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Service CTA */}
              <div className="mt-8 pt-4">
                <a
                  href={ctaHref}
                  className="hover-zoom-sm inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-400/40 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-gold-gradient hover:text-ink hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
