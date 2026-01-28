import { Award, Heart, Users, Leaf, Shield, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();
  
  const benefits = [
    {
      icon: Award,
      title: "Veteran-Crafted Quality",
      description: "Military precision in every harvest",
    },
    {
      icon: Leaf,
      title: "Sun-Grown Excellence",
      description: "Natural outdoor cultivation",
    },
    {
      icon: Shield,
      title: "Lab-Tested & Safe",
      description: "Rigorous quality assurance",
    },
    {
      icon: Sparkles,
      title: "Small-Batch Freshness",
      description: "Limited harvests, maximum care",
    },
    {
      icon: Heart,
      title: "Wellness-Focused",
      description: "Supporting healing journeys",
    },
    {
      icon: Users,
      title: "Buffalo Local",
      description: "Community-rooted cultivation",
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
            Why Choose Garden of Weeden?
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-6 rounded-full shadow-lg shadow-green-500/50"></div>
          <p className="font-garden text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the difference that veteran values and Buffalo's unique terroir make
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                className="group bg-midnight-grove/30 backdrop-blur-sm border border-green-500/20 rounded-xl p-5 text-center hover:border-green-500/50 hover:bg-midnight-grove/50 transition-all duration-300"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                  ease: "easeOut" 
                }}
              >
                <div className="bg-green-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
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
          <Link href="/shop">
            <button className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-garden font-bold text-base shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span>Shop Premium Cannabis</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
