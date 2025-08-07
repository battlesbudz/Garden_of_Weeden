// Export all SEO components and utilities for easy importing
export { default as SEOHead } from './SEOHead';
export type { SEOProps } from './SEOHead';

// Re-export SEO utilities for convenience
export {
  SITE_CONFIG,
  getCanonicalUrl,
  getPageTitle,
  getOrganizationSchema,
  getLocalBusinessSchema,
  getProductSchema,
  getBreadcrumbSchema,
  CANNABIS_KEYWORDS
} from '../../utils/seo';