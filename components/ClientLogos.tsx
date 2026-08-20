"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cloudinaryUrl } from "@/sanity/lib/image";
import type { ClientLogoResult } from "@/sanity/lib/queries";
import { fadeOnly, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion/variants";

const FALLBACK_CLIENTS: ClientLogoResult[] = [
  { _id: "c1", name: "GrowMore" },
  { _id: "c2", name: "Solaris AI" },
  { _id: "c3", name: "Visionary" },
  { _id: "c4", name: "Penta Corp" },
  { _id: "c5", name: "Boltshift" },
  { _id: "c6", name: "Orbit Spatial" },
];

interface ClientLogosProps {
  clients?: ClientLogoResult[];
  label?: string;
}

export default function ClientLogos({
  clients,
  label = "Trusted by startups and enterprise teams across 20+ countries",
}: ClientLogosProps) {
  const prefersReducedMotion = useReducedMotion();
  const items = clients?.length ? clients : FALLBACK_CLIENTS;
  const itemVariant = prefersReducedMotion ? fadeOnly : fadeUp;

  return (
    <section
      aria-label="Client logos"
      className="border-y border-gold-400/10 bg-ink py-12 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.p
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={fadeOnly}
          className="text-center font-mono text-xs font-semibold uppercase tracking-[0.25em] text-parchment/45"
        >
          {label}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={viewportOnce}
          variants={staggerContainer(0.06)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
        >
          {items.map((client) => {
            const logoUrl = client.logo
              ? cloudinaryUrl(client.logo, { width: 160, format: "auto" })
              : undefined;

            return (
              <motion.div
                key={client._id}
                variants={itemVariant}
                className="hover-zoom-sm flex h-8 items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={client.name}
                    width={112}
                    height={32}
                    className="h-7 w-auto object-contain sm:h-8"
                  />
                ) : (
                  <span className="font-display text-base font-semibold tracking-tight text-parchment/70 sm:text-lg">
                    {client.name}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
