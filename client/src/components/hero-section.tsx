import { ArrowRight, CalendarDays, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

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
        <div className="absolute inset-0 bg-gradient-to-r from-battles-black via-battles-black/80 to-battles-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-battles-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[inherit] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.78fr] lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          <p className="font-garden text-sm font-semibold uppercase tracking-[0.28em] text-green-400">
            Farm to Flame Cannabis
          </p>
          <h1 className="mt-5 max-w-4xl font-enchanted text-6xl leading-[0.88] text-parchment drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-8xl">
            Garden of Weeden
          </h1>
          <p className="mt-7 max-w-2xl font-garden text-xl leading-relaxed text-gray-200 md:text-2xl">
            A Buffalo cannabis microbusiness with its own farm, a current craft menu, the Forbidden Fruit lounge, and a mobile weed bar built for private events.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-7 py-4 font-garden text-base font-bold text-white shadow-xl shadow-black/30 transition hover:bg-green-800"
            >
              <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
              View Current Menu
            </Link>
            <a
              href="#mobile-weed-bar"
              className="inline-flex items-center justify-center rounded-xl bg-parchment px-7 py-4 font-garden text-base font-bold text-battles-black shadow-xl shadow-black/30 transition hover:bg-white"
            >
              <CalendarDays className="mr-2 h-5 w-5" aria-hidden="true" />
              Book the Mobile Weed Bar
            </a>
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-garden text-base font-bold text-white backdrop-blur transition hover:border-green-400 hover:text-green-300"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Call Jennifer
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
              <p className="font-garden text-xs font-semibold uppercase tracking-[0.22em] text-green-400">Today starts here</p>
              <p className="mt-2 font-storybook text-3xl text-parchment">Menu, lounge, events.</p>
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
                <span>Buffalo rooted with bike-route access and off-street parking.</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
