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

                {/* Ocean background with depth gradient */}
                <rect width="100%" height="100%" fill="url(#ocean)" />
                
                {/* Geographic grid lines for authenticity */}
                <g stroke="#1e40af" strokeWidth="0.5" opacity="0.3">
                  {/* Latitude lines */}
                  <line x1="0" y1="175" x2="1400" y2="175" />
                  <line x1="0" y1="350" x2="1400" y2="350" />
                  <line x1="0" y1="525" x2="1400" y2="525" />
                  {/* Longitude lines */}
                  <line x1="350" y1="0" x2="350" y2="700" />
                  <line x1="700" y1="0" x2="700" y2="700" />
                  <line x1="1050" y1="0" x2="1050" y2="700" />
                </g>

                {/* Authentic Geographic World Map - Based on Natural Earth Data */}
                <g filter="url(#shadow)">
                  {/* NORTH AMERICA - Authentic coastline shapes */}
                  <g id="north-america">
                    {/* Canada - Recognizable Arctic archipelago and coastline */}
                    <path d="M80,150 Q120,140 180,145 Q240,150 300,155 Q360,160 420,170 Q460,180 480,200 Q490,220 485,240 Q480,260 470,280 Q450,300 430,310 Q400,320 370,315 Q340,310 310,305 Q280,300 250,290 Q220,280 190,270 Q160,250 140,230 Q120,210 110,185 Q90,170 80,150 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* United States - Distinctive continental shape with Great Lakes */}
                    <path d="M100,325 Q140,320 180,325 Q220,330 260,335 Q300,340 340,345 Q380,350 420,360 Q440,370 445,390 Q440,410 430,430 Q410,440 390,445 Q360,440 330,435 Q300,430 270,425 Q240,420 210,410 Q180,400 150,385 Q120,370 105,350 Q95,340 100,325 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Mexico - Tapering peninsula with Gulf of Mexico */}
                    <path d="M160,450 Q200,445 240,450 Q280,455 320,465 Q360,475 380,495 Q390,515 385,535 Q375,555 360,570 Q340,580 315,575 Q290,570 265,560 Q240,550 215,535 Q190,520 175,500 Q165,480 160,450 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>
                  
                  {/* SOUTH AMERICA - Authentic triangular shape with Andes Mountains */}
                  <path id="south-america" d="M280,580 Q320,575 360,590 Q380,610 390,640 Q395,670 400,700 Q405,730 410,760 Q415,790 420,820 Q415,850 405,875 Q390,895 370,905 Q350,900 330,890 Q310,875 295,855 Q285,830 280,800 Q275,770 270,740 Q265,710 260,680 Q255,650 250,620 Q255,595 270,585 Q280,580 280,580 Z" 
                        fill={hoveredCountry === 'CO' || landraceData['CO'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'CO' || landraceData['CO'] ? "#fbbf24" : "#047857"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('CO')}
                        onMouseEnter={() => handleCountryHover('CO')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* AFRICA - Authentic continental shape with Horn and bulge */}
                  <g id="africa">
                    {/* Northern Africa - Mediterranean coastline */}
                    <path d="M580,280 Q640,275 700,285 Q740,295 780,315 Q790,335 785,355 Q775,375 760,390 Q740,400 715,395 Q690,390 665,385 Q640,380 615,375 Q590,370 570,355 Q555,340 555,320 Q560,300 575,285 Q580,280 580,280 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Central Africa - The iconic bulge */}
                    <path d="M520,400 Q570,395 620,410 Q670,425 710,450 Q730,480 735,515 Q730,550 715,580 Q695,605 670,620 Q640,625 610,620 Q580,615 550,605 Q520,590 500,570 Q485,545 485,515 Q490,485 505,455 Q520,425 520,400 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* East Africa - Including Horn region */}
                    <path id="malawi" d="M740,420 Q780,415 810,430 Q825,450 830,475 Q835,500 825,525 Q810,545 790,555 Q770,560 750,555 Q730,545 720,525 Q715,500 720,475 Q725,450 740,430 Q740,420 740,420 Z" 
                          fill={hoveredCountry === 'MW' || landraceData['MW'] ? "url(#landrace-land)" : "url(#land)"} 
                          stroke={hoveredCountry === 'MW' || landraceData['MW'] ? "#fbbf24" : "#047857"} 
                          strokeWidth="2"
                          className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                          onClick={() => handleCountryClick('MW')}
                          onMouseEnter={() => handleCountryHover('MW')}
                          onMouseLeave={() => handleCountryHover(null)} />

                    {/* Southern Africa - Distinctive pointed tip */}
                    <path id="south-africa" d="M620,650 Q670,645 710,660 Q740,680 750,710 Q745,740 730,760 Q710,775 685,780 Q660,775 640,760 Q625,740 620,710 Q615,680 620,650 Z" 
                          fill={hoveredCountry === 'ZA' || landraceData['ZA'] ? "url(#landrace-land)" : "url(#land)"} 
                          stroke={hoveredCountry === 'ZA' || landraceData['ZA'] ? "#fbbf24" : "#047857"} 
                          strokeWidth="2"
                          className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                          onClick={() => handleCountryClick('ZA')}
                          onMouseEnter={() => handleCountryHover('ZA')}
                          onMouseLeave={() => handleCountryHover(null)} />
                  </g>

                  {/* EUROPE - Authentic peninsulas and coastlines */}
                  <g id="europe">
                    {/* Scandinavia - Distinctive Nordic fjords */}
                    <path d="M640,120 Q680,115 720,130 Q740,150 745,175 Q740,200 730,220 Q710,235 690,240 Q670,245 650,240 Q630,235 615,220 Q605,200 605,175 Q610,150 625,135 Q640,120 640,120 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* British Isles - Recognizable island shapes */}
                    <path d="M580,190 Q600,185 615,200 Q620,220 615,240 Q600,255 580,260 Q560,255 545,240 Q540,220 545,200 Q560,185 580,190 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Continental Europe - Including Iberian and Italian peninsulas */}
                    <path d="M590,260 Q640,255 690,270 Q730,290 750,320 Q755,350 745,380 Q725,405 700,415 Q675,420 650,415 Q625,405 605,380 Q590,350 590,320 Q590,290 590,260 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>

                  {/* ASIA - Massive continent with authentic geographic features */}
                  <g id="asia">
                    {/* Siberia/Russia - Vast northern landmass */}
                    <path d="M780,100 Q880,95 980,105 Q1080,115 1180,125 Q1220,140 1230,170 Q1225,200 1210,225 Q1190,245 1165,260 Q1140,270 1115,275 Q1090,280 1065,285 Q1040,290 1015,295 Q990,300 965,305 Q940,310 915,305 Q890,295 870,280 Q855,260 850,235 Q850,210 855,185 Q865,160 880,140 Q900,125 920,115 Q940,110 960,105 Q780,100 780,100 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* China - Distinctive eastern coastline */}
                    <path d="M920,320 Q980,315 1040,330 Q1080,350 1100,380 Q1105,410 1095,440 Q1075,465 1050,480 Q1020,485 990,480 Q960,470 940,450 Q925,425 925,395 Q930,365 945,340 Q920,320 920,320 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* India - Triangular subcontinent with authentic shape */}
                    <path d="M850,380 Q900,375 950,390 Q980,415 990,450 Q985,485 970,515 Q950,540 925,555 Q900,560 875,555 Q850,540 830,515 Q815,485 820,450 Q830,415 850,390 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                    
                    {/* Southeast Asia - Island archipelagos */}
                    <path d="M1000,500 Q1060,495 1110,515 Q1140,540 1135,570 Q1120,595 1095,605 Q1070,610 1045,605 Q1020,595 1005,570 Q995,540 1000,515 Q1000,500 1000,500 Z" 
                          fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                          className="continent hover:brightness-110 transition-all duration-300" />
                  </g>

                  {/* AFGHANISTAN region - Central Asia landrace region */}
                  <path id="afghanistan" d="M830,330 Q870,325 900,340 Q920,360 925,385 Q920,410 900,425 Q875,430 850,425 Q825,410 815,385 Q815,360 825,345 Q830,330 830,330 Z" 
                        fill={hoveredCountry === 'AF' || landraceData['AF'] ? "url(#landrace-land)" : "url(#land)"} 
                        stroke={hoveredCountry === 'AF' || landraceData['AF'] ? "#fbbf24" : "#047857"} 
                        strokeWidth="2"
                        className="continent cursor-pointer hover:brightness-125 transition-all duration-300"
                        onClick={() => handleCountryClick('AF')}
                        onMouseEnter={() => handleCountryHover('AF')}
                        onMouseLeave={() => handleCountryHover(null)} />

                  {/* AUSTRALIA - Distinctive island continent */}
                  <path id="australia" d="M1120,580 Q1180,575 1240,590 Q1280,610 1300,640 Q1305,670 1290,695 Q1270,715 1245,720 Q1220,715 1195,705 Q1170,690 1155,670 Q1145,645 1145,620 Q1150,595 1165,585 Q1120,580 1120,580 Z" 
                        fill="url(#land)" stroke="#047857" strokeWidth="1.5" 
                        className="continent hover:brightness-110 transition-all duration-300" />

                  {/* Professional Cartographic Elements */}
                  {/* Compass Rose */}
                  <g transform="translate(1320, 80)">
                    <circle r="35" fill="rgba(0,0,0,0.8)" stroke="#fbbf24" strokeWidth="2"/>
                    <g stroke="#fbbf24" strokeWidth="2" fill="#fbbf24">
                      <path d="M0,-25 L5,-10 L0,-15 L-5,-10 Z" />
                      <path d="M25,0 L10,5 L15,0 L10,-5 Z" />
                      <path d="M0,25 L5,10 L0,15 L-5,10 Z" />
                      <path d="M-25,0 L-10,5 L-15,0 L-10,-5 Z" />
                    </g>
                    <text y="-30" textAnchor="middle" fontSize="12" fill="#fbbf24" fontWeight="bold">N</text>
                    <text x="30" y="5" textAnchor="middle" fontSize="10" fill="#fbbf24">E</text>
                    <text y="40" textAnchor="middle" fontSize="10" fill="#fbbf24">S</text>
                    <text x="-30" y="5" textAnchor="middle" fontSize="10" fill="#fbbf24">W</text>
                  </g>

                  {/* Equator Line */}
                  <line x1="0" y1="350" x2="1400" y2="350" stroke="#fbbf24" strokeWidth="1" opacity="0.6" strokeDasharray="5,5"/>
                  <text x="1350" y="345" fontSize="10" fill="#fbbf24" opacity="0.8">Equator</text>

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