import { Award, MapPin, Leaf, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
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
  heroVeteranBadge?: string;
  pillar1Title?: string;
  pillar2Title?: string;
  pillar3Title?: string;
  locationText?: string;
}

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const heroTitle = settings?.heroTitle || "Garden of Weeden";
  const heroTagline = settings?.heroTagline || "Farm to Flame Cannabis";
  const heroSubtitle = settings?.heroSubtitle || "Local, small-batch cannabis products sourced from our farm south of Buffalo and small craft growers across Central and Western NY.";
  const heroShopButtonText = settings?.heroShopButtonText || "Shop Farm to Flame";
  const heroStoryButtonText = settings?.heroStoryButtonText || "Our Story";
  const heroVeteranBadge = settings?.heroVeteranBadge || "Farm to Flame";
  const pillar1Title = settings?.pillar1Title || "Local Farm Partners";
  const pillar2Title = settings?.pillar2Title || "Buffalo Roots";
  const pillar3Title = settings?.pillar3Title || "Craft Products";
  const locationText = settings?.locationText || "Proudly cultivated in the regional area";

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center bg-battles-black overflow-hidden"
      style={{
        marginTop: 'calc(var(--hopeline-banner-height, 40px) + 64px)',
        minHeight: 'calc(100vh - var(--hopeline-banner-height, 40px) - 64px)',
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-50">
          <VideoBackground
            videoSrc={undefined}
            posterImage={fieldRowsImage}
            alt="Garden of Weeden cannabis cultivation fields in Buffalo, NY"
            className=""
            showControls={false}
            autoplay={true}
            muted={true}
            loop={true}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-battles-black/90 via-battles-black/50 to-battles-black/95"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-battles-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-full px-5 py-2 mb-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <Award className="h-4 w-4 text-green-400" aria-hidden="true" />
          <span className="font-garden text-sm text-green-400 font-semibold tracking-wide uppercase">{heroVeteranBadge}</span>
        </motion.div>

        <motion.div 
          className="mb-6"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
        >
          <h1 className="font-enchanted text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-parchment mb-4 leading-[0.9] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {heroTitle}
          </h1>
          <div className="h-1.5 w-32 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-6 rounded-full shadow-lg shadow-green-500/50"></div>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <h2 className="font-storybook text-2xl md:text-4xl lg:text-5xl text-green-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] mb-4 tracking-wide">
            {heroTagline}
          </h2>
          <p className="font-garden text-lg md:text-xl lg:text-2xl text-gray-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
        >
          <Link
            href="/shop"
            className="group bg-green-700 hover:bg-green-800 text-white px-10 py-5 rounded-xl font-garden font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            data-testid="hero-cta-shop"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>{heroShopButtonText}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="border-2 border-parchment/60 text-parchment px-8 py-4 rounded-xl font-garden font-semibold text-base hover:bg-parchment/10 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            data-testid="hero-cta-story"
          >
            {heroStoryButtonText}
          </Link>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-gray-300">
            <Award className="h-5 w-5 text-green-500" aria-hidden="true" />
            <span className="font-garden text-sm md:text-base">{pillar1Title}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="h-5 w-5 text-green-500" aria-hidden="true" />
            <span className="font-garden text-sm md:text-base">{pillar2Title}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Leaf className="h-5 w-5 text-green-500" aria-hidden="true" />
            <span className="font-garden text-sm md:text-base">{pillar3Title}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Sparkles className="h-5 w-5 text-green-500" aria-hidden="true" />
            <span className="font-garden text-sm md:text-base">Sun-Grown Quality</span>
          </div>
        </motion.div>

        <motion.div 
          className="inline-flex items-center gap-2 bg-midnight-grove/60 backdrop-blur-sm border border-green-500/40 rounded-full px-6 py-3"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
        >
          <MapPin className="h-4 w-4 text-green-500" aria-hidden="true" />
          <span className="font-garden text-sm text-parchment font-medium">{locationText}</span>
        </motion.div>
      </div>
    </section>
  );
}
