import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Leaf, Layers, Sun, Settings, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import LandraceMap from '@/components/products/LandraceMap';
import CultivationMethods from '@/components/products/CultivationMethods';
import WaitlistForm from '@/components/products/WaitlistForm';

import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle, getProductSchema } from '@/utils/seo';

// Pure landrace cultivar data - Preserved genetics from their native terroir
const landraceStrains = [
  {
    name: "Afghan Kush",
    location: "Hindu Kush Mountains, Afghanistan",
    coordinates: { x: 1340, y: 410 }, // Afghanistan coordinates
    notes: "Broad-leaf indica, traditional hash cultivar with deep body relaxation",
    thc: "15-20%",
    cbd: "4-8%",
    flowering: "8-10 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Thai Stick", 
    location: "Northern Thailand",
    coordinates: { x: 1480, y: 520 }, // Thailand coordinates
    notes: "Pure equatorial sativa, citrus-incense terpene profile with true head high",
    thc: "12-16%",
    cbd: "3-6%",
    flowering: "14-18 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Moroccan Hash Plant",
    location: "Rif Mountains, Morocco", 
    coordinates: { x: 1000, y: 380 }, // Morocco coordinates
    notes: "Traditional hash-making variety, earthy-spiced resin production",
    thc: "12-18%",
    cbd: "3-6%",
    flowering: "9-11 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Colombian Gold",
    location: "Santa Marta Mountains, Colombia",
    coordinates: { x: 580, y: 550 }, // Colombia coordinates
    notes: "Legendary equatorial sativa with golden pistils, sweet earth terpenes",
    thc: "13-17%",
    cbd: "2-5%",
    flowering: "12-16 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Malawi Gold",
    location: "Malawi, Southeast Africa",
    coordinates: { x: 1180, y: 700 }, // Malawi coordinates
    notes: "Pure African sativa, racey cerebral effects with spicy-floral profile",
    thc: "14-18%",
    cbd: "2-4%",
    flowering: "16-20 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Durban Poison",
    location: "Durban, South Africa",
    coordinates: { x: 1140, y: 800 }, // South Africa coordinates
    notes: "100% sativa with anise-licorice terpenes, energizing clear-headed expression",
    thc: "15-19%",
    cbd: "1-3%",
    flowering: "8-10 weeks",
    chemotype: "Type I - THC Dominant"
  }
];

