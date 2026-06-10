import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import SocialProofSection from "@/components/social-proof-section";
import LocalFarmNetworkSection from "@/components/local-farm-network-section";
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
        title="Garden of Weeden - Farm to Flame Cannabis | Buffalo, NY"
        description="Garden of Weeden is a NYS licensed microbusiness dispensary and on-site consumption space in Buffalo, NY, focused on Farm to Flame craft cannabis from local growers."
        keywords={[
          "Garden of Weeden",
          "Farm to Flame cannabis Buffalo",
          "Buffalo cannabis shop",
          "Western New York cannabis",
          "local cannabis farmers",
          "Forbidden Fruit lounge",
          "craft cannabis Buffalo",
          "buy cannabis Buffalo NY",
          "Central and Western NY cannabis",
          "Buffalo NY dispensary"
        ]}
        canonicalUrl={getCanonicalUrl("/")}
        structuredData={structuredData}
        ogType="website"
      />
      <Navigation />
      <HeroSection />
      <SocialProofSection />
      <LocalFarmNetworkSection />
      <FeaturedProductsSection />
      <BrandStorySection />
      <UrgencyBanner />
      <ServicesSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
