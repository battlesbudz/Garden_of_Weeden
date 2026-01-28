import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Eye, CheckCircle, Clock, XCircle, Truck, Search, Trash2, Edit, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    notes: "",
  });

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: orderDetails, isLoading: loadingDetails } = useQuery<Order>({
    queryKey: ["/api/orders", selectedOrder?.id],
    enabled: !!selectedOrder?.id && detailsOpen,
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
      toast({ title: "Order status updated" });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ orderId, paymentStatus }: { orderId: number; paymentStatus: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${orderId}/payment`, { paymentStatus });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      if (selectedOrder) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrder.id] });
      }
      toast({ title: "Payment status updated" });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, data }: { orderId: number; data: typeof editForm }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${orderId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      if (selectedOrder) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrder.id] });
      }
      setEditOpen(false);
      toast({ title: "Order updated successfully" });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await apiRequest("DELETE", `/api/admin/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      setDeleteOpen(false);
      setDetailsOpen(false);
      setSelectedOrder(null);
      toast({ title: "Order deleted" });
    },
  });

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      customerName: order.customerName || "",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      shippingAddress: order.shippingAddress || "",
      notes: order.notes || "",
    });
    setEditOpen(true);
  };

  const openDeleteDialog = (order: Order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const filteredOrders = orders?.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toString().includes(query) ||
      order.orderNumber?.toLowerCase().includes(query) ||
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
                <TableRow 
                  key={order.id} 
                  className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => viewOrderDetails(order)}
                >
                  <TableCell className="text-white font-medium">{order.orderNumber || `#${order.id}`}</TableCell>
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
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                        className="text-gray-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(order)}
                        className="text-gray-400 hover:text-blue-400"
                        title="Edit Order"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(order)}
                        className="text-gray-400 hover:text-red-400"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Order {selectedOrder?.orderNumber || `#${selectedOrder?.id}`}</DialogTitle>
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

              <div className="border-t border-zinc-800 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Order Status</p>
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
                <div>
                  <p className="text-gray-400 text-sm mb-2">Payment Status</p>
                  <Select
                    value={orderDetails.paymentStatus || "pending"}
                    onValueChange={(value) => {
                      updatePaymentMutation.mutate({ orderId: orderDetails.id, paymentStatus: value });
                    }}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed (Paid)</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {orderDetails.paymentMethod && (
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>Payment Method: <span className="text-white capitalize">{orderDetails.paymentMethod}</span></span>
                </div>
              )}

              {orderDetails.notes && (
                <div className="border-t border-zinc-800 pt-4">
                  <p className="text-gray-400 text-sm mb-1">Order Notes</p>
                  <p className="text-white">{orderDetails.notes}</p>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(orderDetails)}
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openDeleteDialog(orderDetails)}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Order
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Order not found</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Order {selectedOrder?.orderNumber || `#${selectedOrder?.id}`}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Customer Name</Label>
              <Input
                value={editForm.customerName}
                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Customer Email</Label>
              <Input
                type="email"
                value={editForm.customerEmail}
                onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Customer Phone</Label>
              <Input
                value={editForm.customerPhone}
                onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Shipping Address</Label>
              <Textarea
                value={editForm.shippingAddress}
                onChange={(e) => setEditForm({ ...editForm, shippingAddress: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-zinc-700">
              Cancel
            </Button>
            <Button
              onClick={() => selectedOrder && updateOrderMutation.mutate({ orderId: selectedOrder.id, data: editForm })}
              disabled={updateOrderMutation.isPending}
              className="bg-battles-gold text-black hover:bg-battles-gold/90"
            >
              {updateOrderMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Order
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-300">
            Are you sure you want to delete order <span className="text-white font-medium">{selectedOrder?.orderNumber || `#${selectedOrder?.id}`}</span>? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-zinc-700">
              Cancel
            </Button>
            <Button
              onClick={() => selectedOrder && deleteOrderMutation.mutate(selectedOrder.id)}
              disabled={deleteOrderMutation.isPending}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteOrderMutation.isPending ? "Deleting..." : "Delete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
