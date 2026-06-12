import { ArrowRight, CalendarDays, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { VideoBackground } from "@/components/video-background";
// Hero background: lush sunny farm rows — full canopy, deep green, peak summer
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

  const defaultHeroSubtitle =
    "Buffalo's Farm to Flame cannabis microbusiness: house-grown flower, regional craft products, the Forbidden Fruit lounge, and a mobile weed bar for private events.";
  const staleHeroSubtitles = new Set([
    "A Buffalo cannabis microbusiness with its own farm, a current craft menu, the Forbidden Fruit lounge, and a mobile weed bar built for private events.",
  ]);
  const defaultHeroShopButtonText = "View Current Menu";
  const staleShopButtonLabels = new Set(["Shop Farm to Flame", "Explore Farm to Flame"]);
  const defaultHeroStoryButtonText = "Book the Mobile Weed Bar";
  const staleStoryButtonLabels = new Set(["Our Story"]);

  const heroTitle = settings?.heroTitle || "Garden of Weeden";
  const heroTagline = settings?.heroTagline || "Farm to Flame Cannabis";
  const heroSubtitle =
    settings?.heroSubtitle && !staleHeroSubtitles.has(settings.heroSubtitle)
      ? settings.heroSubtitle
      : defaultHeroSubtitle;
  const heroShopButtonText =
    settings?.heroShopButtonText && !staleShopButtonLabels.has(settings.heroShopButtonText)
      ? settings.heroShopButtonText
      : defaultHeroShopButtonText;
  const heroStoryButtonText =
    settings?.heroStoryButtonText && !staleStoryButtonLabels.has(settings.heroStoryButtonText)
      ? settings.heroStoryButtonText
      : defaultHeroStoryButtonText;
  const locationText = settings?.locationText || "Buffalo rooted with bike-route access and off-street parking.";

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-battles-black text-white"
      style={{
        marginTop: "calc(var(--hopeline-banner-height, 40px) + 64px)",
        minHeight: "calc(100vh - var(--hopeline-banner-height, 40px) - 64px)",
      }}
    >
      <div className="absolute inset-0">
        <VideoBackground
          videoSrc={undefined}
          posterImage={heroFarmImage}
          alt="Garden of Weeden cannabis farm rows near Buffalo, NY — lush summer growth"
          showControls={false}
          autoplay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/35 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-battles-black via-battles-black/85 to-battles-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-battles-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[inherit] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.78fr] lg:px-8">
        <motion.div
          className="rounded-none bg-black/40 p-4 backdrop-blur-[1px] sm:bg-transparent sm:p-0 sm:backdrop-blur-0"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          <p className="font-garden text-sm font-semibold uppercase tracking-[0.28em] text-green-400">
            {heroTagline}
          </p>
          <h1 className="mt-4 font-enchanted text-6xl leading-none text-parchment drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] md:text-8xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl font-garden text-lg leading-relaxed text-gray-300">
            {heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-garden text-sm font-bold text-white transition hover:bg-green-600"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {heroShopButtonText}
            </Link>
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-garden text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {heroStoryButtonText}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-garden text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-green-500" aria-hidden="true" />
              {locationText}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:block"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: 0.2 }}
        >
          <div className="overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={heroFarmImage}
              alt="Garden of Weeden farm rows — own-farm cannabis near Buffalo, NY"
              className="h-[420px] w-full object-cover opacity-90"
            />
          </div>
          <p className="mt-3 text-center font-garden text-xs font-semibold uppercase tracking-widest text-green-500/70">
            Own farm · 15 miles south of Buffalo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
