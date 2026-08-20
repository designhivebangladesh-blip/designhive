import { ArrowRight, ShieldCheck } from "lucide-react";
import StartProjectButton from "./StartProjectButton";
import type { HeroResult, CtaButtonResult, ProjectCardResult } from "@/sanity/lib/queries";

const FALLBACK = {
  eyebrow: "Design · Development · Growth",
  headlineLine: "We build digital experiences",
  headlineHighlight: "people remember.",
  description:
    "Designhive creates high-performance websites, digital products and brand experiences that help ambitious businesses look better, rank higher and grow faster.",
  primaryCta: { label: "Start a Project", href: "#contact" } satisfies CtaButtonResult,
  secondaryCta: { label: "Explore Our Work", href: "#work" } satisfies CtaButtonResult,
  trustLine: "Trusted by startups and ambitious businesses worldwide",
  brandMarks: ["GrowMore", "Penta", "SOLARIS", "Visionary", "Boltshift"],
};

interface HeroProps {
  data?: HeroResult;
  projects?: ProjectCardResult[];
}

export default function Hero({ data }: HeroProps) {
  const eyebrow = data?.eyebrow || FALLBACK.eyebrow;
  const headlineLine = data?.headlineLine || FALLBACK.headlineLine;
  const headlineHighlight = data?.headlineHighlight || FALLBACK.headlineHighlight;
  const description = data?.description || FALLBACK.description;
  const primaryCta = data?.primaryCta ?? FALLBACK.primaryCta;
  const secondaryCta = data?.secondaryCta ?? FALLBACK.secondaryCta;
  const trustLine = data?.trustLine || FALLBACK.trustLine;
  const brandMarks = data?.brandMarks?.length ? data.brandMarks : FALLBACK.brandMarks;

  return (
    <section id="home" aria-label="Hero Section" className="dh-hero">
      <div className="dh-hero__orb dh-hero__orb--one" aria-hidden="true" />
      <div className="dh-hero__orb dh-hero__orb--two" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <div className="dh-hero__eyebrow">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>

        <h1 className="dh-hero__title">
          {headlineLine} <span>{headlineHighlight}</span>
        </h1>

        <p className="dh-hero__description">{description}</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <StartProjectButton
            label={primaryCta.label}
            className="dh-hero__primary"
          />
          <a href={secondaryCta.href} className="dh-hero__secondary">
            {secondaryCta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="dh-hero__trust">
          <p>{trustLine}</p>
          <div>
            {brandMarks.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
