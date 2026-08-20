"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ExternalLink, Layers, X } from "lucide-react";
import { cloudinaryUrl } from "@/sanity/lib/image";
import { localizeHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type {
  SectionHeadingResult,
  CtaButtonResult,
  ProjectCardResult,
  PortfolioCategoryResult,
} from "@/sanity/lib/queries";

const FALLBACK_HEADING = {
  eyebrow: "Selected Work",
  title: "Work that deserves to be seen",
  description:
    "A visual collection of websites, digital products and brand experiences designed and built by Designhive.",
};

const FALLBACK_CTA = { label: "View All Projects", href: "/portfolio" };

const FALLBACK_PROJECTS: ProjectCardResult[] = [
  { icon: "sparkles", title: "Enact Growth", slug: "enact-growth", subtitle: "Fintech dashboard & analytics UI", category: { title: "UX/UI Design", slug: "ux-ui" }, result: "+42% user retention and 3x faster onboarding.", featured: true },
  { icon: "palette", title: "Prism Global", slug: "prism", subtitle: "Brand identity & strategic design system", category: { title: "Branding", slug: "branding" }, result: "A sharper premium identity built for scale.", featured: true },
  { icon: "box", title: "Orbit Spatial", slug: "orbit", subtitle: "3D spatial computing product design", category: { title: "Web Apps", slug: "web-apps" }, result: "Smooth interactive product experience.", featured: true },
  { icon: "smartphone", title: "Waypoint Travel", slug: "waypoint", subtitle: "AI travel companion mobile app", category: { title: "Mobile", slug: "mobile" }, result: "Offline-first UX with instant sync.", featured: true },
  { icon: "bar-chart-3", title: "Addlytics", slug: "addlytics", subtitle: "E-commerce analytics & reporting suite", category: { title: "UX/UI Design", slug: "ux-ui" }, result: "Simplified reporting for faster decisions.", featured: true },
  { icon: "sparkles", title: "Halo Studio", slug: "halo", subtitle: "Interactive 3D product showcase", category: { title: "Web Apps", slug: "web-apps" }, result: "+65% increase in add-to-cart conversions.", featured: true },
];

interface PortfolioProps {
  heading?: SectionHeadingResult;
  cta?: CtaButtonResult;
  projects?: ProjectCardResult[];
  categories?: PortfolioCategoryResult[];
  locale?: Locale;
  showAll?: boolean;
}

const CARD_LAYOUT = [
  "dh-work-card--tall",
  "dh-work-card--wide",
  "dh-work-card--medium",
  "dh-work-card--tall",
  "dh-work-card--medium",
  "dh-work-card--wide",
  "dh-work-card--medium",
  "dh-work-card--tall",
  "dh-work-card--wide",
  "dh-work-card--medium",
  "dh-work-card--tall",
  "dh-work-card--wide",
];

export default function Portfolio({
  heading,
  cta,
  projects,
  categories,
  locale = "en",
  showAll = false,
}: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalProject, setActiveModalProject] = useState<ProjectCardResult | null>(null);

  const eyebrow = heading?.eyebrow || FALLBACK_HEADING.eyebrow;
  const title = heading?.title || FALLBACK_HEADING.title;
  const description = heading?.description || FALLBACK_HEADING.description;
  const items = projects?.length ? projects : FALLBACK_PROJECTS;

  const categoryOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      ...(categories?.length
        ? categories.map((c) => ({ label: c.title, value: c.slug }))
        : Array.from(
            new Map(
              items
                .filter((p) => p.category?.slug)
                .map((p) => [p.category!.slug, p.category!.title])
            )
          ).map(([value, label]) => ({ label, value }))),
    ],
    [categories, items]
  );

  const filteredProjects =
    selectedCategory === "all"
      ? items
      : items.filter((p) => p.category?.slug === selectedCategory);

  const ctaHref = localizeHref(cta?.href || FALLBACK_CTA.href, locale);

  return (
    <section id="work" className="dh-work-section relative overflow-hidden">
      <div className="dh-work-glow dh-work-glow--one" aria-hidden="true" />
      <div className="dh-work-glow dh-work-glow--two" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <span className="dh-section-eyebrow">{eyebrow}</span>
          <h2 className="dh-work-title">{title}</h2>
          <p className="dh-work-description">{description}</p>
        </header>

        {categoryOptions.length > 1 && (
          <nav className="dh-work-filters" aria-label="Filter projects">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                aria-pressed={selectedCategory === cat.value}
                className={selectedCategory === cat.value ? "is-active" : ""}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}

        <div className="dh-work-wall" aria-live="polite">
          {filteredProjects.map((project, index) => {
            const imageUrl = project.coverImage
              ? cloudinaryUrl(project.coverImage, { width: 1100, height: 850, crop: "fill", quality: "auto" })
              : undefined;
            const layout = CARD_LAYOUT[index % CARD_LAYOUT.length];

            return (
              <article key={project.slug} className={`dh-work-card ${layout}`}>
                <button
                  type="button"
                  className="dh-work-card__button"
                  onClick={() => setActiveModalProject(project)}
                  aria-label={`Open case study: ${project.title}`}
                >
                  <div className="dh-work-card__media">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="dh-work-card__image"
                      />
                    ) : (
                      <div className="dh-work-card__fallback" aria-hidden="true">
                        <span>{project.category?.title || "Designhive"}</span>
                      </div>
                    )}
                    <div className="dh-work-card__shade" />
                    <div className="dh-work-card__meta">
                      <span>{project.category?.title || "Digital Experience"}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </div>
                    <div className="dh-work-card__title">
                      <h3>{project.title}</h3>
                      <p>{project.subtitle}</p>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>

        {!showAll && (
          <div className="mt-12 flex justify-center">
            <Link href={ctaHref} className="dh-work-cta">
              {cta?.label || FALLBACK_CTA.label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      {activeModalProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveModalProject(null);
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/15 bg-[#0b1020] p-6 text-white shadow-2xl sm:p-10">
            <button
              type="button"
              onClick={() => setActiveModalProject(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Close case study"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModalProject.coverImage && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={cloudinaryUrl(activeModalProject.coverImage, { width: 1400, height: 800, crop: "fill" })}
                  alt={activeModalProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            )}

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {activeModalProject.category?.title || "Case Study"}
            </span>
            <h2 id="project-dialog-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              {activeModalProject.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/65">
              {activeModalProject.subtitle}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Challenge", activeModalProject.challenge],
                ["Solution", activeModalProject.solution],
                ["Result", activeModalProject.result],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{label}</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">{value}</p>
                  </div>
                ) : null
              )}
            </div>

            {activeModalProject.liveUrl && (
              <a
                href={activeModalProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b1020] transition hover:scale-[1.02]"
              >
                View Live Project
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {activeModalProject.result && (
              <p className="sr-only">
                <CheckCircle2 aria-hidden="true" /> {activeModalProject.result}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
