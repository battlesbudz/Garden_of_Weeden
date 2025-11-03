import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

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
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // We're already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav
      className="fixed w-full top-0 z-50 bg-black border-b border-yellow-500/20"
      style={{ backgroundColor: '#000000' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="nav-logo-link">
            <span className="text-2xl font-bold text-green-500" data-testid="nav-brand-name">
              Garden of Weeden
            </span>
          </Link>

          {/* Mobile menu button - Always visible with yellow styling */}
          <div className="block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-yellow-400 hover:text-yellow-300 border border-yellow-400 hover:border-yellow-300"
              data-testid="nav-mobile-menu-button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-home">
                Home
              </Link>
              <Link href="/products" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors" data-testid="nav-link-products">
                Products
              </Link>
              <Link href="/shop" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" data-testid="nav-link-shop">
                <ShoppingBag className="h-4 w-4 mr-1" aria-hidden="true" />
                Shop
              </Link>
              <button
                onClick={() => navigateToSection("contact")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-link-contact"
                aria-label="Navigate to Contact section"
              >
                Contact
              </button>

              {/* Authentication Links */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-battles-gold hover:text-battles-gold/80" data-testid="nav-user-menu-trigger">
                      <User className="h-4 w-4 mr-2" aria-hidden="true" />
                      {(user as any)?.email || (user as any)?.firstName || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-battles-gold/30">
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-battles-gold">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a href="/api/login" className="bg-battles-gold hover:bg-battles-gold/90 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors" data-testid="nav-signin-button" aria-label="Sign in to your account">
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-battles-black border-t border-battles-gold">
            <Link href="/" className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link href="/shop" className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full" onClick={() => setIsOpen(false)}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shop
            </Link>
            <button
              onClick={() => navigateToSection("contact")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              Contact
            </button>
            
            {/* Mobile Auth */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout ({(user as any)?.email || (user as any)?.firstName || 'User'})
              </button>
            ) : (
              <a href="/api/login" className="block bg-battles-gold hover:bg-battles-gold/90 text-black px-3 py-2 text-base font-semibold w-full text-center rounded">
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
