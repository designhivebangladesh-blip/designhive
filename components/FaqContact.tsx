"use client";

import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  Twitter,
  Instagram,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import QuoteForm from "./QuoteForm";
import type {
  SectionHeadingResult,
  FaqResult,
  ContactInfoResult,
} from "@/sanity/lib/queries";
import type { Messages } from "@/lib/i18n/messages";

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

const FALLBACK_FAQ_HEADING = {
  eyebrow: "Answers & Clarity",
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about partnering with Designhive, our timeline commitments, and delivery workflows.",
};

const FALLBACK_FAQS: FaqResult[] = [
  {
    _id: "faq-1",
    question: "What is your typical project timeline?",
    answer:
      "Most core website and brand identity projects are completed within 3 to 6 weeks from initial strategy kick-off to final production release.",
    category: "Process",
  },
  {
    _id: "faq-2",
    question: "Do you offer custom headless CMS integration?",
    answer:
      "Yes, we specialize in Next.js App Router coupled with Sanity Studio CMS, providing total marketing independence for your team with real-time editing.",
    category: "Technical",
  },
  {
    _id: "faq-3",
    question: "How do revisions and direct feedback work?",
    answer:
      "Every project includes dedicated sprint revisions. You work directly with studio founder Tahsin Habib via Figma, Loom, and async Slack communication.",
    category: "Workflow",
  },
  {
    _id: "faq-4",
    question: "What happens after our website launches?",
    answer:
      "We provide a 30-day post-launch warranty, comprehensive CMS training guides, and optional monthly retainer slots for continuous design iteration.",
    category: "Support",
  },
];

const FALLBACK_CONTACT: ContactInfoResult = {
  email: "designhivebangladesh@gmail.com",
  phone: "+8801408388029",
  whatsapp: "+8801408388029",
  location: "Dhaka, Bangladesh",
  address: "House 14, Road 5, Block D, Banani, Dhaka 1213",
  openingHours: [
    { days: "Mon – Fri", hours: "9:00 AM – 7:00 PM (GMT+6)" },
    { days: "Saturday", hours: "10:00 AM – 4:00 PM (GMT+6)" },
  ],
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
};

interface FaqContactProps {
  faqHeading?: SectionHeadingResult;
  faqs?: FaqResult[];
  contactInfo?: ContactInfoResult | null;
  messages?: Messages;
}

export default function FaqContact({
  faqHeading,
  faqs,
  contactInfo,
}: FaqContactProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const eyebrow = faqHeading?.eyebrow || FALLBACK_FAQ_HEADING.eyebrow;
  const title = faqHeading?.title || FALLBACK_FAQ_HEADING.title;
  const description = faqHeading?.description || FALLBACK_FAQ_HEADING.description;

  const faqItems = faqs?.length ? faqs : FALLBACK_FAQS;
  const contact = contactInfo || FALLBACK_CONTACT;

  const whatsappRaw = contact.whatsapp || contact.phone || "+8801408388029";
  const whatsappUrl = whatsappRaw.startsWith("http")
    ? whatsappRaw
    : `https://wa.me/${whatsappRaw.replace(/[^0-9]/g, "")}`;

  function toggleFaq(id: string) {
    setOpenFaqId((prev) => (prev === id ? null : id));
  }

  return (
    <section id="faq" className="honeycomb-field relative bg-parchment py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* FAQ Section */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/70">
            {description}
          </p>
        </div>

        {/* Accessible FAQ Accordion Grid */}
        <div className="mt-14 max-w-3xl mx-auto space-y-4" role="region" aria-label="Frequently Asked Questions">
          {faqItems.map((faq) => {
            const isOpen = openFaqId === faq._id;
            const answerText = typeof faq.answer === "string"
              ? faq.answer
              : Array.isArray(faq.answer)
              ? faq.answer.map((block: { children?: { text?: string }[] }) => block?.children?.map((c) => c.text ?? "").join("")).join(" ")
              : "Contact studio support for details.";

            return (
              <div
                key={faq._id}
                className="overflow-hidden rounded-2xl border border-gold-400/30 bg-white/80 transition-all duration-300 shadow-sm hover:border-gold-500 backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq._id}`}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-2xl"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-gold-600 shrink-0" />
                    <span className="font-display text-lg font-semibold text-ink">
                      {faq.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-ink/50 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-gold-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${faq._id}`}
                    className="px-6 pb-6 pt-2 text-sm leading-relaxed text-ink/75 border-t border-gold-400/15 animate-fade-in"
                  >
                    <p>{answerText}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA & Quote Form Section */}
        <div id="contact" className="mt-28 border-t border-gold-400/20 pt-20 scroll-mt-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
            {/* Direct Contact CTAs & Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-600">
                  Direct Studio Access
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Let&apos;s start your next digital milestone
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/70">
                  Have a specific question or want an instant project timeline? Connect with our team directly via WhatsApp, email, or telephone.
                </p>

                {/* Direct Action Buttons: WhatsApp & Email */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-zoom group flex items-center gap-2.5 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${contact.email}`}
                    className="hover-zoom group flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-parchment shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <Mail className="h-4 w-4 text-gold-300" />
                    <span>Email Studio</span>
                  </a>
                </div>

                {/* Business Hours & Details */}
                <div className="mt-12 space-y-4 border-t border-gold-400/20 pt-8">
                  {contact.location && (
                    <div className="flex items-start gap-3 text-sm text-ink/80">
                      <MapPin className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-ink">Studio Location</p>
                        <p className="text-xs text-ink/60">{contact.location} {contact.address ? `— ${contact.address}` : ""}</p>
                      </div>
                    </div>
                  )}

                  {contact.phone && (
                    <div className="flex items-center gap-3 text-sm text-ink/80">
                      <Phone className="h-5 w-5 text-gold-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink">Direct Telephone</p>
                        <a href={`tel:${contact.phone}`} className="text-xs text-gold-700 font-mono hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.openingHours?.length ? (
                    <div className="flex items-start gap-3 text-sm text-ink/80">
                      <Clock className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-ink">Operating Hours</p>
                        <div className="mt-1 space-y-1">
                          {contact.openingHours.map((oh, i) => (
                            <p key={i} className="text-xs text-ink/65 font-mono">
                              {oh.days}: {oh.hours}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Social Links */}
                {contact.socialLinks?.length ? (
                  <div className="mt-8 flex items-center gap-3">
                    {contact.socialLinks.map((social) => {
                      const Icon = SOCIAL_ICON_MAP[social.platform] ?? Twitter;
                      return (
                        <a
                          key={social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-zoom-sm flex h-9 w-9 items-center justify-center rounded-full border border-gold-400/30 bg-white text-ink hover:bg-gold-gradient hover:text-ink transition-colors"
                          aria-label={`Visit Designhive on ${social.platform}`}
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Reusable Multi-Step Quote Form */}
            <div>
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
