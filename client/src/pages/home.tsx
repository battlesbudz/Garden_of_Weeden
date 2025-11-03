import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import RetailSection from "@/components/retail-section";
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
        title="Garden of Weeden - Premium Cannabis Dispensary"
        description="Garden of Weeden - Your premier destination for high-quality cannabis products. Explore our selection of premium flower, edibles, vapes, and more."
        keywords={[
          "Garden of Weeden",
          "cannabis dispensary",
          "premium cannabis",
          "cannabis flower",
          "cannabis edibles",
          "cannabis vapes",
          "marijuana dispensary",
          "legal cannabis",
          "cannabis products",
          "dispensary near me"
        ]}
        canonicalUrl={getCanonicalUrl("/")}
        structuredData={structuredData}
        ogType="website"
      />
      <Navigation />
      <HeroSection />
      <RetailSection />
      <ServicesSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
