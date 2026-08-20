"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { cloudinaryUrl } from "@/sanity/lib/image";
import type { ProjectCardResult } from "@/sanity/lib/queries";

interface FloatingProjectsProps {
  /** Featured projects from Sanity — only `featured == true` items should be passed in. */
  projects?: ProjectCardResult[];
}

const FALLBACK_PROJECTS: { title: string; category: string }[] = [
  { title: "Solaris Rebrand", category: "Branding" },
  { title: "GrowMore Platform", category: "Web App" },
  { title: "Boltshift Launch", category: "Product Design" },
  { title: "Penta Commerce", category: "E-commerce" },
];

// Staggered floating positions & animation offsets — desktop only shows
// all of them, CardGrid below hides the 4th/5th card under 768px.
const CARD_LAYOUT = [
  { className: "left-0 top-2 w-[62%]", delay: 0, duration: 6 },
  { className: "right-0 top-24 w-[58%]", delay: 0.6, duration: 7 },
  { className: "left-6 top-[19rem] w-[56%]", delay: 1.1, duration: 6.5 },
  { className: "right-4 top-[27rem] w-[54%] hidden sm:block", delay: 1.6, duration: 7.5 },
  { className: "left-24 top-[35rem] w-[50%] hidden lg:block", delay: 2, duration: 6.8 },
];

export default function FloatingProjects({ projects }: FloatingProjectsProps) {
  const source =
    projects && projects.length > 0
      ? projects.slice(0, 5)
      : FALLBACK_PROJECTS.map((p) => ({ ...p, slug: "", coverImage: undefined, category: { title: p.category, slug: "" } }));

  const cards = source.slice(0, 5);

  return (
    <div className="relative mx-auto h-[38rem] w-full max-w-[560px] select-none sm:h-[44rem]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gold-400/10 blur-[100px]" />

      {cards.map((project, i) => {
        const layout = CARD_LAYOUT[i % CARD_LAYOUT.length];
        const title = "title" in project ? project.title : "";
        const categoryTitle =
          typeof project.category === "object" && project.category ? project.category.title : "";
        const imageUrl =
          "coverImage" in project && project.coverImage
            ? cloudinaryUrl(project.coverImage, { width: 480, height: 320, crop: "fill" })
            : undefined;

        return (
          <motion.div
            key={`${title}-${i}`}
            className={`group absolute overflow-hidden rounded-2xl border border-gold-400/20 bg-white/5 shadow-gold-lg backdrop-blur-xl ${layout.className}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: layout.duration,
                delay: layout.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]"
            >
              <div className="relative aspect-[3/2] w-full bg-ink-soft">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 60vw, 320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-600/30 via-ink-soft to-ink">
                    <Layers className="h-8 w-8 text-gold-300/60" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-ink/60 text-gold-200 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div className="p-4">
                {categoryTitle && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300/80">
                    {categoryTitle}
                  </p>
                )}
                <p className="mt-1 truncate font-display text-sm font-semibold text-parchment">{title}</p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
