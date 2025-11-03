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
    demographics: "Diverse urban community with vibrant local culture",
    distance: "0 miles",
    seoTitle: "Garden of Weeden Cannabis Dispensary Buffalo NY - Premium Quality Cannabis",
    seoDescription: "Premium cannabis dispensary in Buffalo, NY. Locally-owned Garden of Weeden offers cannabis flower, edibles, vapes and consumption lounge. Serving Erie County with quality and care.",
    keywords: [
      "cannabis dispensary Buffalo NY",
      "Buffalo marijuana dispensary", 
      "locally owned cannabis Buffalo",
      "Garden of Weeden Buffalo",
      "cannabis shop Erie County NY",
      "Buffalo weed dispensary",
      "premium cannabis Buffalo"
    ],
    localCompetitors: ["Traditional pharmacies", "Alcohol retailers"],
    uniqueContent: {
      intro: "Buffalo's premier locally-owned cannabis dispensary, bringing premium cannabis experiences to Western NY residents.",
      benefits: [
        "Locally owned and community-focused",
        "Walking distance from downtown Buffalo",
        "Welcoming environment and knowledgeable staff",
        "Educational cannabis programs for the community",
        "Consumption lounge for on-site enjoyment"
      ],
      localFacts: [
        "Historic industrial city embracing cannabis innovation",
        "Growing cannabis community in Western New York",
        "Central location serving all of Erie County",
        "Easy access from I-90 and Route 33"
      ],
      callToAction: "Experience premium cannabis quality at Buffalo's trusted local dispensary."
    },
    lastModified: "2025-11-03",
    priority: 1.0
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
    seoTitle: "Cannabis Dispensary Near Niagara Falls NY - Garden of Weeden Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Niagara Falls, NY area. Garden of Weeden in Buffalo offers quality cannabis products, 20 miles from Niagara Falls. Perfect for tourists and locals.",
    keywords: [
      "cannabis near Niagara Falls NY",
      "Niagara Falls marijuana dispensary nearby",
      "Niagara County cannabis",
      "cannabis tourism Niagara Falls"
    ],
    localCompetitors: ["Tourist-focused dispensaries"],
    uniqueContent: {
      intro: "Niagara Falls cannabis enthusiasts and tourists discover authentic premium quality at Garden of Weeden, just 30 minutes away.",
      benefits: [
        "Easy 30-minute drive from Niagara Falls",
        "Cannabis tourism experience with consumption lounge",
        "Locally-owned quality and community commitment",
        "Perfect stop before or after visiting the Falls"
      ],
      localFacts: [
        "Major international tourist destination",
        "Growing cannabis tourism market",
        "Border city with diverse cannabis culture"
      ],
      callToAction: "Experience authentic premium cannabis during your Niagara Falls visit."
    },
    lastModified: "2025-11-03",
    priority: 0.7
  },
  {
    slug: "tonawanda",
    city: "Tonawanda", 
    county: "Erie County",
    state: "NY",
    zipCodes: ["14150", "14151"],
    population: 57961,
    demographics: "Suburban community, working families, strong local pride",
    distance: "15 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Tonawanda NY - Garden of Weeden Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Tonawanda, NY area. Garden of Weeden in Buffalo offers quality cannabis products, 15 miles from Tonawanda. Quick drive for quality.",
    keywords: [
      "cannabis near Tonawanda NY",
      "Tonawanda marijuana dispensary nearby",
      "locally owned dispensary Tonawanda",
      "Erie County cannabis shop"
    ],
    localCompetitors: ["Local dispensaries"],
    uniqueContent: {
      intro: "Tonawanda residents enjoy easy access to premium locally-owned cannabis, just 20 minutes away in Buffalo.",
      benefits: [
        "Quick 20-minute drive to premium cannabis",
        "Personal service from dedicated local staff",
        "Educational consumption lounge experience",
        "Supporting local community businesses"
      ],
      localFacts: [
        "Suburban WNY community embracing cannabis culture",
        "Growing appreciation for quality local businesses",
        "Strong connection to Buffalo cannabis scene"
      ],
      callToAction: "Experience premium cannabis quality at Garden of Weeden, your trusted local WNY dispensary."
    },
    lastModified: "2025-11-03",
    priority: 0.6
  },
  {
    slug: "cheektowaga",
    city: "Cheektowaga",
    county: "Erie County",
    state: "NY",
    zipCodes: ["14225", "14227", "14211"],
    population: 88226,
    demographics: "Large suburban community, diverse working families, vibrant local culture",
    distance: "10 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Cheektowaga NY - Garden of Weeden Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Cheektowaga, NY area. Garden of Weeden in Buffalo offers quality cannabis products, 10 miles from Cheektowaga. Quick drive for quality.",
    keywords: [
      "cannabis near Cheektowaga NY",
      "Cheektowaga marijuana dispensary nearby",
      "locally owned dispensary Cheektowaga",
      "Erie County cannabis shop",
      "Buffalo suburbs cannabis"
    ],
    localCompetitors: ["Chain dispensaries", "Corporate cannabis stores"],
    uniqueContent: {
      intro: "Cheektowaga residents enjoy premium locally-owned cannabis just 15 minutes away in downtown Buffalo.",
      benefits: [
        "Quick 15-minute drive to premium cannabis",
        "Personal service from knowledgeable local staff",
        "Supporting local community businesses",
        "Educational cannabis programs for families",
        "Consumption lounge for safe, social use"
      ],
      localFacts: [
        "Largest suburb in Erie County with 88,000+ residents",
        "Community seeking authentic local businesses",
        "Growing appreciation for premium cannabis quality",
        "Easy access via Transit Road and Walden Avenue"
      ],
      callToAction: "Experience premium cannabis quality at Garden of Weeden, serving your Cheektowaga community."
    },
    lastModified: "2025-11-03",
    priority: 0.8
  },
  {
    slug: "amherst",
    city: "Amherst",
    county: "Erie County",
    state: "NY",
    zipCodes: ["14226", "14221", "14228"],
    population: 129200,
    demographics: "Affluent college town, UB students and professionals, educated community",
    distance: "15 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Amherst NY - Garden of Weeden University Premium Cannabis",
    seoDescription: "Premium cannabis dispensary serving Amherst, NY and UB area. Garden of Weeden in Buffalo offers quality cannabis products, 15 miles from Amherst. Quality for discerning users.",
    keywords: [
      "cannabis near Amherst NY",
      "Amherst marijuana dispensary nearby",
      "UB cannabis dispensary",
      "University Buffalo cannabis",
      "premium cannabis Amherst NY"
    ],
    localCompetitors: ["University-area dispensaries", "Chain stores"],
    uniqueContent: {
      intro: "Amherst professionals and UB community discover premium locally-owned cannabis experiences, just 20 minutes away in Buffalo.",
      benefits: [
        "20-minute drive to premium cannabis experience",
        "Educational focus perfect for university community",
        "Locally-owned quality and exceptional standards",
        "Consumption lounge for responsible social use",
        "Premium products for discerning professionals"
      ],
      localFacts: [
        "Home to University at Buffalo with 30,000+ students",
        "Affluent community with highest educated demographics",
        "Progressive attitudes toward cannabis wellness",
        "Easy access via I-290 and Maple Road"
      ],
      callToAction: "Discover premium cannabis quality at Garden of Weeden - education and excellence combined."
    },
    lastModified: "2025-11-03",
    priority: 0.7
  },
  {
    slug: "west-seneca",
    city: "West Seneca",
    county: "Erie County",
    state: "NY",
    zipCodes: ["14224", "14206"],
    population: 45920,
    demographics: "Family-oriented suburban community, working professionals, strong local pride",
    distance: "12 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near West Seneca NY - Garden of Weeden Family-Friendly Cannabis",
    seoDescription: "Premium cannabis dispensary serving West Seneca, NY families. Garden of Weeden in Buffalo offers quality cannabis products, 12 miles from West Seneca. Community-focused quality.",
    keywords: [
      "cannabis near West Seneca NY",
      "West Seneca marijuana dispensary nearby",
      "family friendly cannabis West Seneca",
      "locally owned dispensary West Seneca",
      "Erie County cannabis"
    ],
    localCompetitors: ["Big box dispensaries", "Chain cannabis stores"],
    uniqueContent: {
      intro: "West Seneca families trust locally-owned Garden of Weeden for premium cannabis experiences, just 18 minutes away in Buffalo.",
      benefits: [
        "18-minute drive to premium cannabis quality",
        "Family-oriented educational approach",
        "Community-focused business supporting local families",
        "Safe consumption lounge environment",
        "Personal service from dedicated local staff"
      ],
      localFacts: [
        "Strong family community with local business support",
        "Growing acceptance of cannabis wellness benefits",
        "Community seeking authentic local businesses",
        "Easy access via Seneca Street and Route 400"
      ],
      callToAction: "Experience community-focused premium cannabis at Garden of Weeden, serving West Seneca families."
    },
    lastModified: "2025-11-03",
    priority: 0.7
  },
  {
    slug: "orchard-park",
    city: "Orchard Park",
    county: "Erie County",
    state: "NY",
    zipCodes: ["14127", "14224"],
    population: 29054,
    demographics: "Affluent suburb, Bills fans, professionals and families, strong community pride",
    distance: "20 miles from Buffalo",
    seoTitle: "Cannabis Dispensary Near Orchard Park NY - Garden of Weeden Bills Country Cannabis",
    seoDescription: "Premium cannabis dispensary serving Orchard Park, NY and Bills fans. Garden of Weeden in Buffalo offers quality cannabis products, 20 miles from Orchard Park. Game day quality.",
    keywords: [
      "cannabis near Orchard Park NY",
      "Orchard Park marijuana dispensary nearby",
      "Bills game cannabis",
      "locally owned dispensary Orchard Park",
      "premium cannabis Bills country"
    ],
    localCompetitors: ["Highpoint dispensaries", "Chain stores"],
    uniqueContent: {
      intro: "Orchard Park residents and Bills fans experience premium locally-owned cannabis, just 25 minutes away in downtown Buffalo.",
      benefits: [
        "25-minute drive to premium cannabis quality",
        "Perfect for Bills game day celebrations",
        "Locally-owned business with exceptional quality",
        "Consumption lounge for social game watching",
        "Premium products for affluent community standards"
      ],
      localFacts: [
        "Home of Buffalo Bills and passionate sports community",
        "Affluent suburb with discerning consumer preferences",
        "Community supporting quality local businesses",
        "Easy access via Route 219 and Abbott Road"
      ],
      callToAction: "Experience championship-quality premium cannabis at Garden of Weeden - perfect for Bills Country."
    },
    lastModified: "2025-11-03",
    priority: 0.6
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
    "name": `Garden of Weeden Cannabis Dispensary - ${location.city}, ${location.state}`,
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
    "keywords": location.keywords.join(", ")
  };
}