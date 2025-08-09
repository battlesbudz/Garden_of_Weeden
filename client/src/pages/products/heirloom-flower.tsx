import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check, Leaf, Layers, Sun, Settings, MapPin, FileText, Award, Users } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import worldMapImage from "@assets/Winkel_triple_projection_SW_1754600003820.jpg";
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle, getProductSchema } from '@/utils/seo';

// FAQ Questions Data
const faqQuestions = [
  {
    question: "When does this fire drop?",
    answer: "Next harvest completes Spring 2026. Collectors get 48-hour priority access. Only 50 plants of these preserved genetics per cycle — true connoisseur allocation."
  },
  {
    question: "Why join the waitlist now?",
    answer: "Waitlist members get exclusive benefits: 48-hour early access, 15% discount on first purchase, detailed cultivation updates, and guaranteed allocation from each small batch harvest."
  },
  {
    question: "What makes this worth the wait?",
    answer: "These aren't mass-produced hybrids. Each plant gets 12+ months of organic care. The genetics are rare - some are extinct in their native regions. You're getting access to cannabis history that most people will never experience."
  },
  {
    question: "How do I know this is different from other \"premium\" cannabis?",
    answer: "Simple: try our sample when available. The clear-headed effects, complex flavors, and lack of anxiety speak for themselves. Plus, we provide full cultivation documentation and genetic lineage for complete transparency."
  }
];

