import { motion, useReducedMotion } from "framer-motion";
import { Handshake, Leaf, Sprout } from "lucide-react";
// Contrasting pair: overcast wide-field (shows scale) + mature canopy rows (shows yield)
import farmOvercastImage from "@assets/farm_rows_overcast_wide.jpg";
import farmMatureImage from "@assets/farm_rows_mature_canopy.jpg";

const proofPoints = [
  {
    icon: Sprout,
    title: "Own farm flower",
    text: "Garden of Weeden branded flower and pre-rolls come from the company farm 15 miles south of Buffalo.",
  },
  {
    icon: Leaf,
    title: "Cannabis Farmers Alliance",
    text: "The wider menu supports local small farms, microbusinesses, and regional producers they know.",
  },
  {
    icon: Handshake,
    title: "No mystery shelf",
    text: "Budtenders can speak to the growers, cultivation practices, and product story behind the menu.",
  },
];

export default function LocalFarmNetworkSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="local-farm-network" className="bg-midnight-grove/20 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65 }}
        >
          <p className="font-garden text-sm font-semibold uppercase tracking-[0.24em] text-green-400">Farm to Flame</p>
          <h2 className="mt-4 max-w-3xl font-enchanted text-5xl leading-none text-parchment md:text-7xl">
            House-grown flower, sold by the source.
          </h2>
          <p className="mt-6 max-w-2xl font-garden text-lg leading-relaxed text-gray-300">
            Most dispensaries buy flower from someone else. Garden of Weeden is a microbusiness, so its name-brand cannabis can move from their own cultivation to their own dispensary and lounge.
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden border border-green-500/25 bg-battles-black shadow-2xl"
          initial={{ opacity: 1, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: prefersReducedMotion ? 0 : 0.1 }}
        >
          {/* Two-photo grid: overcast wide shot on top, mature canopy below */}
          <div className="grid grid-cols-2 gap-0.5 bg-green-500/10">
            <img
              src={farmOvercastImage}
              alt="Garden of Weeden farm rows on overcast day — full field scale near Buffalo"
              className="h-48 w-full object-cover"
            />
            <img
              src={farmMatureImage}
              alt="Garden of Weeden mature cannabis canopy rows — mid-season growth"
              className="h-48 w-full object-cover"
            />
          </div>
          <div className="divide-y divide-white/10">
            {proofPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                  <Icon className="mt-1 h-6 w-6 text-green-400" aria-hidden="true" />
                  <div>
                    <h3 className="font-storybook text-xl text-parchment">{point.title}</h3>
                    <p className="mt-1 font-garden text-sm leading-relaxed text-gray-400">{point.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
