import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-battles-black bg-opacity-95" : "bg-battles-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src={logoPath}
              alt="Battles Budz Logo"
              className="h-8 w-auto"
            />
            <span className="ml-3 text-battles-gold font-bold text-xl">
              BATTLES BUDZ
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {[
                { id: "home", label: "Home" },
                { id: "retail", label: "Retail" },
                { id: "services", label: "Services" },
                { id: "about", label: "About" },
                { id: "team", label: "Team" },
                { id: "events", label: "Events" },
                { id: "education", label: "Education" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-battles-gold px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-battles-gold"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-battles-black border-t border-battles-gold">
            {[
              { id: "home", label: "Home" },
              { id: "retail", label: "Retail" },
              { id: "services", label: "Services" },
              { id: "about", label: "About" },
              { id: "team", label: "Team" },
              { id: "events", label: "Events" },
              { id: "education", label: "Education" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