// Pure landrace cultivar data - Preserved genetics from their native terroir
const landraceStrains = [
  {
    name: "Afghan Kush",
    location: "Hindu Kush Mountains, Afghanistan",
    coordinates: { x: 1340, y: 410 }, // Afghanistan - using grid lines, ~65°E, ~35°N
    notes: "Broad-leaf indica, traditional hash cultivar with deep body relaxation",
    thc: "15-20%",
    cbd: "4-8%",
    flowering: "8-10 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Thai Stick", 
    location: "Northern Thailand",
    coordinates: { x: 1480, y: 520 }, // Thailand - using grid lines, ~100°E, ~18°N
    notes: "Pure equatorial sativa, citrus-incense terpene profile with true head high",
    thc: "12-16%",
    cbd: "3-6%",
    flowering: "14-18 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Moroccan Hash Plant",
    location: "Rif Mountains, Morocco", 
    coordinates: { x: 1000, y: 380 }, // Morocco Rif Mountains: 35°N, 4°W - positioned on Moroccan landmass
    notes: "Traditional hash-making variety, earthy-spiced resin production",
    thc: "12-18%",
    cbd: "3-6%",
    flowering: "9-11 weeks",
    chemotype: "Type II - Balanced"
  },
  {
    name: "Colombian Gold",
    location: "Santa Marta Mountains, Colombia",
    coordinates: { x: 580, y: 550 }, // Colombia Santa Marta: 11.24°N, 74.20°W - positioned on northern Colombian coast
    notes: "Legendary equatorial sativa with golden pistils, sweet earth terpenes",
    thc: "13-17%",
    cbd: "2-5%",
    flowering: "12-16 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Malawi Gold",
    location: "Malawi, Southeast Africa",
    coordinates: { x: 1180, y: 700 }, // Malawi - using grid lines, ~34°E, ~13°S
    notes: "Pure African sativa, racey cerebral effects with spicy-floral profile",
    thc: "14-18%",
    cbd: "2-4%",
    flowering: "16-20 weeks",
    chemotype: "Type I - THC Dominant"
  },
  {
    name: "Durban Poison",
    location: "Durban, South Africa",
    coordinates: { x: 1140, y: 800 }, // South Africa - using grid lines, ~31°E, ~30°S
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

const productFormats = [
  {
    name: "Artisanal Flower (5g)",
    image: cannabisFlower1,
    notes: "Fire genetics, loud terpenes, connoisseur-grade",
    price: "Collector Pricing TBD"
  }
];

export default function HeirloomFlowerPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedStrain, setSelectedStrain] = useState<number | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(247);
  const { toast } = useToast();
  
  // Map interaction state
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Use ref to store transform state without causing re-renders
  const transformRef = useRef({
    scale: 0.9,
    positionX: 0,
    positionY: 0,
    hasBeenSet: false
  });

  const productStructuredData = getProductSchema({
    name: "Heirloom Cannabis Flower - Premium Landrace Strains",
    description: "Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics.",
    price: "TBD",
    category: "Cannabis Flower",
    imageUrl: cannabisFlower1,
    inStock: false
  });







  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate waitlist count decrease
    setWaitlistCount(prev => Math.max(prev - 1, 0));
    setIsSubscribed(true);
    toast({
      title: "Welcome to the Cultivation Club!",
      description: "You're now guaranteed priority access to our Spring 2026 harvest.",
    });
    setEmail('');
  };

  // Create a memoized map component outside the render cycle
  const StableMapComponent = useMemo(() => (
      <div className="relative">
        <div className="bg-gray-800 rounded-lg p-8 border border-battles-gold/20">
          <h3 className="text-2xl font-bold text-battles-gold mb-6 text-center">Global Landrace Origins</h3>
          
          {/* Professional Interactive World Map with react-zoom-pan-pinch */}
          <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-battles-gold/30">
            <TransformWrapper
              key="map-transform-wrapper"
              initialScale={transformRef.current.hasBeenSet ? transformRef.current.scale : 0.9}
              initialPositionX={transformRef.current.hasBeenSet ? transformRef.current.positionX : 0}
              initialPositionY={transformRef.current.hasBeenSet ? transformRef.current.positionY : 0}
              minScale={0.4}
              maxScale={4}
              limitToBounds={false}
              centerOnInit={!transformRef.current.hasBeenSet}
              wheel={{ step: 0.15 }}
              pinch={{ step: 8 }}
              doubleClick={{ disabled: false }}
              panning={{ 
                velocityDisabled: true
              }}
              alignmentAnimation={{ disabled: false }}
              disablePadding={true}
              onTransformed={(ref, state) => {
                transformRef.current = {
                  scale: state.scale,
                  positionX: state.positionX,
                  positionY: state.positionY,
                  hasBeenSet: true
                };
              }}
            >
              
              <TransformComponent
                wrapperClass="!w-full !h-96"
                contentClass="!w-full !h-full"
              >
                <div 
                  className="relative w-full h-full min-w-[800px] min-h-[400px]"
                  onClick={() => setSelectedStrain(null)}
                >
                  <img
                    src={worldMapImage}
                    alt="World Map with Cannabis Origins"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  
                  {/* Strain Location Markers */}
                  {landraceStrains.map((strain, index) => (
                    <div
                      key={strain.name}
                      className={`absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer transition-all duration-200 z-20 ${
                        selectedStrain === index 
                          ? 'w-6 h-6 -ml-3 -mt-3' 
                          : 'hover:w-5 hover:h-5 hover:-ml-2.5 hover:-mt-2.5'
                      }`}
                      style={{
                        left: `${(strain.coordinates.x / 2058) * 100}%`,
                        top: `${(strain.coordinates.y / 1262) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedStrain(selectedStrain === index ? null : index);
                      }}
                    >
                      <div className={`w-full h-full rounded-full border-2 border-white shadow-lg ${
                        selectedStrain === index
                          ? 'bg-battles-gold animate-pulse'
                          : 'bg-yellow-500 hover:bg-battles-gold'
                      }`} />
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>

            {/* Fixed Strain Info Popup - Centered Overlay */}
            {selectedStrain !== null && (
              <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-black/95 backdrop-blur-sm text-white rounded-lg p-4 w-[320px] max-w-[90vw] border border-battles-gold/50 shadow-xl pointer-events-auto">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-battles-gold mb-1">
                        {landraceStrains[selectedStrain].name}
                      </h4>
                      <p className="text-gray-300 text-sm">{landraceStrains[selectedStrain].location}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedStrain(null)}
                      className="text-gray-400 hover:text-white text-xl leading-none ml-2"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <div className="text-center bg-black/50 rounded px-2 py-2 flex-1">
                      <div className="text-battles-gold font-semibold text-xs">THC</div>
                      <div className="text-white text-sm">{landraceStrains[selectedStrain].thc}</div>
                    </div>
                    <div className="text-center bg-black/50 rounded px-2 py-2 flex-1">
                      <div className="text-battles-gold font-semibold text-xs">CBD</div>
                      <div className="text-white text-sm">{landraceStrains[selectedStrain].cbd}</div>
                    </div>
                    <div className="text-center bg-black/50 rounded px-2 py-2 flex-1">
                      <div className="text-battles-gold font-semibold text-xs">Flowering</div>
                      <div className="text-white text-sm">{landraceStrains[selectedStrain].flowering}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {landraceStrains[selectedStrain].notes}
                  </p>

                  <div className="text-center">
                    <button 
                      onClick={() => setSelectedStrain(null)}
                      className="bg-battles-gold/20 hover:bg-battles-gold/30 text-battles-gold border border-battles-gold/50 rounded px-4 py-2 text-sm transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white border border-battles-gold/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span>Landrace Origins</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-2 text-battles-gold" />
            <span>Click markers to explore strain details • Use pinch gestures to zoom and pan smoothly</span>
          </div>
        </div>
      </div>
  ), [selectedStrain]);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Heirloom Cannabis Flower - Premium Landrace Strains")}
        description="Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics. Join the waitlist for rare, therapeutic cannabis strains."
        keywords={["heirloom cannabis", "landrace strains", "organic cannabis", "premium flower", "therapeutic cannabis", "ancient genetics", "cannabis cultivation", "Battles Budz flower"]}
        canonicalUrl={getCanonicalUrl("/products/heirloom-flower")}
        structuredData={productStructuredData}
        ogType="product"
        ogImage={cannabisFlower1}
      />
      {/* Navigation */}
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
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
                Authentic landrace cultivars. Indoor precision. Living soil tradition.
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
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email for priority access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-gray-800 border-battles-gold/30 text-white placeholder-gray-400 h-12"
                    required
                  />
                  <Button type="submit" className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold h-12 px-8">
                    Join Waitlist
                  </Button>
                </form>
              </div>
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



      {/* Interactive Origin Map */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Global Landrace Origins</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Authentic cultivars from legendary regions — preserved genetics that shaped modern cannabis culture
            </p>
          </div>
          {StableMapComponent}
        </div>
      </section>



      {/* Cultivation Methods */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Indoor LED Precision Meets Living Soil Tradition</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Climate-controlled preservation of equatorial genetics — Year-round tropical sativa cultivation impossible outdoors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultivationMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="bg-gray-900 border-battles-gold/20 hover:border-battles-gold/40 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-battles-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-battles-gold" />
                    </div>
                    <CardTitle className="text-battles-gold">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm leading-relaxed">{method.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>







      {/* Pure Genetics & Product Details */}
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
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">OG Strains vs Modern Hybrids</h3>
                  <p className="text-gray-300">While modern genetics chase 30%+ THC causing anxiety, our preserved landraces deliver balanced effects with authentic terpene profiles.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Living Soil + LED Spectrum</h3>
                  <p className="text-gray-300">Our living soil beds maintain native terroir while full-spectrum LEDs replicate equatorial sun cycles for true sativa expressions.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Sun className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Genetic Conservation</h3>
                  <p className="text-gray-300">Many cultivars are extinct in native regions. We're preserving fire genetics through seed banking and careful phenotype selection.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black p-8 rounded-lg border border-battles-gold/20">
              <h3 className="text-2xl font-semibold text-battles-gold mb-6 text-center">Product Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">THC Content</span>
                  <span className="text-battles-gold font-semibold">12-18%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">CBD Content</span>
                  <span className="text-battles-gold font-semibold">3-8%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Cultivation</span>
                  <span className="text-battles-gold font-semibold">Organic No-Till</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Flowering Time</span>
                  <span className="text-battles-gold font-semibold">12-20 Weeks</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Batch Size</span>
                  <span className="text-battles-gold font-semibold">50 Plants Only</span>
                </div>
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
            {faqQuestions.map((faq, index) => (
              <div key={index} className="bg-black p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">{faq.question}</h3>
                <p className="text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Limited Time: Early Bird Benefits</h3>
              <p className="text-gray-300">
                Join the waitlist for exclusive cultivation reports and 15% off your first order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-battles-gold/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8 inline-block">
            <p className="text-red-400 font-semibold">
              ⏰ Only 247 waitlist spots remaining for Spring 2026 harvest
            </p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-gold mb-6">
            Secure Your Cannabis History
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Authentic landrace genetics from legendary regions. Limited cultivation ensures exclusivity.
          </p>
          
          {isSubscribed ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 max-w-md mx-auto">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-green-500 mb-4">Welcome to the List!</h3>
              <p className="text-gray-300 mb-4">You're now guaranteed priority access to our Spring 2026 harvest.</p>
              <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-4">
                <p className="text-battles-gold font-semibold">Your Benefits:</p>
                <ul className="text-gray-300 text-sm mt-2 space-y-1">
                  <li>• 48-hour early access</li>
                  <li>• 15% first purchase discount</li>
                  <li>• Exclusive cultivation updates</li>
                  <li>• Guaranteed allocation</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto">
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email for exclusive access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border-battles-gold/30 text-white placeholder-gray-400 h-14 text-center text-lg"
                  required
                />
                <Button type="submit" className="w-full bg-battles-gold text-battles-black hover:bg-yellow-400 font-bold text-lg h-14">
                  Secure My Priority Access
                </Button>
              </form>
              
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