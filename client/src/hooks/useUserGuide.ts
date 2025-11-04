import { useState, useEffect } from 'react';

interface UserGuideState {
  showAgeVerification: boolean;
  showQuickStart: boolean;
  showTour: boolean;
  isFirstVisit: boolean;
}

export function useUserGuide() {
  const [guideState, setGuideState] = useState<UserGuideState>({
    showAgeVerification: false,
    showQuickStart: false,
    showTour: false,
    isFirstVisit: false,
  });

  useEffect(() => {
    // Age verification required on EVERY page load - no caching
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const tourCompleted = localStorage.getItem('tourCompleted');
    
    const isFirstVisit = !hasVisited;

    setGuideState({
      showAgeVerification: true, // Always show on every page load
      showQuickStart: false, // Only show when explicitly requested
      showTour: false,
      isFirstVisit,
    });

    // Mark as visited
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleAgeVerified = () => {
    console.log('AGE GATE: handleAgeVerified called - closing modal');
    setGuideState(prev => {
      const newState = {
        ...prev,
        showAgeVerification: false,
        showQuickStart: false, // Go directly to homepage instead
      };
      console.log('AGE GATE: New state set', newState);
      return newState;
    });
  };

  const handleAgeDenied = () => {
    // Per NY OCM regulations: redirect under-21 users away from cannabis content
    // Clear any age verification data to prevent bypass
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('ageVerifiedDate');
    
    // Redirect to NY OCM consumer education site
    window.location.href = 'https://cannabis.ny.gov/consumers';
  };

  const handleQuickStartClose = () => {
    setGuideState(prev => ({
      ...prev,
      showQuickStart: false,
    }));
  };

  const handleStartTour = () => {
    setGuideState(prev => ({
      ...prev,
      showQuickStart: false,
      showTour: true,
    }));
  };

  const handleTourComplete = () => {
    localStorage.setItem('tourCompleted', 'true');
    setGuideState(prev => ({
      ...prev,
      showTour: false,
    }));
  };

  const handleTourClose = () => {
    setGuideState(prev => ({
      ...prev,
      showTour: false,
    }));
  };

  const handleShowQuickStart = () => {
    setGuideState(prev => ({
      ...prev,
      showQuickStart: true,
    }));
  };

  const handleShowTour = () => {
    setGuideState(prev => ({
      ...prev,
      showTour: true,
    }));
  };

  const handleOptionSelect = (path: string) => {
    // Navigate to the selected path
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = path;
    }
  };

  return {
    ...guideState,
    handleAgeVerified,
    handleAgeDenied,
    handleQuickStartClose,
    handleStartTour,
    handleTourComplete,
    handleTourClose,
    handleShowQuickStart,
    handleShowTour,
    handleOptionSelect,
  };
}