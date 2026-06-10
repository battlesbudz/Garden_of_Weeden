import { Award, Heart, Users, Leaf, Shield, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SiteSettings {
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefit1Title?: string;
  benefit1Desc?: string;
  benefit2Title?: string;
  benefit2Desc?: string;
  benefit3Title?: string;
  benefit3Desc?: string;
  benefit4Title?: string;
  benefit4Desc?: string;
  benefit5Title?: string;
  benefit5Desc?: string;
  benefit6Title?: string;
  benefit6Desc?: string;
  benefitsCtaText?: string;
}

export default function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();
  
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const benefitsTitle = settings?.benefitsTitle || "Why Choose Garden of Weeden?";
  const benefitsSubtitle = settings?.benefitsSubtitle || "Farm to Flame means local farmers, small-batch craft products, and budtenders who know the story behind the cannabis.";
  const benefitsCtaText = settings?.benefitsCtaText || "Shop Farm to Flame";

  const icons = [Award, Leaf, Shield, Sparkles, Heart, Users];

  const benefits = [
    {
      icon: icons[0],
      title: settings?.benefit1Title || "Local Farm Partners",
      description: settings?.benefit1Desc || "Products sourced from our farm and NYS small craft growers",
    },
    {
      icon: icons[1],
      title: settings?.benefit2Title || "Sun-Grown Excellence",
      description: settings?.benefit2Desc || "Natural outdoor cultivation",
    },
    {
      icon: icons[2],
      title: settings?.benefit3Title || "Lab-Tested Products",
      description: settings?.benefit3Desc || "Compliance-minded quality standards",
    },
    {
      icon: icons[3],
      title: settings?.benefit4Title || "Small-Batch Freshness",
      description: settings?.benefit4Desc || "Limited harvests, maximum care",
    },
    {
      icon: icons[4],
      title: settings?.benefit5Title || "Forbidden Fruit Lounge",
      description: settings?.benefit5Desc || "On-site consumption space for relaxing, events, and community",
    },
    {
      icon: icons[5],
      title: settings?.benefit6Title || "Buffalo Local",
      description: settings?.benefit6Desc || "Community-rooted cultivation",
    },
  ];

  return (
    <section id="services" className="relative py-20 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-midnight-grove/20 to-battles-black"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-14"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
        >
          <h2 className="font-enchanted text-4xl md:text-5xl lg:text-6xl text-parchment mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {benefitsTitle}
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-6 rounded-full shadow-lg shadow-green-500/50"></div>
          <p className="font-garden text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {benefitsSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-midnight-grove/30 backdrop-blur-sm border border-green-500/20 rounded-xl p-5 text-center"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: "easeOut" 
                }}
              >
                <div className="bg-green-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="text-green-500 h-6 w-6" />
                </div>
                <h3 className="font-storybook text-sm md:text-base mb-1 text-parchment">
                  {benefit.title}
                </h3>
                <p className="font-garden text-xs text-gray-400">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
        >
          <Link
            href="/shop"
            className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-garden font-bold text-base shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>{benefitsCtaText}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
