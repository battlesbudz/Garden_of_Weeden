import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Shield, GraduationCap, Lightbulb, Sprout, Award, Target } from 'lucide-react';

const timelineEvents = [
  {
    year: 'Military Service',
    icon: Shield,
    title: 'Service & Dedication',
    description: 'Learning discipline, precision, and commitment to excellence through military service',
    highlight: 'Foundation of Enchanted Grit',
    position: 'left' as const
  },
  {
    year: 'Transition',
    icon: Target,
    title: 'Finding Purpose',
    description: 'Transitioning from service to civilian life, discovering cannabis as wellness and mission',
    highlight: 'A New Chapter',
    position: 'right' as const
  },
  {
    year: 'Education',
    icon: GraduationCap,
    title: 'Cannabis Education',
    description: 'Deep dive into cultivation science, New York cannabis regulations, and business fundamentals',
    highlight: 'Knowledge is Power',
    position: 'left' as const
  },
  {
    year: 'Vision',
    icon: Lightbulb,
    title: 'The Garden Vision',
    description: 'Conceptualizing Garden of Weeden: merging Wizard of Oz whimsy with veteran values',
    highlight: 'Enchanted Grit Born',
    position: 'right' as const
  },
  {
    year: 'Launch',
    icon: Sprout,
    title: 'Business Launch',
    description: 'Establishing Buffalo\'s veteran-owned cannabis microbusiness with OCM compliance',
    highlight: 'Dreams Taking Root',
    position: 'left' as const
  },
  {
    year: 'Future',
    icon: Award,
    title: 'Leading the Industry',
    description: 'Setting the standard for craft cannabis quality, veteran entrepreneurship, and community impact',
    highlight: 'The Journey Continues',
    position: 'right' as const
  }
];

export function ServiceToSoilTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30l15-15M30 30l-15 15M30 30l15 15M30 30l-15-15' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-storybook text-parchment mb-4">
            Service to Soil
          </h2>
          <p className="text-xl text-gray-400 font-garden max-w-3xl mx-auto">
            A veteran's journey from military precision to craft cannabis cultivation
          </p>
        </motion.div>

        {/* Desktop: Alternating Timeline */}
        <div className="hidden md:block relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-600 via-green-500 to-green-600 transform -translate-x-1/2" />

          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = event.position === 'left';

              return (
                <motion.div
                  key={index}
                  initial={{ 
                    opacity: 0, 
                    x: prefersReducedMotion ? 0 : (isLeft ? -50 : 50) 
                  }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: prefersReducedMotion ? 0 : 0.6, 
                    delay: prefersReducedMotion ? 0 : 0.2 * index 
                  }}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                >
                  {/* Content Card */}
                  <div className="w-5/12">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                      <div className="mb-3">
                        <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {event.highlight}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-parchment mb-2 font-garden">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 font-garden mb-3">
                        {event.description}
                      </p>
                      <div className="text-sm text-green-400 font-semibold font-garden">
                        {event.year}
                      </div>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg border-4 border-gray-900">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Linear Timeline */}
        <div className="md:hidden space-y-8">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : 0.15 * index 
                }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg border-2 border-gray-900">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                    <div className="mb-2">
                      <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {event.highlight}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-parchment mb-2 font-garden">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-garden mb-2">
                      {event.description}
                    </p>
                    <div className="text-xs text-green-400 font-semibold font-garden">
                      {event.year}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < timelineEvents.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-green-600 -mb-8" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <blockquote className="relative">
            <div className="text-6xl text-green-600 opacity-30 absolute -top-4 left-1/2 transform -translate-x-1/2">"</div>
            <p className="text-2xl md:text-3xl font-storybook text-parchment italic relative z-10 max-w-4xl mx-auto">
              From military precision to craft cultivation — where service meets soil and excellence grows.
            </p>
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}
