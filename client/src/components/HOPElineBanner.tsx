import { Phone } from "lucide-react";

const BANNER_HEIGHT = 40;

export const HOPELINE_BANNER_HEIGHT = BANNER_HEIGHT;

export default function HOPElineBanner() {
  return (
    <div
      className="fixed top-0 left-0 w-full z-[60] bg-green-700 text-white"
      style={{ height: `${BANNER_HEIGHT}px` }}
      role="banner"
      aria-label="New York State HOPEline"
      data-testid="hopeline-banner"
    >
      <div className="h-full max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap overflow-hidden">
        <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">
          NY HOPEline:{' '}
          <a href="tel:18778467369" className="underline hover:text-green-200 transition-colors">
            1-877-8-HOPENY
          </a>
          <span className="hidden sm:inline"> (1-877-846-7369)</span>
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
