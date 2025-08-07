import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl } from '@/utils/seo';

export default function KeywordLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Battles Buds Cannabis Gloversville - Veteran Gloversville Cannabis Dispensary"
        description="Battles Buds cannabis dispensary in Gloversville, NY. Veteran-owned cannabis business by Justin Battles. Premium cannabis products and consumption lounge coming to Central New York."
        keywords={[
          "battles buds cannabis gloversville",
          "veteran gloversville cannabis",
          "battles budz gloversville",
          "justin battles cannabis",
          "gloversville cannabis veteran",
          "veteran owned cannabis gloversville ny",
          "battles buds dispensary",
          "cannabis dispensary gloversville new york"
        ]}
        canonicalUrl={getCanonicalUrl("/battles-buds-cannabis-gloversville")}
        ogType="website"
      />
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              <span className="text-battles-gold">Battles Buds Cannabis</span><br />
              Gloversville, NY
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
              Veteran-Owned Cannabis Dispensary <span className="text-battles-gold">Opening 2025</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Founded by U.S. Military Veteran Justin Battles, bringing premium cannabis 
              experiences to Gloversville and Central New York
            </p>
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-battles-gold mb-4">
                Veteran Gloversville Cannabis Business
              </h3>
              <p className="text-gray-300">
                <strong>Battles Buds</strong> (also known as Battles Budz) is a veteran-owned 
                cannabis microbusiness bringing legal cannabis retail, consumption lounge, 
                and educational experiences to Gloversville, New York.
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
                  Battles Buds Cannabis Business Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <strong className="text-battles-gold">Business Name:</strong>
                    <p className="text-gray-300">Battles Budz LLC (DBA: Battles Buds)</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Owner/Founder:</strong>
                    <p className="text-gray-300">Justin Battles, U.S. Military Veteran</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Location:</strong>
                    <p className="text-gray-300">Gloversville, New York 12078</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Business Type:</strong>
                    <p className="text-gray-300">Cannabis Microbusiness (Cultivation, Processing, Retail, Consumption Lounge)</p>
                  </div>
                  <div>
                    <strong className="text-battles-gold">Status:</strong>
                    <p className="text-gray-300">Pre-Launch Development - Coming 2025</p>
                  </div>
                </div>
              </div>

              {/* Veteran Focus */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-playfair font-bold text-battles-gold mb-6">
                  Veteran Cannabis Leadership
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    <strong className="text-battles-gold">Justin Battles</strong>, the founder 
                    of Battles Buds cannabis, is a proud U.S. Military Veteran who understands 
                    the unique needs of veterans seeking cannabis alternatives.
                  </p>
                  <p className="text-gray-300">
                    This <strong className="text-battles-gold">veteran Gloversville cannabis</strong> business 
                    is specifically designed to serve fellow veterans and the broader community 
                    with premium, safe, and legal cannabis products.
                  </p>
                  <p className="text-gray-300">
                    As a <strong className="text-battles-gold">veteran-owned cannabis business</strong> in 
                    Central New York, Battles Buds represents military values of service, 
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
              Battles Buds Cannabis Products & Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Cannabis Products</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Premium Cannabis Flower (Heirloom Landrace Strains)</li>
                  <li>• Cannabis Edibles (Cosmic Chewz)</li>
                  <li>• Cannabis Vapes (Freedom Fog)</li>
                  <li>• Cannabis Beverages (Battle Brew)</li>
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
              Cannabis in Gloversville, New York
            </h2>
            <div className="bg-gray-900 rounded-lg p-8">
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                <strong className="text-battles-gold">Battles Buds cannabis Gloversville</strong> will be 
                the premier destination for legal cannabis in Central New York. Our 
                <strong className="text-battles-gold"> veteran Gloversville cannabis</strong> dispensary 
                will serve adults 21+ with premium products and educational experiences.
              </p>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                As the first <strong className="text-battles-gold">veteran-owned cannabis dispensary</strong> in 
                the Gloversville area, we're committed to bringing safe, legal, and premium 
                cannabis products to our community while honoring our military heritage.
              </p>
              <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">
                  Stay Updated on Our Launch
                </h3>
                <p className="text-gray-300 mb-4">
                  Be the first to know when Battles Buds cannabis opens in Gloversville, NY
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