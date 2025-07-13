import { ChevronDown } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";
import heroVideo from "@assets/received_749885827120964_1_1752390318079.mp4";
import heroBackgroundImg from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";

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
      className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden pt-10"
    >
      {/* Background video/image with overlay */}
      <div className="absolute inset-0">
        {/* Battles Budz cultivation video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroBackgroundImg}
          onError={(e) => {
            console.log('Video failed to load:', e);
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div>
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mb-8">
          <img
            src={logoPath}
            alt="Battles Budz Logo"
            className="h-44 md:h-56 w-auto mx-auto"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-4">
          <span className="text-battles-gold">Rooted in Purpose.</span>
          <br />
          <span className="text-white">Grown with Integrity.</span>
        </h1>

        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto font-light">
          Veteran-owned premium cannabis cultivation, processing, and consumption
          experiences in the heart of New York's Mohawk Valley.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollToSection("retail")}
            className="bg-battles-gold text-battles-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors w-full sm:w-auto"
          >
            Explore Products
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="border-2 border-battles-gold text-battles-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-battles-gold hover:text-battles-black transition-colors w-full sm:w-auto"
          >
            Get Launch Updates
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-battles-gold">
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </div>
    </section>
  );
}
