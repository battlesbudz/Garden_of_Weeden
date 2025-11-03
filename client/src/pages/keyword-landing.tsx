import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl } from '@/utils/seo';

export default function KeywordLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Garden of Weeden Cannabis Buffalo - Premium Cannabis Dispensary"
        description="Garden of Weeden cannabis dispensary in Buffalo, NY. Local microbusiness offering premium cannabis products and services in Western New York."
        keywords={[
          "garden of weeden cannabis buffalo",
          "buffalo cannabis",
          "garden of weeden buffalo",
          "cannabis dispensary buffalo",
          "buffalo cannabis dispensary",
          "cannabis buffalo ny",
          "garden of weeden dispensary",
          "cannabis dispensary buffalo new york"
        ]}
        canonicalUrl={getCanonicalUrl("/buffalo-cannabis")}
        ogType="website"
      />
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              <span className="text-battles-gold">Garden of Weeden</span><br />
              Buffalo, NY
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
              Premium Cannabis Dispensary <span className="text-battles-gold">Coming Soon</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Bringing premium cannabis experiences to Buffalo and Western New York
            </p>
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-battles-gold mb-4">
                Buffalo Cannabis Business
              </h3>
              <p className="text-gray-300">
                <strong>Garden of Weeden</strong> is a local cannabis microbusiness bringing 
                legal cannabis retail and quality services to Buffalo, New York.
              </p>
            </div>
          </div>
        </section>

        {/* Key Information */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Business Details */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-playfair font-bold text-battles-gold mb-6">
                  Garden of Weeden Business Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <strong className="text-battles-gold">Business Name:</strong>
                    <p className="text-gray-300">Garden of Weeden</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Location:</strong>
                    <p className="text-gray-300">Buffalo, NY</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Business Type:</strong>
                    <p className="text-gray-300">Cannabis Microbusiness</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Status:</strong>
                    <p className="text-gray-300">Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Mission Focus */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-playfair font-bold text-battles-gold mb-6">
                  Our Commitment
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    <strong className="text-battles-gold">Garden of Weeden</strong> is dedicated to 
                    providing the Buffalo community with premium cannabis products and exceptional service.
                  </p>
                  <p className="text-gray-300">
                    This <strong className="text-battles-gold">Buffalo cannabis</strong> business 
                    is designed to serve the community with premium, safe, and legal cannabis products.
                  </p>
                  <p className="text-gray-300">
                    As a local <strong className="text-battles-gold">cannabis business</strong> in 
                    Western New York, Garden of Weeden represents values of quality, 
                    integrity, and excellence in everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products & Services */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8 text-center">
              Garden of Weeden Products & Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Cannabis Products</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Premium Cannabis Flower</li>
                  <li>• Cannabis Edibles</li>
                  <li>• Cannabis Vapes</li>
                  <li>• Cannabis Beverages</li>
                  <li>• Pre-rolls and Concentrates</li>
                </ul>
              </div>
              <div className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Cannabis Services</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Cannabis Consumption Lounge</li>
                  <li>• Cannabis Education & Training</li>
                  <li>• Cannabis Tourism Experiences</li>
                  <li>• Veteran Cannabis Consultation</li>
                  <li>• Cannabis Business Investment Opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Local SEO Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8">
              Cannabis in Buffalo, New York
            </h2>
            <div className="bg-gray-900 rounded-lg p-8">
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                <strong className="text-battles-gold">Battles Buds cannabis Buffalo</strong> will be 
                the premier destination for legal cannabis in Western New York. Our 
                <strong className="text-battles-gold"> veteran Buffalo cannabis</strong> dispensary 
                will serve adults 21+ with premium products and educational experiences.
              </p>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                As the first <strong className="text-battles-gold">veteran-owned cannabis dispensary</strong> in 
                the Buffalo area, we're committed to bringing safe, legal, and premium 
                cannabis products to our community while honoring our military heritage.
              </p>
              <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">
                  Stay Updated on Our Launch
                </h3>
                <p className="text-gray-300 mb-4">
                  Be the first to know when Battles Buds cannabis opens in Buffalo, NY
                </p>
                <p className="text-battles-gold font-semibold">
                  Email: battlesbudz@gmail.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}