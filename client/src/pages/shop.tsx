import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ShoppingBag, Package, Tags, Filter, ArrowUpDown, X, ShoppingCart, Check, Loader2 } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Brand, Product, ShopItem } from "@shared/schema";

type ProductWithBrand = Product & { brand?: Brand };
type ShopItemWithProduct = ShopItem & { product: ProductWithBrand };
type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

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

export default function Shop() {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const { data: shopItems, isLoading: shopItemsLoading } = useQuery<ShopItemWithProduct[]>({
    queryKey: ["/api/shop-items"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, shopItemId }: { productId: number; shopItemId: number }) => {
      return apiRequest("POST", "/api/cart/items", { productId, shopItemId, quantity: 1 });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setAddedItems(prev => new Set(prev).add(variables.shopItemId));
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
      setTimeout(() => {
        setAddedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(variables.shopItemId);
          return newSet;
        });
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const getItemPrice = (item: ShopItemWithProduct) => {
    return item.shopPrice || item.product?.price || "0";
  };

  const getItemInStock = (item: ShopItemWithProduct) => {
    return (item.shopQuantity || 0) > 0;
  };

  const filteredAndSortedItems = useMemo(() => {
    if (!shopItems) return [];
    
    // Filter
    let result = shopItems.filter((item) => {
      if (selectedBrand && item.product?.brandId !== selectedBrand) return false;
      if (selectedCategory && item.product?.category !== selectedCategory) return false;
      if (!showOutOfStock && !getItemInStock(item)) return false;
      return true;
    });
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.product?.name || "").localeCompare(b.product?.name || "");
        case "name-desc":
          return (b.product?.name || "").localeCompare(a.product?.name || "");
        case "price-asc":
          return parseFloat(getItemPrice(a)) - parseFloat(getItemPrice(b));
        case "price-desc":
          return parseFloat(getItemPrice(b)) - parseFloat(getItemPrice(a));
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
    
    return result;
  }, [shopItems, selectedBrand, selectedCategory, showOutOfStock, sortBy]);

  const brands = useMemo(() => {
    if (!shopItems) return [];
    const brandMap = new Map<number, Brand>();
    shopItems.forEach(item => {
      if (item.product?.brand) {
        brandMap.set(item.product.brand.id, item.product.brand);
      }
    });
    return Array.from(brandMap.values());
  }, [shopItems]);

  const categories = Array.from(new Set(shopItems?.map((item) => item.product?.category).filter(Boolean) || []));
  const hasContent = shopItems && shopItems.length > 0;
  const hasActiveFilters = selectedBrand !== null || selectedCategory !== null || showOutOfStock;

  const clearAllFilters = () => {
    setSelectedBrand(null);
    setSelectedCategory(null);
    setShowOutOfStock(false);
  };

  if (shopItemsLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-36 pb-20 text-center">
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
        
        <div className="container mx-auto px-4 pt-36 pb-16 sm:pb-24">
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
      
      <div className="container mx-auto px-4 pt-36 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold mb-4 text-white">
            Our <span className="text-battles-gold">Shop</span>
          </h1>
          <p className="text-lg text-gray-300">
            Farm to Flame craft cannabis products from trusted local brands
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
                <button
                  type="button"
                  key={brand.id}
                  className={`bg-zinc-900 border border-zinc-800 rounded-lg transition-all hover:border-battles-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-battles-gold ${
                    selectedBrand === brand.id ? "border-battles-gold ring-2 ring-battles-gold/50" : ""
                  }`}
                  onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                  aria-pressed={selectedBrand === brand.id}
                  aria-label={`Filter by ${brand.name}`}
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
                        <Tags className="w-8 h-8 text-battles-gold" aria-hidden="true" />
                      </div>
                    )}
                    <h3 className="text-white font-medium text-sm">{brand.name}</h3>
                  </CardContent>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter and Sort Toolbar */}
        <div className="mb-8 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left side - Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-battles-gold" />
                <span className="text-gray-300 text-sm font-medium">Category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-battles-gold text-black hover:bg-battles-gold/90" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={selectedCategory === category ? "bg-battles-gold text-black hover:bg-battles-gold/90" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                  >
                    {formatCategory(category)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right side - Sort and options */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Show out of stock toggle */}
              <Button
                size="sm"
                variant={showOutOfStock ? "default" : "outline"}
                onClick={() => setShowOutOfStock(!showOutOfStock)}
                className={showOutOfStock ? "bg-zinc-700 text-white hover:bg-zinc-600" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
              >
                {showOutOfStock ? "Showing All" : "In Stock Only"}
              </Button>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-battles-gold" />
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                    <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-medium">{filteredAndSortedItems.length}</span> of{" "}
              <span className="text-white font-medium">{shopItems?.length || 0}</span> products
              {selectedBrand && brands && (
                <span>
                  {" "}from <span className="text-battles-gold">{brands.find(b => b.id === selectedBrand)?.name}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group hover:border-battles-gold/50 transition-colors">
                <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                  {item.product?.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product?.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        !getItemInStock(item) ? "opacity-50 grayscale" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-zinc-600" />
                    </div>
                  )}
                  {/* Badges container */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.product?.isFeatured && (
                      <Badge className="bg-battles-gold text-black font-semibold">
                        Featured
                      </Badge>
                    )}
                    {!getItemInStock(item) && (
                      <Badge className="bg-red-600 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  {item.product?.brand && (
                    <Badge className="absolute top-2 right-2 bg-zinc-700/90 text-white backdrop-blur-sm">
                      {item.product.brand.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-semibold line-clamp-2 flex-1">{item.product?.name}</h3>
                    <span className="text-battles-gold font-bold text-lg whitespace-nowrap">
                      ${parseFloat(getItemPrice(item)).toFixed(2)}
                    </span>
                  </div>
                  {item.product?.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.product.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <Badge variant="outline" className="border-zinc-700 text-gray-400 text-xs">
                      {formatCategory(item.product?.category || "")}
                    </Badge>
                    {getItemInStock(item) ? (
                      <span className="text-green-500 text-xs font-medium">In Stock ({item.shopQuantity})</span>
                    ) : (
                      <span className="text-red-400 text-xs font-medium">Out of Stock</span>
                    )}
                  </div>
                  {getItemInStock(item) && (
                    <Button
                      className={`w-full mt-3 transition-colors ${
                        addedItems.has(item.id) 
                          ? "bg-green-600 hover:bg-green-600 text-white" 
                          : "bg-battles-gold text-black hover:bg-battles-gold/90"
                      }`}
                      onClick={() => addToCartMutation.mutate({ productId: item.product?.id || 0, shopItemId: item.id })}
                      disabled={addToCartMutation.isPending || addedItems.has(item.id)}
                    >
                      {addedItems.has(item.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added!
                        </>
                      ) : addToCartMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-2">No products match your filters</p>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your search criteria</p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
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
