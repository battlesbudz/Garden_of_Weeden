import { ArrowRight, CalendarDays, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { VideoBackground } from "@/components/video-background";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

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
          posterImage={fieldRowsImage}
          alt="Garden of Weeden cannabis farm rows near Buffalo"
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
          <h1 className="mt-5 max-w-4xl font-enchanted text-6xl leading-[0.88] text-parchment drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl">
            {heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl font-garden text-xl font-semibold leading-relaxed text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)] md:text-2xl">
            {heroSubtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-7 py-4 font-garden text-base font-bold text-white shadow-xl shadow-black/30 transition hover:bg-green-800"
            >
              <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
              {heroShopButtonText}
            </Link>
            <a
              href="#mobile-weed-bar"
              className="inline-flex items-center justify-center rounded-xl bg-parchment px-7 py-4 font-garden text-base font-bold text-battles-black shadow-xl shadow-black/30 transition hover:bg-white"
            >
              <CalendarDays className="mr-2 h-5 w-5" aria-hidden="true" />
              {heroStoryButtonText}
            </a>
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-garden text-base font-bold text-white backdrop-blur transition hover:border-green-400 hover:text-green-300"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Book a Private Event
            </a>
          </div>
        </motion.div>

        <motion.aside
          className="border-y border-green-500/35 bg-black/45 p-6 backdrop-blur-md lg:border lg:p-7"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          <div className="grid gap-5">
            <div>
              <p className="font-garden text-xs font-semibold uppercase tracking-[0.22em] text-green-400">Plan your visit</p>
              <p className="mt-2 font-storybook text-3xl text-parchment">Shop, lounge, book.</p>
            </div>
            <div className="grid gap-3 font-garden text-sm text-gray-300">
              <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                <span>Garden of Weeden flower and pre-rolls come from the company farm.</span>
              </div>
              <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                <span>Partner products come from regional small farms and microbusinesses.</span>
              </div>
              <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                <span>{locationText}</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
