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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      },
    });
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
              <button
                onClick={() => scrollToSection("about")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("retail")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </button>
              <Link href="/shop">
                <a className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Shop
                </a>
              </Link>
              <Link href="/investors">
                <a className="text-battles-white hover:text-battles-gold px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Investors
                </a>
              </Link>

              {/* Authentication Links */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-battles-gold hover:text-battles-gold/80">
                      <User className="h-4 w-4 mr-2" />
                      {user?.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-battles-gold/30">
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            <a className="flex items-center text-white hover:text-battles-gold">
                              <Settings className="h-4 w-4 mr-2" />
                              Admin Dashboard
                            </a>
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
                <Link href="/login">
                  <a className="bg-battles-gold hover:bg-battles-gold/90 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                    Sign In
                  </a>
                </Link>
              )}
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
            <button
              onClick={() => scrollToSection("about")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("retail")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
            >
              Events
            </button>
            <Link href="/shop">
              <a className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop
              </a>
            </Link>
            <Link href="/investors">
              <a className="block text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left">
                Investors
              </a>
            </Link>
            
            {/* Mobile Auth */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/dashboard">
                    <a className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </a>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-battles-gold px-3 py-2 text-base font-medium w-full text-left"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout ({user?.username})
                </button>
              </>
            ) : (
              <Link href="/login">
                <a className="block bg-battles-gold hover:bg-battles-gold/90 text-black px-3 py-2 text-base font-semibold w-full text-center rounded">
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