export default function HeirloomFlowerPage() {
  const [selectedStrain, setSelectedStrain] = useState<number | null>(null);

  const pageTitle = getPageTitle("Heirloom Flower - Pure Landrace Cannabis Genetics");
  const canonicalUrl = getCanonicalUrl("/products/heirloom-flower");
  const productSchema = getProductSchema({
    name: "Heirloom Flower Collection",
    description: "Authentic landrace cannabis genetics preserved through careful indoor cultivation and living soil methods",
    category: "Cannabis Genetics",
    price: "Contact for Pricing",
    inStock: true
  });

  return (
    <>
      <SEOHead
        title={pageTitle}
        description="Discover authentic landrace cannabis genetics preserved through indoor cultivation and living soil. Experience pure equatorial sativas and traditional indica varieties from their original terroir."
        keywords={["landrace cannabis", "pure genetics", "equatorial sativa", "traditional indica", "living soil cannabis", "indoor cultivation", "cannabis terroir", "authentic strains"]}
        canonicalUrl={canonicalUrl}
        structuredData={productSchema}
      />
      
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link to="/products" className="text-battles-gold hover:text-battles-gold/80 transition-colors flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-battles-gold to-yellow-500 bg-clip-text text-transparent">
                  Heirloom Flower
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Authentic landrace genetics preserved through controlled indoor cultivation
                </p>
                <div className="space-y-4 text-lg text-gray-400">
                  <div className="flex items-center gap-3">
                    <Leaf className="text-battles-gold w-5 h-5" />
                    <span>Pure equatorial sativas and traditional indicas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="text-battles-gold w-5 h-5" />
                    <span>Indoor cultivation preserving original terroir expression</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Layers className="text-battles-gold w-5 h-5" />
                    <span>Living soil methods maintaining authentic profiles</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={cannabisFlower1} 
                  alt="Premium heirloom cannabis flower showing trichome density"
                  className="rounded-2xl shadow-2xl border border-battles-gold/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Landrace Map Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <LandraceMap 
              strains={landraceStrains}
              selectedStrain={selectedStrain}
              onStrainSelect={setSelectedStrain}
            />
          </div>
        </section>

        {/* Cultivation Methods */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <CultivationMethods methods={[
              {
                icon: Sun,
                title: "Indoor Cultivation",
                description: "Precise environmental control recreates optimal growing conditions for each landrace variety, ensuring consistent expression of genetic traits."
              },
              {
                icon: Layers,
                title: "Living Soil Methods", 
                description: "Organic soil biology creates symbiotic relationships with roots, enhancing nutrient uptake and terpene production naturally."
              },
              {
                icon: Settings,
                title: "Environmental Precision",
                description: "Controlled humidity, temperature, and photoperiods allow us to replicate the native conditions each strain evolved in."
              },
              {
                icon: Award,
                title: "Genetic Preservation",
                description: "Protected indoor environment prevents contamination while maintaining the authentic characteristics of pure landrace genetics."
              }
            ]} />
          </div>
        </section>

        {/* Cannabis Terminology Guide */}
        <section className="py-16 px-4 bg-gray-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-battles-gold mb-8 text-center">
              Understanding Cannabis Genetics
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-800/50 border-battles-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Landrace Varieties</h3>
                  <p className="text-gray-300 mb-4">
                    Pure cannabis genetics that evolved naturally in specific geographic regions over thousands of years.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• No human hybridization or breeding intervention</li>
                    <li>• Adapted to local climate and growing conditions</li>
                    <li>• Unique terpene profiles reflecting their terroir</li>
                    <li>• Genetic foundation for modern cannabis varieties</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-battles-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Equatorial Sativas</h3>
                  <p className="text-gray-300 mb-4">
                    Cannabis varieties that originated near the equator, adapted to consistent 12/12 light cycles.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Longer flowering periods (12-20 weeks)</li>
                    <li>• Tall, stretchy growth patterns</li>
                    <li>• Cerebral, energizing effects</li>
                    <li>• Complex terpene profiles with citrus, spice notes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-battles-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Traditional Indicas</h3>
                  <p className="text-gray-300 mb-4">
                    Cannabis varieties from mountainous regions, particularly the Hindu Kush range.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Shorter flowering periods (6-10 weeks)</li>
                    <li>• Compact, bushy growth structure</li>
                    <li>• Body-focused, relaxing effects</li>
                    <li>• Earthy, hashy terpene expressions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-battles-gold/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-battles-gold mb-4">Cannabis Chemotypes</h3>
                  <p className="text-gray-300 mb-4">
                    Classification system based on cannabinoid ratios rather than indica/sativa morphology.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Type I: THC-dominant (&gt;0.3% THC, &lt;0.3% CBD)</li>
                    <li>• Type II: Balanced (THC and CBD both &gt;0.3%)</li>
                    <li>• Type III: CBD-dominant (&lt;0.3% THC, &gt;0.3% CBD)</li>
                    <li>• More accurate than traditional classifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Indoor Cultivation Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-battles-gold mb-8">
              Why Indoor Cultivation for Landrace Preservation?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <Settings className="w-12 h-12 text-battles-gold mx-auto" />
                <h3 className="text-xl font-semibold">Precise Environmental Control</h3>
                <p className="text-gray-400">
                  Indoor cultivation allows us to recreate the specific environmental conditions each landrace evolved in, from humidity levels to photoperiods.
                </p>
              </div>
              
              <div className="space-y-4">
                <Award className="w-12 h-12 text-battles-gold mx-auto" />
                <h3 className="text-xl font-semibold">Genetic Preservation</h3>
                <p className="text-gray-400">
                  Protected environment prevents contamination from modern hybrid pollen, maintaining the genetic integrity of pure landrace lines.
                </p>
              </div>
              
              <div className="space-y-4">
                <Users className="w-12 h-12 text-battles-gold mx-auto" />
                <h3 className="text-xl font-semibold">Consistent Expression</h3>
                <p className="text-gray-400">
                  Stable growing conditions allow the true terroir characteristics to express consistently, showcasing authentic genetic profiles.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 border border-battles-gold/20">
              <h3 className="text-2xl font-semibold text-battles-gold mb-4">Living Soil Advantage</h3>
              <p className="text-lg text-gray-300 mb-6">
                Our living soil approach creates a thriving ecosystem that mirrors the natural soil biology these genetics co-evolved with over millennia.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-battles-gold mb-2">Microbial Diversity</h4>
                  <p className="text-gray-400">
                    Beneficial bacteria and fungi form symbiotic relationships with roots, enhancing nutrient uptake and terpene production.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-battles-gold mb-2">Natural Nutrient Cycling</h4>
                  <p className="text-gray-400">
                    Organic matter breakdown provides slow-release nutrition that supports the plant's natural growth rhythms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="py-16 px-4 bg-gray-900/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Join the Heirloom Collection Waitlist</h2>
            <p className="text-gray-300 mb-8">Be the first to access our landrace genetics when they become available. Limited quantities ensure genetic preservation and quality.</p>
            <WaitlistForm 
              placeholder="Enter your email for heirloom access"
              buttonText="Join Heirloom Waitlist"
              large={true}
            />
          </div>
        </section>

        {/* Educational Note */}
        <section className="py-12 px-4 bg-gray-900/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Educational Content</h3>
              <p className="text-gray-300">
                This information is provided for educational purposes about cannabis genetics and cultivation methods. 
                All products comply with applicable state and local regulations where legally available.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}