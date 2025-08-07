import { MapPin, Mail, Phone, AlertTriangle } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";
import { LocationLinksFooter } from '@/components/seo/LocationLinksGenerator';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src={logoPath}
                alt="Battles Budz Logo"
                className="h-8 w-auto mr-3"
              />
              <span className="text-battles-gold font-bold text-xl">
                BATTLES BUDZ
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Premium cannabis cultivation, processing, and consumption
              experiences in Gloversville, New York. Veteran-owned and
              community-focused.
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center">
                <MapPin className="text-battles-gold mr-2 h-4 w-4" />
                Gloversville, NY 12078
              </p>
              <p className="flex items-center">
                <Mail className="text-battles-gold mr-2 h-4 w-4" />
                battlesbudz@gmail.com
              </p>
              <p className="flex items-center">
                <Phone className="text-battles-gold mr-2 h-4 w-4" />
                (904) 415-7635
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-battles-gold font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { id: "home", label: "Home" },
                { id: "retail", label: "Retail" },
                { id: "services", label: "Services" },
                { id: "about", label: "About" },
                { id: "team", label: "Team" },
                { id: "events", label: "Events" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-battles-gold transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-battles-gold font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/privacy-policy" className="hover:text-battles-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-battles-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/age-verification" className="hover:text-battles-gold transition-colors">
                  Age Verification
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-yellow-900 border border-battles-gold rounded-lg p-4 mb-6">
            <h5 className="text-battles-gold font-semibold mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Legal Disclaimer
            </h5>
            <p className="text-yellow-100 text-sm">
              Battles Budz LLC operates under New York State Adult-Use Microbusiness License 
              OCMMICR-2023-000258. Must be 21+ to purchase cannabis products.
              Cannabis products have not been analyzed or approved by the FDA.
              Please consume responsibly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 Battles Budz USA. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Veteran-Owned Cannabis Business</p>
          </div>
        </div>
      </div>
      
      {/* Location Links for SEO */}
      <LocationLinksFooter />
      
      <div className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Battles Budz LLC. All rights reserved. | Veteran-Owned Cannabis Business | Gloversville, NY</p>
        </div>
      </div>
    </footer>
  );
}
