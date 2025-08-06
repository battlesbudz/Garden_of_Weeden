import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Plus, 
  User, 
  Calendar,
  Video,
  Play,
  Heart
} from "lucide-react";

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
  videoUrl?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category?: ForumCategory;
  comments?: Array<{
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
    };
    likeCount: number;
  }>;
}

export function ForumSection() {
  const [newPost, setNewPost] = useState({ title: "", content: "", categoryId: "", videoUrl: "" });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: categories = [] } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  const { data: posts = [] } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts'],
  });

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest('POST', '/api/forum/posts', postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      setNewPost({ title: "", content: "", categoryId: "", videoUrl: "" });
      setShowCreatePost(false);
      toast({ description: "Post created successfully!" });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to create post";
      toast({ description: errorMessage, variant: "destructive" });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const response = await apiRequest('POST', '/api/forum/comments', {
        postId,
        content,
        authorId: user?.id
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      setNewComment("");
      toast({ description: "Comment added successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to add comment", variant: "destructive" });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('POST', '/api/forum/likes', {
        postId,
        userId: user?.id
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
    }
  });

  // Utility functions
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Event handlers
  const handleCreatePost = () => {
    if (!isAuthenticated || !user) {
      toast({ description: "Please log in to create a post", variant: "destructive" });
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createPostMutation.mutate({
      ...newPost,
      authorId: user.id,
      categoryId: newPost.categoryId || null
    });
  };

  const handleCreateComment = (postId: number) => {
    if (!isAuthenticated || !user) {
      toast({ description: "Please log in to comment", variant: "destructive" });
      return;
    }

    if (!newComment.trim()) {
      toast({ description: "Please enter a comment", variant: "destructive" });
      return;
    }

    createCommentMutation.mutate({ postId, content: newComment });
  };

  const handleLikePost = (postId: number) => {
    if (!isAuthenticated || !user) {
      toast({ description: "Please log in to like posts", variant: "destructive" });
      return;
    }
    likePostMutation.mutate(postId);
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           (post.category && post.category.name.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const pinnedPosts = filteredPosts.filter(post => post.isPinned);
  const regularPosts = filteredPosts.filter(post => !post.isPinned);

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Forum</h2>
          <p className="text-gray-600">Connect with fellow cannabis enthusiasts</p>
        </div>
        <Button onClick={() => setShowCreatePost(true)} disabled={!isAuthenticated}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📌 Pinned Posts
          </h3>
          {pinnedPosts.map((post) => (
            <ForumPostCard
              key={post.id}
              post={post}
              showComments={showComments}
              onToggleComments={toggleComments}
              onLikePost={handleLikePost}
              onCreateComment={handleCreateComment}
              newComment={newComment}
              setNewComment={setNewComment}
              user={user}
              getInitials={getInitials}
              extractVideoId={extractVideoId}
              createCommentMutation={createCommentMutation}
            />
          ))}
        </div>
      )}

      {/* Regular Posts */}
      <div className="space-y-4">
        {regularPosts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600">Be the first to start a conversation!</p>
          </div>
        ) : (
          regularPosts.map((post) => (
            <ForumPostCard
              key={post.id}
              post={post}
              showComments={showComments}
              onToggleComments={toggleComments}
              onLikePost={handleLikePost}
              onCreateComment={handleCreateComment}
              newComment={newComment}
              setNewComment={setNewComment}
              user={user}
              getInitials={getInitials}
              extractVideoId={extractVideoId}
              createCommentMutation={createCommentMutation}
            />
          ))
        )}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share your thoughts with the community</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's your post about?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={newPost.categoryId} 
                onValueChange={(value) => setNewPost(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content *</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (Optional)</label>
              <Input
                value={newPost.videoUrl}
                onChange={(e) => setNewPost(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending || !newPost.title.trim() || !newPost.content.trim()}
              >
                {createPostMutation.isPending ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate component for individual forum posts
interface ForumPostCardProps {
  post: ForumPost;
  showComments: { [key: number]: boolean };
  onToggleComments: (postId: number) => void;
  onLikePost: (postId: number) => void;
  onCreateComment: (postId: number) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  user: any;
  getInitials: (firstName: string, lastName: string) => string;
  extractVideoId: (url: string) => string | null;
  createCommentMutation: any;
}

function ForumPostCard({ 
  post, 
  showComments, 
  onToggleComments, 
  onLikePost, 
  onCreateComment, 
  newComment, 
  setNewComment, 
  user, 
  getInitials, 
  extractVideoId, 
  createCommentMutation 
}: ForumPostCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-battles-gold text-black">
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{post.title}</h3>
                {post.isPinned && <Badge variant="secondary">📌 Pinned</Badge>}
                {post.category && (
                  <Badge 
                    style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                  >
                    {post.category.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.author.firstName} {post.author.lastName}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
        
        {/* Video embed */}
        {post.videoUrl && extractVideoId(post.videoUrl) && (
          <div className="mb-4">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(post.videoUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Post Actions */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <button 
            onClick={() => onLikePost(post.id)}
            className="flex items-center gap-1 hover:text-red-500 transition-colors"
          >
            <Heart className="h-4 w-4" />
            <span>{post.likeCount}</span>
          </button>
          <button 
            onClick={() => onToggleComments(post.id)}
            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.replyCount} comments</span>
          </button>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>

        {/* Comments Section */}
        {showComments[post.id] && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Add comment form */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-battles-gold text-black text-xs">
                  {user && getInitials(user.firstName || "", user.lastName || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="text-sm min-h-[60px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => onCreateComment(post.id)}
                    disabled={createCommentMutation.isPending}
                  >
                    {createCommentMutation.isPending ? "Posting..." : "Comment"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setNewComment("")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Display Comments */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-battles-gold text-black text-xs">
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors">
                          <Heart className="h-3 w-3" />
                          <span>{comment.likeCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}