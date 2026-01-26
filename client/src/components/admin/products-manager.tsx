import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import type { Product, Brand } from "@shared/schema";

type ProductWithBrand = Product & { brand?: Brand };

export default function ProductsManager() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithBrand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "cannabis",
    brandId: null as number | null,
    imageUrl: "",
    inStock: true,
    isFeatured: false,
  });

  const { data: products, isLoading } = useQuery<ProductWithBrand[]>({
    queryKey: ["/api/admin/products"],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/admin/brands"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/products", {
        ...data,
        brandId: data.brandId || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      return await apiRequest("PATCH", `/api/admin/products/${id}`, {
        ...data,
        brandId: data.brandId || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      resetForm();
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "cannabis",
      brandId: null,
      imageUrl: "",
      inStock: true,
      isFeatured: false,
    });
  };

  const openEditDialog = (product: ProductWithBrand) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      brandId: product.brandId || null,
      imageUrl: product.imageUrl || "",
      inStock: product.inStock ?? true,
      isFeatured: product.isFeatured ?? false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label htmlFor="name" className="text-white">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          className="bg-zinc-800 border-zinc-700 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          className="bg-zinc-800 border-zinc-700 text-white"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-white">Price *</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-white">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="cannabis">Cannabis</SelectItem>
              <SelectItem value="merchandise">Merchandise</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="brand" className="text-white">Brand</Label>
        <Select
          value={formData.brandId?.toString() || "none"}
          onValueChange={(value) => setFormData({ ...formData, brandId: value === "none" ? null : parseInt(value) })}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="none">No Brand</SelectItem>
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.png"
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        {formData.imageUrl && (
          <div className="mt-2 p-2 bg-zinc-800 rounded-lg inline-block">
            <img src={formData.imageUrl} alt="Product preview" className="max-h-20 object-contain" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
          />
          <Label htmlFor="inStock" className="text-white">In Stock</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="isFeatured" className="text-white">Featured</Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingProduct(null);
            resetForm();
          }}
          className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="bg-battles-gold text-black hover:bg-battles-gold/90"
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {products?.length || 0} product{(products?.length || 0) !== 1 ? "s" : ""} total
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-battles-gold text-black hover:bg-battles-gold/90" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {products?.length === 0 ? (
          <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
            <Package className="w-12 h-12 mx-auto text-gray-500 mb-2" />
            <p className="text-gray-400">No products yet. Add your first product!</p>
          </div>
        ) : (
          products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center gap-4">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 bg-zinc-700 rounded flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{product.name}</h3>
                  <p className="text-battles-gold font-semibold">${product.price}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-gray-300">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="text-xs px-2 py-0.5 rounded bg-battles-gold/20 text-battles-gold">
                        {product.brand.name}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${product.inStock ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.isFeatured && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-900 text-purple-300">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(product)}
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      deleteMutation.mutate(product.id);
                    }
                  }}
                  className="border-red-900 text-red-400 hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
