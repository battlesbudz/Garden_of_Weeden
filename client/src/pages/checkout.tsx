import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreditCard, Truck, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { CartWithItems } from "@shared/schema";

const checkoutFormSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  billingAddress: z.string().optional(),
  paymentMethod: z.enum(["ach", "debit", "cash"]).default("ach"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: number; message: string } | null>(null);

  const { data: cart, isLoading: cartLoading } = useQuery<CartWithItems>({
    queryKey: ["/api/cart"],
  });

  const { data: paymentInfo } = useQuery<{ provider: string; configured: boolean; methods: string[] }>({
    queryKey: ["/api/checkout/payment-info"],
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      billingAddress: "",
      paymentMethod: "ach",
      notes: "",
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const response = await apiRequest("POST", "/api/checkout", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setOrderSuccess({ orderId: data.orderId, message: data.message });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      }
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    checkoutMutation.mutate(data);
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-36 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const hasItems = cart?.items && cart.items.length > 0;

  if (!hasItems && !orderSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-36 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/shop")} className="bg-battles-gold text-black hover:bg-battles-gold/90">
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SEOHead
          title={getPageTitle("Order Confirmed - Garden of Weeden")}
          description="Your order has been placed successfully."
          keywords={["order confirmation", "Garden of Weeden"]}
          canonicalUrl={getCanonicalUrl("/checkout")}
          ogType="website"
        />
        <Navigation />
        <div className="container mx-auto px-4 pt-36 pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Order Placed Successfully!</h1>
            <p className="text-gray-400 mb-2">Order #{orderSuccess.orderId}</p>
            <p className="text-gray-300 mb-8">{orderSuccess.message}</p>
            
            <Alert className="bg-blue-900/20 border-blue-500/30 mb-8">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                Payment is pending. Once you set up your Paybotic merchant account and add your API credentials, 
                payments will process automatically. For now, you can process payments offline.
              </AlertDescription>
            </Alert>

            <div className="space-x-4">
              <Button onClick={() => navigate("/shop")} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                Continue Shopping
              </Button>
              <Button onClick={() => navigate(`/orders/${orderSuccess.orderId}`)} className="bg-battles-gold text-black hover:bg-battles-gold/90">
                View Order
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = parseFloat(cart?.total || "0");
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Checkout - Garden of Weeden")}
        description="Complete your order at Garden of Weeden."
        keywords={["checkout", "Garden of Weeden", "cannabis order"]}
        canonicalUrl={getCanonicalUrl("/checkout")}
        ogType="website"
      />
      <Navigation />

      <div className="container mx-auto px-4 pt-36 pb-12">
        <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white mb-8 text-center">
          Checkout
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <User className="w-5 h-5 text-battles-gold" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-zinc-800 border-zinc-700 text-white" placeholder="John Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email *</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="bg-zinc-800 border-zinc-700 text-white" placeholder="john@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" className="bg-zinc-800 border-zinc-700 text-white" placeholder="(555) 555-5555" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Truck className="w-5 h-5 text-battles-gold" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Address *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]" 
                              placeholder="Street address, City, State ZIP"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <CreditCard className="w-5 h-5 text-battles-gold" />
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Select your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-3 p-4 border border-zinc-700 rounded-lg hover:border-battles-gold/50 cursor-pointer">
                                <RadioGroupItem value="ach" id="ach" className="text-battles-gold" />
                                <Label htmlFor="ach" className="flex-1 cursor-pointer">
                                  <span className="text-white font-medium">ACH Bank Transfer</span>
                                  <p className="text-gray-400 text-sm">Secure bank transfer (1-3 business days)</p>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-4 border border-zinc-700 rounded-lg hover:border-battles-gold/50 cursor-pointer">
                                <RadioGroupItem value="debit" id="debit" className="text-battles-gold" />
                                <Label htmlFor="debit" className="flex-1 cursor-pointer">
                                  <span className="text-white font-medium">Debit Card</span>
                                  <p className="text-gray-400 text-sm">PIN-based debit payment</p>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-4 border border-zinc-700 rounded-lg hover:border-battles-gold/50 cursor-pointer">
                                <RadioGroupItem value="cash" id="cash" className="text-battles-gold" />
                                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                  <span className="text-white font-medium">Pay in Store (Cash)</span>
                                  <p className="text-gray-400 text-sm">Reserve your order and pay when you pick up</p>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentInfo && !paymentInfo.configured && (
                      <Alert className="mt-4 bg-yellow-900/20 border-yellow-500/30">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <AlertDescription className="text-yellow-300">
                          Payment processing is in sandbox mode. Orders will be created but payment will be pending 
                          until the payment provider is configured.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-zinc-800 border-zinc-700 text-white" 
                          placeholder="Any special instructions for your order..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {checkoutMutation.isError && (
                  <Alert className="bg-red-900/20 border-red-500/30">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      There was an error processing your order. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-battles-gold text-black hover:bg-battles-gold/90 text-lg py-6"
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-28">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-zinc-800">
                      <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.product?.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white text-sm font-medium">
                        ${(parseFloat(item.priceAtAdd) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-700 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-battles-gold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
