import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import RetailSection from "@/components/retail-section";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import TeamSection from "@/components/team-section";
import EventsSection from "@/components/events-section";
import EducationSection from "@/components/education-section";
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
    <div className="min-h-screen">
      <SEOHead
        title="Battles Budz - Premium Cannabis Experience | Gloversville, NY"
        description="Premium cannabis cultivation, processing, and consumption experiences in Gloversville, NY. Veteran-owned microbusiness offering retail cannabis, consumption lounge, and educational events."
        keywords={CANNABIS_KEYWORDS.home}
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
      <EducationSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
