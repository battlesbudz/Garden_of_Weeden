import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
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

// Landrace strain data - Precise coordinates measured on 2058x1262px Winkel Triple projection
const landraceStrains = [
  {
    name: "Afghan Kush",
    location: "Hindu Kush Mountains, Afghanistan",
    coordinates: { x: 1340, y: 410 }, // Afghanistan - using grid lines, ~65°E, ~35°N
    notes: "Broad-leaf, hash-heavy, calming body effects",
    thc: "15-20%",
    cbd: "4-8%",
    flowering: "8-10 weeks"
  },
  {
    name: "Thai Stick", 
    location: "Northern Thailand",
    coordinates: { x: 1480, y: 520 }, // Thailand - using grid lines, ~100°E, ~18°N
    notes: "Long flowering, citrus incense profile with creative clarity",
    thc: "12-16%",
    cbd: "3-6%",
    flowering: "14-18 weeks"
  },
  {
    name: "Moroccan Hash Plant",
    location: "Rif Mountains, Morocco", 
    coordinates: { x: 1000, y: 380 }, // Morocco Rif Mountains: 35°N, 4°W - positioned on Moroccan landmass
    notes: "Traditional hash variety with earthy, spiced resin production",
    thc: "12-18%",
    cbd: "3-6%",
    flowering: "9-11 weeks"
  },
  {
    name: "Colombian Gold",
    location: "Santa Marta Mountains, Colombia",
    coordinates: { x: 550, y: 580 }, // Colombia Santa Marta: 11.24°N, 74.20°W - northern coast
    notes: "Uplifting sativa with golden pistils and sweet earth tones",
    thc: "13-17%",
    cbd: "2-5%",
    flowering: "12-16 weeks"
  },
  {
    name: "Malawi Gold",
    location: "Malawi, Southeast Africa",
    coordinates: { x: 1180, y: 700 }, // Malawi - using grid lines, ~34°E, ~13°S
    notes: "Energetic, cerebral, spicy aroma with soaring effects",
    thc: "14-18%",
    cbd: "2-4%",
    flowering: "16-20 weeks"
  },
  {
    name: "Durban Poison",
    location: "Durban, South Africa",
    coordinates: { x: 1140, y: 800 }, // South Africa - using grid lines, ~31°E, ~30°S
    notes: "Sweet anise aroma with energizing, clear-headed effects",
    thc: "15-25%",
    cbd: "1-3%",
    flowering: "8-9 weeks"
  }
];

const cultivationMethods = [
  {
    icon: Leaf,
    title: "Organic Living Soil",
    description: "Microbial-rich soil built from composted matter and worm castings that naturally feeds our plants through beneficial microorganisms."
  },
  {
    icon: Layers,
    title: "No-Till Beds",
    description: "We never disturb the soil layers, respecting the natural soil food web and preserving beneficial mycorrhizal networks."
  },
  {
    icon: Sun,
    title: "Equatorial Genetics",
    description: "Long daylight-flowering strains with unique photoperiod responses that produce complex cannabinoid profiles."
  },
  {
    icon: Settings,
    title: "Traditional Practices",
    description: "Hand-trimmed, sun-fed, and ritualistically grown with intention, honoring ancient cultivation wisdom."
  }
];

