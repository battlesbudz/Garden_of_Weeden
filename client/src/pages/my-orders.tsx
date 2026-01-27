import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Package, ArrowRight, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle } from "@/utils/seo";
import { useAuth } from "@/hooks/useAuth";

interface Order {
  id: number;
  total: string;
  status: string;
  paymentStatus?: string;
  createdAt: string;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "paid":
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "shipped":
      return <Truck className="w-5 h-5 text-blue-500" />;
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
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
    default:
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
  }
}

export default function MyOrders() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 pb-20 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Sign In to View Orders</h1>
          <p className="text-gray-400 mb-8">Please sign in to see your order history.</p>
          <Button onClick={() => navigate("/login")} className="bg-battles-gold text-black hover:bg-battles-gold/90">
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("My Orders - Garden of Weeden")}
        description="View your order history at Garden of Weeden."
        keywords={["orders", "order history", "Garden of Weeden"]}
        canonicalUrl={getCanonicalUrl("/my-orders")}
        ogType="website"
      />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-12">
        <h1 className="text-3xl font-playfair font-bold text-white mb-8">My Orders</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4 max-w-3xl">
            {orders.map((order) => (
              <Card key={order.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-white font-medium">Order #{order.id}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <p className="text-battles-gold font-bold">${parseFloat(order.total).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate("/shop")} className="bg-battles-gold text-black hover:bg-battles-gold/90">
              Start Shopping
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
