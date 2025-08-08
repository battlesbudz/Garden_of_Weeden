import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Leaf, Layers, Sun, Settings, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import LandraceMap from '@/components/products/LandraceMap';
import CultivationMethods from '@/components/products/CultivationMethods';
import WaitlistForm from '@/components/products/WaitlistForm';
import StrainDetails from '@/components/products/StrainDetails';
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle, getProductSchema } from '@/utils/seo';

// Pure landrace cultivar data
const landraceStrains = [
  {
    name: "Afghan Kush",
    location: "Hindu Kush Mountains, Afghanistan",
    coordinates: { x: 1340, y: 410 },
    notes: "Broad-leaf indica, traditional hash cultivar with deep body relaxation",
    thc: "15-20%",
    cbd: "4-8%",
    flowering: "8-10 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Thai Stick", 
    location: "Northern Thailand",
    coordinates: { x: 1480, y: 520 },
    notes: "Pure equatorial sativa, citrus-incense terpene profile with true head high",
    thc: "12-16%",
    cbd: "3-6%",
    flowering: "14-18 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Moroccan Hash Plant",
    location: "Rif Mountains, Morocco", 
    coordinates: { x: 1000, y: 380 },
    notes: "Traditional hash-making variety, earthy-spiced resin production",
    thc: "12-18%",
    cbd: "3-6%",
    flowering: "9-11 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Colombian Gold",
    location: "Santa Marta Mountains, Colombia",
    coordinates: { x: 580, y: 550 },
    notes: "Legendary equatorial sativa with golden pistils, sweet earth terpenes",
    thc: "13-17%",
    cbd: "2-5%",
    flowering: "12-16 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Malawi Gold",
    location: "Malawi, Southeast Africa",
    coordinates: { x: 1180, y: 700 },
    notes: "Pure African sativa, racey cerebral effects with spicy-floral profile",
    thc: "14-18%",
    cbd: "2-4%",
    flowering: "16-20 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Durban Poison",
    location: "Durban, South Africa",
    coordinates: { x: 1140, y: 800 },
    notes: "100% sativa with anise-licorice terpenes, energizing clear-headed expression",
    thc: "15-25%",
    cbd: "1-3%",
    flowering: "8-9 weeks",
    chemotype: "Type I - THC Dominant"
  }
];

const cultivationMethods = [
  {
    icon: Leaf,
    title: "Living Soil Beds",
    description: "Microbial-rich no-till beds replicating native terroir. Our soil food web preserves authentic terpene expressions and cannabinoid profiles."
  },
  {
    icon: Layers,
    title: "Full-Spectrum LEDs",
    description: "Precision light spectrums matching equatorial sun cycles. 13/11 photoperiods for true sativa flowering expressions."
  },
  {
    icon: Sun,
    title: "Climate-Controlled Preservation",
    description: "Year-round cultivation of tropical sativas impossible outdoors. Protected genetic conservation from contamination and climate change."
  },
  {
    icon: Settings,
    title: "Artisanal Craft Methods",
    description: "Hand-trimmed, slow-cured, small-batch cultivation. Pure genetics preserved through traditional selection methods."
  }
];

