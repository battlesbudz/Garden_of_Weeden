import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, GlassWater, Music, Phone, Sparkles, Users } from "lucide-react";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";

const bookingIdeas = [
  { icon: Users, label: "Private parties" },
  { icon: Music, label: "Events and celebrations" },
  { icon: Sparkles, label: "Hosted cannabis experiences" },
];

export default function MobileWeedBarSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="mobile-weed-bar" className="relative overflow-hidden bg-parchment py-20 text-battles-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:px-8">
        <motion.div
          className="relative min-h-[420px] overflow-hidden rounded-none bg-battles-black shadow-2xl md:rounded-lg"
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65 }}
        >
          <img
            src={flowerCloseupImage}
            alt="Craft cannabis flower for Garden of Weeden events"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <p className="font-garden text-xs font-semibold uppercase tracking-[0.24em] text-green-300">Signature service</p>
            <p className="mt-3 font-storybook text-4xl text-parchment">The Mobile Weed Bar</p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          <div className="max-w-3xl">
            <p className="font-garden text-sm font-bold uppercase tracking-[0.24em] text-green-800">
              Book Garden of Weeden
            </p>
            <h2 className="mt-4 font-enchanted text-5xl leading-[0.95] text-battles-black md:text-7xl">
              Bring the weed bar to your party.
            </h2>
            <p className="mt-6 font-garden text-xl leading-relaxed text-black/75">
              Add Garden of Weeden to private parties, celebrations, and events with a hosted mobile weed bar experience. Jennifer handles private event scheduling and helps shape the setup around the occasion.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {bookingIdeas.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="border-t-2 border-green-800 pt-4">
                  <Icon className="h-6 w-6 text-green-800" aria-hidden="true" />
                  <p className="mt-3 font-garden text-sm font-bold uppercase tracking-wide text-battles-black">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center rounded-xl bg-battles-black px-8 py-4 font-garden text-base font-bold text-white shadow-xl transition hover:bg-green-900"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Book With Jennifer
            </a>
            <a
              href="tel:+17164201591"
              className="inline-flex items-center justify-center rounded-xl border-2 border-battles-black px-8 py-4 font-garden text-base font-bold text-battles-black transition hover:bg-white"
            >
              <CalendarDays className="mr-2 h-5 w-5" aria-hidden="true" />
              (716) 420-1591
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3 font-garden text-sm font-semibold text-black/70">
            <GlassWater className="h-5 w-5 text-green-800" aria-hidden="true" />
            <span>Mobile weed bar bookings can pair with the Forbidden Fruit lounge or stand alone for private events.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
