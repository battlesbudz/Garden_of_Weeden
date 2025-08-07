import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Shop from "@/pages/shop";


import EnhancedCommunityPage from "@/pages/enhanced-community";
import ForumPostPage from "@/pages/forum-post";
import InvestorPortal from "@/pages/investor-portal";
import InvestorAdmin from "@/pages/investor-admin";

// Product Pages
import BattleBrewPage from "@/pages/products/battle-brew";
import CosmicChewzPage from "@/pages/products/cosmic-chewz";
import FreedomFogVapesPage from "@/pages/products/freedom-fog-vapes";
import HeirloomFlowerPage from "@/pages/products/heirloom-flower";


import NotFound from "./pages/not-found";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import AgeVerification from "./pages/age-verification";
import KeywordLandingPage from "./pages/keyword-landing";
import LocationPage from "./pages/location/[location]";
import { AgeVerificationModal } from "@/components/user-guide/age-verification-modal";
import { QuickStartModal } from "@/components/user-guide/quick-start-modal";
import { UserGuideOverlay } from "@/components/user-guide/user-guide-overlay";
import { HelpButton } from "@/components/user-guide/help-button";
import { useUserGuide } from "@/hooks/useUserGuide";

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
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/shop" component={Shop} />
        <Route path="/investors" component={InvestorPortal} />
        <Route path="/investor-portal" component={InvestorPortal} />

        <Route path="/community" component={EnhancedCommunityPage} />
        <Route path="/community/posts/:id" component={ForumPostPage} />
        <Route path="/investor-admin" component={InvestorAdmin} />

        {/* Product Pages */}
        <Route path="/products/battle-brew" component={BattleBrewPage} />
        <Route path="/products/cosmic-chewz" component={CosmicChewzPage} />
        <Route path="/products/freedom-fog-vapes" component={FreedomFogVapesPage} />
        <Route path="/products/heirloom-flower" component={HeirloomFlowerPage} />
        
        {/* SEO Landing Pages */}
        <Route path="/battles-buds-cannabis-gloversville" component={KeywordLandingPage} />
        <Route path="/veteran-gloversville-cannabis" component={KeywordLandingPage} />
        <Route path="/justin-battles-cannabis" component={KeywordLandingPage} />
        
        {/* Location-Specific SEO Pages */}
        <Route path="/location/:location" component={LocationPage} />

        <Route path="/enhanced-community" component={EnhancedCommunityPage} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/age-verification" component={AgeVerification} />
        <Route component={NotFound} />
      </Switch>
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