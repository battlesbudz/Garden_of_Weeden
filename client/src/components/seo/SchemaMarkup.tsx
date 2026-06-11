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
          "name": "Garden of Weeden LLC",
          "alternateName": "Garden of Weeden",
          "description": "Farm to Flame cannabis microbusiness at 1455 Niagara St in Buffalo, New York, offering craft products, retail service, and the Forbidden Fruit lounge.",
          "url": window.location.origin,
          "logo": window.location.origin + "/logo.png",
          "image": window.location.origin + "/og-image.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1455 Niagara St",
            "addressLocality": "Buffalo",
            "addressRegion": "NY",
            "postalCode": "14213",
            "addressCountry": "US"
          },
          "telephone": "+1-716-420-1591",
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday"], "opens": "10:00", "closes": "19:30" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "10:00", "closes": "20:30" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Thursday", "Friday", "Saturday"], "opens": "10:00", "closes": "22:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "18:00" }
          ],
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
          "foundingDate": "2024",
          "industry": "Cannabis Industry",
          "keywords": [
            "cannabis dispensary",
            "cannabis cultivation", 
            "consumption lounge",
            "Farm to Flame",
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
                  "name": "Craft Cannabis Flower",
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
            "https://www.facebook.com/",
            "https://www.instagram.com/",
            "https://twitter.com/"
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
