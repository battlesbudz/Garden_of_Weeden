import { ChevronDown, Award, MapPin, Heart } from "lucide-react";
import { Link } from "wouter";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center bg-battles-black min-h-screen overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={fieldRowsImage} 
          alt="Garden of Weeden cannabis cultivation" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-battles-black/80 via-battles-black/60 to-battles-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Main Headline */}
        <div className="animate-fade-in mb-6">
          <h1 className="font-enchanted text-5xl md:text-7xl lg:text-8xl text-parchment mb-4 leading-tight">
            Garden of Weeden
          </h1>
          <div className="h-1 w-32 bg-evergreen mx-auto mb-6"></div>
        </div>

        {/* Veteran-Owned Tagline */}
        <div className="animate-fade-in-up mb-8">
          <h2 className="font-storybook text-2xl md:text-4xl lg:text-5xl text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
            From Service to Soil
          </h2>
          <p className="font-garden text-xl md:text-2xl text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
            Where Military Precision Meets Botanical Mastery
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
          <div className="bg-midnight-grove/40 backdrop-blur-sm border border-evergreen/30 rounded-lg p-6 hover:border-evergreen/60 transition-all">
            <Award className="h-10 w-10 text-evergreen mx-auto mb-3" />
            <h3 className="font-storybook text-xl text-parchment mb-2">Veteran-Owned</h3>
            <p className="font-garden text-sm text-gray-300">Service-forged cultivation excellence</p>
          </div>
          <div className="bg-midnight-grove/40 backdrop-blur-sm border border-evergreen/30 rounded-lg p-6 hover:border-evergreen/60 transition-all">
            <MapPin className="h-10 w-10 text-evergreen mx-auto mb-3" />
            <h3 className="font-storybook text-xl text-parchment mb-2">Buffalo Roots</h3>
            <p className="font-garden text-sm text-gray-300">Grown in Western NY's micro-terroir</p>
          </div>
          <div className="bg-midnight-grove/40 backdrop-blur-sm border border-evergreen/30 rounded-lg p-6 hover:border-evergreen/60 transition-all">
            <Heart className="h-10 w-10 text-evergreen mx-auto mb-3" />
            <h3 className="font-storybook text-xl text-parchment mb-2">Wellness Focused</h3>
            <p className="font-garden text-sm text-gray-300">Supporting veteran healing journeys</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400 mb-12">
          <Link href="/about">
            <button
              className="bg-evergreen hover:bg-canopy text-white px-8 py-4 rounded-lg font-garden font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-evergreen/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              data-testid="hero-cta-story"
            >
              Our Story
            </button>
          </Link>
          <button
            onClick={() => scrollToSection("retail")}
            className="border-2 border-evergreen text-parchment px-8 py-4 rounded-lg font-garden font-semibold text-base hover:bg-evergreen/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
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
        <div className="inline-flex items-center gap-2 bg-midnight-grove/60 backdrop-blur-sm border border-evergreen/40 rounded-full px-6 py-3 animate-fade-in-up animation-delay-1000">
          <MapPin className="h-4 w-4 text-evergreen" />
          <span className="font-garden text-sm text-parchment font-medium">Proudly Cultivated in Buffalo, NY</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-evergreen animate-bounce z-10">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
