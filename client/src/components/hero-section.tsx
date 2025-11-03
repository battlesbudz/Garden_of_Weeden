import { ChevronDown, Leaf } from "lucide-react";

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
      className="relative flex flex-col items-center justify-center text-center bg-battles-black min-h-screen overflow-x-hidden py-20"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Logo/Brand */}
        <div className="animate-fade-in flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="w-16 h-16 text-green-500" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-500">
              Garden of Weeden
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <div className="animate-fade-in-up mb-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white">
            Your Premium Cannabis Destination
          </h2>
        </div>

        {/* Supporting text */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto font-light text-gray-300 animate-fade-in-up animation-delay-200">
          Discover quality cannabis products crafted for discerning enthusiasts in Buffalo, New York.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-in-up animation-delay-400 mb-8">
          <button
            onClick={() => scrollToSection("retail")}
            className="bg-battles-gold text-battles-black px-8 py-3 rounded-lg font-semibold text-base hover:bg-yellow-400 hover:shadow-lg hover:shadow-battles-gold/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Explore Products
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="border-2 border-battles-gold text-battles-gold px-8 py-3 rounded-lg font-semibold text-base hover:bg-battles-gold hover:text-battles-black hover:shadow-lg hover:shadow-battles-gold/30 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
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
