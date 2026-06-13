import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Award, Leaf, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import fieldRowsImage from "@assets/farm_rows_perspective_barn.jpg";

interface SiteSettings {
  storyTitle?: string;
  storyText?: string;
  storyButton1Text?: string;
  storyButton2Text?: string;
}

export default function BrandStorySection() {
  const prefersReducedMotion = useReducedMotion();
  const { data: settings } = useQuery<SiteSettings>({ queryKey: ["/api/site-settings"] });

  const storyTitle = settings?.storyTitle || "What Farm to Flame Means";
  const storyText =
    settings?.storyText ||
    "Farm to Flame is not a slogan. Our branded flower and pre-rolls are grown by our own farm 15 miles south of Buffalo, and our partner products come from local growers and microbusinesses we know through Cannabis Farmers Alliance relationships.";
  const storyButton1Text = settings?.storyButton1Text || "Our Full Story";
  const storyButton2Text = settings?.storyButton2Text || "Book a Private Event";

  const storyPillars = [
    { icon: Leaf, label: "Grower-known products" },
    { icon: Award, label: "Budtender guidance" },
    { icon: Users, label: "Regional farm relationships" },
  ];

  return (
    <section id="our-story" className="bg-parchment py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

        {/* Photo — left */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.75 }}
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={fieldRowsImage}
              alt="Garden of Weeden farm with homestead barn — mid-season rows 15 miles south of Buffalo"
              className="h-[480px] w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center font-garden text-xs font-bold uppercase tracking-widest text-green-800/70">
            Our Farm · Est. 2024 · Buffalo, NY
          </p>
        </motion.div>

        {/* Copy — right */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.75, delay: 0.1 }}
        >
          <p className="font-garden text-sm font-bold uppercase tracking-[0.26em] text-green-700">
            Our story
          </p>
          <h2 className="mt-3 font-enchanted text-5xl leading-tight text-black md:text-6xl">
            {storyTitle}
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-green-600" />

          <p className="mt-6 font-garden text-lg leading-relaxed text-black/80">
            {storyText}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {storyPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  className="rounded-xl border border-green-700/30 bg-green-700/10 p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-green-700" aria-hidden="true" />
                  <p className="font-garden text-xs font-semibold text-black/75">{pillar.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-transparent px-7 py-4 font-garden text-sm font-bold text-black transition hover:bg-black hover:text-white"
            >
              {storyButton1Text}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-7 py-4 font-garden text-sm font-bold text-white transition hover:bg-green-800"
            >
              {storyButton2Text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
