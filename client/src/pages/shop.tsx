import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
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
    return null; // Default for merchandise
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
        address: "To be provided", // You can add address collection here
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
        description="Shop premium cannabis products at Battles Budz. Browse our selection of cannabis flower, edibles, vapes, and beverages. Legal cannabis dispensary in Gloversville, NY."
        keywords={CANNABIS_KEYWORDS.shop}
        canonicalUrl={getCanonicalUrl("/shop")}
        ogType="website"
      />
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-battles-gold mb-4">
              Battles Budz Shop
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium cannabis products and merchandise from your favorite veteran-owned business
            </p>
          </div>

          {/* Shopping Cart Button */}
          <div className="fixed top-24 right-4 z-50">
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold relative"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Shopping Cart Sidebar */}
          {showCart && (
            <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-battles-gold/30 p-6 z-40 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair text-battles-gold">Your Cart</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-battles-gold"
                >
                  ×
                </Button>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-gray-400">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center p-3 bg-black/50 rounded">
                        <div>
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <p className="text-battles-gold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.productId)}
                            className="h-8 w-8 p-0 border-battles-gold text-battles-gold"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price } as Product)}
                            className="h-8 w-8 p-0 border-battles-gold text-battles-gold"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-battles-gold/30 pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold text-battles-gold">
                      <span>Total: ${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={orderMutation.isPending}
                    className="w-full bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
                  >
                    {orderMutation.isPending ? "Processing..." : "Checkout"}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(products as Product[])?.map((product: Product) => (
              <Card key={product.id} className="bg-gray-900 border-battles-gold/20 hover:border-battles-gold/60 transition-all">
                <CardHeader>
                  <div className="aspect-square bg-black/50 rounded-lg mb-4 flex items-center justify-center">
                    {getProductImage(product.name) ? (
                      <img 
                        src={getProductImage(product.name)!} 
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg p-4"
                      />
                    ) : (
                      <div className="text-6xl text-battles-gold/30">🌿</div>
                    )}
                  </div>
                  <CardTitle className="text-battles-gold">{product.name}</CardTitle>
                  <Badge 
                    variant={product.category === 'cannabis' ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {product.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-battles-gold">
                      ${product.price}
                    </span>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {(products as Product[])?.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl text-battles-gold/30 mb-4">🛍️</div>
              <h2 className="text-2xl font-playfair text-battles-gold mb-2">
                Shop Opening Soon!
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We're working on stocking our shop with premium cannabis products and merchandise. 
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