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
    // Check age verification
    const ageVerified = localStorage.getItem('ageVerified');
    const ageVerifiedDate = localStorage.getItem('ageVerifiedDate');
    
    // Check if age verification is still valid (24 hours)
    const isAgeVerificationValid = ageVerified && ageVerifiedDate && 
      (Date.now() - new Date(ageVerifiedDate).getTime()) < 24 * 60 * 60 * 1000;

    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    const tourCompleted = localStorage.getItem('tourCompleted');
    
    const isFirstVisit = !hasVisited;

    setGuideState({
      showAgeVerification: !isAgeVerificationValid,
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
    setGuideState(prev => ({
      ...prev,
      showAgeVerification: false,
      showQuickStart: false, // Go directly to homepage instead
    }));
  };

  const handleAgeDenied = () => {
    // Redirect to age-appropriate page or show denial message
    window.location.href = 'https://www.google.com';
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