import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Plus, 
  User, 
  Calendar,
  ArrowLeft,
  BookOpen,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  categoryId?: number;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category?: ForumCategory;
}

export default function CommunityPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", categoryId: "" });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/forum/categories"],
    enabled: true,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory],
    queryFn: () => 
      apiRequest(`/api/forum/posts${selectedCategory ? `?category=${selectedCategory}` : ""}`, {
        method: "GET",
      }),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/forum/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setNewPost({ title: "", content: "", categoryId: "" });
      setShowCreatePost(false);
      toast({ description: "Post created successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to create post", variant: "destructive" });
    },
  });

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/community');
      setLocation('/login');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createPostMutation.mutate({
      title: newPost.title,
      content: newPost.content,
      categoryId: newPost.categoryId ? parseInt(newPost.categoryId) : null,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-battles-gold hover:text-battles-gold/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-battles-gold" />
                <h1 className="text-2xl font-bold text-battles-gold">Community Forum</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/education">
                <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Education Center
                </Button>
              </Link>
              {isAuthenticated ? (
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-battles-gold text-black hover:bg-battles-gold/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', '/community');
                    setLocation('/login');
                  }}
                  className="bg-battles-gold text-black hover:bg-battles-gold/90"
                >
                  Login to Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-battles-gold">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Posts
                </Button>
                {categories.map((category: ForumCategory) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Badge 
                      style={{ backgroundColor: category.color }}
                      className="mr-2 text-black"
                    >
                      •
                    </Badge>
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Education Integration */}
            <Card className="bg-gray-900 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-battles-gold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Education Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">
                  Connect learning with community discussions
                </p>
                <Link href="/education">
                  <Button variant="outline" className="w-full border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black">
                    Browse Guides
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Create Post Form */}
            {showCreatePost && (
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                  />
                  <select
                    value={newPost.categoryId}
                    onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                  >
                    <option value="">Select a category (optional)</option>
                    {categories.map((category: ForumCategory) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Textarea
                    placeholder="Share your thoughts, questions, or experiences..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="bg-gray-800 border-gray-600 min-h-32"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createPostMutation.isPending}
                      className="bg-battles-gold text-black hover:bg-battles-gold/90"
                    >
                      {createPostMutation.isPending ? "Creating..." : "Create Post"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="border-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">
                      Be the first to start a conversation in this category!
                    </p>
                    {isAuthenticated && (
                      <Button 
                        onClick={() => setShowCreatePost(true)}
                        className="bg-battles-gold text-black hover:bg-battles-gold/90"
                      >
                        Create First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                posts.map((post: ForumPost) => (
                  <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-battles-gold/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-battles-gold text-black">
                            {getInitials(post.author.firstName, post.author.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <Badge 
                                style={{ backgroundColor: post.category.color }}
                                className="text-black text-xs"
                              >
                                {post.category.name}
                              </Badge>
                            )}
                            {post.isPinned && (
                              <Badge variant="secondary" className="text-xs">
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <Link href={`/community/posts/${post.id}`}>
                            <h3 className="text-lg font-semibold text-white hover:text-battles-gold cursor-pointer mb-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {post.content.substring(0, 200)}
                            {post.content.length > 200 && "..."}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author.firstName} {post.author.lastName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.viewCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.replyCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likeCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}