import { motion, useReducedMotion } from "framer-motion";
import { Star, Shield, Leaf, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SiteSettings {
  socialProofSubtitle?: string;
  trustBadge1Title?: string;
  trustBadge1Desc?: string;
  trustBadge2Title?: string;
  trustBadge2Desc?: string;
  trustBadge3Title?: string;
  trustBadge3Desc?: string;
  trustBadge4Title?: string;
  trustBadge4Desc?: string;
  socialProofQuote?: string;
}

export default function SocialProofSection() {
  const prefersReducedMotion = useReducedMotion();

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const subtitle = settings?.socialProofSubtitle || "Trusted by Buffalo & Beyond";
  const quote = settings?.socialProofQuote || "From service to soil — bringing veteran values to cannabis cultivation";

  const trustBadges = [
    {
      icon: Shield,
      title: settings?.trustBadge1Title || "Licensed & Compliant",
      description: settings?.trustBadge1Desc || "NYS Cannabis License Holder"
    },
    {
      icon: Award,
      title: settings?.trustBadge2Title || "Veteran Excellence",
      description: settings?.trustBadge2Desc || "Military precision in cultivation"
    },
    {
      icon: Leaf,
      title: settings?.trustBadge3Title || "Sun-Grown Quality",
      description: settings?.trustBadge3Desc || "Natural outdoor cultivation"
    },
    {
      icon: Star,
      title: settings?.trustBadge4Title || "Buffalo Proud",
      description: settings?.trustBadge4Desc || "Local roots, local impact"
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-battles-black to-midnight-grove/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <p className="font-garden text-lg text-gray-400 uppercase tracking-widest">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustBadges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.1 
                }}
              >
                <div className="bg-midnight-grove/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 h-full">
                  <div className="bg-green-500/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="font-storybook text-lg text-parchment mb-2">{badge.title}</h3>
                  <p className="font-garden text-sm text-gray-400">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.4 }}
        >
          <p className="font-garden text-gray-500 italic">
            "{quote}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
