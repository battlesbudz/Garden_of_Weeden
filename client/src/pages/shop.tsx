import { ShoppingBag } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";

export default function Shop() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Shop - Garden of Weeden")}
        description="Garden of Weeden shop opening soon. Premium cannabis products and merchandise from your favorite business in Buffalo, NY."
        keywords={["Garden of Weeden", "cannabis shop", "Buffalo NY dispensary", "cannabis products", "coming soon"]}
        canonicalUrl={getCanonicalUrl("/shop")}
        ogType="website"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-battles-gold/10 p-6 rounded-full">
              <ShoppingBag className="h-16 w-16 text-battles-gold" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold mb-4 text-white">
            Shop <span className="text-battles-gold">Opening Soon</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            We're carefully curating a premium selection of cannabis products for you. 
            Check back soon for our grand opening!
          </p>
          
          <Card className="mt-12 bg-gray-900 border-battles-gold/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="text-6xl">🌿</div>
              </div>
              <CardTitle className="text-battles-gold">Garden of Weeden</CardTitle>
              <CardDescription className="text-gray-400">
                Quality is Our Priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Our team is dedicated to sourcing and developing premium products 
                that meet the highest standards. Stay tuned for updates on our 
                shop launch. We appreciate your patience!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
