import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";

export default function HOPElineBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (bannerRef.current) {
        const height = bannerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--hopeline-banner-height', `${height}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 w-full z-[60] bg-green-700 text-white"
      role="banner"
      aria-label="New York State HOPEline"
      data-testid="hopeline-banner"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-center flex-wrap">
        <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        <span>
          NY HOPEline:{' '}
          <a href="tel:18778467369" className="underline hover:text-green-200 transition-colors">
            1-877-8-HOPENY (1-877-846-7369)
          </a>
          {' | Text HOPENY (467369) | '}
          <a
            href="https://hopeny.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-200 transition-colors"
          >
            hopeny.org
          </a>
        </span>
      </div>
    </div>
  );
}
