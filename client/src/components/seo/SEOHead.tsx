import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  structuredData?: object;
  noIndex?: boolean;
}

interface SEOHeadProps extends SEOProps {
  children?: React.ReactNode;
}

export default function SEOHead({
  title = "Garden of Weeden - Farm to Flame Cannabis | Buffalo, NY",
  description = "Buffalo Farm to Flame cannabis microbusiness with house-grown flower, regional craft products, the Forbidden Fruit lounge, and private event bookings.",
  keywords = ["cannabis", "dispensary", "Buffalo NY", "Farm to Flame", "consumption lounge", "cannabis education"],
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalUrl,
  structuredData,
  noIndex = false,
  children
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    updateMetaTag('description', description);
    
    // Update keywords
    updateMetaTag('keywords', keywords.join(', '));
    
    // Update Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:url', canonicalUrl || window.location.href);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Update canonical URL
    if (canonicalUrl) {
      updateCanonicalUrl(canonicalUrl);
    }
    
    // Add robots meta tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
    
    // Add structured data
    if (structuredData) {
      addStructuredData(structuredData);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData, noIndex]);

  return <>{children}</>;
}

// Helper functions for updating meta tags
function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateCanonicalUrl(url: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

function addStructuredData(data: object) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
