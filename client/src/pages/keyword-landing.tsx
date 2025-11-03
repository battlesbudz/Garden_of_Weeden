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
            <h1 className="font-enchanted text-4xl md:text-6xl mb-6 text-parchment">
              Garden of Weeden<br />
              <span className="text-green-500">Buffalo, NY</span>
            </h1>
            <div className="h-1 w-32 bg-green-500 mx-auto mb-6"></div>
            <h2 className="font-storybook text-2xl md:text-3xl mb-6 text-green-400">
              Veteran-Owned Cannabis Microbusiness <span className="text-parchment">Coming Soon</span>
            </h2>
            <p className="font-garden text-xl text-gray-300 mb-8">
              From service to soil: veteran-owned craft cannabis cultivation in Western New York
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-storybook text-xl text-parchment mb-4">
                Buffalo's Veteran-Owned Cannabis Garden
              </h3>
              <p className="font-garden text-gray-300">
                <strong className="text-green-500">Garden of Weeden</strong> is a veteran-owned cannabis microbusiness 
                rooted in Buffalo, New York. Where military-grade precision meets botanical mastery.
              </p>
            </div>
          </div>
        </section>

        {/* Key Information */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Business Details */}
              <div className="bg-gray-900 rounded-lg p-8 border border-green-500/20">
                <h2 className="font-storybook text-2xl text-parchment mb-6">
                  Garden of Weeden Business Details
                </h2>
                <div className="space-y-4 font-garden">
                  <div>
                    <strong className="text-green-500">Business Name:</strong>
                    <p className="text-gray-300">Garden of Weeden LLC</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Location:</strong>
                    <p className="text-gray-300">Buffalo, NY (Western New York)</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Business Type:</strong>
                    <p className="text-gray-300">Veteran-Owned Cannabis Microbusiness</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Cultivation:</strong>
                    <p className="text-gray-300">Outdoor Buffalo Micro-Terroir</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Status:</strong>
                    <p className="text-gray-300">Coming Soon - Join Waitlist</p>
                  </div>
                </div>
              </div>

              {/* Mission Focus */}
              <div className="bg-gray-900 rounded-lg p-8 border border-green-500/20">
                <h2 className="font-storybook text-2xl text-parchment mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 font-garden">
                  <p className="text-gray-300">
                    <strong className="text-green-500">Garden of Weeden</strong> brings dedication 
                    and veteran-earned values to Buffalo's cannabis community.
                  </p>
                  <p className="text-gray-300">
                    This <strong className="text-green-500">veteran-owned Buffalo cannabis</strong> operation 
                    cultivates premium flower in Western New York's unique micro-terroir.
                  </p>
                  <p className="text-gray-300">
                    As a local <strong className="text-green-500">cannabis microbusiness</strong>, 
                    we're committed to veteran wellness, community service, and botanical excellence.
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