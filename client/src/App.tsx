import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import Shop from "@/pages/shop";


import NotFound from "./pages/not-found";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import AgeVerification from "./pages/age-verification";
import KeywordLandingPage from "./pages/keyword-landing";
import LocationPage from "./pages/location/[location]";
import ProductsComingSoon from "@/pages/products-coming-soon";
import { AgeVerificationModal } from "@/components/user-guide/age-verification-modal";
import { QuickStartModal } from "@/components/user-guide/quick-start-modal";
import { UserGuideOverlay } from "@/components/user-guide/user-guide-overlay";
import { HelpButton } from "@/components/user-guide/help-button";
import { useUserGuide } from "@/hooks/useUserGuide";
import SkipNavigation from "@/components/accessibility/SkipNavigation";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <SkipNavigation />
      <ScrollToTop />
      <main id="main-content" role="main" tabIndex={-1}>
        <Switch>
          <Route path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/shop" component={Shop} />
        
        {/* Product Pages - Coming Soon */}
        <Route path="/products" component={ProductsComingSoon} />
        <Route path="/products/:slug" component={ProductsComingSoon} />
        
        {/* SEO Landing Pages */}
        <Route path="/buffalo-cannabis" component={KeywordLandingPage} />
        <Route path="/cannabis-buffalo-ny" component={KeywordLandingPage} />
        
        {/* Location-Specific SEO Pages */}
        <Route path="/location/:location" component={LocationPage} />
        
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/age-verification" component={AgeVerification} />
        <Route component={NotFound} />
      </Switch>
      </main>
    </>
  );
}

function App() {
  const userGuide = useUserGuide();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />

        {/* User Guide System */}
        <AgeVerificationModal
          isOpen={userGuide.showAgeVerification}
          onVerified={userGuide.handleAgeVerified}
          onDenied={userGuide.handleAgeDenied}
        />

        <QuickStartModal
          isOpen={userGuide.showQuickStart}
          onClose={userGuide.handleQuickStartClose}
          onStartTour={userGuide.handleStartTour}
          onOptionSelect={userGuide.handleOptionSelect}
        />

        <UserGuideOverlay
          isOpen={userGuide.showTour}
          onClose={userGuide.handleTourClose}
          onComplete={userGuide.handleTourComplete}
        />

        <HelpButton
          onStartTour={userGuide.handleShowTour}
          onShowGuide={userGuide.handleShowQuickStart}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;