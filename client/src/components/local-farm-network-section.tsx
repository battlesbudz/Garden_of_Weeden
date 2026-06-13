import { motion, useReducedMotion } from "framer-motion";
import { Handshake, Leaf, Sprout } from "lucide-react";
import farmOvercastImage from "@assets/farm_rows_overcast_wide.jpg";
import farmMatureImage from "@assets/farm_rows_mature_canopy.jpg";

const proofPoints = [
  {
    icon: Sprout,
    title: "Own farm flower",
    text: "Our branded flower and pre-rolls come from our farm 15 miles south of Buffalo.",
  },
  {
    icon: Leaf,
    title: "Cannabis Farmers Alliance",
    text: "Our wider menu supports local small farms, microbusinesses, and regional producers we know.",
  },
  {
    icon: Handshake,
    title: "No mystery shelf",
    text: "Budtenders can speak to the growers, cultivation practices, and product story behind every item.",
  },
];

export default function LocalFarmNetworkSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="local-farm-network" className="bg-black py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">

        {/* Left: copy */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <p className="font-garden text-sm font-bold uppercase tracking-[0.26em] text-green-400">
            Local Farm Network
          </p>
          <h2 className="mt-4 font-enchanted text-5xl leading-tight text-white md:text-6xl">
            House-grown flower, sold by the source.
          </h2>
          <p className="mt-5 font-garden text-lg leading-relaxed text-gray-100">
            Most dispensaries buy flower from someone else. We are a microbusiness —
            our name-brand cannabis moves from our own cultivation directly to our own dispensary and lounge.
          </p>

          <div className="mt-8 space-y-4">
            {proofPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  className="flex gap-4 rounded-xl border border-green-500/30 bg-green-950/60 p-5"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: i * 0.1 }}
                >
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-green-400" aria-hidden="true" />
                  <div>
                    <h3 className="font-storybook text-xl text-white">{point.title}</h3>
                    <p className="mt-1 font-garden text-sm leading-relaxed text-gray-200">{point.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: two photos stacked */}
        <motion.div
          className="grid gap-4"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.1 }}
        >
          <img
            src={farmOvercastImage}
            alt="Garden of Weeden farm — wide field view on overcast day near Buffalo"
            className="h-56 w-full rounded-xl object-cover shadow-xl"
          />
          <img
            src={farmMatureImage}
            alt="Garden of Weeden mature cannabis canopy rows — mid-season growth"
            className="h-56 w-full rounded-xl object-cover shadow-xl"
          />
          <p className="text-center font-garden text-xs font-bold uppercase tracking-widest text-green-500/60">
            Garden of Weeden farm · 15 miles south of Buffalo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
