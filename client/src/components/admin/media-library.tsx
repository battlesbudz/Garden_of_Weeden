import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Image as ImageIcon, Loader2, Search, X, Download, Grid, List } from "lucide-react";

interface MediaItem {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaLibrary() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mediaItems, isLoading } = useQuery<MediaItem[]>({
    queryKey: ["/api/admin/media"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload file");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      toast({ title: "File uploaded successfully" });
    },
    onError: (error: Error) => {
      toast({ title: error.message || "Failed to upload file", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      setSelectedImage(null);
      toast({ title: "File deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete file", variant: "destructive" });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast({ title: `${file.name} is not an image file`, variant: "destructive" });
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({ title: `${file.name} exceeds 10MB limit`, variant: "destructive" });
          continue;
        }
        await uploadMutation.mutateAsync(file);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredItems = mediaItems?.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-battles-gold text-black" : "text-gray-400 hover:text-white"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-battles-gold text-black" : "text-gray-400 hover:text-white"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-battles-gold text-black hover:bg-battles-gold/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="text-gray-400 text-sm">
        {filteredItems.length} file{filteredItems.length !== 1 ? "s" : ""} 
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 mb-2">
            {searchQuery ? "No files match your search" : "No files uploaded yet"}
          </p>
          {!searchQuery && (
            <p className="text-gray-500 text-sm">Upload images to use in products, blog posts, and more</p>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setSelectedImage(item)}
                  className="group relative aspect-square bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-battles-gold transition-colors"
                >
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">View</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs truncate">{item.filename}</p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white truncate">{item.filename}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="max-h-80 object-contain rounded"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <span>{formatFileSize(item.size)}</span>
                    <span className="text-gray-600">•</span>
                    <span>{item.mimeType}</span>
                    <span className="text-gray-600">•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(item.url)}
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(item.url, "_blank")}
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (confirm("Delete this file? This cannot be undone.")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="border-red-900 text-red-400 hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.filename}</p>
                  <p className="text-gray-400 text-xs">
                    {formatFileSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(item.url)}
                  className="text-gray-400 hover:text-white"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Delete this file? This cannot be undone.")) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
