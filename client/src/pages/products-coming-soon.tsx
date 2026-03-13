import { useQuery } from "@tanstack/react-query";
import { Leaf, Package, Tags } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import type { Brand, Product } from "@shared/schema";

type ProductWithBrand = Product & { brand?: Brand };

const categoryLabels: Record<string, string> = {
  flower: "Flower",
  "pre-rolls": "Pre-Rolls",
  edibles: "Edibles",
  concentrates: "Concentrates",
  vapes: "Vapes & Cartridges",
  tinctures: "Tinctures",
  topicals: "Topicals",
  capsules: "Capsules",
  beverages: "Beverages",
  accessories: "Accessories",
  merchandise: "Merchandise",
  cannabis: "Cannabis",
};

const formatCategory = (category: string): string => {
  return categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

export default function ProductsPage() {
  const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithBrand[]>({
    queryKey: ["/api/products"],
  });

  const hasContent = (brands?.length || 0) > 0 || (products?.length || 0) > 0;

  if (brandsLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-36 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-garden-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <SEOHead
          title={getPageTitle("Products - Garden of Weeden")}
          description="Explore our premium cannabis products and brands from Garden of Weeden in Buffalo, NY."
          keywords={["Garden of Weeden", "cannabis products", "Buffalo NY dispensary", "cannabis brands"]}
          canonicalUrl={getCanonicalUrl("/products")}
          ogType="website"
        />
        <Navigation />
        
        <div className="container mx-auto px-4 pt-36 pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="bg-garden-green/10 p-6 rounded-full">
                <Package className="h-16 w-16 text-garden-green" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Products <span className="text-garden-green">Coming Soon</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We're carefully curating a premium selection of cannabis products for you. 
              Check back soon or visit our shop to stay updated.
            </p>
            
            <Card className="mt-12">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Leaf className="h-12 w-12 text-garden-green" />
                </div>
                <CardTitle>Quality is Our Priority</CardTitle>
                <CardDescription>
                  We're working hard to bring you the finest cannabis products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our team is dedicated to sourcing and developing premium products 
                  that meet the highest standards. Stay tuned for updates on our 
                  product launch.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEOHead
        title={getPageTitle("Products - Garden of Weeden")}
        description="Explore our premium cannabis products and brands from Garden of Weeden in Buffalo, NY."
        keywords={["Garden of Weeden", "cannabis products", "Buffalo NY dispensary", "cannabis brands"]}
        canonicalUrl={getCanonicalUrl("/products")}
        ogType="website"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-36 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-yeseva font-bold mb-4 text-gray-900 dark:text-white">
            Our <span className="text-garden-green">Products</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium cannabis products and trusted brands
          </p>
        </div>

        {brands && brands.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Tags className="w-6 h-6 text-garden-green" />
              Our Brands
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Card
                  key={brand.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-24 h-24 object-contain mb-4"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-garden-green/10 rounded-full flex items-center justify-center mb-4">
                          <Tags className="w-12 h-12 text-garden-green" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {products && products.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-garden-green" />
              Our Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-garden-green text-white">
                        Featured
                      </Badge>
                    )}
                    {product.brand && (
                      <Badge className="absolute top-2 right-2 bg-gray-800/80 text-white backdrop-blur-sm">
                        {product.brand.name}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Badge variant="outline" className="text-xs">
                        {formatCategory(product.category)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
