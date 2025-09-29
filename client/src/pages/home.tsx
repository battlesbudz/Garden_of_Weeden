import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import RetailSection from "@/components/retail-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import TeamSection from "@/components/team-section";
import EventsSection from "@/components/events-section";

import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getOrganizationSchema, getLocalBusinessSchema, CANNABIS_KEYWORDS } from "@/utils/seo";

export default function Home() {
  const structuredData = [
    getOrganizationSchema(),
    getLocalBusinessSchema()
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead
        title="Battles Budz Cannabis Dispensary Buffalo NY - Veteran Owned Premium Cannabis"
        description="Battles Budz - Premier veteran-owned cannabis dispensary in Buffalo, NY. Premium cannabis flower, edibles, vapes and consumption lounge. Founded by U.S. Military Veteran Justin Battles."
        keywords={[
          "Battles Budz",
          "battles buds cannabis",
          "cannabis dispensary Buffalo NY",
          "veteran owned cannabis Buffalo",
          "Buffalo cannabis dispensary",
          "veteran cannabis New York",
          "Justin Battles cannabis",
          "premium cannabis Buffalo",
          "cannabis consumption lounge NY",
          "New York cannabis microbusiness",
          "battles budz dispensary",
          "buffalo marijuana dispensary",
          "veteran owned dispensary NY"
        ]}
        canonicalUrl={getCanonicalUrl("/")}
        structuredData={structuredData}
        ogType="website"
      />
      <Navigation />
      <HeroSection />
      <RetailSection />
      <ServicesSection />
      <AboutSection />
      <TeamSection />
      <EventsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
