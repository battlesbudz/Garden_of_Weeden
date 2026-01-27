import { MapPin, Mail, Phone, Leaf, Award, Heart } from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { useReducedMotion } from "framer-motion";
import { LocationLinksFooter } from '@/components/seo/LocationLinksGenerator';
import { OCMFooterWarning } from '@/components/OCMWarning';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const { settings } = useSiteSettings();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Veteran-Owned Pride Banner */}
        <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-storybook text-xl text-parchment font-semibold">Certified Veteran-Owned Business</h3>
                <p className="font-garden text-sm text-gray-300">Quality and care in every harvest</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-storybook text-xl text-parchment font-semibold">Buffalo-Proud</h3>
                <p className="font-garden text-sm text-gray-300">Rooted in Western New York</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-green-500" />
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
              <Leaf className="text-green-500 mr-3 h-8 w-8" />
              <span className="text-green-500 font-enchanted text-2xl" data-testid="footer-brand-name">
                {settings.siteName}
              </span>
            </div>
            <p className="font-garden text-gray-400 mb-4 max-w-md">
              {settings.siteTagline || "Veteran-owned cannabis microbusiness cultivating premium flower in Buffalo, NY."}
            </p>
            <div className="text-gray-400 space-y-2">
              <p className="flex items-center" data-testid="footer-address">
                <MapPin className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{settings.address}</span>
              </p>
              <a 
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center hover:text-battles-gold transition-colors" 
                data-testid="footer-email"
                aria-label={`Email ${settings.siteName} at ${settings.contactEmail}`}
              >
                <Mail className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{settings.contactEmail}</span>
              </a>
              <a 
                href={`tel:${settings.contactPhone}`}
                className="flex items-center hover:text-battles-gold transition-colors" 
                data-testid="footer-phone"
                aria-label={`Call ${settings.siteName} at ${settings.contactPhone}`}
              >
                <Phone className="text-battles-gold mr-2 h-4 w-4" aria-hidden="true" />
                <span>{settings.contactPhone}</span>
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
            <div className="space-y-3">
              {settings.instagramUrl && (
                <a 
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300"
                  data-testid="footer-link-instagram"
                  aria-label={`Follow ${settings.siteName} on Instagram`}
                >
                  <FaInstagram className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-garden text-sm text-gray-300 group-hover:text-green-500 transition-colors">Instagram</div>
                    <div className="font-garden text-xs text-gray-500">Follow our journey</div>
                  </div>
                </a>
              )}
              {settings.facebookUrl && (
                <a 
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-blue-500/20 transition-all duration-300"
                  data-testid="footer-link-facebook"
                  aria-label={`Follow ${settings.siteName} on Facebook`}
                >
                  <FaFacebook className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-garden text-sm text-gray-300 group-hover:text-blue-500 transition-colors">Facebook</div>
                    <div className="font-garden text-xs text-gray-500">Like our page</div>
                  </div>
                </a>
              )}
              {settings.twitterUrl && (
                <a 
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 hover:border-sky-500 hover:bg-sky-500/20 transition-all duration-300"
                  data-testid="footer-link-twitter"
                  aria-label={`Follow ${settings.siteName} on Twitter`}
                >
                  <FaTwitter className="h-6 w-6 text-gray-400 group-hover:text-sky-500 transition-colors flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-garden text-sm text-gray-300 group-hover:text-sky-500 transition-colors">Twitter / X</div>
                    <div className="font-garden text-xs text-gray-500">Follow us</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* OCM Compliance Warning - Required by NY OCM Regulations */}
          <div className="mb-6">
            <OCMFooterWarning />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p data-testid="footer-copyright">&copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
            <p className="mt-2 sm:mt-0" data-testid="footer-location">{settings.address}</p>
          </div>
          {settings.footerText && (
            <p className="text-gray-500 text-xs mt-4 text-center">{settings.footerText}</p>
          )}
        </div>
      </div>
      
      {/* Location Links for SEO */}
      <LocationLinksFooter />
      
      <div className="bg-black py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved. | {settings.address}</p>
        </div>
      </div>
    </footer>
  );
}
