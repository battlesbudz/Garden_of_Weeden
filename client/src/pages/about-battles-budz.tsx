import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle } from '@/utils/seo';

export default function AboutBattlesBudzPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="About Battles Budz - Veteran-Owned Cannabis Dispensary Gloversville NY"
        description="Learn about Battles Budz, the premier veteran-owned cannabis dispensary coming to Gloversville, NY. Founded by U.S. Military Veteran Justin Battles, offering premium cannabis products and consumption lounge experiences."
        keywords={[
          "Battles Budz",
          "Justin Battles veteran",
          "veteran owned cannabis business",
          "Gloversville NY cannabis dispensary",
          "battles budz cannabis story", 
          "military veteran cannabis entrepreneur",
          "cannabis microbusiness New York",
          "veteran cannabis dispensary",
          "Gloversville cannabis business"
        ]}
        canonicalUrl={getCanonicalUrl("/about-battles-budz")}
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
              <span className="text-battles-gold font-semibold">About Battles Budz</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              About <span className="text-battles-gold">Battles Budz</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The story of a U.S. Military Veteran bringing premium cannabis experiences to Gloversville, New York
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Founder Story */}
            <div className="bg-gray-900 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-6">
                Founded by Veteran Justin Battles
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Battles Budz was founded by <strong className="text-battles-gold">Justin Battles</strong>, 
                  a proud U.S. Military Veteran who served our country with honor and distinction. After completing 
                  his military service, Justin discovered the transformative power of cannabis for veterans dealing 
                  with service-related challenges.
                </p>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Recognizing the need for a premium, veteran-focused cannabis experience in Central New York, 
                  Justin established <strong className="text-battles-gold">Battles Budz LLC</strong> as a 
                  microbusiness dedicated to cultivation, processing, retail, and consumption lounge operations 
                  in Gloversville, NY.
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-gray-900 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-6">
                Our Mission: Premium Cannabis for Everyone
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">For Veterans</h3>
                  <p className="text-gray-300 mb-4">
                    Providing fellow veterans with safe, premium cannabis alternatives to traditional 
                    treatments, in a welcoming environment that understands military culture.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">For the Community</h3>
                  <p className="text-gray-300 mb-4">
                    Bringing legal, regulated cannabis products and educational experiences to 
                    Gloversville and the broader Central New York region.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Overview */}
            <div className="bg-gray-900 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-6">
                Battles Budz Cannabis Business
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Products & Services</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Premium Cannabis Flower (Heirloom Landrace Strains)</li>
                    <li>• Cannabis Edibles (Cosmic Chewz Brand)</li>
                    <li>• Cannabis Vapes (Freedom Fog Brand)</li>
                    <li>• Cannabis Beverages (Battle Brew Brand)</li>
                    <li>• Cannabis Consumption Lounge</li>
                    <li>• Cannabis Education & Tourism</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Business Details</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Business Name:</strong> Battles Budz LLC</li>
                    <li>• <strong>Owner:</strong> Justin Battles (U.S. Veteran)</li>
                    <li>• <strong>Location:</strong> Gloversville, NY 12078</li>
                    <li>• <strong>License Type:</strong> Cannabis Microbusiness</li>
                    <li>• <strong>Status:</strong> Pre-Launch Development</li>
                    <li>• <strong>Expected Opening:</strong> 2025</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-900 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-6">
                Why Gloversville, New York?
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                <strong className="text-battles-gold">Gloversville, NY</strong> represents the heart of 
                Central New York's growing cannabis market. As a veteran-owned business, Battles Budz 
                chose this location to serve both the local community and veterans throughout the region 
                who deserve access to premium cannabis products and education.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our planned <strong className="text-battles-gold">cannabis dispensary in Gloversville</strong> will 
                feature a consumption lounge, educational center, and retail space designed to create a 
                premium cannabis experience unlike anything currently available in Central New York.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-6">
                Get in Touch with Battles Budz
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Interested in learning more about our veteran-owned cannabis business, 
                investment opportunities, or staying updated on our launch?
              </p>
              <div className="space-y-4">
                <p className="text-battles-gold font-semibold">
                  Email: battlesbudz@gmail.com
                </p>
                <p className="text-gray-400">
                  Follow our journey as we bring premium cannabis to Gloversville, NY
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}