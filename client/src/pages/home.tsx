import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductCarousel from "@/components/product-carousel";
import CategoryGrid from "@/components/category-grid";
import BrandShowcase from "@/components/brand-showcase";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import TeamSection from "@/components/team-section";
import EventsSection from "@/components/events-section";
import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getOrganizationSchema, getLocalBusinessSchema } from "@/utils/seo";
import { bestSellerProducts, staffPickProducts, edibleProducts } from "@/data/productData";

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
      
      {/* Best Sellers Section */}
      <div id="products">
        <ProductCarousel 
          title="Shop Our Best Sellers" 
          products={bestSellerProducts}
          viewAllLink="/shop"
        />
      </div>
      
      {/* Category Grid */}
      <CategoryGrid />
      
      {/* Staff Picks Section */}
      <ProductCarousel 
        title="Shop Staff Picks" 
        products={staffPickProducts}
        viewAllLink="/shop"
      />
      
      {/* About Section with CTA */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1616164943636-398dfa7c2e75?auto=format&fit=crop&w=800&q=80"
                alt="Cannabis Dispensary Interior"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <p className="text-battles-gold font-semibold text-lg mb-2">Discover Our</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Cannabis Dispensary Near You
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Shop with us today and unlock unbeatable deals, exclusive discounts, and special offers—designed to help you save and make every visit more rewarding. At Battles Budz, we value your loyalty and are here to keep you coming back for more savings and top-quality cannabis!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const element = document.getElementById("about");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-battles-gold text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                  data-testid="button-about-us"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById("about");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-2 border-battles-gold text-battles-gold px-8 py-3 rounded-lg font-bold hover:bg-battles-gold hover:text-black transition-all"
                  data-testid="button-visit-us-about"
                >
                  Visit Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Showcase */}
      <BrandShowcase />
      
      {/* Popular Edibles Section */}
      <ProductCarousel 
        title="Popular Edibles at Battles Budz" 
        products={edibleProducts}
        viewAllLink="/shop?category=edibles"
      />
      
      {/* Original Sections */}
      <AboutSection />
      <ServicesSection />
      <TeamSection />
      <EventsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
