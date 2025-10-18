import { MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${heroBackgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-fade-in">
          Premium Cannabis Dispensary in Buffalo, New York
        </h1>
        
        {/* Subheading */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-battles-gold mb-8 font-semibold animate-fade-in-up animation-delay-200">
          Battles Budz: Your Western New York Cannabis Connection
        </h2>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up animation-delay-400">
          {/* Address */}
          <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-battles-gold/30">
            <MapPin className="h-6 w-6 text-battles-gold mb-2" />
            <p className="text-white font-medium text-sm">Address</p>
            <p className="text-gray-300 text-sm text-center">
              Buffalo, NY
              <br />
              <span className="text-battles-gold text-xs">(Opening 2025)</span>
            </p>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-battles-gold/30">
            <Clock className="h-6 w-6 text-battles-gold mb-2" />
            <p className="text-white font-medium text-sm">Hours</p>
            <p className="text-gray-300 text-sm text-center">
              Mon – Sat: 9AM – 9PM
              <br />
              Sundays: 10AM – 6PM
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-battles-gold/30">
            <Phone className="h-6 w-6 text-battles-gold mb-2" />
            <p className="text-white font-medium text-sm">Phone</p>
            <p className="text-gray-300 text-sm">
              Coming Soon
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <Button
            onClick={() => scrollToSection("products")}
            className="bg-battles-gold text-black px-10 py-6 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:shadow-lg hover:shadow-battles-gold/50 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="button-shop-now"
          >
            Shop Now
          </Button>
          <Button
            onClick={() => scrollToSection("about")}
            className="border-2 border-battles-gold text-battles-gold bg-transparent px-10 py-6 rounded-lg font-bold text-lg hover:bg-battles-gold hover:text-black hover:shadow-lg hover:shadow-battles-gold/50 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            data-testid="button-visit-us"
          >
            Visit Us
          </Button>
        </div>
      </div>
    </section>
  );
}
