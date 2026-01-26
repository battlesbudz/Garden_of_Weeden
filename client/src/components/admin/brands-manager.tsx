import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import type { Brand } from "@shared/schema";

export default function BrandsManager() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    isActive: true,
    sortOrder: 0,
  });

  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/admin/brands"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/admin/brands", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Brand created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create brand", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      return await apiRequest("PATCH", `/api/admin/brands/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setEditingBrand(null);
      resetForm();
      toast({ title: "Brand updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update brand", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({ title: "Brand deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete brand", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
      isActive: true,
      sortOrder: 0,
    });
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logoUrl: brand.logoUrl || "",
      isActive: brand.isActive ?? true,
      sortOrder: brand.sortOrder ?? 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: formData });
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

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white">Brand Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter brand name"
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
          placeholder="Enter brand description"
          className="bg-zinc-800 border-zinc-700 text-white"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
        <Input
          id="logoUrl"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        {formData.logoUrl && (
          <div className="mt-2 p-2 bg-zinc-800 rounded-lg inline-block">
            <img src={formData.logoUrl} alt="Logo preview" className="max-h-20 object-contain" />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="sortOrder" className="text-white">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          value={formData.sortOrder}
          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive" className="text-white">Active (visible on shop)</Label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingBrand(null);
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
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingBrand ? "Update Brand" : "Create Brand"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {brands?.length || 0} brand{(brands?.length || 0) !== 1 ? "s" : ""} total
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-battles-gold text-black hover:bg-battles-gold/90" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Brand</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingBrand} onOpenChange={(open) => !open && setEditingBrand(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Brand</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {brands?.length === 0 ? (
          <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
            <p className="text-gray-400">No brands yet. Add your first brand!</p>
          </div>
        ) : (
          brands?.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center gap-4">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="w-12 h-12 object-contain rounded" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-700 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{brand.name}</h3>
                  {brand.description && (
                    <p className="text-gray-400 text-sm line-clamp-1">{brand.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${brand.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-gray-500">Order: {brand.sortOrder}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(brand)}
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this brand?")) {
                      deleteMutation.mutate(brand.id);
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
