import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Lightbulb, Sprout, Award, Target, Leaf } from 'lucide-react';

const timelineEvents = [
  { year: 'Farm', icon: Leaf, title: 'Local Farmer Partners', description: 'Products sourced from our farm south of Buffalo and small craft growers across Central and Western NY', highlight: 'Local Roots', position: 'left' as const },
  { year: 'Cultivation', icon: Sprout, title: 'Small-Batch Craft', description: 'Budtenders learn the cultivation practices and farmer stories behind the products on the menu', highlight: 'Craft Knowledge', position: 'right' as const },
  { year: 'Education', icon: GraduationCap, title: 'Customer Guidance', description: 'Clear cannabis education, product context, and New York compliance guide the customer experience', highlight: 'Know the Source', position: 'left' as const },
  { year: 'Dispensary', icon: Target, title: 'Garden of Weeden', description: 'A NYS licensed microbusiness dispensary serving local craft products in Buffalo, NY', highlight: 'NYS Licensed', position: 'right' as const },
  { year: 'Lounge', icon: Lightbulb, title: 'Forbidden Fruit', description: 'An on-site consumption lounge for relaxing, events, education, and private gatherings', highlight: 'Community Space', position: 'left' as const },
  { year: 'Flame', icon: Award, title: 'Farm to Flame', description: 'The full experience: local sourcing, craft cannabis, informed service, and community connection', highlight: 'The Concept', position: 'right' as const }
];

export function ServiceToSoilTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-storybook text-parchment mb-4">
            Farm to Flame
          </h2>
          <p className="text-xl text-gray-400 font-garden max-w-3xl mx-auto">
            A local craft cannabis journey from regional farms to the Forbidden Fruit lounge and dispensary menu.
          </p>
        </motion.div>

        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-600 via-green-500 to-green-600 transform -translate-x-1/2" />
          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = event.position === 'left';

              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : (isLeft ? -50 : 50) }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2 * index }}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                >
                  <div className="w-5/12">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                      <div className="mb-3">
                        <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {event.highlight}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-parchment mb-2 font-garden">{event.title}</h3>
                      <p className="text-gray-400 font-garden mb-3">{event.description}</p>
                      <div className="text-sm text-green-400 font-semibold font-garden">{event.year}</div>
                    </div>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg border-4 border-gray-900">
                      <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden space-y-8">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;

            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.15 * index }}
                className="relative flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg border-2 border-gray-900">
                    <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                    <div className="mb-2">
                      <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {event.highlight}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-parchment mb-2 font-garden">{event.title}</h3>
                    <p className="text-sm text-gray-400 font-garden mb-2">{event.description}</p>
                    <div className="text-xs text-green-400 font-semibold font-garden">{event.year}</div>
                  </div>
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-green-600 -mb-8" />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <blockquote className="relative">
            <div className="text-6xl text-green-600 opacity-30 absolute -top-4 left-1/2 transform -translate-x-1/2">"</div>
            <p className="text-2xl md:text-3xl font-storybook text-parchment italic relative z-10 max-w-4xl mx-auto">
              Farm to Flame connects local farms, craft products, and community experiences.
            </p>
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
}
