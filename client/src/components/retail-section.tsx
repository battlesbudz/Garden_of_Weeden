import { Sprout, Award, Heart, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

export default function RetailSection() {
  const prefersReducedMotion = useReducedMotion();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section id="retail" className="relative py-24 overflow-hidden">
      {/* Enhanced background with layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-battles-black to-midnight-grove/20"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-green-500/3 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buffalo Micro-Terroir Section */}
        <div className="mb-24">
          <motion.div 
            className="text-center mb-16"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
          >
            <h2 className="font-enchanted text-5xl md:text-6xl lg:text-7xl text-parchment mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Buffalo Micro-Terroir
            </h2>
            <div className="h-1.5 w-40 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-8 rounded-full shadow-lg shadow-green-500/50"></div>
            <p className="font-storybook text-2xl md:text-3xl text-green-400 max-w-3xl mx-auto mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Where Lake Erie Winds Meet Western New York Soil
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="group"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-green-500/30 group-hover:border-green-500/60 transition-all duration-500">
                <img 
                  src={flowerCloseupImage} 
                  alt="Garden of Weeden premium cannabis flower close-up" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-battles-black/50 via-transparent to-transparent group-hover:from-battles-black/30 transition-all duration-500"></div>
              </div>
            </motion.div>
            <motion.div 
              className="space-y-8 font-garden text-gray-300"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <p className="text-lg md:text-xl leading-relaxed">
                Our Buffalo cultivation site harnesses the unique environmental conditions of Western New York. 
                Lake Erie's moderating influence creates ideal temperature swings, while mineral-rich glacial soils 
                provide the foundation for exceptional cannabis cultivation.
              </p>
              <div className="bg-midnight-grove/50 backdrop-blur-md border border-green-500/40 rounded-2xl p-8 shadow-xl hover:border-green-500/60 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
                <h3 className="font-storybook text-xl text-parchment mb-3 flex items-center">
                  <MapPin className="h-5 w-5 text-green-500 mr-2" />
                  Terroir Advantages
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong className="text-green-500">Lake Effect Climate:</strong> Cooler summers, moderated winters</li>
                  <li>• <strong className="text-green-500">Glacial Soils:</strong> Mineral-dense growing medium</li>
                  <li>• <strong className="text-green-500">Outdoor Cultivation:</strong> Sun-grown for natural terpene development</li>
                  <li>• <strong className="text-green-500">Buffalo Pride:</strong> Supporting local Western NY economy</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cultivation Process */}
        <div className="mb-24">
          <motion.div 
            className="text-center mb-16"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
          >
            <h2 className="font-enchanted text-5xl md:text-6xl lg:text-7xl text-parchment mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Our Cultivation Process
            </h2>
            <div className="h-1.5 w-40 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-8 rounded-full shadow-lg shadow-green-500/50"></div>
            <p className="font-storybook text-2xl md:text-3xl text-green-400 max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Quality and Consistency in Every Harvest
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8 font-garden text-gray-300 order-2 md:order-1"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
            >
              <p className="text-lg md:text-xl leading-relaxed">
                Every plant receives careful attention throughout its lifecycle. Our cultivation approach 
                combines time-tested methods with hands-on experience, ensuring consistent quality 
                and excellence in every harvest.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="group bg-midnight-grove/50 backdrop-blur-md border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/70 hover:bg-midnight-grove/70 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <Sprout className="h-10 w-10 text-green-500 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h4 className="font-storybook text-lg text-parchment mb-2 group-hover:text-green-400 transition-colors">Cultivation</h4>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Sun-grown in Buffalo's unique lake-effect climate</p>
                </div>
                <div className="group bg-midnight-grove/50 backdrop-blur-md border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/70 hover:bg-midnight-grove/70 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-10 w-10 text-green-500 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h4 className="font-storybook text-lg text-parchment mb-2 group-hover:text-green-400 transition-colors">Harvest</h4>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Hand-trimmed with craft care</p>
                </div>
                <div className="group bg-midnight-grove/50 backdrop-blur-md border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/70 hover:bg-midnight-grove/70 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-10 w-10 text-green-500 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h4 className="font-storybook text-lg text-parchment mb-2 group-hover:text-green-400 transition-colors">Cure</h4>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Slow-cured for optimal flavor</p>
                </div>
                <div className="group bg-midnight-grove/50 backdrop-blur-md border border-green-500/30 rounded-xl p-6 text-center hover:border-green-500/70 hover:bg-midnight-grove/70 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-10 w-10 text-green-500 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h4 className="font-storybook text-lg text-parchment mb-2 group-hover:text-green-400 transition-colors">Local</h4>
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">Buffalo-proud, locally rooted</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2 group"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-green-500/30 group-hover:border-green-500/60 transition-all duration-500">
                <img 
                  src={dryingRacksImage} 
                  alt="Garden of Weeden drying racks showing craft curing process" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-battles-black/50 via-transparent to-transparent group-hover:from-battles-black/30 transition-all duration-500"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Farm to Flame CTA */}
        <motion.div 
          className="relative overflow-hidden text-center bg-midnight-grove/50 backdrop-blur-md border border-green-500/40 rounded-2xl p-16 shadow-2xl hover:border-green-500/70 hover:shadow-3xl hover:shadow-green-500/20 transition-all duration-500"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent"></div>
          <div className="relative z-10">
          <h3 className="font-storybook text-3xl text-parchment mb-4">
            Farm to Flame Updates
          </h3>
          <p className="font-garden text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Follow current local farm partner releases, Forbidden Fruit lounge events, and seasonal craft products.
          </p>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="bg-green-500 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-garden font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300"
            aria-label="Subscribe to newsletter for Farm to Flame updates"
            data-testid="retail-join-waitlist"
          >
            Join the Garden List
          </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
