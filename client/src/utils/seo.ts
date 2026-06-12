// SEO utility functions and constants

export const SITE_CONFIG = {
  name: "Garden of Weeden",
  tagline: "Farm to Flame Cannabis",
  description: "Farm to Flame cannabis microbusiness in Buffalo, NY with house-grown flower, regional craft products, the Forbidden Fruit lounge, and private event bookings.",
  url: import.meta.env.VITE_SITE_URL || "https://gardenofweeden-production.up.railway.app",
  businessName: "Garden of Weeden",
  location: {
    city: "Buffalo",
    state: "NY",
    address: "1455 Niagara St",
    postalCode: "14213",
    coordinates: {
      latitude: 42.8864,
      longitude: -78.8784
    }
  },
  contact: {
    email: "manager.gardenofweeden@gmail.com",
    phone: "+1-716-420-1591"
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
      "streetAddress": SITE_CONFIG.location.address,
      "addressLocality": SITE_CONFIG.location.city,
      "addressRegion": SITE_CONFIG.location.state,
      "postalCode": SITE_CONFIG.location.postalCode,
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
      "postalCode": SITE_CONFIG.location.postalCode,
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
    "Farm to Flame cannabis Buffalo",
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
    "craft cannabis flower",
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
    "cannabis advocacy",
    "cannabis culture",
    "cannabis enthusiasts"
  ]
};
