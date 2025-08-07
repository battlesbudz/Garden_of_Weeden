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
              {/* Interactive world map with SVG overlay for markers */}
              <div 
                className="relative w-full h-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
                style={{ 
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
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
                {/* Professional world map SVG */}
                <svg 
                  ref={svgRef}
                  viewBox="0 0 1400 700" 
                  className="w-full h-full"
                  style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center center'
                  }}
                >
                <g 
                  transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
                  style={{ transformOrigin: 'center' }}
                >
                <defs>
                  <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="50%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="land" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="landrace-land" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
                  </filter>
                </defs>

                {/* Ocean background */}
                <rect width="100%" height="100%" fill="url(#ocean)" />

                {/* World map with proper spacing and realistic proportions - Iteration 3 */}
                <g filter="url(#shadow)">
                  {/* NORTH AMERICA - Properly spaced and proportioned */}
                  <g id="north-america">
                    {/* Canada - Recognizable shape with proper coastlines */}
                    <path d="M100,180 L150,175 L200,170 L250,175 L300,180 L350,185 L400,190 L450,195 L480,210 L485,230 L480,250 L470,270 L455,285 L435,295 L415,300 L395,295 L375,285 L355,275 L335,265 L315,255 L295,245 L275,235 L255,225 L235,215 L215,205 L195,195 L175,185 L155,180 L135,185 L115,190 L100,200 L100,180 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* United States - Distinctive rectangular shape */}
                    <path d="M120,310 L170,305 L220,310 L270,315 L320,320 L370,325 L420,330 L450,345 L445,365 L435,385 L420,400 L400,410 L375,415 L350,410 L325,400 L300,390 L275,380 L250,370 L225,360 L200,350 L175,340 L150,330 L125,320 L120,310 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Florida - Distinctive peninsula */}
                    <path d="M380,420 L395,415 L405,435 L400,455 L390,470 L375,475 L365,460 L365,440 L370,425 L380,420 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Mexico - Triangular shape tapering south */}
                    <path d="M180,430 L230,425 L280,430 L330,435 L370,445 L365,465 L355,485 L340,500 L320,510 L295,515 L270,510 L245,500 L220,485 L200,465 L185,445 L180,430 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>
                  
                  {/* SOUTH AMERICA - Properly positioned and shaped */}
                  <path id="south-america" d="M350,530 L380,525 L410,535 L425,555 L430,580 L435,605 L440,630 L445,655 L450,680 L455,705 L460,730 L465,755 L460,780 L450,800 L435,815 L415,825 L395,820 L380,810 L370,795 L365,775 L360,750 L355,725 L350,700 L345,675 L340,650 L335,625 L330,600 L325,575 L330,550 L340,535 L350,530 Z" 
                        fill={hoveredCountry === 'CO' || landraceData['CO'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'CO' || landraceData['CO'] ? "#fbbf24" : "#10b981"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('CO')}
                        onMouseEnter={() => handleCountryHover('CO')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* AFRICA - Iconic bulge shape with proper proportions */}
                  <path id="africa" d="M580,300 L620,295 L660,305 L700,320 L730,340 L750,370 L755,405 L750,440 L745,475 L740,510 L735,545 L725,575 L710,600 L690,620 L665,630 L635,625 L610,615 L590,600 L575,580 L565,555 L560,525 L555,495 L550,465 L545,435 L540,405 L545,375 L555,345 L570,320 L580,300 Z" 
                        fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                        className="continent hover:brightness-110 transition-all duration-300" />
                  
                  {/* East Africa - Separate region for Malawi */}
                  <path id="malawi" d="M760,480 L780,475 L795,485 L805,505 L800,525 L785,540 L770,545 L755,540 L745,525 L740,505 L745,485 L760,480 Z" 
                        fill={hoveredCountry === 'MW' || landraceData['MW'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'MW' || landraceData['MW'] ? "#fbbf24" : "#10b981"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('MW')}
                        onMouseEnter={() => handleCountryHover('MW')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* South Africa - Distinctive southern tip */}
                  <path id="south-africa" d="M680,640 L720,635 L750,645 L770,665 L775,685 L765,705 L745,715 L720,720 L695,715 L675,705 L665,690 L665,670 L670,650 L680,640 Z" 
                        fill={hoveredCountry === 'ZA' || landraceData['ZA'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'ZA' || landraceData['ZA'] ? "#fbbf24" : "#10b981"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('ZA')}
                        onMouseEnter={() => handleCountryHover('ZA')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* EUROPE - Compact with distinct peninsulas */}
                  <g id="europe">
                    {/* Scandinavia - Nordic countries */}
                    <path d="M640,150 L680,145 L710,160 L715,185 L710,210 L695,230 L675,240 L650,245 L625,240 L605,225 L600,200 L605,175 L620,160 L640,150 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* British Isles */}
                    <path d="M580,200 L600,195 L615,210 L610,230 L595,245 L575,250 L560,240 L555,220 L560,205 L580,200 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Continental Europe */}
                    <path d="M620,250 L670,245 L720,260 L740,285 L735,315 L720,340 L695,355 L665,360 L635,355 L610,340 L595,315 L590,285 L600,260 L620,250 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>

                  {/* ASIA - Massive continent with proper spacing */}
                  <g id="asia">
                    {/* Siberia/Russia - Vast northern expanse */}
                    <path d="M750,140 L850,135 L950,140 L1050,145 L1150,150 L1200,165 L1205,190 L1200,215 L1190,240 L1175,260 L1155,275 L1135,285 L1115,290 L1095,295 L1075,300 L1055,305 L1035,310 L1015,315 L995,320 L975,325 L955,320 L935,310 L920,295 L910,275 L905,250 L900,225 L895,200 L890,175 L885,150 L880,130 L860,125 L840,130 L820,140 L800,155 L780,170 L760,155 L750,140 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* China - Eastern region */}
                    <path d="M920,330 L980,325 L1040,335 L1080,350 L1105,375 L1100,405 L1085,430 L1065,450 L1040,465 L1015,470 L990,465 L970,450 L955,430 L945,405 L950,375 L960,350 L975,335 L920,330 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* India - Triangular subcontinent */}
                    <path d="M860,390 L920,385 L960,400 L980,425 L985,455 L980,485 L965,510 L945,530 L920,545 L895,550 L870,545 L850,530 L835,510 L830,485 L835,455 L845,425 L860,400 L860,390 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Southeast Asia */}
                    <path d="M1000,480 L1060,475 L1100,490 L1120,515 L1115,545 L1100,570 L1080,585 L1055,590 L1030,585 L1010,570 L995,545 L990,515 L995,490 L1000,480 Z" 
                          fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>

                  {/* AFGHANISTAN region - Central Asia */}
                  <path id="afghanistan" d="M850,340 L890,335 L920,345 L935,365 L930,390 L910,405 L885,410 L860,405 L840,390 L835,365 L840,345 L850,340 Z" 
                        fill={hoveredCountry === 'AF' || landraceData['AF'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'AF' || landraceData['AF'] ? "#fbbf24" : "#10b981"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('AF')}
                        onMouseEnter={() => handleCountryHover('AF')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* THAILAND region - Southeast Asia */}
                  <path id="thailand" d="M1080,510 L1110,505 L1130,515 L1140,535 L1135,555 L1115,570 L1095,575 L1075,570 L1060,555 L1055,535 L1060,515 L1080,510 Z" 
                        fill={hoveredCountry === 'TH' || landraceData['TH'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'TH' || landraceData['TH'] ? "#fbbf24" : "#10b981"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('TH')}
                        onMouseEnter={() => handleCountryHover('TH')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* AUSTRALIA - Properly positioned down under */}
                  <path id="australia" d="M1040,650 L1100,645 L1160,655 L1200,675 L1205,705 L1195,730 L1175,750 L1150,765 L1120,770 L1090,765 L1065,750 L1045,730 L1035,705 L1040,675 L1040,650 Z" 
                        fill="url(#land)" stroke="#10b981" strokeWidth="1.5" 
                        className="continent hover:brightness-110 transition-all duration-300" />
                  
                  {/* New Zealand */}
                  <path d="M1220,750 L1240,745 L1250,765 L1245,785 L1235,795 L1220,800 L1210,785 L1210,765 L1220,750 Z" 
                        fill="url(#land)" stroke="#10b981" strokeWidth="1" 
                        className="continent hover:brightness-110 transition-all duration-300" />
                </g>

                {/* Clean landrace strain markers positioned on properly spaced continents */}
                {Object.entries(landraceData).map(([code, data], index) => {
                  let x = 0, y = 0;
                  switch(code) {
                    case 'MW': x = 775; y = 515; break; // Malawi - East Africa
                    case 'TH': x = 1100; y = 540; break; // Thailand - Southeast Asia
                    case 'AF': x = 870; y = 370; break; // Afghanistan - Central Asia  
                    case 'CO': x = 380; y = 560; break; // Colombia - Northern South America
                    case 'ZA': x = 720; y = 675; break; // South Africa
                  }
                  
                  return (
                    <g key={code}>
                      {/* Static marker with glow effect */}
                      <circle cx={x} cy={y} r="20" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />
                      <circle cx={x} cy={y} r="12" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" 
                              className="cursor-pointer hover:scale-110 transition-all duration-300 drop-shadow-lg"
                              onClick={() => handleCountryClick(code)} />
                      <circle cx={x} cy={y} r="6" fill="#fef3c7" className="pointer-events-none" />
                      
                      {/* Strain name label */}
                      <text x={x} y={y - 35} textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none"
                            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}>
                        {data.strainName}
                      </text>
                      
                      {/* Location label */}
                      <text x={x} y={y - 20} textAnchor="middle" className="fill-yellow-200 text-xs font-medium pointer-events-none"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        {data.location.split(',')[0]}
                      </text>
                      
                      {/* Tooltip on hover */}
                      {hoveredCountry === code && (
                        <g>
                          <rect x={x - 80} y={y + 25} width="160" height="60" 
                                fill="rgba(0,0,0,0.9)" stroke="#fbbf24" strokeWidth="1" rx="5" />
                          <text x={x} y={y + 45} textAnchor="middle" className="fill-battles-gold text-xs font-semibold">
                            {data.strainName}
                          </text>
                          <text x={x} y={y + 60} textAnchor="middle" className="fill-white text-xs">
                            THC: {data.thc} | CBD: {data.cbd}
                          </text>
                          <text x={x} y={y + 75} textAnchor="middle" className="fill-gray-300 text-xs">
                            Click for details
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Geographic grid - Professional cartographic lines */}
                <g opacity="0.2" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4">
                  <line x1="350" y1="0" x2="350" y2="700" />
                  <line x1="700" y1="0" x2="700" y2="700" />
                  <line x1="1050" y1="0" x2="1050" y2="700" />
                  <line x1="0" y1="175" x2="1400" y2="175" />
                  <line x1="0" y1="350" x2="1400" y2="350" />
                  <line x1="0" y1="525" x2="1400" y2="525" />
                  {/* Equator line */}
                  <line x1="0" y1="350" x2="1400" y2="350" stroke="#fbbf24" strokeWidth="2" opacity="0.4" />
                </g>

                {/* Title */}
                <text x="700" y="45" textAnchor="middle" className="fill-white text-2xl font-bold drop-shadow-lg"
                      style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))' }}>
                  GLOBAL LANDRACE CANNABIS ORIGINS
                </text>
                
                {/* Professional legend */}
                <g transform="translate(40, 600)">
                  <rect x="0" y="0" width="280" height="80" fill="rgba(0,0,0,0.8)" rx="8" stroke="#fbbf24" strokeWidth="2" />
                  <circle cx="20" cy="20" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
                  <text x="40" y="26" className="fill-white text-base font-medium">Ancient Landrace Origins</text>
                  <circle cx="20" cy="45" r="6" fill="#047857" stroke="#10b981" strokeWidth="1" />
                  <text x="40" y="51" className="fill-white text-base">Other Continents</text>
                  <text x="20" y="70" className="fill-yellow-200 text-sm">Click markers to explore strain details</text>
                </g>

                {/* Compass rose - Professional cartographic style */}
                <g transform="translate(1320, 80)" opacity="0.7">
                  <circle r="35" fill="none" stroke="#fbbf24" strokeWidth="2" />
                  <circle r="25" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                  <path d="M 0,-30 L 5,-20 L 0,-10 L -5,-20 Z" fill="#fbbf24" />
                  <path d="M 30,0 L 20,5 L 10,0 L 20,-5 Z" fill="#fbbf24" />
                  <path d="M 0,30 L 5,20 L 0,10 L -5,20 Z" fill="#fbbf24" />
                  <path d="M -30,0 L -20,5 L -10,0 L -20,-5 Z" fill="#fbbf24" />
                  <text y="-40" textAnchor="middle" className="fill-white text-sm font-bold">N</text>
                  <text y="8" x="40" textAnchor="middle" className="fill-white text-sm">E</text>
                  <text y="50" textAnchor="middle" className="fill-white text-sm">S</text>
                  <text y="8" x="-40" textAnchor="middle" className="fill-white text-sm">W</text>
                </g>
                </g>
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