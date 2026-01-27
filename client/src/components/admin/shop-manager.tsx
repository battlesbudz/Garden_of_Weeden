import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Package, DollarSign, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Brand, Product, ShopItem } from "@shared/schema";

type ProductWithBrand = Product & { brand?: Brand };
type ShopItemWithProduct = ShopItem & { product: ProductWithBrand };

export default function ShopManager() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [shopPrice, setShopPrice] = useState<string>("");
  const [shopQuantity, setShopQuantity] = useState<string>("");
  const [editData, setEditData] = useState<{ shopPrice: string; shopQuantity: string; isActive: boolean }>({
    shopPrice: "",
    shopQuantity: "",
    isActive: true,
  });

  const { data: shopItems, isLoading: loadingShopItems } = useQuery<ShopItemWithProduct[]>({
    queryKey: ["/api/admin/shop-items/with-products"],
  });

  const { data: allProducts } = useQuery<ProductWithBrand[]>({
    queryKey: ["/api/admin/products"],
  });

  const shopItemProductIds = new Set(shopItems?.map(item => item.productId) || []);
  const availableProducts = allProducts?.filter(p => !shopItemProductIds.has(p.id)) || [];

  const addMutation = useMutation({
    mutationFn: async (data: { productId: number; shopPrice?: string; shopQuantity?: number }) => {
      return await apiRequest("POST", "/api/admin/shop-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items/with-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop-items"] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Product added to shop" });
    },
    onError: () => {
      toast({ title: "Failed to add product to shop", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ShopItem> }) => {
      return await apiRequest("PATCH", `/api/admin/shop-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items/with-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop-items"] });
      setEditingId(null);
      toast({ title: "Shop item updated" });
    },
    onError: () => {
      toast({ title: "Failed to update shop item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/shop-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop-items/with-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shop-items"] });
      toast({ title: "Product removed from shop" });
    },
    onError: () => {
      toast({ title: "Failed to remove product from shop", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setSelectedProductId("");
    setShopPrice("");
    setShopQuantity("");
  };

  const handleAdd = () => {
    if (!selectedProductId) {
      toast({ title: "Please select a product", variant: "destructive" });
      return;
    }
    addMutation.mutate({
      productId: parseInt(selectedProductId),
      shopPrice: shopPrice || undefined,
      shopQuantity: shopQuantity ? parseInt(shopQuantity) : 0,
    });
  };

  const startEditing = (item: ShopItemWithProduct) => {
    setEditingId(item.id);
    setEditData({
      shopPrice: item.shopPrice || "",
      shopQuantity: String(item.shopQuantity || 0),
      isActive: item.isActive ?? true,
    });
  };

  const saveEdit = (id: number) => {
    updateMutation.mutate({
      id,
      data: {
        shopPrice: editData.shopPrice || undefined,
        shopQuantity: editData.shopQuantity ? parseInt(editData.shopQuantity) : 0,
        isActive: editData.isActive,
      },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ shopPrice: "", shopQuantity: "", isActive: true });
  };

  if (loadingShopItems) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Loading shop items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {shopItems?.length || 0} products in shop
        </p>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-battles-gold text-black hover:bg-battles-gold/90">
              <Plus className="w-4 h-4 mr-2" />
              Import Product to Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
            <DialogHeader>
              <DialogTitle>Import Product to Shop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="product" className="text-white">Select Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 max-h-60">
                    {availableProducts.length === 0 ? (
                      <div className="p-2 text-gray-400 text-sm">No products available to import</div>
                    ) : (
                      availableProducts.map((product) => (
                        <SelectItem key={product.id} value={String(product.id)}>
                          {product.name} {product.brand ? `(${product.brand.name})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-xs mt-1">
                  Products must be added in the Products tab first
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopPrice" className="text-white">Shop Price (optional)</Label>
                  <Input
                    id="shopPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shopPrice}
                    onChange={(e) => setShopPrice(e.target.value)}
                    placeholder="Use product price"
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                  <p className="text-gray-500 text-xs mt-1">Leave blank to use product's base price</p>
                </div>
                <div>
                  <Label htmlFor="shopQuantity" className="text-white">Shop Quantity</Label>
                  <Input
                    id="shopQuantity"
                    type="number"
                    min="0"
                    value={shopQuantity}
                    onChange={(e) => setShopQuantity(e.target.value)}
                    placeholder="0"
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAdd}
                  disabled={!selectedProductId || addMutation.isPending}
                  className="flex-1 bg-battles-gold text-black hover:bg-battles-gold/90"
                >
                  {addMutation.isPending ? "Adding..." : "Add to Shop"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setIsAddOpen(false); resetForm(); }}
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {shopItems && shopItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Base Price</TableHead>
              <TableHead className="text-gray-400">Shop Price</TableHead>
              <TableHead className="text-gray-400">Quantity</TableHead>
              <TableHead className="text-gray-400">Active</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shopItems.map((item) => (
              <TableRow key={item.id} className="border-zinc-800">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product?.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{item.product?.name}</p>
                      {item.product?.brand && (
                        <p className="text-gray-500 text-sm">{item.product.brand.name}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  ${parseFloat(item.product?.price || "0").toFixed(2)}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editData.shopPrice}
                      onChange={(e) => setEditData({ ...editData, shopPrice: e.target.value })}
                      placeholder="Use base price"
                      className="bg-zinc-800 border-zinc-700 text-white w-24"
                    />
                  ) : (
                    <span className="text-white">
                      {item.shopPrice ? `$${parseFloat(item.shopPrice).toFixed(2)}` : (
                        <span className="text-gray-500">Base price</span>
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      min="0"
                      value={editData.shopQuantity}
                      onChange={(e) => setEditData({ ...editData, shopQuantity: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white w-20"
                    />
                  ) : (
                    <span className={item.shopQuantity && item.shopQuantity > 0 ? "text-green-500" : "text-red-400"}>
                      {item.shopQuantity || 0}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Switch
                      checked={editData.isActive}
                      onCheckedChange={(checked) => setEditData({ ...editData, isActive: checked })}
                    />
                  ) : (
                    <Badge className={item.isActive ? "bg-green-600" : "bg-red-600"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === item.id ? (
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => saveEdit(item.id)}
                        className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-zinc-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEditing(item)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <DollarSign className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Products in Shop</h3>
          <p className="text-gray-400 mb-4">
            Import products from your product catalog to display them on your shop page.
          </p>
          <p className="text-gray-500 text-sm">
            Products must be added in the Products tab first, then imported here to appear on the shop.
          </p>
        </div>
      )}
    </div>
  );
}
