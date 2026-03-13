/**
 * SkipNavigation Component
 * 
 * Provides a "Skip to main content" link for keyboard and screen reader users
 * to bypass navigation and jump directly to the main content.
 * 
 * WCAG 2.1 Level A - Success Criterion 2.4.1 (Bypass Blocks)
 */

import { useReducedMotion } from "framer-motion";

export default function SkipNavigation() {
  const prefersReducedMotion = useReducedMotion();
  
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      // Also scroll into view for visual confirmation
      mainContent.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkipClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-12 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-battles-gold focus:text-black focus:font-semibold focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-battles-gold focus:ring-offset-2"
      data-testid="skip-navigation-link"
    >
      Skip to main content
    </a>
  );
}
