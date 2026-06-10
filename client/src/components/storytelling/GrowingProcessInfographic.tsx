import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Sprout, Droplets, Sun, Flower2, Scissors, Wind, Award } from 'lucide-react';

const growingSteps = [
  {
    id: 1,
    icon: Sprout,
    title: 'Seed Selection',
    description: 'Hand-picked genetics from premium cultivars',
    color: 'from-green-900 to-green-700',
    duration: '1-2 days'
  },
  {
    id: 2,
    icon: Droplets,
    title: 'Germination',
    description: 'Controlled environment for optimal sprouting',
    color: 'from-blue-900 to-blue-700',
    duration: '3-5 days'
  },
  {
    id: 3,
    icon: Sun,
    title: 'Vegetative Growth',
    description: 'Building strong root systems and foliage',
    color: 'from-yellow-900 to-yellow-700',
    duration: '4-8 weeks'
  },
  {
    id: 4,
    icon: Flower2,
    title: 'Flowering',
    description: 'Trichome development and cannabinoid production',
    color: 'from-purple-900 to-purple-700',
    duration: '8-12 weeks'
  },
  {
    id: 5,
    icon: Scissors,
    title: 'Harvest',
    description: 'Precision timing for peak potency and flavor',
    color: 'from-orange-900 to-orange-700',
    duration: '1-2 days'
  },
  {
    id: 6,
    icon: Wind,
    title: 'Cure',
    description: 'Slow drying and curing for premium quality',
    color: 'from-teal-900 to-teal-700',
    duration: '2-4 weeks'
  },
  {
    id: 7,
    icon: Award,
    title: 'Quality Control',
    description: 'Hand-inspected for potency, purity, and craft quality',
    color: 'from-green-600 to-green-800',
    duration: 'Continuous'
  }
];

export function GrowingProcessInfographic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-storybook text-parchment mb-4">
            Our Cultivation Journey
          </h2>
          <p className="text-xl text-gray-400 font-garden max-w-3xl mx-auto">
            From seed to shelf, every step is guided by patient craft, careful handling, and local farm knowledge
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Progress Line */}
            <motion.div
              className="absolute top-20 left-0 right-0 h-1 bg-gray-700"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: prefersReducedMotion ? 0 : 1.5, delay: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
            
            <div className="grid grid-cols-7 gap-4">
              {growingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 0.5, 
                      delay: prefersReducedMotion ? 0 : 0.1 * index 
                    }}
                    className="relative"
                  >
                    {/* Icon Circle */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg border-4 border-gray-900 relative z-10`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-green-500">{step.id}</span>
                        <span className="text-xs text-gray-500 font-garden">{step.duration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-parchment mb-2 font-garden">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-garden">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    {index < growingSteps.length - 1 && (
                      <div className="absolute top-20 right-0 transform translate-x-1/2 text-green-500">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 0 L20 10 L10 20 L10 12 L0 12 L0 8 L10 8 Z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="lg:hidden space-y-6">
          {growingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : 0.1 * index 
                }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-parchment font-garden">
                      {step.title}
                    </h3>
                    <span className="text-xs text-gray-500 font-garden">{step.duration}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-garden">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < growingSteps.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-700 -mb-6" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 border border-green-500/30">
            <p className="text-lg text-white font-garden mb-2">
              <span className="font-semibold">Total Cycle:</span> Approximately 3-6 months from seed to shelf
            </p>
            <p className="text-sm text-green-200 font-garden">
              Every batch is tracked with care for consistency, quality, and a clear Farm to Flame story
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
