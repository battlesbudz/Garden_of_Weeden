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
import InvestorsPage from "@/pages/investors";
import Education from "@/pages/education";
import EnhancedCommunityPage from "@/pages/enhanced-community";
import ForumPostPage from "@/pages/forum-post";
import NotFound from "@/pages/not-found";
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
        <Route path="/investors" component={InvestorsPage} />
        <Route path="/education" component={Education} />
        <Route path="/community" component={EnhancedCommunityPage} />
        <Route path="/community/posts/:id" component={ForumPostPage} />
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
