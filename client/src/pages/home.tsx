import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import SocialProofSection from "@/components/social-proof-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import BrandStorySection from "@/components/brand-story-section";
import UrgencyBanner from "@/components/urgency-banner";
import ServicesSection from "@/components/services-section";
import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getOrganizationSchema, getLocalBusinessSchema } from "@/utils/seo";

export default function Home() {
  const structuredData = [
    getOrganizationSchema(),
    getLocalBusinessSchema()
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title="Garden of Weeden - Veteran-Owned Cannabis | Buffalo, NY"
        description="Garden of Weeden: Veteran-owned cannabis microbusiness in Buffalo, NY. Shop premium craft flower grown with military precision. From service to soil."
        keywords={[
          "Garden of Weeden",
          "veteran-owned cannabis Buffalo",
          "Buffalo cannabis shop",
          "Western New York cannabis",
          "veteran cannabis business",
          "Buffalo micro-terroir",
          "craft cannabis Buffalo",
          "buy cannabis Buffalo NY",
          "veteran wellness cannabis",
          "Buffalo NY dispensary"
        ]}
        canonicalUrl={getCanonicalUrl("/")}
        structuredData={structuredData}
        ogType="website"
      />
      <Navigation />
      <HeroSection />
      <SocialProofSection />
      <FeaturedProductsSection />
      <BrandStorySection />
      <UrgencyBanner />
      <ServicesSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
