// Location-based SEO data for Western NY cannabis market
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

export const westernNYLocations: LocationSEOData[] = [
  {
    slug: "buffalo",
    city: "Buffalo",
    county: "Erie County",
    state: "NY",
    zipCodes: ["14202"],
    population: 278349,
    demographics: "Diverse urban community with strong veteran population",
    distance: "0 miles",
    seoTitle: "Battles Budz Cannabis Dispensary Buffalo NY - Veteran Owned Premium Cannabis",
    seoDescription: "Premium cannabis dispensary in Buffalo, NY. Veteran-owned by Justin Battles, offering cannabis flower, edibles, vapes and consumption lounge. Serving Erie County since 2025.",
    keywords: [
      "cannabis dispensary Buffalo NY",
      "Buffalo marijuana dispensary", 
      "veteran owned cannabis Buffalo",
      "Battles Budz Buffalo",
      "cannabis shop Erie County NY",
      "Buffalo weed dispensary",
      "premium cannabis Buffalo"
    ],
    localCompetitors: ["Traditional pharmacies", "Alcohol retailers"],
    uniqueContent: {
      intro: "Buffalo's first veteran-owned cannabis dispensary, bringing premium cannabis experiences to Western NY residents.",
      benefits: [
        "Local ownership by veteran Justin Battles",
        "Walking distance from downtown Buffalo",
        "Veteran-friendly environment and staff",
        "Educational cannabis programs for the community",
        "Consumption lounge for on-site enjoyment"
      ],
      localFacts: [
        "Historic industrial city embracing cannabis innovation",
        "Strong veteran community of over 15,000 local veterans",
        "Central location serving all of Erie County",
        "Easy access from I-90 and Route 33"
      ],
      callToAction: "Be among the first to experience premium cannabis in Buffalo when we open in 2025."
    },
    lastModified: "2025-01-07",
    priority: 1.0
  },
  {
    slug: "rochester",
    city: "Rochester",
    county: "Monroe County", 
    state: "NY",
    zipCodes: ["14601", "14602", "14603", "14604", "14605"],
    population: 211328,
    demographics: "College town with tech professionals and diverse community",
    distance: "75 miles from Buffalo",
    seoTitle: "Cannabis Near Rochester NY - Battles Budz Dispensary 75 Miles Away",
    seoDescription: "Premium cannabis dispensary serving Rochester, NY area. Battles Budz in Buffalo offers veteran-owned cannabis products, 75 miles from Rochester. Worth the drive for quality.",
    keywords: [
      "cannabis near Rochester NY",
      "Rochester marijuana dispensary nearby",
      "cannabis delivery Rochester NY",
      "Monroe County cannabis shop",
      "premium cannabis Rochester area"
    ],
    localCompetitors: ["Existing Rochester dispensaries"],
    uniqueContent: {
      intro: "Serving Rochester residents with premium veteran-owned cannabis, worth the scenic drive to Buffalo.",
      benefits: [
        "1.5 hour drive to premium cannabis experience",
        "Veteran-owned business supporting local veterans",
        "Educational programs for Rochester cannabis newcomers",
        "Higher quality than mass-market dispensaries"
      ],
      localFacts: [
        "University town with growing cannabis acceptance",
        "Tech hub with professionals seeking premium products",
        "Strong connection to Western NY cannabis culture"
      ],
      callToAction: "Join our mailing list for Rochester area updates and grand opening announcements."
    },
    lastModified: "2025-01-07",
    priority: 0.8
  },
  {
    slug: "niagara-falls",
    city: "Niagara Falls",
    county: "Niagara County",
    state: "NY", 
    zipCodes: ["14301", "14302", "14303", "14304"],
    population: 48671,
    demographics: "Tourist destination with local working community",
    distance: "20 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Niagara Falls NY - Battles Budz Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Niagara Falls, NY area. Battles Budz in Buffalo offers veteran-owned cannabis products, 20 miles from Niagara Falls. Perfect for tourists and locals.",
    keywords: [
      "cannabis near Niagara Falls NY",
      "Niagara Falls marijuana dispensary nearby",
      "Niagara County cannabis",
      "cannabis tourism Niagara Falls"
    ],
    localCompetitors: ["Tourist-focused dispensaries"],
    uniqueContent: {
      intro: "Niagara Falls cannabis enthusiasts and tourists discover authentic premium quality at Battles Budz, just 30 minutes away.",
      benefits: [
        "Easy 30-minute drive from Niagara Falls",
        "Cannabis tourism experience with consumption lounge",
        "Veteran-owned authenticity and military precision",
        "Perfect stop before or after visiting the Falls"
      ],
      localFacts: [
        "Major international tourist destination",
        "Growing cannabis tourism market",
        "Border city with diverse cannabis culture"
      ],
      callToAction: "Experience authentic veteran-owned cannabis during your Niagara Falls visit."
    },
    lastModified: "2025-01-07",
    priority: 0.7
  },
  {
    slug: "tonawanda",
    city: "Tonawanda", 
    county: "Erie County",
    state: "NY",
    zipCodes: ["14150", "14151"],
    population: 57961,
    demographics: "Suburban community, working families, strong veteran presence",
    distance: "15 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Tonawanda NY - Battles Budz Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Tonawanda, NY area. Battles Budz in Buffalo offers veteran-owned cannabis products, 15 miles from Tonawanda. Quick drive for quality.",
    keywords: [
      "cannabis near Tonawanda NY",
      "Tonawanda marijuana dispensary nearby",
      "veteran owned dispensary Tonawanda",
      "Erie County cannabis shop"
    ],
    localCompetitors: ["Local dispensaries"],
    uniqueContent: {
      intro: "Tonawanda residents enjoy easy access to premium veteran-owned cannabis, just 20 minutes away in Buffalo.",
      benefits: [
        "Quick 20-minute drive to premium cannabis",
        "Personal service from veteran owner Justin Battles",
        "Educational consumption lounge experience",
        "Supporting local veteran entrepreneurship"
      ],
      localFacts: [
        "Suburban WNY community embracing cannabis culture",
        "Growing appreciation for veteran-owned businesses",
        "Strong connection to Buffalo cannabis scene"
      ],
      callToAction: "Experience veteran-owned cannabis quality at Battles Budz, your local WNY dispensary."
    },
    lastModified: "2025-01-07",
    priority: 0.6
  },
  {
    slug: "jamestown",
    city: "Jamestown",
    county: "Chautauqua County", 
    state: "NY",
    zipCodes: ["14701", "14702"],
    population: 28712,
    demographics: "Small city, working-class community, rural WNY character",
    distance: "65 miles from Buffalo",
    seoTitle: "Cannabis Tourism Jamestown NY - Battles Budz Veteran-Owned Dispensary Experience",
    seoDescription: "Jamestown cannabis tourism destination. Experience veteran-owned Battles Budz dispensary in Buffalo. Premium cannabis and consumption lounge worth the scenic drive through WNY.",
    keywords: [
      "cannabis tourism Jamestown NY",
      "Jamestown cannabis day trip",
      "veteran owned dispensary near Jamestown",
      "premium cannabis Jamestown area",
      "Chautauqua County cannabis"
    ],
    localCompetitors: ["Limited local options"],
    uniqueContent: {
      intro: "Jamestown's cannabis tourists discover authentic veteran-owned experiences at Battles Budz - a scenic 1-hour drive to premium cannabis and consumption lounge.",
      benefits: [
        "Cannabis tourism destination with consumption lounge",
        "Authentic veteran-owned business story",
        "Educational cannabis experiences for rural WNY users",
        "Premium products for discerning users",
        "Scenic drive through beautiful Western NY"
      ],
      localFacts: [
        "Rural WNY community seeking veteran-owned businesses",
        "Growing cannabis tourism from Chautauqua County",
        "Appreciation for authentic local cannabis businesses"
      ],
      callToAction: "Plan your cannabis tourism trip from Jamestown to experience authentic veteran-owned cannabis at Battles Budz."
    },
    lastModified: "2025-01-07",
    priority: 0.5
  }
];

// Location-specific meta tag generation
export function getLocationSEO(locationSlug: string): LocationSEOData | null {
  return westernNYLocations.find(loc => loc.slug === locationSlug) || null;
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