// SEO utility functions and constants

export const SITE_CONFIG = {
  name: "Battles Budz",
  tagline: "Premium Cannabis Experience",
  description: "Premium cannabis cultivation, processing, and consumption experiences in Gloversville, NY. Veteran-owned microbusiness offering retail cannabis, consumption lounge, and educational events.",
  url: import.meta.env.VITE_SITE_URL || "https://battlesbudz.replit.app",
  businessName: "Battles Budz LLC",
  location: {
    city: "Gloversville",
    state: "NY",
    address: "Gloversville, NY 12078",
    coordinates: {
      latitude: 43.0534,
      longitude: -74.3434
    }
  },
  contact: {
    email: "info@battlesbudz.com",
    phone: "+1-518-XXX-XXXX"
  },
  social: {
    facebook: "https://facebook.com/battlesbudz",
    instagram: "https://instagram.com/battlesbudz",
    twitter: "https://twitter.com/battlesbudz"
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
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.twitter
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
    "cannabis dispensary Gloversville NY",
    "premium cannabis Gloversville",
    "veteran owned cannabis business",
    "consumption lounge New York",
    "cannabis cultivation NY",
    "cannabis processing facility",
    "legal cannabis Gloversville",
    "cannabis retail store",
    "cannabis education classes",
    "cannabis community events"
  ],
  shop: [
    "buy cannabis Gloversville",
    "cannabis products NY",
    "premium cannabis flower",
    "cannabis edibles",
    "cannabis vapes",
    "cannabis concentrates",
    "legal cannabis purchase",
    "cannabis delivery Gloversville",
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
    "cannabis community Gloversville",
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