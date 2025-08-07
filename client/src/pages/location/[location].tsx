import { useRoute } from 'wouter';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl } from '@/utils/seo';
import { getLocationSEO, getLocationStructuredData, centralNYLocations } from '@/data/locationSEO';
import { MapPin, Clock, Phone, Car, Users, Star } from 'lucide-react';

export default function LocationPage() {
  const [match, params] = useRoute('/location/:location');
  const locationSlug = params?.location;
  
  if (!locationSlug) {
    return <div>Location not found</div>;
  }

  const locationData = getLocationSEO(locationSlug);
  
  if (!locationData) {
    return <div>Location not found</div>;
  }

  const structuredData = getLocationStructuredData(locationData);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={locationData.seoTitle}
        description={locationData.seoDescription}
        keywords={locationData.keywords}
        canonicalUrl={getCanonicalUrl(`/location/${locationSlug}`)}
        structuredData={structuredData}
        ogType="website"
      />
      <Navigation />
      
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-black border-b border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-battles-gold transition-colors">
                Home
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">Locations</span>
              <span className="text-gray-600">/</span>
              <span className="text-battles-gold font-semibold">{locationData.city}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              <span className="text-battles-gold">Cannabis in {locationData.city}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
              Battles Budz Serving {locationData.county}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {locationData.uniqueContent.intro}
            </p>
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-battles-gold mr-2" />
                  <span>{locationData.distance}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-battles-gold mr-2" />
                  <span>{locationData.population.toLocaleString()} residents</span>
                </div>
                <div className="flex items-center">
                  <Car className="h-4 w-4 text-battles-gold mr-2" />
                  <span>Easy access</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Benefits */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8 text-center">
              Why {locationData.city} Chooses Battles Budz
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-battles-gold mb-6">Local Benefits</h3>
                <ul className="space-y-3">
                  {locationData.uniqueContent.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-5 w-5 text-battles-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-battles-gold mb-6">Local Facts</h3>
                <ul className="space-y-3">
                  {locationData.uniqueContent.localFacts.map((fact, index) => (
                    <li key={index} className="flex items-start">
                      <MapPin className="h-5 w-5 text-battles-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8 text-center">
              Battles Budz Cannabis Dispensary Details
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black rounded-lg p-6 text-center">
                <MapPin className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-battles-gold mb-2">Location</h3>
                <p className="text-gray-300">Gloversville, NY</p>
                <p className="text-gray-400 text-sm">{locationData.distance} from {locationData.city}</p>
              </div>
              
              <div className="bg-black rounded-lg p-6 text-center">
                <Clock className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-battles-gold mb-2">Status</h3>
                <p className="text-gray-300">Coming 2025</p>
                <p className="text-gray-400 text-sm">Pre-launch development</p>
              </div>
              
              <div className="bg-black rounded-lg p-6 text-center">
                <Phone className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-battles-gold mb-2">Contact</h3>
                <p className="text-gray-300">battlesbudz@gmail.com</p>
                <p className="text-gray-400 text-sm">Stay updated on opening</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-battles-gold mb-4">
                Join {locationData.city} Cannabis Community
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                {locationData.uniqueContent.callToAction}
              </p>
              <div className="space-y-4">
                <p className="text-battles-gold font-semibold">
                  Email: battlesbudz@gmail.com
                </p>
                <p className="text-gray-400">
                  Serving {locationData.city}, {locationData.county} and surrounding areas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Locations */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-playfair font-bold text-battles-gold mb-8 text-center">
              Other Locations We Serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centralNYLocations
                .filter(loc => loc.slug !== locationSlug)
                .map((location) => (
                  <Link
                    key={location.slug}
                    href={`/location/${location.slug}`}
                    className="bg-black rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <h3 className="text-battles-gold font-semibold mb-2">{location.city}</h3>
                    <p className="text-gray-400 text-sm">{location.distance}</p>
                    <p className="text-gray-300 text-sm">{location.county}</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}