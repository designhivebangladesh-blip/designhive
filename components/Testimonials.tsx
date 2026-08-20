import Image from "next/image";
import { Star, Quote, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cloudinaryUrl } from "@/sanity/lib/image";
import type {
  SectionHeadingResult,
  TestimonialResult,
  ClientLogoResult,
  FounderCredibilityResult,
} from "@/sanity/lib/queries";

const FALLBACK_HEADING = {
  eyebrow: "Client Endorsements & Trust",
  title: "Validated by market leaders and founders worldwide",
  description:
    "Hear directly from the visionary teams and tech founders we have partnered with to build digital products.",
};

const FALLBACK_TESTIMONIALS: TestimonialResult[] = [
  {
    _id: "test-1",
    quote:
      "Designhive transformed our product from a fragmented dashboard into an intuitive software experience. Our user conversion jumped 40% in 60 days.",
    authorName: "Sarah Jenkins",
    authorRole: "VP of Product, GrowMore",
    rating: 5,
    client: "GrowMore Fintech",
  },
  {
    _id: "test-2",
    quote:
      "Tahsin and his team operate with obsessive focus on detail. They did not just design a website; they shaped our brand position for enterprise investors.",
    authorName: "Marcus Vance",
    authorRole: "Founder & CEO, Solaris AI",
    rating: 5,
    client: "Solaris AI Platform",
  },
  {
    _id: "test-3",
    quote:
      "The Next.js and Sanity implementation was flawlessly executed. Page load times are under 0.8 seconds and editing marketing content is completely effortless.",
    authorName: "Elena Rostova",
    authorRole: "Head of Growth, Visionary Tech",
    rating: 5,
    client: "Visionary Tech",
  },
];

const FALLBACK_CLIENTS: ClientLogoResult[] = [
  { _id: "c1", name: "GrowMore" },
  { _id: "c2", name: "Solaris AI" },
  { _id: "c3", name: "Visionary" },
  { _id: "c4", name: "Penta Corp" },
  { _id: "c5", name: "Boltshift" },
];

const FALLBACK_FOUNDER_CREDIBILITY: FounderCredibilityResult = {
  founderName: "Tahsin Habib",
  founderRole: "Founder & Lead Studio Director",
  founderBio:
    "With over 10 years of experience directing user experience architecture and strategic brand systems, Tahsin leads every Designhive project with direct studio accountability.",
  founderQuote:
    "We treat every client project like our own product — zero generic templates, relentless attention to craft, and measurable business outcomes.",
  credentials: [
    "10+ Years Industry Experience",
    "250+ Digital Products Launched",
    "98% Client Retention & Satisfaction Rate",
    "100% Next.js & Sanity Specialist",
  ],
};

interface TestimonialsProps {
  heading?: SectionHeadingResult;
  testimonials?: TestimonialResult[];
  clients?: ClientLogoResult[];
  founderCredibility?: FounderCredibilityResult;
}

export default function Testimonials({
  heading,
  testimonials,
  clients,
  founderCredibility,
}: TestimonialsProps) {
  const eyebrow = heading?.eyebrow || FALLBACK_HEADING.eyebrow;
  const title = heading?.title || FALLBACK_HEADING.title;
  const description = heading?.description || FALLBACK_HEADING.description;

  const reviews = testimonials?.length ? testimonials : FALLBACK_TESTIMONIALS;
  const logoItems = clients?.length ? clients : FALLBACK_CLIENTS;
  const founder = founderCredibility?.founderName ? founderCredibility : FALLBACK_FOUNDER_CREDIBILITY;

  const founderAvatarUrl = founder.founderAvatar
    ? cloudinaryUrl(founder.founderAvatar, { width: 160, height: 160, crop: "fill" })
    : undefined;

  return (
    <section id="testimonials" className="honeycomb-field relative bg-ink py-28 lg:py-36 text-parchment overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[35rem] w-[35rem] rounded-full bg-gold-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[35rem] w-[35rem] rounded-full bg-gold-300/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Client Logos Strip */}
        <div className="border-b border-gold-400/15 pb-16">
          <p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.25em] text-parchment/50">
            Trusted by founders and leadership teams at
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-75">
            {logoItems.map((client) => {
              const logoUrl = client.logo
                ? cloudinaryUrl(client.logo, { width: 180, format: "auto" })
                : undefined;

              return (
                <div
                  key={client._id}
                  className="hover-zoom-sm grayscale transition-all hover:grayscale-0 hover:opacity-100 flex items-center justify-center"
                >
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={client.name}
                      width={120}
                      height={40}
                      className="h-9 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-display text-xl font-bold tracking-tight text-parchment/60 hover:text-gold-300">
                      {client.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Header */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-400">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-parchment sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-parchment/70 sm:text-lg">
            {description}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const avatarUrl = review.avatar
              ? cloudinaryUrl(review.avatar, { width: 96, height: 96, crop: "fill" })
              : undefined;

            return (
              <article
                key={review._id}
                className="hover-zoom relative flex flex-col justify-between rounded-3xl border border-gold-400/25 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-gold-400/60 hover:bg-white/10"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold-400">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-gold-400 stroke-none" />
                      ))}
                    </div>
                    <Quote className="h-7 w-7 text-gold-400/30" />
                  </div>

                  {/* Quote text */}
                  <p className="mt-6 text-sm leading-relaxed text-parchment/85 italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-8 flex items-center gap-4 border-t border-gold-400/15 pt-5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gold-400/30 bg-gold-400/10 flex items-center justify-center font-display text-sm font-bold text-gold-300">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={review.authorName}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      review.authorName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-parchment">
                      {review.authorName}
                    </h4>
                    {review.authorRole && (
                      <p className="text-xs text-parchment/60">{review.authorRole}</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Founder Credibility Block */}
        <div className="mt-24 rounded-3xl border border-gold-400/30 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 lg:p-12 backdrop-blur-md shadow-gold-lg">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.8fr]">
            {/* Founder Avatar / Card */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold-400 shadow-gold">
                {founderAvatarUrl ? (
                  <Image
                    src={founderAvatarUrl}
                    alt={founder.founderName || "Founder"}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold-gradient text-ink">
                    <Award className="h-12 w-12" />
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-parchment">
                {founder.founderName}
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider text-gold-400 mt-1">
                {founder.founderRole}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-300/90 font-medium">
                <ShieldCheck className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Direct Studio Lead Accountability</span>
              </div>
            </div>

            {/* Founder Bio & Credibility Highlights */}
            <div>
              {founder.founderBio && (
                <p className="text-base leading-relaxed text-parchment/80">
                  {founder.founderBio}
                </p>
              )}

              {founder.founderQuote && (
                <blockquote className="mt-5 rounded-2xl border-l-2 border-gold-400 bg-gold-400/10 p-4 text-sm font-medium italic text-gold-200">
                  &ldquo;{founder.founderQuote}&rdquo;
                </blockquote>
              )}

              {founder.credentials?.length ? (
                <div className="mt-6 border-t border-gold-400/15 pt-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gold-400">
                    Founder Credibility Metrics
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {founder.credentials.map((cred, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-parchment/90">
                        <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                        <span>{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
