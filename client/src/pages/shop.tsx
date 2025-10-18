import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle, CANNABIS_KEYWORDS } from "@/utils/seo";

// Import product images
import cosmicChewzImg from "@assets/20240228_223118_1752399041772.png";
import freedomFogImg from "@assets/file_0000000084c86230b8826b578af0fa18_1752398828783.png";
import cannabisFlowerImg from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import battleBrewImg from "@assets/file_00000000a95c61f9a7846b7990b6738f_1752399026270.png";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
  inStock: boolean;
}

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
}

export default function Shop() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Map product names to images
  const getProductImage = (productName: string) => {
    if (productName.toLowerCase().includes('cosmic chewz')) return cosmicChewzImg;
    if (productName.toLowerCase().includes('freedom fog')) return freedomFogImg;
    if (productName.toLowerCase().includes('battle brew') || productName.toLowerCase().includes('sweet tea')) return battleBrewImg;
    if (productName.toLowerCase().includes('heirloom') || productName.toLowerCase().includes('flower') || productName.toLowerCase().includes('purple punch')) return cannabisFlowerImg;
    return null;
  };

  // Get strain type based on category
  const getStrainType = (category: string) => {
    if (category === 'cannabis') return 'Hybrid';
    if (category === 'edibles') return 'Indica';
    return 'N/A';
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed!",
        description: "Your order has been submitted successfully.",
      });
      setCart([]);
      setShowCart(false);
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }];
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.productId !== productId);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customerInfo: {
        email: user?.email || "guest@battlesbudz.com",
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Guest Customer",
        address: "To be provided",
      },
    };

    orderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Cannabis Shop - Premium Products")}
        description="Shop premium cannabis products at Battles Budz. Browse our selection of cannabis flower, edibles, vapes, and beverages. Legal cannabis dispensary in Buffalo, NY."
        keywords={CANNABIS_KEYWORDS.shop}
        canonicalUrl={getCanonicalUrl("/shop")}
        ogType="website"
      />
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Battles Budz Shop
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium cannabis products from your favorite veteran-owned business
            </p>
          </div>

          {/* Shopping Cart Button */}
          <div className="fixed top-28 right-4 z-40">
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold relative shadow-lg"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white h-6 w-6 flex items-center justify-center rounded-full p-0">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 border-l border-battles-gold/30 p-6 z-50 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-battles-gold">Your Cart</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-battles-gold"
                  data-testid="button-close-cart"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-400">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center p-4 bg-black/50 rounded-lg border border-battles-gold/20">
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm mb-1">{item.name}</h3>
                          <p className="text-battles-gold font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.productId)}
                            className="h-8 w-8 p-0 border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                            data-testid={`button-decrease-${item.productId}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price } as Product)}
                            className="h-8 w-8 p-0 border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                            data-testid={`button-increase-${item.productId}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-battles-gold/30 pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-battles-gold">
                      <span>Total:</span>
                      <span data-testid="text-cart-total">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={orderMutation.isPending}
                    className="w-full bg-battles-gold hover:bg-battles-gold/90 text-black font-bold py-3"
                    data-testid="button-checkout"
                  >
                    {orderMutation.isPending ? "Processing..." : "Checkout"}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(products as Product[])?.map((product: Product, index: number) => (
              <div
                key={product.id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-battles-gold/20 hover:border-battles-gold/60 transition-all group"
                data-testid={`product-card-${index}`}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-black/50">
                  {getProductImage(product.name) ? (
                    <img 
                      src={getProductImage(product.name)!} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-battles-gold/30">🌿</div>
                    </div>
                  )}
                  {!product.inStock && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Battles Budz</p>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Strain Type */}
                  <p className="text-sm text-battles-gold mb-1">{getStrainType(product.category)}</p>

                  {/* Category Badge */}
                  <Badge 
                    variant={product.category === 'cannabis' ? 'default' : 'secondary'}
                    className="mb-3 text-xs"
                  >
                    {product.category}
                  </Badge>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-white">${product.price}</span>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      size="sm"
                      className="bg-battles-gold hover:bg-yellow-400 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`button-add-to-cart-${index}`}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(products as Product[])?.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl text-battles-gold/30 mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-battles-gold mb-2">
                Shop Opening Soon!
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We're working on stocking our shop with premium cannabis products. 
                Check back soon for exciting new items!
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
