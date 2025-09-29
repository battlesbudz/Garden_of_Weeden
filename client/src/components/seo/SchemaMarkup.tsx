import { SITE_CONFIG } from '@/utils/seo';

interface SchemaMarkupProps {
  type: 'organization' | 'local-business' | 'cannabis-business';
}

export default function SchemaMarkup({ type }: SchemaMarkupProps) {
  const getSchema = () => {
    switch (type) {
      case 'cannabis-business':
        return {
          "@context": "https://schema.org",
          "@type": ["Organization", "LocalBusiness"],
          "name": "Battles Budz LLC",
          "alternateName": "Battles Budz",
          "description": "Veteran-owned cannabis microbusiness offering premium cannabis cultivation, processing, and consumption experiences in Buffalo, New York.",
          "url": "https://battlesbudz.replit.app",
          "logo": "https://battlesbudz.replit.app/logo.png",
          "image": "https://battlesbudz.replit.app/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Buffalo",
            "addressRegion": "NY",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "42.8864",
            "longitude": "-78.8784"
          },
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "42.8864",
              "longitude": "-78.8784"
            },
            "geoRadius": "50000"
          },
          "founder": {
            "@type": "Person",
            "name": "Justin Battles",
            "description": "U.S. Military Veteran and Cannabis Industry Entrepreneur"
          },
          "foundingDate": "2024",
          "industry": "Cannabis Industry",
          "keywords": [
            "cannabis dispensary",
            "veteran owned business",
            "cannabis cultivation", 
            "consumption lounge",
            "premium cannabis",
            "Buffalo NY",
            "New York cannabis",
            "cannabis microbusiness",
            "cannabis retail",
            "cannabis processing"
          ],
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates", 
              "latitude": "42.8864",
              "longitude": "-78.8784"
            },
            "geoRadius": "80000"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Cannabis Products and Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Premium Cannabis Flower",
                  "category": "Cannabis Products"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Product",
                  "name": "Cannabis Edibles",
                  "category": "Cannabis Products"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Cannabis Consumption Lounge",
                  "category": "Cannabis Services"
                }
              }
            ]
          },
          "sameAs": [
            "https://www.facebook.com/battlesbudz",
            "https://www.instagram.com/battlesbudz",
            "https://twitter.com/battlesbudz"
          ]
        };
      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}