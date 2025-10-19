import { MapPin, Mail, Phone, AlertTriangle } from "lucide-react";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";
import { LocationLinksFooter } from '@/components/seo/LocationLinksGenerator';
import { OCMFooterWarning } from '@/components/OCMWarning';

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
                alt="Battles Budz Logo - Premium Cannabis Dispensary"
                className="h-8 w-auto mr-3"
                data-testid="footer-logo"
              />
              <span className="text-battles-gold font-bold text-xl" data-testid="footer-brand-name">
                BATTLES BUDZ
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Premium cannabis cultivation, processing, and consumption
              experiences in Buffalo, New York. Veteran-owned and
              community-focused.
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center" data-testid="footer-address">
                <MapPin className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>333 Franklin St, Buffalo NY, 14202</span>
              </p>
              <p className="flex items-center" data-testid="footer-email">
                <Mail className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <a href="mailto:battlesbudz@gmail.com" className="hover:text-battles-gold transition-colors">
                  battlesbudz@gmail.com
                </a>
              </p>
              <p className="flex items-center" data-testid="footer-phone">
                <Phone className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <a href="tel:+19044157635" className="hover:text-battles-gold transition-colors">
                  (904) 415-7635
                </a>
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
                    data-testid={`footer-link-${item.id}`}
                    aria-label={`Navigate to ${item.label} section`}
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
                <a 
                  href="/privacy-policy" 
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-privacy"
                  aria-label="View Privacy Policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms-of-service" 
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-terms"
                  aria-label="View Terms of Service"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/age-verification" 
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-age-verification"
                  aria-label="View Age Verification Policy"
                >
                  Age Verification
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* OCM Compliance Warning - Required by NY OCM Regulations */}
          <div className="mb-6">
            <OCMFooterWarning />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p data-testid="footer-copyright">&copy; 2025 Battles Budz LLC. All rights reserved.</p>
            <p className="mt-2 sm:mt-0" data-testid="footer-veteran-badge">Veteran-Owned Cannabis Business</p>
          </div>
        </div>
      </div>
      
      {/* Location Links for SEO */}
      <LocationLinksFooter />
      
      <div className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Battles Budz LLC. All rights reserved. | Veteran-Owned Cannabis Business | Buffalo, NY</p>
        </div>
      </div>
    </footer>
  );
}
