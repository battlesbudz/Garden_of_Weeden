import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import HomeActionRouterSection from "@/components/home-action-router-section";
import HomeFarmTeaserSection from "@/components/home-farm-teaser-section";
import LocalFarmNetworkSection from "@/components/local-farm-network-section";
import BrandStorySection from "@/components/brand-story-section";
import OnTheRouteSection from "@/components/on-the-route-section";
import QuietNewsletterSection from "@/components/quiet-newsletter-section";
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
        description="We are a NYS licensed Farm to Flame cannabis microbusiness near Buffalo, NY, offering local small-batch flower from our own farm and regional craft growers connected through Cannabis Farmers Alliance."
        keywords={[
          "Garden of Weeden",
          "Cannabis Farmers Alliance",
          "Farm to Flame cannabis",
          "Buffalo cannabis microbusiness",
          "Buffalo cannabis shop",
          "Western New York cannabis",
          "local cannabis farmers",
          "Garden of Weeden farm",
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
      <HomeActionRouterSection />
      <HomeFarmTeaserSection />
      <LocalFarmNetworkSection />
      <BrandStorySection />
      <OnTheRouteSection />
      <QuietNewsletterSection />
      <Footer />
    </div>
  );
}
