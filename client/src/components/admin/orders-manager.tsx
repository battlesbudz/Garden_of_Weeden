import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Eye, CheckCircle, Clock, XCircle, Truck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  items?: OrderItem[];
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

function getPaymentBadge(status?: string) {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="border-green-500/50 text-green-400">Paid</Badge>;
    case "failed":
      return <Badge variant="outline" className="border-red-500/50 text-red-400">Failed</Badge>;
    case "processing":
      return <Badge variant="outline" className="border-blue-500/50 text-blue-400">Processing</Badge>;
    default:
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Pending</Badge>;
  }
}

export default function OrdersManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: orderDetails, isLoading: loadingDetails } = useQuery<Order>({
    queryKey: ["/api/orders", selectedOrder?.id],
    enabled: !!selectedOrder?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      if (selectedOrder) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrder.id] });
      }
    },
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const filteredOrders = orders?.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toString().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.customerEmail?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by order #, name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="text-sm text-gray-400">
          {filteredOrders?.length || 0} orders
        </div>
      </div>

      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="rounded-md border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                <TableHead className="text-gray-300">Order #</TableHead>
                <TableHead className="text-gray-300">Customer</TableHead>
                <TableHead className="text-gray-300">Total</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Payment</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="text-white font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white">{order.customerName || "Anonymous"}</p>
                      <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-battles-gold font-medium">${parseFloat(order.total).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No orders yet</p>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Customer</p>
                  <p className="text-white">{orderDetails.customerName || "Anonymous"}</p>
                  <p className="text-gray-400 text-sm">{orderDetails.customerEmail}</p>
                  {orderDetails.customerPhone && (
                    <p className="text-gray-400 text-sm">{orderDetails.customerPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white">
                    {new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {orderDetails.shippingAddress && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Shipping Address</p>
                  <p className="text-white whitespace-pre-line">{orderDetails.shippingAddress}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-2">Order Items</p>
                <div className="space-y-2">
                  {orderDetails.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                      <div className="w-12 h-12 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                        {item.product?.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{item.product?.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <p className="text-battles-gold font-medium">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${parseFloat(orderDetails.subtotal || orderDetails.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">${parseFloat(orderDetails.tax || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-battles-gold">${parseFloat(orderDetails.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-gray-400 text-sm mb-2">Update Order Status</p>
                <Select
                  value={orderDetails.status}
                  onValueChange={(value) => {
                    updateStatusMutation.mutate({ orderId: orderDetails.id, status: value });
                  }}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderDetails.notes && (
                <div className="border-t border-zinc-800 pt-4">
                  <p className="text-gray-400 text-sm mb-1">Order Notes</p>
                  <p className="text-white">{orderDetails.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Order not found</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
