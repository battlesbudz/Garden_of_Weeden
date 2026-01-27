import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartWithItems } from "@shared/schema";

export default function Cart() {
  const { data: cart, isLoading } = useQuery<CartWithItems>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return apiRequest("DELETE", `/api/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Shopping Cart - Garden of Weeden")}
        description="View your shopping cart at Garden of Weeden."
        keywords={["shopping cart", "Garden of Weeden", "cannabis"]}
        canonicalUrl={getCanonicalUrl("/cart")}
        ogType="website"
      />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-battles-gold" />
              Your Cart
            </h1>
            {hasItems && (
              <Button
                variant="ghost"
                onClick={() => clearCartMutation.mutate()}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                disabled={clearCartMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {!hasItems ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-20 h-20 mx-auto text-gray-600 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Looks like you haven't added any products yet.</p>
                <Link href="/shop">
                  <Button className="bg-battles-gold text-black hover:bg-battles-gold/90">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <Card key={item.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{item.product?.name}</h3>
                            {item.product?.brand && (
                              <p className="text-gray-400 text-sm">{item.product.brand.name}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemMutation.mutate(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            disabled={removeItemMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              className="w-8 h-8 p-0 border-zinc-700"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                              disabled={updateQuantityMutation.isPending}
                              className="w-8 h-8 p-0 border-zinc-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-battles-gold font-bold text-lg">
                              ${(parseFloat(item.priceAtAdd) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              ${parseFloat(item.priceAtAdd).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-zinc-900 border-battles-gold/30">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cart.itemCount} items)</span>
                    <span className="text-white">${cart.total}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (8%)</span>
                    <span className="text-white">${(parseFloat(cart.total) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-battles-gold">
                        ${(parseFloat(cart.total) * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full bg-battles-gold text-black hover:bg-battles-gold/90 mt-4">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
