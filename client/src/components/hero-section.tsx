import { ChevronDown, Award, MapPin, Heart } from "lucide-react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center bg-battles-black min-h-screen overflow-hidden"
    >
      {/* Background Video/Image with Enhanced Overlays */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-50">
          <VideoBackground
            videoSrc={undefined} // Replace with actual video URL when available: "/videos/garden-story.mp4"
            posterImage={fieldRowsImage}
            alt="Garden of Weeden cannabis cultivation fields in Buffalo, NY"
            className=""
            showControls={false}
            autoplay={true}
            muted={true}
            loop={true}
          />
        </div>
        {/* Sophisticated gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-battles-black/90 via-battles-black/50 to-battles-black/95"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-battles-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        {/* Main Headline - Larger & Bolder */}
        <motion.div 
          className="mb-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
        >
          <h1 className="font-enchanted text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] text-parchment mb-6 leading-[0.9] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Garden of Weeden
          </h1>
          <div className="h-1.5 w-40 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-8 rounded-full shadow-lg shadow-green-500/50"></div>
        </motion.div>

        {/* Veteran-Owned Tagline - Enhanced */}
        <motion.div 
          className="mb-10"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, delay: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <h2 className="font-storybook text-3xl md:text-5xl lg:text-6xl text-parchment drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] mb-6 tracking-wide">
            From Service to Soil
          </h2>
          <p className="font-garden text-xl md:text-3xl lg:text-4xl text-parchment/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] max-w-4xl mx-auto leading-relaxed">
            Veteran-Owned Cannabis Microbusiness in Buffalo, NY
          </p>
        </motion.div>

        {/* Three Pillars - Enhanced with sophisticated hover effects */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-14">
          <motion.div 
            className="group bg-midnight-grove/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/70 hover:bg-midnight-grove/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <Award className="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="font-storybook text-2xl text-parchment mb-3 group-hover:text-green-400 transition-colors">Veteran-Owned</h3>
            <p className="font-garden text-base text-gray-300 group-hover:text-gray-200 transition-colors">Quality cultivation by those who served</p>
          </motion.div>
          <motion.div 
            className="group bg-midnight-grove/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/70 hover:bg-midnight-grove/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="font-storybook text-2xl text-parchment mb-3 group-hover:text-green-400 transition-colors">Buffalo Roots</h3>
            <p className="font-garden text-base text-gray-300 group-hover:text-gray-200 transition-colors">Grown in Western NY's micro-terroir</p>
          </motion.div>
          <motion.div 
            className="group bg-midnight-grove/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/70 hover:bg-midnight-grove/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="font-storybook text-2xl text-parchment mb-3 group-hover:text-green-400 transition-colors">Wellness Focused</h3>
            <p className="font-garden text-base text-gray-300 group-hover:text-gray-200 transition-colors">Supporting veteran healing journeys</p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400 mb-12">
          <Link href="/about">
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-garden font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              data-testid="hero-cta-story"
            >
              Our Story
            </button>
          </Link>
          <button
            onClick={() => scrollToSection("retail")}
            className="border-2 border-green-500 text-parchment px-8 py-4 rounded-lg font-garden font-semibold text-base hover:bg-green-700/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="hero-cta-products"
          >
            Learn More
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="bg-parchment hover:bg-parchment/90 text-black px-8 py-4 rounded-lg font-garden font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="hero-cta-newsletter"
          >
            Get Updates
          </button>
        </div>

        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 bg-midnight-grove/60 backdrop-blur-sm border border-green-500/40 rounded-full px-6 py-3 animate-fade-in-up animation-delay-1000">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="font-garden text-sm text-parchment font-medium">Proudly Cultivated in Buffalo, NY</span>
        </div>
      </div>

      </section>
  );
}
