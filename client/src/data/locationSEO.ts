// Location-based SEO data for Central NY cannabis market
// Following Reddit user's successful location-specific SEO strategy

export interface LocationSEOData {
  slug: string;
  city: string;
  county: string;
  state: string;
  zipCodes: string[];
  population: number;
  demographics: string;
  distance: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  localCompetitors: string[];
  uniqueContent: {
    intro: string;
    benefits: string[];
    localFacts: string[];
    callToAction: string;
  };
  lastModified: string;
  priority: number;
}

export const centralNYLocations: LocationSEOData[] = [
  {
    slug: "gloversville",
    city: "Gloversville",
    county: "Fulton County",
    state: "NY",
    zipCodes: ["12078"],
    population: 14740,
    demographics: "Diverse community with growing veteran population",
    distance: "0 miles",
    seoTitle: "Battles Budz Cannabis Dispensary Gloversville NY - Veteran Owned Premium Cannabis",
    seoDescription: "Premium cannabis dispensary in Gloversville, NY. Veteran-owned by Justin Battles, offering cannabis flower, edibles, vapes and consumption lounge. Serving Fulton County since 2025.",
    keywords: [
      "cannabis dispensary Gloversville NY",
      "Gloversville marijuana dispensary", 
      "veteran owned cannabis Gloversville",
      "Battles Budz Gloversville",
      "cannabis shop Fulton County NY",
      "Gloversville weed dispensary",
      "premium cannabis Gloversville"
    ],
    localCompetitors: ["Traditional pharmacies", "Alcohol retailers"],
    uniqueContent: {
      intro: "Gloversville's first veteran-owned cannabis dispensary, bringing premium cannabis experiences to Fulton County residents.",
      benefits: [
        "Local ownership by veteran Justin Battles",
        "Walking distance from downtown Gloversville",
        "Veteran-friendly environment and staff",
        "Educational cannabis programs for the community",
        "Consumption lounge for on-site enjoyment"
      ],
      localFacts: [
        "Historic leather manufacturing city embracing cannabis innovation",
        "Strong veteran community of over 800 local veterans",
        "Central location serving all of Fulton County",
        "Easy access from Routes 29 and 30A"
      ],
      callToAction: "Be among the first to experience premium cannabis in Gloversville when we open in 2025."
    },
    lastModified: "2025-01-07",
    priority: 1.0
  },
  {
    slug: "johnstown",
    city: "Johnstown",
    county: "Fulton County", 
    state: "NY",
    zipCodes: ["12095"],
    population: 8300,
    demographics: "Working-class community, close-knit neighborhoods",
    distance: "8 miles from Gloversville",
    seoTitle: "Cannabis Near Johnstown NY - Battles Budz Dispensary 8 Miles Away",
    seoDescription: "Closest premium cannabis dispensary to Johnstown, NY. Battles Budz in nearby Gloversville offers veteran-owned cannabis products just 8 miles away. Delivery available.",
    keywords: [
      "cannabis near Johnstown NY",
      "Johnstown marijuana dispensary nearby",
      "cannabis delivery Johnstown NY",
      "closest dispensary to Johnstown",
      "Fulton County cannabis shop"
    ],
    localCompetitors: [],
    uniqueContent: {
      intro: "Serving Johnstown residents with the closest premium cannabis dispensary, just 8 miles away in Gloversville.",
      benefits: [
        "Quick 15-minute drive to premium cannabis",
        "Delivery service available to Johnstown area",
        "Veteran-owned business supporting local veterans",
        "Educational programs for Johnstown cannabis newcomers"
      ],
      localFacts: [
        "Historic mill town with growing cannabis acceptance",
        "Part of the greater Gloversville-Johnstown metro area",
        "Strong veteran presence from local military families"
      ],
      callToAction: "Join our mailing list for Johnstown area delivery updates and grand opening announcements."
    },
    lastModified: "2025-01-07",
    priority: 0.8
  },
  {
    slug: "amsterdam",
    city: "Amsterdam",
    county: "Montgomery County",
    state: "NY", 
    zipCodes: ["12010"],
    population: 17800,
    demographics: "Diverse urban community, young professionals",
    distance: "18 miles from Gloversville",
    seoTitle: "Cannabis Dispensary Near Amsterdam NY - Battles Budz Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Amsterdam, NY area. Battles Budz in Gloversville offers veteran-owned cannabis products, 18 miles from Amsterdam. Worth the drive for quality.",
    keywords: [
      "cannabis near Amsterdam NY",
      "Amsterdam marijuana dispensary nearby",
      "Montgomery County cannabis",
      "premium cannabis Amsterdam NY area"
    ],
    localCompetitors: ["Existing Amsterdam dispensaries"],
    uniqueContent: {
      intro: "Amsterdam cannabis enthusiasts discover premium quality at Battles Budz, the veteran-owned dispensary worth the 25-minute drive.",
      benefits: [
        "Higher quality products than mass-market dispensaries",
        "Veteran-owned authenticity and military precision",
        "Educational consumption lounge experience",
        "Personalized service you won't find in bigger stores"
      ],
      localFacts: [
        "Growing cannabis tourism destination",
        "Young professional community embracing premium cannabis",
        "Historic riverside city with modern cannabis attitudes"
      ],
      callToAction: "Experience the difference veteran-owned cannabis quality makes - plan your visit to Battles Budz."
    },
    lastModified: "2025-01-07",
    priority: 0.7
  },
  {
    slug: "schenectady",
    city: "Schenectady", 
    county: "Schenectady County",
    state: "NY",
    zipCodes: ["12301", "12302", "12303", "12304", "12305", "12306", "12307", "12308", "12309"],
    population: 65273,
    demographics: "Urban area, college students, professionals",
    distance: "35 miles from Gloversville",
    seoTitle: "Premium Cannabis Alternative to Schenectady NY Dispensaries - Battles Budz",
    seoDescription: "Skip crowded Schenectady dispensaries. Battles Budz offers premium veteran-owned cannabis experience 35 miles away. Quality over convenience - worth the drive for serious cannabis users.",
    keywords: [
      "alternative to Schenectady dispensaries",
      "premium cannabis near Schenectady",
      "veteran owned dispensary Schenectady area",
      "quality cannabis Schenectady NY"
    ],
    localCompetitors: ["CURALEAF", "Verilife", "MedMen"],
    uniqueContent: {
      intro: "Schenectady cannabis connoisseurs choose quality over convenience, making the drive to Battles Budz for premium veteran-owned cannabis.",
      benefits: [
        "Escape corporate cannabis chains",
        "Personal service from veteran owner Justin Battles",
        "Premium products not available in mass-market stores",
        "Educational consumption lounge experience",
        "Supporting veteran entrepreneurship"
      ],
      localFacts: [
        "Union College students and faculty seek quality cannabis",
        "Growing appreciation for craft cannabis over corporate",
        "Strong veteran community values supporting veteran businesses"
      ],
      callToAction: "Join Schenectady cannabis enthusiasts who choose quality over convenience at Battles Budz."
    },
    lastModified: "2025-01-07",
    priority: 0.6
  },
  {
    slug: "albany",
    city: "Albany",
    county: "Albany County", 
    state: "NY",
    zipCodes: ["12201", "12202", "12203", "12204", "12205", "12206", "12207", "12208", "12209", "12210"],
    population: 97478,
    demographics: "State capital, government workers, diverse urban population",
    distance: "45 miles from Gloversville",
    seoTitle: "Cannabis Tourism Albany NY - Battles Budz Veteran-Owned Dispensary Experience",
    seoDescription: "Albany cannabis tourism destination. Experience veteran-owned Battles Budz dispensary 45 miles away. Premium cannabis and consumption lounge worth the scenic drive from NY's capital.",
    keywords: [
      "cannabis tourism Albany NY",
      "Albany cannabis day trip",
      "veteran owned dispensary near Albany",
      "premium cannabis Albany area",
      "cannabis consumption lounge Albany"
    ],
    localCompetitors: ["CURALEAF Albany", "Verilife Albany", "Fine Fettle"],
    uniqueContent: {
      intro: "Albany's cannabis tourists discover authentic veteran-owned experiences at Battles Budz - a scenic hour drive to premium cannabis and consumption lounge.",
      benefits: [
        "Cannabis tourism destination with consumption lounge",
        "Authentic veteran-owned business story",
        "Educational cannabis experiences for state workers",
        "Premium products for discerning Albany professionals",
        "Scenic drive through beautiful Central NY"
      ],
      localFacts: [
        "State government workers seeking veteran-owned businesses",
        "Growing cannabis tourism from NY's capital region",
        "Appreciation for authentic local cannabis businesses"
      ],
      callToAction: "Plan your cannabis tourism trip from Albany to experience authentic veteran-owned cannabis at Battles Budz."
    },
    lastModified: "2025-01-07",
    priority: 0.5
  }
];

// Location-specific meta tag generation
export function getLocationSEO(locationSlug: string): LocationSEOData | null {
  return centralNYLocations.find(loc => loc.slug === locationSlug) || null;
}

// Generate location-based structured data
export function getLocationStructuredData(location: LocationSEOData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Battles Budz Cannabis Dispensary - ${location.city}, ${location.state}`,
    "description": location.seoDescription,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.state,
      "addressCountry": "US",
      "postalCode": location.zipCodes[0]
    },
    "areaServed": {
      "@type": "City",
      "name": location.city,
      "sameAs": `https://en.wikipedia.org/wiki/${location.city.replace(' ', '_')},_New_York`
    },
    "keywords": location.keywords.join(", "),
    "founder": {
      "@type": "Person", 
      "name": "Justin Battles",
      "description": "U.S. Military Veteran, Cannabis Industry Entrepreneur"
    }
  };
}