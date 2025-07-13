import { ChevronDown } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

interface VideoHeroSectionProps {
  videoSrc?: string;
  fallbackImage?: string;
}

export default function VideoHeroSection({ 
  videoSrc, 
  fallbackImage = "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
}: VideoHeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden pt-20"
    >
      {/* Background video or image with overlay */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={fallbackImage}
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Fallback to image if video fails */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('${fallbackImage}')`,
              }}
            />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('${fallbackImage}')`,
            }}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <img
            src={logoPath}
            alt="Battles Budz Logo"
            className="h-24 w-auto mx-auto mb-6"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
          <span className="text-battles-gold">Rooted in Purpose.</span>
          <br />
          <span className="text-white">Grown with Integrity.</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-battles-gold" />
      </div>
    </section>
  );
}