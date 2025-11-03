import { Link } from 'wouter';
import { westernNYLocations } from '@/data/locationSEO';
import { MapPin } from 'lucide-react';

// Component to generate internal links for all locations - SEO boost
export function LocationLinksFooter() {
  return (
    <section className="bg-gray-900 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-battles-gold mb-4 text-center">
          Cannabis Dispensary Serving Western New York
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {westernNYLocations.map((location) => (
            <Link
              key={location.slug}
              href={`/location/${location.slug}`}
              className="flex items-center space-x-2 text-gray-300 hover:text-battles-gold transition-colors text-sm p-2 rounded hover:bg-gray-800"
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span>Cannabis {location.city}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Premium cannabis dispensary serving Erie County, Niagara County, and Western New York suburbs
        </p>
      </div>
    </section>
  );
}

// Keywords-rich breadcrumb component
export function SEOBreadcrumbs({ currentPage, location }: { currentPage: string; location?: string }) {
  return (
    <div className="bg-black border-b border-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-400 hover:text-battles-gold transition-colors">
            Garden of Weeden Cannabis Dispensary
          </Link>
          <span className="text-gray-600">/</span>
          {location && (
            <>
              <span className="text-gray-400">Cannabis Near {location}</span>
              <span className="text-gray-600">/</span>
            </>
          )}
          <span className="text-battles-gold font-semibold">{currentPage}</span>
        </nav>
      </div>
    </div>
  );
}