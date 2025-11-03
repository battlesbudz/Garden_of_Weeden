import { MapPin, Mail, Phone, Leaf, Award, Heart } from "lucide-react";
import { LocationLinksFooter } from '@/components/seo/LocationLinksGenerator';
import { OCMFooterWarning } from '@/components/OCMWarning';
import { SITE_CONFIG } from '@/utils/seo';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Veteran-Owned Pride Banner */}
        <div className="bg-evergreen/20 border border-evergreen/40 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-evergreen" />
              <div>
                <h3 className="font-storybook text-xl text-parchment font-semibold">Certified Veteran-Owned Business</h3>
                <p className="font-garden text-sm text-gray-300">Quality and care in every harvest</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-evergreen" />
              <div>
                <h3 className="font-storybook text-xl text-parchment font-semibold">Buffalo-Proud</h3>
                <p className="font-garden text-sm text-gray-300">Rooted in Western New York</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-evergreen" />
              <div>
                <h3 className="font-storybook text-xl text-parchment font-semibold">Community Committed</h3>
                <p className="font-garden text-sm text-gray-300">Supporting veteran wellness</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Leaf className="text-evergreen mr-3 h-8 w-8" />
              <span className="text-evergreen font-enchanted text-2xl" data-testid="footer-brand-name">
                Garden of Weeden
              </span>
            </div>
            <p className="font-garden text-gray-400 mb-4 max-w-md">
              Veteran-owned cannabis microbusiness cultivating premium flower in Buffalo, NY.
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center" data-testid="footer-address">
                <MapPin className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{SITE_CONFIG.location.address}</span>
              </p>
              <a 
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center hover:text-battles-gold transition-colors" 
                data-testid="footer-email"
                aria-label={`Email ${SITE_CONFIG.name} at ${SITE_CONFIG.contact.email}`}
              >
                <Mail className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.email}</span>
              </a>
              <a 
                href={`tel:${SITE_CONFIG.contact.phone}`}
                className="flex items-center hover:text-battles-gold transition-colors" 
                data-testid="footer-phone"
                aria-label={`Call ${SITE_CONFIG.name} at ${SITE_CONFIG.contact.phone}`}
              >
                <Phone className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-battles-gold font-semibold mb-4">Essential Links</h4>
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
                  href="#contact" 
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-contact"
                  aria-label="Contact Us"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-battles-gold font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href={SITE_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-facebook"
                  aria-label={`Follow ${SITE_CONFIG.name} on Facebook`}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href={SITE_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-instagram"
                  aria-label={`Follow ${SITE_CONFIG.name} on Instagram`}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href={SITE_CONFIG.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-battles-gold transition-colors"
                  data-testid="footer-link-twitter"
                  aria-label={`Follow ${SITE_CONFIG.name} on Twitter`}
                >
                  Twitter
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
            <p data-testid="footer-copyright">&copy; 2025 {SITE_CONFIG.businessName}. All rights reserved.</p>
            <p className="mt-2 sm:mt-0" data-testid="footer-location">{SITE_CONFIG.location.city}, {SITE_CONFIG.location.state}</p>
          </div>
        </div>
      </div>
      
      {/* Location Links for SEO */}
      <LocationLinksFooter />
      
      <div className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 {SITE_CONFIG.businessName}. All rights reserved. | {SITE_CONFIG.location.city}, {SITE_CONFIG.location.state}</p>
        </div>
      </div>
    </footer>
  );
}
