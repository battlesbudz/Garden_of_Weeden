import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

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
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src={logoPath}
              alt="Battles Budz Logo"
              className="h-28 w-auto"
            />
            <span className="ml-4 text-battles-gold font-bold text-xl flex items-center">
              BATTLES BUDZ
            </span>
          </Link>

          {/* Mobile menu button - Always visible with yellow styling */}
          <div className="block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-yellow-400 hover:text-yellow-300 border border-yellow-400 hover:border-yellow-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/community" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Community
              </Link>
              <button
                onClick={() => navigateToSection("about")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => navigateToSection("retail")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => navigateToSection("events")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </button>
              <Link href="/shop" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Shop
              </Link>
              <Link href="/investors" className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Investors
              </Link>

              {/* Authentication Links */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-battles-gold hover:text-battles-gold/80">
                      <User className="h-4 w-4 mr-2" />
                      {(user as any)?.email || (user as any)?.firstName || 'User'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-battles-gold/30">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="flex items-center text-white hover:text-battles-gold">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/investors" className="flex items-center text-white hover:text-battles-gold">
                            <Settings className="h-4 w-4 mr-2" />
                            Investor Portal
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/investor-admin" className="flex items-center text-white hover:text-battles-gold">
                            <Settings className="h-4 w-4 mr-2" />
                            Investor Admin
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-battles-gold/30" />
                      </>
                    )}

                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-battles-gold">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <a href="/api/login" className="bg-battles-gold hover:bg-battles-gold/90 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors">
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
            <Link href="/community" className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left" onClick={() => setIsOpen(false)}>
              Community
            </Link>
            <button
              onClick={() => navigateToSection("about")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              About
            </button>
            <button
              onClick={() => navigateToSection("retail")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              Products
            </button>
            <button
              onClick={() => navigateToSection("events")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              Events
            </button>
            <Link href="/shop" className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shop
            </Link>
            <Link href="/investors" className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left">
              Investors
            </Link>
            
            {/* Mobile Auth */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link href="/dashboard" className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                    <Link href="/investors" className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Investor Portal
                    </Link>
                    <Link href="/investor-admin" className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Investor Admin
                    </Link>

                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout ({(user as any)?.email || (user as any)?.firstName || 'User'})
                </button>
              </>
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
