import { useEffect } from 'react';
import { SEOProps } from '@/components/seo/SEOHead';

/**
 * Custom hook for managing SEO meta tags dynamically
 * Useful for pages that need to update SEO based on state changes
 */
export function useSEO(seoData: SEOProps) {
  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    if (seoData.description) {
      updateMetaTag('description', seoData.description);
    }

    // Update keywords
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords.join(', '));
    }

    // Update canonical URL
    if (seoData.canonicalUrl) {
      updateCanonicalUrl(seoData.canonicalUrl);
    }

    // Update Open Graph tags
    if (seoData.title) updateMetaProperty('og:title', seoData.title);
    if (seoData.description) updateMetaProperty('og:description', seoData.description);
    if (seoData.ogType) updateMetaProperty('og:type', seoData.ogType);
    if (seoData.ogImage) updateMetaProperty('og:image', seoData.ogImage);
    if (seoData.canonicalUrl) updateMetaProperty('og:url', seoData.canonicalUrl);

    // Add structured data
    if (seoData.structuredData) {
      addStructuredData(seoData.structuredData);
    }

    // Handle robots meta tag
    if (seoData.noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
  }, [seoData]);
}

// Helper functions
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