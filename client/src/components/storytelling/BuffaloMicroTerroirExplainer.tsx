import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Cloud, Droplets, ThermometerSun, Wind, MapPin, Leaf } from 'lucide-react';
import { AnimatedCounter } from '../interactive/AnimatedCounter';

const terroirFactors = [
  {
    icon: Cloud,
    title: 'Lake Effect Climate',
    stat: '25%',
    statLabel: 'More Humidity',
    description: 'Lake Erie creates unique microclimate with consistent humidity levels ideal for terpene development',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: ThermometerSun,
    title: 'Temperature Moderation',
    stat: '62°F',
    statLabel: 'Avg Year-Round',
    description: 'Lake proximity moderates extreme temperatures, creating stable growing conditions year-round',
    color: 'from-orange-500 to-orange-700'
  },
  {
    icon: Droplets,
    title: 'Natural Water Source',
    stat: '40in',
    statLabel: 'Annual Rainfall',
    description: 'Abundant natural precipitation and proximity to fresh water reserves for pure irrigation',
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    icon: Wind,
    title: 'Air Circulation',
    stat: '12mph',
    statLabel: 'Avg Wind Speed',
    description: 'Consistent lake breezes provide natural air circulation, reducing mold and promoting healthy growth',
    color: 'from-teal-500 to-teal-700'
  }
];

const soilComposition = [
  { component: 'Glacial Till', percentage: 35, color: 'bg-gray-500' },
  { component: 'Organic Matter', percentage: 30, color: 'bg-green-600' },
  { component: 'Sand & Silt', percentage: 20, color: 'bg-yellow-600' },
  { component: 'Clay', percentage: 15, color: 'bg-orange-700' }
];

export function BuffaloMicroTerroirExplainer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);

  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl md:text-5xl font-storybook text-parchment">
              Buffalo Micro-Terroir
            </h2>
          </div>
          <p className="text-xl text-gray-400 font-garden max-w-3xl mx-auto">
            Why Western New York's unique climate creates exceptional cannabis
          </p>
        </motion.div>

        {/* Climate Factors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {terroirFactors.map((factor, index) => {
            const Icon = factor.icon;
            const isSelected = selectedFactor === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : 0.1 * index 
                }}
                onMouseEnter={() => setSelectedFactor(index)}
                onMouseLeave={() => setSelectedFactor(null)}
                className={`bg-gray-800 border-2 rounded-lg p-6 transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-green-500 shadow-lg shadow-green-500/20 scale-105' 
                    : 'border-gray-700 hover:border-green-500/50'
                }`}
                data-testid={`terroir-factor-${index}`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${factor.color} flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-bold text-parchment text-center mb-2 font-garden">
                  {factor.title}
                </h3>

                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-green-500">
                    <AnimatedCounter 
                      end={parseInt(factor.stat)} 
                      suffix={factor.stat.replace(/[0-9]/g, '')}
                      duration={2}
                      isInView={isInView}
                      testId={`terroir-stat-${index}`}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-garden">{factor.statLabel}</div>
                </div>

                <p className="text-sm text-gray-400 text-center font-garden">
                  {factor.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Soil Composition Section */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-6 h-6 text-green-500" />
            <h3 className="text-2xl font-bold text-parchment font-garden">
              Western New York Soil Composition
            </h3>
          </div>

          <p className="text-gray-400 font-garden mb-6">
            Our region's unique glacial soil, enriched over millennia, provides the perfect foundation for premium cannabis cultivation.
          </p>

          <div className="space-y-4">
            {soilComposition.map((soil, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : 0.6 + (0.1 * index) 
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-parchment font-semibold font-garden">{soil.component}</span>
                  <span className="text-green-500 font-bold">
                    <AnimatedCounter 
                      end={soil.percentage} 
                      suffix="%" 
                      duration={2}
                      isInView={isInView}
                      testId={`soil-${soil.component.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                    />
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full ${soil.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${soil.percentage}%` } : {}}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 1.5, 
                      delay: prefersReducedMotion ? 0 : 0.6 + (0.1 * index),
                      ease: "easeOut"
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Impact Statement */}
        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 1 }}
          className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-8 text-center border border-green-500/30"
        >
          <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 font-garden">
            The Buffalo Advantage
          </h4>
          <p className="text-lg text-green-50 font-garden max-w-3xl mx-auto">
            Lake Erie's microclimate + glacial-enriched soil + Western New York's temperate seasons = 
            <span className="font-bold text-white"> Unparalleled terroir for craft cannabis cultivation</span>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={100} suffix="%" duration={2} isInView={isInView} testId="stat-natural-conditions" />
              </div>
              <div className="text-sm text-green-100 font-garden">Natural Growing Conditions</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={0} suffix="%" duration={2} isInView={isInView} testId="stat-artificial-enhancements" />
              </div>
              <div className="text-sm text-green-100 font-garden">Artificial Enhancements</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
