import { motion, useReducedMotion } from "framer-motion";
import { Handshake, Leaf, MapPin, Sprout, Users } from "lucide-react";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";

const networkPoints = [
  {
    icon: Sprout,
    title: "Grown by Garden of Weeden",
    text: "Our name-brand flower and pre-rolls come from our own farm 15 miles south of Buffalo.",
  },
  {
    icon: Handshake,
    title: "No Middleman",
    text: "When you buy a Garden of Weeden joint, you are buying cannabis grown by the same microbusiness selling it.",
  },
  {
    icon: Users,
    title: "Local Farm Partners",
    text: "Other products come from small craft growers, microbusinesses, and regional farms we know.",
  },
  {
    icon: Leaf,
    title: "Cannabis Farmers Alliance",
    text: "Our farm relationships include producers connected through the Cannabis Farmers Alliance.",
  },
];

export default function LocalFarmNetworkSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="local-farm-network" className="relative overflow-hidden bg-battles-black py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-midnight-grove/25 to-battles-black" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          >
            <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">
              Local Farm Network
            </p>
            <h2 className="mt-4 font-enchanted text-4xl text-parchment drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] md:text-6xl">
              Own farm. Local partners. Real relationships.
            </h2>
            <p className="mt-6 font-garden text-lg leading-relaxed text-gray-300">
              Garden of Weeden is a NYS licensed microbusiness with a farm 15 miles south of Buffalo.
              Our branded flower starts with our own cultivation, while our wider menu supports small
              family farms, women-owned, veteran-owned, minority-owned, and microbusiness producers
              across Central and Western NY.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-green-500/25 bg-midnight-grove/45 p-4">
              <MapPin className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
              <p className="font-garden text-sm text-gray-300">
                Farm to Flame means customers can trace the story from regional soil to the product they take home.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {networkPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  className="rounded-xl border border-green-500/20 bg-midnight-grove/35 p-6 shadow-xl shadow-black/20"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                >
                  <Icon className="mb-4 h-7 w-7 text-green-400" aria-hidden="true" />
                  <h3 className="font-storybook text-xl text-parchment">{point.title}</h3>
                  <p className="mt-3 font-garden text-sm leading-relaxed text-gray-400">{point.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <img src={fieldRowsImage} alt="Garden of Weeden farm rows near Buffalo" className="h-72 w-full rounded-xl object-cover" />
          <img src={flowerCloseupImage} alt="Garden of Weeden craft cannabis flower" className="h-72 w-full rounded-xl object-cover" />
        </div>
      </div>
    </section>
  );
}
