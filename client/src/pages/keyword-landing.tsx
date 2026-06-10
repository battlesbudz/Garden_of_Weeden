import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl } from '@/utils/seo';

export default function KeywordLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title="Garden of Weeden Buffalo - Farm to Flame Cannabis Dispensary"
        description="Garden of Weeden is an open NYS licensed microbusiness dispensary and Forbidden Fruit on-site consumption lounge in Buffalo, NY, focused on local Farm to Flame craft cannabis."
        keywords={[
          "garden of weeden cannabis buffalo",
          "Farm to Flame Buffalo",
          "Buffalo cannabis dispensary",
          "NYS licensed microbusiness",
          "Forbidden Fruit lounge",
          "local cannabis farmers",
          "Central and Western NY cannabis"
        ]}
        canonicalUrl={getCanonicalUrl("/buffalo-cannabis")}
        ogType="website"
      />
      <Navigation />

      <div className="pt-36">
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-enchanted text-4xl md:text-6xl mb-6 text-parchment">
              Garden of Weeden<br />
              <span className="text-green-500">Buffalo, NY</span>
            </h1>
            <div className="h-1 w-32 bg-green-500 mx-auto mb-6"></div>
            <h2 className="font-storybook text-2xl md:text-3xl mb-6 text-green-400">
              Farm to Flame Cannabis Dispensary
            </h2>
            <p className="font-garden text-xl text-gray-300 mb-8">
              Local craft cannabis from regional farmers to your flame.
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-storybook text-xl text-parchment mb-4">
                NYS Licensed Microbusiness
              </h3>
              <p className="font-garden text-gray-300">
                <strong className="text-green-500">Garden of Weeden</strong> is a boutique
                cannabis dispensary and on-site consumption space serving local, small-batch
                products from our farm south of Buffalo and other NYS small craft growers.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-lg p-8 border border-green-500/20">
                <h2 className="font-storybook text-2xl text-parchment mb-6">
                  Business Details
                </h2>
                <div className="space-y-4 font-garden">
                  <div>
                    <strong className="text-green-500">Business Name:</strong>
                    <p className="text-gray-300">Garden of Weeden LLC</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Location:</strong>
                    <p className="text-gray-300">Buffalo, NY (Western New York) with off-street parking</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Business Type:</strong>
                    <p className="text-gray-300">NYS Licensed Microbusiness Dispensary & Consumption Lounge</p>
                  </div>
                  <div>
                    <strong className="text-green-500">License:</strong>
                    <p className="text-gray-300">OCMMICR-2023-000312</p>
                  </div>
                  <div>
                    <strong className="text-green-500">Status:</strong>
                    <p className="text-gray-300">Open</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-8 border border-green-500/20">
                <h2 className="font-storybook text-2xl text-parchment mb-6">
                  Farm to Flame
                </h2>
                <div className="space-y-4 font-garden text-gray-300">
                  <p>
                    Budtenders know the farmer partners, cultivation practices, and product stories
                    behind the cannabis on the menu.
                  </p>
                  <p>
                    The mission is to support small family farms, women, veteran, and minority
                    owned businesses instead of large corporate organizations.
                  </p>
                  <p>
                    The Forbidden Fruit lounge hosts on-site consumption, community events, and
                    private event options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8 text-center">
              Products & Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Craft Products</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>Premium cannabis flower</li>
                  <li>Pre-rolls and concentrates</li>
                  <li>Edibles, vapes, and beverages</li>
                  <li>Seasonal local farm partner releases</li>
                </ul>
              </div>
              <div className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Community Experiences</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>Forbidden Fruit on-site consumption lounge</li>
                  <li>Fun and educational cannabis events</li>
                  <li>Compliant cannabis education support for private events</li>
                  <li>Contact Jennifer Fornell at (716) 420-1591 for private event scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-playfair font-bold text-battles-gold mb-8">
              Local Cannabis in Buffalo, New York
            </h2>
            <div className="bg-gray-900 rounded-lg p-8">
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                <strong className="text-battles-gold">Garden of Weeden</strong> is focused on
                local craft cannabis, regional sourcing, and an informed buying experience for
                adults 21+ in Western New York.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-battles-gold text-black font-semibold rounded-lg px-6 py-3 hover:bg-yellow-400 transition-colors"
              >
                View Current Menu
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