export default function HeirloomFlowerPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedStrain, setSelectedStrain] = useState<number | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(247);

  const productStructuredData = getProductSchema({
    name: "Heirloom Cannabis Flower - Premium Landrace Strains",
    description: "Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics.",
    price: "TBD",
    category: "Cannabis Flower",
    imageUrl: cannabisFlower1,
    inStock: false
  });

  const handleWaitlistJoin = (email: string) => {
    setWaitlistCount(prev => Math.max(prev - 1, 0));
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead 
        title={getPageTitle("Heirloom Cannabis Flower - Premium Landrace Strains")}
        description="Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics. Indoor cultivation with living soil for genetic preservation."
        canonicalUrl={getCanonicalUrl("/products/heirloom-flower")}
        structuredData={productStructuredData}
        openGraph={{
          title: "Heirloom Cannabis Flower - Premium Landrace Strains | Battles Budz",
          description: "Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics.",
          image: cannabisFlower1,
          type: "product"
        }}
      />
      
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-3 text-sm">
            <Link href="/" className="text-gray-400 hover:text-battles-gold transition-colors">
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/shop" className="text-gray-400 hover:text-battles-gold transition-colors">
              Shop
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-battles-gold font-semibold">Heirloom Flower</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
                <span className="text-battles-gold">Preserved</span> Genetics
              </h1>
              <p className="text-2xl font-bold text-white mb-6">
                Authentic landrace cultivars. Indoor cultivation. Living soil tradition.
              </p>
              <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                Our genetic preservation project features OG strains — pure sativa and indica expressions untouched by hybridization, cultivated in climate-controlled living soil beds under full-spectrum LEDs.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                Fire genetics from legendary regions: Preserved. Authentic. Connoisseur-grade.
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">100%</div>
                  <div className="text-gray-300 text-sm font-medium">Pure Genetics</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">16-20</div>
                  <div className="text-gray-300 text-sm font-medium">Week Sativas</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">Indoor</div>
                  <div className="text-gray-300 text-sm font-medium">Cultivation</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">Living</div>
                  <div className="text-gray-300 text-sm font-medium">Soil Beds</div>
                </div>
              </div>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 font-semibold text-center">
                  ⚠️ Limited Cultivation - Only 50 plants per harvest
                </p>
              </div>
              
              <WaitlistForm onSubmit={handleWaitlistJoin} />
              
              <p className="text-gray-400 text-sm mt-3 text-center lg:text-left">
                📧 Get notified when the harvest is ready
              </p>
            </div>
            
            <div className="flex justify-center">
              <img
                src={cannabisFlower1}
                alt="Heirloom Flower"
                className="w-full max-w-md h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-battles-gold/5 border-y border-battles-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Genetic Conservation</div>
              <p className="text-gray-300">Pure genetics preserved from extinction, untouched by hybridization.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Indoor Cultivation</div>
              <p className="text-gray-300">Climate-controlled, full-spectrum LED cultivation in living soil beds.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Artisanal Craft</div>
              <p className="text-gray-300">50 plants max. Hand-selected phenotypes. Connoisseur quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Origin Map */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Global Landrace Origins</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Authentic cultivars from legendary regions — preserved genetics that shaped modern cannabis culture
            </p>
          </div>
          
          <LandraceMap 
            strains={landraceStrains}
            selectedStrain={selectedStrain}
            onStrainSelect={setSelectedStrain}
          />
          
          {selectedStrain !== null && (
            <StrainDetails 
              strain={landraceStrains[selectedStrain]}
              onClose={() => setSelectedStrain(null)}
            />
          )}
        </div>
      </section>

      {/* Landrace Education */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-4 text-center">Why Pure Genetics Matter</h2>
          <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            While modern hybrids chase extreme THC, we preserve authentic landrace expressions with true entourage effects
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">100% Pure Genetics</h3>
                  <p className="text-gray-300">Original cultivars preserved in their authentic form, never crossed or hybridized. Pure genetics as nature intended.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Cultural Heritage</h3>
                  <p className="text-gray-300">Traditional varieties from legendary hash-making regions. Authentic genetics with deep cultural roots.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">Indoor Advantage</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our controlled environment allows year-round cultivation of 16-20 week equatorial sativas impossible to finish outdoors. 
                  Full-spectrum LEDs replicate native sun cycles while living soil preserves authentic terpene expressions.
                </p>
              </div>

              <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">Genetic Conservation Project</h3>
                <p className="text-gray-300 leading-relaxed">
                  Many of these cultivars are extinct in native regions due to hybridization and climate change. 
                  We're preserving fire genetics through seed banking and careful phenotype selection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultivation Methods */}
      <CultivationMethods methods={cultivationMethods} />

      {/* Product Information */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-battles-gold mb-6">Product Details</h2>
              <Card className="bg-gray-900 border-battles-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-battles-gold mb-4">Artisanal Flower (5g)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-300">Quality</span>
                      <span className="text-battles-gold font-semibold">Connoisseur-Grade</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-300">Processing</span>
                      <span className="text-battles-gold font-semibold">Hand-Trimmed</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-gray-300">Curing</span>
                      <span className="text-battles-gold font-semibold">Slow-Cured</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Batch Size</span>
                      <span className="text-battles-gold font-semibold">50 Plants Only</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-center text-gray-400 mb-4">Ready to secure your spot?</p>
                    <WaitlistForm 
                      onSubmit={handleWaitlistJoin}
                      buttonText="Get Priority Access"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <img
                src={cannabisFlower1}
                alt="Premium Cannabis Flower"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="bg-gray-900 p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">What Makes It Special</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Pure landrace genetics, never hybridized</li>
                  <li>• 12+ months organic cultivation cycle</li>
                  <li>• Hand-selected phenotypes from seed</li>
                  <li>• Living soil terroir preservation</li>
                  <li>• Limited 50-plant batches</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-4 text-center">Common Questions</h2>
          <p className="text-gray-400 text-center mb-12">Everything you need to know about securing your spot</p>
          
          <div className="space-y-6">
            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">When does this fire drop?</h3>
              <p className="text-gray-300">
                Next harvest completes Spring 2026. Collectors get 48-hour priority access. 
                Only 50 plants of these preserved genetics per cycle — true connoisseur allocation.
              </p>
            </div>
            
            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Why join the waitlist now?</h3>
              <p className="text-gray-300">
                Waitlist members get exclusive benefits: 48-hour early access, 15% discount on first purchase, 
                detailed cultivation updates, and guaranteed allocation from each small batch harvest.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">What makes this worth the wait?</h3>
              <p className="text-gray-300">
                These aren't mass-produced hybrids. Each plant gets 12+ months of organic care. The genetics are rare - 
                some are extinct in their native regions. You're getting access to cannabis history that most people will never experience.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">How do I know this is different from other "premium" cannabis?</h3>
              <p className="text-gray-300">
                Simple: try our sample when available. The clear-headed effects, complex flavors, and lack of anxiety speak for themselves. 
                Plus, we provide full cultivation documentation and genetic lineage for complete transparency.
              </p>
            </div>
          </div>
          
          {!isSubscribed && (
            <div className="mt-12 text-center">
              <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">Limited Time: Early Bird Benefits</h3>
                <p className="text-gray-300 mb-4">
                  Join the waitlist in the next 72 hours and receive an exclusive cultivation report plus 15% off your first order.
                </p>
                <div className="text-battles-gold font-semibold">{waitlistCount} spots remaining</div>
              </div>
              
              <WaitlistForm 
                onSubmit={handleWaitlistJoin}
                buttonText="Secure My Priority Access"
                placeholder="Enter your email for exclusive access"
                className="max-w-md mx-auto"
                large
              />
              
              <p className="text-gray-400 text-sm mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            <span className="text-battles-gold font-semibold">21+ Only</span> – Cannabis products pending release
          </p>
        </div>
      </footer>
    </div>
  );
}