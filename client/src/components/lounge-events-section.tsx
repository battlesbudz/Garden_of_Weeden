import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, GlassWater, Phone, Sparkles } from "lucide-react";

const eventItems = [
  "Forbidden Fruit on-site consumption lounge",
  "Fun and educational cannabis events",
  "Private events and lounge bookings",
  "Mobile weed bar services for off-site events",
];

export default function LoungeEventsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="lounge-events" className="relative overflow-hidden bg-battles-black py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-green-950/20 to-battles-black" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          >
            <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
              Forbidden Fruit Lounge
            </p>
            <h2 className="mt-4 font-enchanted text-4xl text-parchment md:text-6xl">
              Experience the farm story together.
            </h2>
            <p className="mt-6 font-garden text-lg leading-relaxed text-gray-300">
              The lounge gives guests a place to relax, learn, and connect around craft cannabis.
              From in-store events to private gatherings, Garden of Weeden can make the Farm to Flame
              experience part of the occasion.
            </p>
            <a
              href="tel:+17164201591"
              className="mt-8 inline-flex items-center rounded-xl bg-green-700 px-8 py-4 font-garden font-bold text-white shadow-xl transition hover:bg-green-800"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Contact Jennifer: (716) 420-1591
            </a>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-green-500/25 bg-midnight-grove/45 p-7"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.1 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <GlassWater className="h-7 w-7 text-green-400" aria-hidden="true" />
              <h3 className="font-storybook text-2xl text-parchment">Lounge, events, and mobile service</h3>
            </div>
            <ul className="space-y-4">
              {eventItems.map((item) => (
                <li key={item} className="flex gap-3 font-garden text-gray-300">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-green-500/20 bg-black/25 p-4">
              <CalendarDays className="mb-2 h-5 w-5 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm text-gray-400">
                Check the in-store events calendar or Instagram for upcoming community and education events.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
