import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, GlassWater, Phone, Sparkles } from "lucide-react";

export default function LoungeEventsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="lounge-events" className="bg-battles-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-8 border-y border-green-500/25 py-10 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-center"
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65 }}
        >
          <div>
            <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
              Forbidden Fruit Lounge
            </p>
            <h2 className="mt-3 font-enchanted text-5xl leading-none text-parchment md:text-6xl">
              Stay awhile.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex gap-3">
              <GlassWater className="mt-1 h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm leading-relaxed text-gray-300">On-site cannabis consumption lounge.</p>
            </div>
            <div className="flex gap-3">
              <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm leading-relaxed text-gray-300">Private lounge bookings and hosted events.</p>
            </div>
            <div className="flex gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm leading-relaxed text-gray-300">Farm to Flame conversations with the team.</p>
            </div>
          </div>

          <a
            href="tel:+17164201591"
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-4 font-garden text-sm font-bold text-white transition hover:bg-green-800"
          >
            <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
            Plan With Jennifer
          </a>
        </motion.div>
      </div>
    </section>
  );
}