const productFormats = [
  {
    name: "Whole Flower (5g)",
    image: cannabisFlower1,
    notes: "Earthy, spiced, high CBG content",
    price: "Pre-Launch Pricing"
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
              panning={{ velocityDisabled: true }}
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
                      
                      {/* Strain Info Popup Overlay */}
                      {selectedStrain === index && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-sm text-white rounded-lg p-3 w-[220px] border border-battles-gold/50 shadow-xl z-30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-sm font-semibold text-battles-gold mb-1">
                                {strain.name}
                              </h4>
                              <p className="text-gray-300 text-xs">{strain.location}</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStrain(null);
                              }}
                              className="text-gray-400 hover:text-white text-sm leading-none"
                            >
                              ×
                            </button>
                          </div>
                          
                          <div className="flex gap-1 mb-2">
                            <div className="text-center bg-black/50 rounded px-1.5 py-1 flex-1">
                              <div className="text-battles-gold font-semibold text-xs">THC</div>
                              <div className="text-white text-xs">{strain.thc}</div>
                            </div>
                            <div className="text-center bg-black/50 rounded px-1.5 py-1 flex-1">
                              <div className="text-battles-gold font-semibold text-xs">CBD</div>
                              <div className="text-white text-xs">{strain.cbd}</div>
                            </div>
                            <div className="text-center bg-black/50 rounded px-1.5 py-1 flex-1">
                              <div className="text-battles-gold font-semibold text-xs">Flower</div>
                              <div className="text-white text-xs">{strain.flowering}</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-xs leading-relaxed">
                            {strain.notes}
                          </p>
                          
                          {/* Arrow pointing to marker */}
                          <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/95 border-l border-t border-battles-gold/50 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-white border border-battles-gold/30">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                <span>Landrace Origins</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-battles-gold rounded-full border border-white"></div>
                <span>Selected Strain</span>
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
                <span className="text-battles-gold">Heirloom</span> Flower
              </h1>
              <p className="text-2xl font-bold text-white mb-6">
                The world's oldest cannabis, grown with modern reverence
              </p>
              <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                Our Heirloom Collection features rare landrace strains — preserved from their native climates, grown in organic living soil, and hand-harvested in small batches.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                These are the ancestors of modern cannabis: Unspoiled. Potent. Spiritually rooted.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">5-20%</div>
                  <div className="text-gray-300 text-sm font-medium">THC Content</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">12-24+</div>
                  <div className="text-gray-300 text-sm font-medium">Week Flower</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">Organic</div>
                  <div className="text-gray-300 text-sm font-medium">Living Soil</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-battles-gold/30 rounded-xl px-4 py-4 text-center hover:border-battles-gold/50 transition-all">
                  <div className="text-battles-gold font-bold text-xl">Hand</div>
                  <div className="text-gray-300 text-sm font-medium">Trimmed</div>
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

      {/* Values Section */}
      <section className="py-12 bg-battles-gold/5 border-y border-battles-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Preserved by Time</div>
              <p className="text-gray-300">Each cultivar is an heirloom, untouched by modern breeding.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Grown with Intention</div>
              <p className="text-gray-300">Tended by hand in living soil.</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-battles-gold mb-2">Crafted in Small Batches</div>
              <p className="text-gray-300">Only 50 plants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Origin Map */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Ancient Cannabis Origins</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Explore the sacred genetics that have evolved naturally across the globe for thousands of years
            </p>
          </div>
          {StableMapComponent}
        </div>
      </section>

      {/* Landrace Education */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-4 text-center">Why Landrace Cannabis Matters</h2>
          <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            While others chase high THC numbers, we preserve what nature perfected over millennia
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Unaltered by Hybridization</h3>
                  <p className="text-gray-300">Pure genetic lineage preserved in its original form, unchanged by modern breeding practices.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Deep Cultural Heritage</h3>
                  <p className="text-gray-300">Rooted in traditional use across generations, carrying the wisdom of ancient cultivation practices.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Richer Cannabinoid Profiles</h3>
                  <p className="text-gray-300">Complex terpene expressions and balanced cannabinoid ratios create the authentic entourage effect.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                  <Sun className="h-6 w-6 text-battles-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-battles-gold mb-2">Equatorial Growth Patterns</h3>
                  <p className="text-gray-300">Long-flowering narrow-leaf varieties adapted to consistent light cycles produce unique effects.</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Cultivation Methods */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">Our Cultivation Approach</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Traditional practices meet modern precision in our organic cultivation methods
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





      {/* Quick Email Capture Mid-Page */}
      <section className="py-12 bg-gradient-to-r from-battles-gold/10 to-yellow-600/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-battles-gold mb-4">
            Secure Your Allocation Now
          </h3>
          <p className="text-gray-300 mb-6">
            Only {waitlistCount} spots remaining for our Spring 2026 harvest
          </p>
          
          {!isSubscribed && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold px-8">
                Join Now
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Why This Special - Enhanced */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
                  <h3 className="text-xl font-semibold text-battles-gold mb-3">Ancient Genetics, Modern Problems</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Modern hybrids focus on extreme THC levels that often cause anxiety and paranoia. 
                    Our landrace genetics offer the balanced, clear-headed effects that cannabis was meant to provide.
                  </p>
                </div>
                
                <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
                  <h3 className="text-xl font-semibold text-battles-gold mb-3">The Entourage Advantage</h3>
                  <p className="text-gray-300 leading-relaxed">
                    With 12-18% THC plus high CBD, CBG, and rare terpenes, you get therapeutic benefits 
                    without the overwhelming high. It's cannabis that works with your body, not against it.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
                  <h3 className="text-xl font-semibold text-battles-gold mb-3">Exclusive Access</h3>
                  <p className="text-gray-300 leading-relaxed">
                    These genetics are rare - many are extinct in their native regions. 
                    We're one of the few cultivators preserving these authentic strains in North America.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black p-8 rounded-lg border border-battles-gold/20">
              <h3 className="text-2xl font-semibold text-battles-gold mb-6 text-center">What You're Getting</h3>
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
                  <span className="text-gray-300">Cultivation Method</span>
                  <span className="text-battles-gold font-semibold">Organic No-Till</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Flowering Time</span>
                  <span className="text-battles-gold font-semibold">12+ Weeks</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">Format</span>
                  <span className="text-battles-gold font-semibold">Pre-rolls & Blunts</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Batch Size</span>
                  <span className="text-battles-gold font-semibold">50 Plants Only</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-center text-gray-400 mb-4">Ready to secure your spot?</p>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 border-battles-gold/30 text-white placeholder-gray-400"
                    required
                  />
                  <Button type="submit" className="w-full bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold">
                    Get Priority Access
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-battles-gold mb-4">What Connoisseurs Are Saying</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Experience the difference that authentic landrace genetics make
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-battles-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic mb-4">
                  "The most spiritual cannabis I've ever tried. Like a window to the past. 
                  The clarity and creativity it provides is unlike anything from modern dispensaries."
                </blockquote>
                <div className="border-t border-gray-800 pt-4">
                  <cite className="text-battles-gold font-semibold">Sarah M.</cite>
                  <p className="text-gray-400 text-sm">Cannabis Consultant, 15+ years experience</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-battles-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic mb-4">
                  "Nothing touches these heirlooms. The flavor, the vibe, the effect—it's perfect. 
                  Finally found cannabis that doesn't give me anxiety but still delivers."
                </blockquote>
                <div className="border-t border-gray-800 pt-4">
                  <cite className="text-battles-gold font-semibold">Mike D.</cite>
                  <p className="text-gray-400 text-sm">Retired Veteran, Medical Patient</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-battles-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic mb-4">
                  "As a terpene researcher, I can confirm these profiles are absolutely unique. 
                  This is what cannabis was before we bred the complexity out of it."
                </blockquote>
                <div className="border-t border-gray-800 pt-4">
                  <cite className="text-battles-gold font-semibold">Dr. Jennifer K.</cite>
                  <p className="text-gray-400 text-sm">Cannabis Research Scientist</p>
                </div>
              </CardContent>
            </Card>
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
              <h3 className="text-xl font-semibold text-battles-gold mb-3">When will these be available?</h3>
              <p className="text-gray-300">
                Our next harvest completes in Spring 2025. Waitlist members get 48-hour priority access before public release. 
                With only 50 plants per batch, spots typically sell out within hours.
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
          
          <div className="mt-12 text-center">
            <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Limited Time: Early Bird Benefits</h3>
              <p className="text-gray-300 mb-4">
                Join the waitlist in the next 72 hours and receive an exclusive cultivation report plus 15% off your first order.
              </p>
              <div className="text-battles-gold font-semibold">247 spots remaining</div>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-battles-gold/30 text-white placeholder-gray-400 h-12"
                required
              />
              <Button type="submit" className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold h-12 px-8">
                Secure My Spot
              </Button>
            </form>
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
            Don't Miss Cannabis History
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 247+ connoisseurs securing priority access to authentic landrace genetics. 
            These strains may never be available again.
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
              <div className="bg-battles-gold/10 border border-battles-gold/30 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-battles-gold mb-3">Exclusive Waitlist Benefits</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-battles-gold font-bold">48 Hours</div>
                    <div className="text-gray-400">Early Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-battles-gold font-bold">15% Off</div>
                    <div className="text-gray-400">First Purchase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-battles-gold font-bold">Updates</div>
                    <div className="text-gray-400">Cultivation Process</div>
                  </div>
                  <div className="text-center">
                    <div className="text-battles-gold font-bold">Guaranteed</div>
                    <div className="text-gray-400">Allocation</div>
                  </div>
                </div>
              </div>
              
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