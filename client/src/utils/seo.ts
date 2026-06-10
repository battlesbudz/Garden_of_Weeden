// SEO utility functions and constants

export const SITE_CONFIG = {
  name: "Garden of Weeden",
  tagline: "Premium Cannabis Experience",
  description: "Premium cannabis products and experiences in Buffalo, NY. Local microbusiness offering quality cannabis retail and services.",
  url: import.meta.env.VITE_SITE_URL || "https://gardenofweeden-production.up.railway.app",
  businessName: "Garden of Weeden",
  location: {
    city: "Buffalo",
    state: "NY",
    address: "Buffalo, NY",
    coordinates: {
      latitude: 42.8864,
      longitude: -78.8784
    }
  },
  contact: {
    email: "info@gardenofweeden.com",
    phone: "+1-716-XXX-XXXX"
  },
  social: {
    instagram: "https://www.instagram.com/garden_of_weeden_ny?igsh=MTBuZDV4dzB6NnVwbA=="
  }
};

// Generate canonical URL
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

// Generate page title
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline} | ${SITE_CONFIG.location.city}, ${SITE_CONFIG.location.state}`;
  return `${pageTitle} | ${SITE_CONFIG.name}`;
}

// Common structured data schemas
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_CONFIG.businessName,
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "logo": `${SITE_CONFIG.url}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": SITE_CONFIG.location.city,
      "addressRegion": SITE_CONFIG.location.state,
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SITE_CONFIG.contact.phone,
      "contactType": "customer service",
      "email": SITE_CONFIG.contact.email
    },
    "sameAs": [
      SITE_CONFIG.social.instagram
    ]
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": SITE_CONFIG.businessName,
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "telephone": SITE_CONFIG.contact.phone,
    "email": SITE_CONFIG.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.location.address,
      "addressLocality": SITE_CONFIG.location.city,
      "addressRegion": SITE_CONFIG.location.state,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.location.coordinates.latitude,
      "longitude": SITE_CONFIG.location.coordinates.longitude
    },
    "openingHours": "Mo-Sa 10:00-21:00",
    "priceRange": "$$",
    "servesCuisine": "Cannabis",
    "paymentAccepted": "Cash, Debit"
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "category": product.category,
    "image": product.imageUrl || `${SITE_CONFIG.url}/default-product.jpg`,
    "brand": {
      "@type": "Brand",
      "name": SITE_CONFIG.name
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_CONFIG.businessName
      }
    }
  };
}

export function getBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

// Cannabis-specific keywords by page type
export const CANNABIS_KEYWORDS = {
  home: [
    "cannabis dispensary Buffalo NY",
    "premium cannabis Buffalo",
    "locally owned cannabis business",
    "legal cannabis Buffalo",
    "cannabis retail store",
    "cannabis products NY",
    "cannabis shop Buffalo",
    "quality cannabis Buffalo"
  ],
  shop: [
    "buy cannabis Buffalo",
    "cannabis products NY",
    "premium cannabis flower",
    "cannabis edibles",
    "cannabis vapes",
    "cannabis concentrates",
    "legal cannabis purchase",
    "cannabis delivery Buffalo",
    "cannabis merchandise",
    "cannabis accessories"
  ],
  education: [
    "cannabis education",
    "cannabis safety training",
    "cannabis dosage guide",
    "cannabis consumption methods",
    "cannabis benefits",
    "cannabis laws NY",
    "responsible cannabis use",
    "cannabis industry training",
    "cannabis cultivation education",
    "cannabis business education"
  ],
  community: [
    "cannabis community Buffalo",
    "cannabis events NY",
    "cannabis meetups",
    "cannabis discussion forum",
    "cannabis social network",
    "cannabis advocacy",
    "cannabis user groups",
    "cannabis industry networking",
    "cannabis culture",
    "cannabis enthusiasts"
  ],
  investors: [
    "cannabis investment opportunities",
    "cannabis business investment",
    "cannabis industry funding",
    "marijuana business investors",
    "cannabis startup investment",
    "legal cannabis investment",
    "cannabis market opportunities",
    "cannabis business plan",
    "cannabis industry growth",
    "cannabis venture capital"
  ]
};
