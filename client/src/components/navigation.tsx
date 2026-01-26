import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, ShoppingBag, LogOut, Shield } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { SITE_CONFIG } from "@/utils/seo";
import logoImage from "@assets/garden_of_weeden_logo_transparent_1762191379653.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Debug auth state
  console.log('Navigation - Auth State:', { user, isAuthenticated, isAdmin });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first
    if (location !== "/") {
      setLocation("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      }, 100);
    } else {
      // We're already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-battles-black/95 backdrop-blur-md shadow-lg shadow-green-500/10 border-b border-green-500/30' 
          : 'bg-battles-black/80 backdrop-blur-sm border-b border-green-500/20'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="nav-logo-link">
            <img 
              src={logoImage}
              alt="Garden of Weeden Logo" 
              className={`w-auto rounded-full transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'}`}
              style={{ backgroundColor: 'transparent', mixBlendMode: 'normal' }}
            />
          </Link>

          {/* Mobile menu button - Always visible with green styling */}
          <div className="block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-500 hover:text-parchment border border-green-500 hover:border-parchment"
              data-testid="nav-mobile-menu-button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-home">
                Home
              </Link>
              <Link href="/about" className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-about">
                Our Story
              </Link>
              <Link href="/blog" className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-blog">
                Blog
              </Link>
              <Link href="/products" className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-products">
                Products
              </Link>
              <Link href="/shop" className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" data-testid="nav-link-shop">
                <ShoppingBag className="h-4 w-4 mr-1" aria-hidden="true" />
                Shop
              </Link>
              <button
                onClick={() => navigateToSection("contact")}
                className="font-garden text-battles-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-link-contact"
                aria-label="Navigate to Contact section"
              >
                Contact
              </button>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2 border-l border-green-500/30 pl-4 ml-2">
                <a
                  href={SITE_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-all duration-300 hover:scale-110"
                  aria-label={`Follow ${SITE_CONFIG.name} on Instagram`}
                  data-testid="nav-social-instagram"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>
              </div>

              {/* Admin Link - Only visible to admins */}
              {isAdmin && (
                <Link href="/admin" className="font-garden text-battles-gold hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" data-testid="nav-link-admin">
                  <Shield className="h-4 w-4 mr-1" aria-hidden="true" />
                  Admin
                </Link>
              )}

              {/* Authentication Links */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="font-garden text-green-500 hover:text-parchment" data-testid="nav-user-menu-trigger">
                      <User className="h-4 w-4 mr-2" aria-hidden="true" />
                      {(user as any)?.email || (user as any)?.firstName || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-green-500/30">
                    {isAdmin && (
                      <DropdownMenuItem asChild className="text-battles-gold hover:text-yellow-400">
                        <Link href="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-green-400">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a href="/api/login" className="font-garden bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors" data-testid="nav-signin-button" aria-label="Sign in to your account">
                  Sign In
                </a>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="block">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-battles-black border-t border-green-500">
            <Link href="/" className="font-garden block text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="font-garden block text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Our Story
            </Link>
            <Link href="/blog" className="font-garden block text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)} data-testid="mobile-nav-link-blog">
              Blog
            </Link>
            <Link href="/products" className="font-garden block text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/shop" className="font-garden flex items-center text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full" onClick={() => setIsOpen(false)}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shop
            </Link>
            <button
              onClick={() => navigateToSection("contact")}
              className="font-garden block text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left"
            >
              Contact
            </button>
            
            {/* Admin Link - Mobile */}
            {isAdmin && (
              <Link href="/admin" className="font-garden flex items-center text-battles-gold hover:text-yellow-400 px-3 py-2 text-base font-medium w-full" onClick={() => setIsOpen(false)}>
                <Shield className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            )}

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="font-garden flex items-center text-white hover:text-green-400 px-3 py-2 text-base font-medium w-full text-left"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout ({(user as any)?.email || (user as any)?.firstName || 'User'})
              </button>
            ) : (
              <a href="/api/login" className="font-garden block bg-green-500 hover:bg-green-700 text-white px-3 py-2 text-base font-semibold w-full text-center rounded">
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
