import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check, Leaf, Layers, Sun, Settings, MapPin, FileText, Award, Users, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle, getProductSchema } from '@/utils/seo';

// Landrace strain data with geographically accurate coordinates
const landraceStrains = [
  {
    name: "Malawi Gold",
    location: "Malawi, Southeast Africa",
    coordinates: { x: 52, y: 72 }, // More accurate position for Malawi
    notes: "Energetic, cerebral, spicy aroma with soaring effects",
    thc: "14-18%",
    cbd: "2-4%",
    flowering: "16-20 weeks"
  },
  {
    name: "Thai Stick",
    location: "Northern Thailand",
    coordinates: { x: 68, y: 55 }, // More accurate position for Thailand
    notes: "Long flowering, citrus incense profile with creative clarity",
    thc: "12-16%",
    cbd: "3-6%",
    flowering: "14-18 weeks"
  },
  {
    name: "Afghan Kush",
    location: "Hindu Kush Mountains, Afghanistan",
    coordinates: { x: 58, y: 42 }, // More accurate position for Afghanistan
    notes: "Broad-leaf, hash-heavy, calming body effects",
    thc: "15-20%",
    cbd: "4-8%",
    flowering: "8-10 weeks"
  },
  {
    name: "Colombian Gold",
    location: "Santa Marta Mountains, Colombia",
    coordinates: { x: 22, y: 68 }, // More accurate position for Colombia
    notes: "Uplifting sativa with golden pistils and sweet earth tones",
    thc: "13-17%",
    cbd: "2-5%",
    flowering: "12-16 weeks"
  },
  {
    name: "Aceh",
    location: "Sumatra, Indonesia", 
    coordinates: { x: 72, y: 78 }, // Indonesia position
    notes: "Earthy, woody flavor with balanced relaxing effects",
    thc: "16-22%",
    cbd: "3-7%",
    flowering: "10-12 weeks"
  },
  {
    name: "Durban Poison",
    location: "Durban, South Africa",
    coordinates: { x: 48, y: 82 }, // South Africa position
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
  
  // Pan and zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  const productStructuredData = getProductSchema({
    name: "Heirloom Cannabis Flower - Premium Landrace Strains",
    description: "Premium heirloom cannabis flower cultivated using traditional organic methods from authentic landrace genetics.",
    price: "TBD",
    category: "Cannabis Flower",
    imageUrl: cannabisFlower1,
    inStock: false
  });

  // Pan and zoom functions
  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 3)
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.5)
    }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.5), 3)
    }));
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - transform.x, y: touch.clientY - transform.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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

  // Clean interactive world map using SVG from SimpleMaps
  const OriginMap = () => {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    
    // Country code mapping for landrace strains
    const landraceData: { [key: string]: any } = {
      'MW': { // Malawi
        strainName: 'Malawi Gold',
        location: 'Malawi, Southeast Africa',
        notes: 'Energetic, cerebral, spicy aroma with soaring effects',
        thc: '14-18%',
        cbd: '2-4%',
        flowering: '16-20 weeks'
      },
      'TH': { // Thailand
        strainName: 'Thai Stick',
        location: 'Northern Thailand',
        notes: 'Long flowering, citrus incense profile with creative clarity',
        thc: '12-16%',
        cbd: '3-6%',
        flowering: '14-18 weeks'
      },
      'AF': { // Afghanistan
        strainName: 'Afghan Kush',
        location: 'Hindu Kush Mountains, Afghanistan',
        notes: 'Broad-leaf, hash-heavy, calming body effects',
        thc: '15-20%',
        cbd: '4-8%',
        flowering: '8-10 weeks'
      },
      'CO': { // Colombia
        strainName: 'Colombian Gold',
        location: 'Santa Marta Mountains, Colombia',
        notes: 'Uplifting sativa with golden pistils and sweet earth tones',
        thc: '13-17%',
        cbd: '2-5%',
        flowering: '12-16 weeks'
      },
      'ZA': { // South Africa
        strainName: 'Durban Poison',
        location: 'Durban, South Africa',
        notes: 'Sweet anise aroma with energizing, clear-headed effects',
        thc: '15-25%',
        cbd: '1-3%',
        flowering: '8-9 weeks'
      }
    };

    const handleCountryClick = (countryCode: string) => {
      if (landraceData[countryCode]) {
        const index = Object.keys(landraceData).indexOf(countryCode);
        setSelectedStrain(index);
        console.log('Country clicked:', countryCode, landraceData[countryCode].strainName);
      }
    };

    const handleCountryHover = (countryCode: string | null) => {
      setHoveredCountry(countryCode);
    };

    return (
      <div className="relative">
        <div className="bg-gray-800 rounded-lg p-8 border border-battles-gold/20">
          <h3 className="text-2xl font-bold text-battles-gold mb-6 text-center">Global Landrace Origins</h3>
          
          {/* Enhanced Interactive World Map with Pan/Zoom */}
          <div className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button
                onClick={handleZoomIn}
                size="sm"
                variant="outline"
                className="bg-black/80 border-battles-gold/30 text-battles-gold hover:bg-battles-gold/20 w-10 h-10 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleZoomOut}
                size="sm"
                variant="outline"
                className="bg-black/80 border-battles-gold/30 text-battles-gold hover:bg-battles-gold/20 w-10 h-10 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleReset}
                size="sm"
                variant="outline"
                className="bg-black/80 border-battles-gold/30 text-battles-gold hover:bg-battles-gold/20 w-10 h-10 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Instructions */}
            <div className="absolute bottom-4 left-4 z-10 bg-black/80 border border-battles-gold/30 rounded px-3 py-1">
              <p className="text-battles-gold text-xs">
                🖱️ Click & drag to pan • 🔍 Scroll to zoom • 📍 Click markers for details
              </p>
            </div>

            <div className="w-full" style={{ height: '500px' }}>
              {/* Interactive world map with image background and overlay markers */}
              <div 
                className="relative w-full h-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
                style={{ 
                  touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Winkel Triple Projection World Map Image */}
                <img 
                  src="/attached_assets/Winkel_triple_projection_SW_1754600003820.jpg"
                  alt="World Map - Winkel Triple Projection"
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* SVG Overlay for Interactive Markers */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1400 700"
                  style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <defs>
                    {/* Landrace glow effect */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Landrace strain markers positioned over the image */}
                  {Object.entries(landraceData).map(([code, data], index) => {
                    let x = 0, y = 0;
                    // Coordinate mapping to the Winkel Triple projection image
                    switch(code) {
                      case 'MW': x = 765; y = 480; break; // Malawi - East Africa
                      case 'TH': x = 1050; y = 420; break; // Thailand - Southeast Asia 
                      case 'AF': x = 820; y = 280; break; // Afghanistan - Central Asia
                      case 'CO': x = 320; y = 480; break; // Colombia - South America
                      case 'ZA': x = 700; y = 580; break; // South Africa
                    }
                    
                    return (
                      <g key={code} className="pointer-events-auto">
                        {/* Glowing strain marker with enhanced visibility */}
                        <circle cx={x} cy={y} r="30" fill="rgba(241, 196, 15, 0.1)" stroke="#f1c40f" strokeWidth="2" opacity="0.8" />
                        <circle cx={x} cy={y} r="20" fill="rgba(241, 196, 15, 0.3)" stroke="#f39c12" strokeWidth="3" />
                        <circle cx={x} cy={y} r="12" fill="#f1c40f" stroke="#ffffff" strokeWidth="3" 
                                className="cursor-pointer hover:scale-125 transition-all duration-300 drop-shadow-2xl"
                                onClick={() => handleCountryClick(code)} 
                                filter="url(#glow)" />
                        <circle cx={x} cy={y} r="6" fill="#fef9e7" className="pointer-events-none" />
                        
                        {/* Enhanced strain labels with better contrast */}
                        <text x={x} y={y - 50} textAnchor="middle" 
                              className="fill-white text-lg font-bold pointer-events-none"
                              style={{ 
                                textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                                filter: 'drop-shadow(0 0 8px rgba(241, 196, 15, 0.6))'
                              }}>
                          {data.strainName}
                        </text>
                        <text x={x} y={y - 30} textAnchor="middle" 
                              className="fill-yellow-200 text-sm font-semibold pointer-events-none"
                              style={{ 
                                textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)'
                              }}>
                          {data.location.split(',')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Title overlay */}
                  <text x="700" y="50" textAnchor="middle" 
                        className="fill-white text-3xl font-bold pointer-events-none"
                        style={{ 
                          textShadow: '4px 4px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.8)',
                          filter: 'drop-shadow(0 0 10px rgba(241, 196, 15, 0.4))'
                        }}>
                    GLOBAL LANDRACE CANNABIS ORIGINS
                  </text>
                  
                  {/* Enhanced legend with better visibility */}
                  <g transform="translate(50, 580)" className="pointer-events-none">
                    <rect x="0" y="0" width="320" height="90" fill="rgba(0,0,0,0.85)" rx="12" 
                          stroke="#f1c40f" strokeWidth="3" filter="url(#glow)" />
                    <circle cx="25" cy="25" r="12" fill="#f1c40f" stroke="#fff" strokeWidth="3" />
                    <text x="50" y="32" className="fill-white text-lg font-bold">Ancient Landrace Origins</text>
                    <text x="25" y="55" className="fill-yellow-200 text-base font-medium">Click markers to explore strain heritage</text>
                    <text x="25" y="75" className="fill-gray-300 text-sm">Pan & zoom to explore the world</text>
                  </g>

                {/* Landrace strain markers with authentic positioning */}
                {Object.entries(landraceData).map(([code, data], index) => {
                  let x = 0, y = 0;
                  switch(code) {
                    case 'MW': x = 765; y = 535; break; // Malawi - East Africa
                    case 'TH': x = 1080; y = 560; break; // Thailand - Southeast Asia 
                    case 'AF': x = 850; y = 390; break; // Afghanistan - Central Asia
                    case 'CO': x = 360; y = 680; break; // Colombia - South America
                    case 'ZA': x = 690; y = 720; break; // South Africa
                  }
                  
                  return (
                    <g key={code}>
                      {/* Glowing strain marker */}
                      <circle cx={x} cy={y} r="25" fill="rgba(241, 196, 15, 0.15)" stroke="#f1c40f" strokeWidth="1" opacity="0.6" />
                      <circle cx={x} cy={y} r="15" fill="rgba(241, 196, 15, 0.4)" stroke="#f39c12" strokeWidth="2" />
                      <circle cx={x} cy={y} r="8" fill="#f1c40f" stroke="#ffffff" strokeWidth="2" 
                              className="cursor-pointer hover:scale-110 transition-all duration-300 drop-shadow-lg"
                              onClick={() => handleCountryClick(code)} />
                      <circle cx={x} cy={y} r="3" fill="#fef9e7" className="pointer-events-none" />
                      
                      {/* Strain labels with authentic typography */}
                      <text x={x} y={y - 40} textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}>
                        {data.strainName}
                      </text>
                      <text x={x} y={y - 25} textAnchor="middle" className="fill-yellow-200 text-xs font-medium pointer-events-none"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        {data.location.split(',')[0]}
                      </text>
                    </g>
                  );
                })}

                </svg>
              </div>
            </div>

          {/* Selected strain details panel */}
          {selectedStrain !== null && selectedStrain < landraceStrains.length && (
            <div className="mt-6 bg-black/50 border border-battles-gold/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Leaf className="h-6 w-6 text-battles-gold mr-3" />
                  <h4 className="text-xl font-bold text-battles-gold">{landraceStrains[selectedStrain].name}</h4>
                </div>
                <button
                  onClick={() => setSelectedStrain(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close strain details"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {landraceStrains[selectedStrain].notes}
                  </p>
                  <div className="flex items-center text-sm text-battles-gold mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{landraceStrains[selectedStrain].location}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-battles-gold font-semibold text-sm">THC</div>
                    <div className="text-white font-bold text-lg">{landraceStrains[selectedStrain].thc}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-battles-gold font-semibold text-sm">CBD</div>
                    <div className="text-white font-bold text-lg">{landraceStrains[selectedStrain].cbd}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-battles-gold font-semibold text-sm">Flowering</div>
                    <div className="text-white font-bold text-sm">{landraceStrains[selectedStrain].flowering}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-2 text-battles-gold" />
            <span>Click on highlighted countries to explore ancient cannabis genetics from around the world</span>
          </div>
        </div>
      </div>
    </div>
    );
  };

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
          <OriginMap />
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