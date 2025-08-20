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
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-16 bg-black"
    >
      {/* Solid gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Subtle pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img
            src={logoPath}
            alt="Battles Budz Logo"
            className="h-48 md:h-64 lg:h-72 w-auto mx-auto drop-shadow-2xl"
          />
        </div>

        {/* New Tagline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-8 animate-fade-in-up">
          <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Crafting Community
          </span>
          <br />
          <span className="text-white mt-2 inline-block">
            and Cannabis
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto font-light text-gray-300 animate-fade-in-up animation-delay-200">
          Veteran-owned premium cannabis cultivation, processing, and consumption
          experiences in the heart of New York's Mohawk Valley.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <button
            onClick={() => scrollToSection("retail")}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-10 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Explore Products
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="border-2 border-yellow-500 text-yellow-500 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Get Launch Updates
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-yellow-500 animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
