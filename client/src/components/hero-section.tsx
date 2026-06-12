import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { VideoBackground } from "@/components/video-background";
import heroFarmImage from "@assets/farm_rows_lush_sunny_1.jpg";

interface SiteSettings {
  heroTitle?: string;
  heroTagline?: string;
  heroSubtitle?: string;
  heroShopButtonText?: string;
  heroStoryButtonText?: string;
  locationText?: string;
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const staleHeroSubtitles = new Set([
    "A Buffalo cannabis microbusiness with its own farm, the Forbidden Fruit lounge, and a mobile weed bar built for private events.",
  ]);
  const staleHeroButtonLabels = new Set(["Our Story", "Book a Private Event"]);
  const staleStoryButtonLabels = new Set(["Book the Mobile Weed Bar"]);

  const heroTitle = settings?.heroTitle || "Garden of Weeden";
  const heroTagline = settings?.heroTagline || "Farm to Flame Cannabis";
  const heroSubtitle =
    settings?.heroSubtitle && !staleHeroSubtitles.has(settings.heroSubtitle)
      ? settings.heroSubtitle
      : "Buffalo's Farm to Flame cannabis microbusiness: house-grown flower, regional craft products, the Forbidden Fruit lounge, and a mobile weed bar for private events.";
  const heroShopButtonText =
    settings?.heroShopButtonText && !staleHeroButtonLabels.has(settings.heroShopButtonText)
      ? settings.heroShopButtonText
      : "Our Story";
  const heroStoryButtonText =
    settings?.heroStoryButtonText && !staleHeroButtonLabels.has(settings.heroStoryButtonText)
      ? settings.heroStoryButtonText
      : "Book a Private Event";
  const locationText = settings?.locationText || "Buffalo rooted with bike-route access and off-street parking.";

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black text-white"
      style={{
        marginTop: "calc(var(--hopeline-banner-height, 40px) + 64px)",
        minHeight: "calc(100vh - var(--hopeline-banner-height, 40px) - 64px)",
      }}
    >
      {/* Background with heavy dark overlay so text is always legible */}
      <div className="absolute inset-0">
        <VideoBackground
          videoSrc={undefined}
          posterImage={heroFarmImage}
          alt="Garden of Weeden cannabis farm rows near Buffalo, NY"
          showControls={false}
          autoplay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-5xl flex-col justify-center px-6 py-20 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          {/* Eyebrow */}
          <p className="font-garden text-sm font-bold uppercase tracking-[0.3em] text-green-400">
            {heroTagline}
          </p>

          {/* Title — white, large, with strong shadow */}
          <h1 className="mt-4 font-enchanted text-7xl leading-[0.92] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,1)] md:text-8xl lg:text-9xl">
            {heroTitle}
          </h1>

          {/* Subtitle — white with shadow, not gray */}
          <p className="mt-6 max-w-2xl font-garden text-xl font-medium leading-relaxed text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-4 font-garden text-base font-bold text-white shadow-lg transition hover:bg-green-500"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
              {heroShopButtonText}
            </Link>
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-8 py-4 font-garden text-base font-bold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 hover:border-white"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {heroStoryButtonText}
            </a>
          </div>

          {/* Location */}
          <p className="mt-8 flex items-center gap-2 font-garden text-sm font-medium text-white/80">
            <MapPin className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
            {locationText}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
