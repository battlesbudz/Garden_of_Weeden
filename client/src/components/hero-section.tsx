import { ChevronDown } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

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
      className="relative min-h-screen flex flex-col items-center justify-start text-center bg-black overflow-x-hidden"
      style={{ margin: 0, padding: 0, marginTop: '-100px' }}
    >
      <div className="relative z-10 w-screen" style={{ margin: 0, padding: 0 }}>
        {/* Logo */}
        <div className="animate-fade-in" style={{ margin: 0, padding: 0 }}>
          <img
            src={logoPath}
            alt="Battles Budz Logo"
            className="drop-shadow-2xl block"
            style={{ 
              margin: 0, 
              padding: 0,
              display: 'block',
              width: '150vw',
              maxWidth: 'none',
              transform: 'translateX(-25vw)'
            }}
          />
        </div>

        {/* New Tagline */}
        <div 
          className="animate-fade-in-up px-4" 
          style={{ 
            marginTop: '-180px',
            padding: '0 16px'
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-8" style={{ margin: 0, lineHeight: 1 }}>
            <span className="text-battles-gold">
              Crafting Community
            </span>
            <br />
            <span className="text-white inline-block">
              and Cannabis
            </span>
          </h1>
        </div>

        {/* Supporting text */}
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto font-light text-gray-300 animate-fade-in-up animation-delay-200">
          Veteran-owned premium cannabis cultivation, processing, and consumption
          experiences in the heart of New York's Mohawk Valley.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <button
            onClick={() => scrollToSection("retail")}
            className="bg-battles-gold text-battles-black px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:shadow-lg hover:shadow-battles-gold/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Explore Products
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="border-2 border-battles-gold text-battles-gold px-10 py-4 rounded-lg font-semibold text-lg hover:bg-battles-gold hover:text-battles-black hover:shadow-lg hover:shadow-battles-gold/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Get Launch Updates
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-battles-gold animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
