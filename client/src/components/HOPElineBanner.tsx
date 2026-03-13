import { Phone } from "lucide-react";

export default function HOPElineBanner() {
  return (
    <div
      className="fixed top-0 left-0 w-full z-[60] bg-green-700 text-white"
      role="banner"
      aria-label="New York State HOPEline"
      data-testid="hopeline-banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold flex-wrap text-center">
        <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
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
