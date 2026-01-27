import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, FileText, Upload, Loader2, Eye, Calendar } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string | null;
  published: boolean;
  metaDescription: string | null;
}

const blogCategories = [
  "News",
  "Industry",
  "Education",
  "Events",
  "Product Updates",
  "Guides",
  "Lifestyle",
];

export default function BlogManager() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "News",
    featuredImage: "",
    published: false,
    tags: "",
    metaDescription: "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File size must be less than 5MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload file");
      }
      
      const { url } = await response.json();
      setFormData({ ...formData, featuredImage: url });
      setImagePreview(URL.createObjectURL(file));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/admin/posts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/blog/posts", {
        ...data,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        publishedAt: data.published ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Blog post created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create blog post", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      return await apiRequest("PUT", `/api/blog/posts/${id}`, {
        ...data,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        publishedAt: data.published ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      setEditingPost(null);
      resetForm();
      toast({ title: "Blog post updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update blog post", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Blog post deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete blog post", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      category: "News",
      featuredImage: "",
      published: false,
      tags: "",
      metaDescription: "",
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      featuredImage: post.featuredImage || "",
      published: post.published,
      tags: post.tags?.join(", ") || "",
      metaDescription: post.metaDescription || "",
    });
    setImagePreview(post.featuredImage || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
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
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title" className="text-white">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter post title"
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug" className="text-white">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="post-url-slug"
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="author" className="text-white">Author *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Author name"
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category" className="text-white">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {blogCategories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-gray-300">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="excerpt" className="text-white">Excerpt *</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Brief summary of the post (shown in listings)"
          className="bg-zinc-800 border-zinc-700 text-white"
          rows={2}
          required
        />
      </div>

      <div>
        <Label htmlFor="content" className="text-white">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Full blog post content (supports Markdown)"
          className="bg-zinc-800 border-zinc-700 text-white font-mono"
          rows={10}
          required
        />
      </div>

      <div>
        <Label className="text-white">Featured Image</Label>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            id="blog-image-upload"
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="border-zinc-700 text-gray-300 hover:bg-zinc-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview || formData.featuredImage ? "Change Image" : "Upload Image"}
                </>
              )}
            </Button>
            {(imagePreview || formData.featuredImage) && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFormData({ ...formData, featuredImage: "" });
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Remove
              </Button>
            )}
          </div>
          {(imagePreview || formData.featuredImage) && (
            <div className="mt-3 p-3 bg-zinc-800 rounded-lg inline-block">
              <img 
                src={imagePreview || formData.featuredImage} 
                alt="Featured image preview" 
                className="max-h-24 object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="tags" className="text-white">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3 (comma separated)"
          className="bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      <div>
        <Label htmlFor="metaDescription" className="text-white">Meta Description (SEO)</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="Description for search engines..."
          className="bg-zinc-800 border-zinc-700 text-white"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
        />
        <Label htmlFor="published" className="text-white">Publish immediately</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingPost(null);
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
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {posts?.length || 0} post{(posts?.length || 0) !== 1 ? "s" : ""} total
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-battles-gold text-black hover:bg-battles-gold/90" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Blog Post</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Blog Post</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {posts?.length === 0 ? (
          <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
            <FileText className="w-12 h-12 mx-auto text-gray-500 mb-2" />
            <p className="text-gray-400">No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          posts?.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt={post.title} className="w-20 h-14 object-cover rounded" />
                ) : (
                  <div className="w-20 h-14 bg-zinc-700 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium truncate">{post.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="bg-zinc-700 text-gray-300">
                      {post.category}
                    </Badge>
                    <Badge
                      variant={post.published ? "default" : "secondary"}
                      className={post.published 
                        ? "bg-green-900 text-green-300" 
                        : "bg-yellow-900 text-yellow-300"
                      }
                    >
                      {post.published ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Published
                        </>
                      ) : (
                        "Draft"
                      )}
                    </Badge>
                    {post.publishedAt && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(post)}
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this blog post?")) {
                      deleteMutation.mutate(post.id);
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
