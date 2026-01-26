import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Package, Tags, Filter } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import type { Brand, Product } from "@shared/schema";

type ProductWithBrand = Product & { brand?: Brand };

export default function Shop() {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: brands, isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithBrand[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    if (selectedBrand && product.brandId !== selectedBrand) return false;
    if (selectedCategory && product.category !== selectedCategory) return false;
    return product.inStock !== false;
  });

  const categories = [...new Set(products?.map((p) => p.category) || [])];
  const hasContent = (brands?.length || 0) > 0 || (products?.length || 0) > 0;

  if (brandsLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading shop...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasContent) {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Shop - Garden of Weeden")}
        description="Shop premium cannabis products and merchandise from Garden of Weeden in Buffalo, NY."
        keywords={["Garden of Weeden", "cannabis shop", "Buffalo NY dispensary", "cannabis products"]}
        canonicalUrl={getCanonicalUrl("/shop")}
        ogType="website"
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold mb-4 text-white">
            Our <span className="text-battles-gold">Shop</span>
          </h1>
          <p className="text-lg text-gray-300">
            Premium cannabis products from trusted brands
          </p>
        </div>

        {brands && brands.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Tags className="w-6 h-6 text-battles-gold" />
              Our Brands
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {brands.map((brand) => (
                <Card
                  key={brand.id}
                  className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-all hover:border-battles-gold ${
                    selectedBrand === brand.id ? "border-battles-gold ring-2 ring-battles-gold/50" : ""
                  }`}
                  onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-16 h-16 object-contain mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                        <Tags className="w-8 h-8 text-battles-gold" />
                      </div>
                    )}
                    <h3 className="text-white font-medium text-sm">{brand.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 mr-2">Filter by:</span>
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-battles-gold text-black" : "border-zinc-700 text-gray-300"}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={selectedCategory === category ? "bg-battles-gold text-black" : "border-zinc-700 text-gray-300"}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
            {(selectedBrand || selectedCategory) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedBrand(null);
                  setSelectedCategory(null);
                }}
                className="text-red-400 hover:text-red-300"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-zinc-600" />
                    </div>
                  )}
                  {product.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-battles-gold text-black">
                      Featured
                    </Badge>
                  )}
                  {product.brand && (
                    <Badge className="absolute top-2 right-2 bg-zinc-700 text-white">
                      {product.brand.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-1 line-clamp-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-battles-gold font-bold text-lg">${product.price}</span>
                    <Badge variant="outline" className="border-zinc-700 text-gray-400">
                      {product.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900 rounded-lg">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No products match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setSelectedBrand(null);
                setSelectedCategory(null);
              }}
              className="text-battles-gold mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
