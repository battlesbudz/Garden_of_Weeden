import { useState, useEffect } from 'react';

interface OCMWarningProps {
  /** Additional CSS classes for wrapper */
  className?: string;
  /** Whether to show warning on top of page instead of bottom (default: false) */
  topPlacement?: boolean;
}

// Exact health warnings mandated by 9 NYCRR § 129.2(d)
// These four statements must rotate in cannabis advertisements
const HEALTH_WARNINGS = [
  "Cannabis can be addictive.",
  "Cannabis can impair concentration and coordination. Do not operate a vehicle or machinery under the influence of cannabis.",
  "There may be health risks associated with consumption of this product.",
  "Cannabis is not recommended for use by persons who are pregnant or nursing.",
] as const;

// General safety statement required by § 129.2(c) - must appear on all advertisements
const GENERAL_SAFETY_WARNING = "For use only by persons 21 years of age and older. Keep out of reach of children and pets. If someone accidentally consumes cannabis, contact the Poison Center. Consume responsibly." as const;

/**
 * OCMWarning Component
 * 
 * Displays New York OCM-compliant health warnings per 9 NYCRR Parts 128 & 129.
 * Features:
 * - Bright yellow background (#fff300) with black text
 * - Compliant font (Arial/Helvetica) at 12px minimum
 * - Bold, legible text
 * - Rotating health warnings
 * - WCAG 2.1 AA accessible with proper ARIA labels
 */
export function OCMWarning({ className = "", topPlacement = false }: OCMWarningProps) {
  const [rotatingWarningIndex, setRotatingWarningIndex] = useState(0);

  useEffect(() => {
    // Rotate warning every 10 seconds
    const interval = setInterval(() => {
      setRotatingWarningIndex((prev) => (prev + 1) % HEALTH_WARNINGS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const rotatingWarning = HEALTH_WARNINGS[rotatingWarningIndex];

  return (
    <div 
      className={`ocm-warning-container ${className}`}
      data-testid="ocm-warning-container"
    >
      <div 
        className="ocm-warning-box"
        role="region"
        aria-label="New York Office of Cannabis Management health warnings"
        style={{
          backgroundColor: '#fff300',
          border: '2px solid #000',
          color: '#000',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 'bold',
          fontSize: '12px',
          padding: '12px 16px',
          margin: topPlacement ? '0 auto 20px' : '20px auto 0',
          maxWidth: '800px',
          borderRadius: '4px',
          lineHeight: '1.5',
        }}
        data-testid="ocm-warning-box"
      >
        {/* General Safety Warning - Required by § 129.2(c) on all cannabis content */}
        <p 
          className="ocm-general-warning" 
          style={{ marginBottom: '10px' }}
          data-testid="ocm-general-warning"
        >
          {GENERAL_SAFETY_WARNING}
        </p>

        {/* Rotating Health Warning - Per §129.2(d) with live region for screen readers */}
        <p 
          className="ocm-rotating-warning"
          data-testid="ocm-rotating-warning"
          aria-live="polite"
          aria-atomic="true"
          role="status"
          aria-label="Rotating health warning"
        >
          {rotatingWarning}
        </p>
      </div>
    </div>
  );
}

/**
 * OCMFooterWarning Component
 * 
 * Specialized variant for footer placement with license information.
 * Includes OCM license number and compliance statement.
 */
export function OCMFooterWarning() {
  const [rotatingWarningIndex, setRotatingWarningIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWarningIndex((prev) => (prev + 1) % HEALTH_WARNINGS.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const rotatingWarning = HEALTH_WARNINGS[rotatingWarningIndex];

  return (
    <div 
      className="ocm-footer-warning-container"
      role="region"
      aria-label="New York Cannabis Management Office Compliance Information"
      data-testid="ocm-footer-warning-container"
    >
      <div 
        className="ocm-warning-box"
        style={{
          backgroundColor: '#fff300',
          border: '2px solid #000',
          color: '#000',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 'bold',
          fontSize: '12px',
          padding: '16px',
          margin: '0 auto',
          maxWidth: '100%',
          borderRadius: '4px',
          lineHeight: '1.6',
        }}
        data-testid="ocm-footer-warning-box"
      >
        {/* General Safety Warning - Required by § 129.2(c) */}
        <p 
          className="ocm-general-warning" 
          style={{ marginBottom: '10px' }}
          data-testid="ocm-footer-general-warning"
        >
          {GENERAL_SAFETY_WARNING}
        </p>

        {/* Rotating Health Warning with live region for screen readers */}
        <p 
          className="ocm-rotating-warning"
          style={{ marginBottom: '12px' }}
          data-testid="ocm-footer-rotating-warning"
          aria-live="polite"
          aria-atomic="true"
          role="status"
          aria-label="Rotating health warning"
        >
          {rotatingWarning}
        </p>

        {/* License Information */}
        <p 
          className="ocm-license-info"
          style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #000' }}
          data-testid="ocm-license-info"
        >
          New York State Licensed Microbusiness | OCMMICR-2023-000312
        </p>
      </div>

      {/* Link to OCM Consumer Site */}
      <div 
        className="text-center mt-3"
        data-testid="ocm-link-container"
      >
        <a
          href="https://cannabis.ny.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-battles-gold transition-colors text-sm underline"
          data-testid="ocm-consumer-link"
          aria-label="Visit New York Office of Cannabis Management consumer website (opens in new tab)"
        >
          New York Office of Cannabis Management - Consumer Information
        </a>
      </div>
    </div>
  );
}
