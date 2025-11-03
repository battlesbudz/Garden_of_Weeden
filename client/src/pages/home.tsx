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
        title="Garden of Weeden - Veteran-Owned Cannabis | Buffalo, NY"
        description="Garden of Weeden: Veteran-owned cannabis microbusiness in Buffalo, NY. From service to soil—cultivating premium flower with military precision in Western New York's micro-terroir."
        keywords={[
          "Garden of Weeden",
          "veteran-owned cannabis Buffalo",
          "Buffalo cannabis",
          "Western New York cannabis",
          "veteran cannabis business",
          "Buffalo micro-terroir",
          "craft cannabis Buffalo",
          "military precision cannabis",
          "veteran wellness cannabis",
          "Buffalo NY dispensary"
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
