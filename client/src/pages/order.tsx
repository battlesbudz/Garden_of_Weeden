import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Package, ArrowLeft, CheckCircle2, Clock, AlertCircle, Truck } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  orderNumber?: string;
  userId?: string;
  total: string;
  subtotal?: string;
  tax?: string;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>;
    case "shipped":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Shipped</Badge>;
    case "delivered":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Delivered</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
    case "pending":
    default:
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
  }
}

function getPaymentStatusIcon(status?: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "failed":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "processing":
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
}

export default function OrderDetails() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="bg-red-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-400 mb-8">We couldn't find this order. It may not exist or you may not have permission to view it.</p>
          <Button onClick={() => navigate("/shop")} className="bg-battles-gold text-black hover:bg-battles-gold/90">
            Back to Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = parseFloat(order.subtotal || order.total);
  const tax = parseFloat(order.tax || "0");
  const total = parseFloat(order.total);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle(`Order ${order.orderNumber || `#${order.id}`} - Garden of Weeden`)}
        description={`View your order details for order ${order.orderNumber || `#${order.id}`}.`}
        keywords={["order", "Garden of Weeden"]}
        canonicalUrl={getCanonicalUrl(`/orders/${order.id}`)}
        ogType="website"
      />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-12">
        <Button
          onClick={() => navigate("/shop")}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-white">Order {order.orderNumber || `#${order.id}`}</h1>
              <p className="text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Package className="w-5 h-5 text-battles-gold" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                              <Package className="w-6 h-6 text-zinc-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.product?.name}</h3>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-gray-400 text-sm">${parseFloat(item.price).toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {order.shippingAddress && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Truck className="w-5 h-5 text-battles-gold" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-line">{order.shippingAddress}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
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

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getPaymentStatusIcon(order.paymentStatus)}
                    <span className="text-gray-300 capitalize">{order.paymentStatus || "Pending"}</span>
                  </div>
                  {order.paymentMethod && (
                    <div className="text-gray-400 text-sm">
                      <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
                    </div>
                  )}
                  {(order.paymentStatus === "pending" || !order.paymentStatus) && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-2">
                      <p className="text-yellow-400 text-sm">
                        {order.paymentMethod === "cash" 
                          ? "Payment will be collected when you pick up your order." 
                          : "Your order has been placed. Payment verification is pending - you will receive confirmation once payment is processed."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {order.customerEmail && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-300">
                    {order.customerName && <p>{order.customerName}</p>}
                    <p className="text-sm">{order.customerEmail}</p>
                    {order.customerPhone && <p className="text-sm">{order.customerPhone}</p>}
                  </CardContent>
                </Card>
              )}

              {order.notes && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
