import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const navigateToSection = (sectionId: string) => {
    if (location !== "/") {
      setLocation("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
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
    <nav className="fixed w-full top-0 z-50 bg-black border-b border-battles-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" data-testid="link-home">
            <img
              src={logoPath}
              alt="Battles Budz Logo"
              className="h-32 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/shop" data-testid="link-shop">
              <Button
                variant="ghost"
                className="text-white hover:text-battles-gold hover:bg-battles-gold/10 font-semibold"
              >
                Shop Now
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-battles-gold hover:text-battles-gold/80" data-testid="button-user-menu">
                    <User className="h-5 w-5 mr-2" />
                    {(user as any)?.email || (user as any)?.firstName || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-battles-gold/30">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center text-white hover:text-battles-gold cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/investor-admin" className="flex items-center text-white hover:text-battles-gold cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Investor Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-battles-gold/30" />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/community" className="flex items-center text-white hover:text-battles-gold cursor-pointer">
                      Community
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/investors" className="flex items-center text-white hover:text-battles-gold cursor-pointer">
                      Investors
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-battles-gold/30" />
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-battles-gold cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="/api/login" data-testid="link-signin">
                <Button className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold">
                  Sign In
                </Button>
              </a>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-battles-gold hover:text-battles-gold/80"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu Button (visible on mobile) */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-battles-gold" data-testid="button-mobile-user">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-battles-gold/30">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center text-white hover:text-battles-gold cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-battles-gold/30" />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-battles-gold cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-battles-gold border border-battles-gold hover:bg-battles-gold/10"
              data-testid="button-mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-black z-40 overflow-y-auto">
          <div className="px-6 py-8 space-y-1">
            {/* Primary Navigation */}
            <div className="space-y-2 mb-8">
              <h3 className="text-battles-gold font-bold text-sm uppercase tracking-wide mb-4">Shop All</h3>
              <Link href="/shop" className="block text-white hover:text-battles-gold text-xl font-medium py-3" onClick={() => setIsOpen(false)} data-testid="link-mobile-shop">
                Shop Now
              </Link>
            </div>

            {/* Connect Section */}
            <div className="space-y-2 mb-8 border-t border-battles-gold/20 pt-6">
              <h3 className="text-battles-gold font-bold text-sm uppercase tracking-wide mb-4">Connect</h3>
              <Link href="/community" className="block text-white hover:text-battles-gold text-lg py-2" onClick={() => setIsOpen(false)} data-testid="link-mobile-community">
                Community
              </Link>
              <button
                onClick={() => navigateToSection("about")}
                className="block text-white hover:text-battles-gold text-lg py-2 w-full text-left"
                data-testid="button-mobile-about"
              >
                About Us
              </button>
              <button
                onClick={() => navigateToSection("events")}
                className="block text-white hover:text-battles-gold text-lg py-2 w-full text-left"
                data-testid="button-mobile-events"
              >
                Events
              </button>
              <Link href="/investors" className="block text-white hover:text-battles-gold text-lg py-2" onClick={() => setIsOpen(false)} data-testid="link-mobile-investors">
                Investors
              </Link>
            </div>

            {/* Auth Section */}
            {!isAuthenticated && (
              <div className="border-t border-battles-gold/20 pt-6">
                <a href="/api/login" className="block bg-battles-gold hover:bg-battles-gold/90 text-black text-center px-6 py-4 text-lg font-bold rounded-lg" data-testid="link-mobile-signin">
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
