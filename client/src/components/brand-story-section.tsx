import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Award, Heart, Users } from "lucide-react";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

export default function BrandStorySection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="our-story" className="relative py-24 bg-battles-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-500/3 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
          >
            <h2 className="font-enchanted text-4xl md:text-5xl lg:text-6xl text-parchment mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              From Service to Soil
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mb-8 rounded-full"></div>
            
            <p className="font-garden text-lg text-gray-300 mb-6 leading-relaxed">
              Garden of Weeden was born from a veteran's journey—channeling the discipline, attention to detail, 
              and commitment to excellence learned in service into cultivating premium cannabis.
            </p>
            
            <p className="font-garden text-lg text-gray-300 mb-8 leading-relaxed">
              Based in Buffalo, NY, we harness Western New York's unique micro-terroir to grow sun-kissed, 
              naturally-cultivated cannabis that honors both the plant and our community.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="text-center p-4 bg-midnight-grove/30 rounded-xl border border-green-500/20">
                <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-garden text-sm text-gray-400">Veteran Values</p>
              </div>
              <div className="text-center p-4 bg-midnight-grove/30 rounded-xl border border-green-500/20">
                <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-garden text-sm text-gray-400">Wellness Focus</p>
              </div>
              <div className="text-center p-4 bg-midnight-grove/30 rounded-xl border border-green-500/20">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-garden text-sm text-gray-400">Community First</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <button className="group bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-xl font-garden font-semibold text-base transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                  <span>Read Our Full Story</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/shop">
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-garden font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Explore Products
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-green-500/30">
                <img
                  src={fieldRowsImage}
                  alt="Garden of Weeden cultivation in Buffalo, NY"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-battles-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl">
                <p className="font-storybook text-lg">Est. 2024</p>
                <p className="font-garden text-sm opacity-80">Buffalo, NY</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
