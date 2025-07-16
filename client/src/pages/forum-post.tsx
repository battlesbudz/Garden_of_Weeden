import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  User, 
  Calendar,
  ArrowLeft,
  Send,
  Heart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";

interface ForumComment {
  id: number;
  content: string;
  postId: number;
  authorId: string;
  parentId?: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
  category?: {
    id: number;
    name: string;
    color: string;
  };
  comments: ForumComment[];
}

export default function ForumPostPage() {
  const [match, params] = useRoute("/community/posts/:id");
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [newComment, setNewComment] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const postId = params?.id ? parseInt(params.id) : null;

  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", postId],
    queryFn: () => apiRequest(`/api/forum/posts/${postId}`, { method: "GET" }),
    enabled: !!postId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/forum/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      setNewComment("");
      toast({ description: "Comment posted successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to post comment", variant: "destructive" });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: () => apiRequest(`/api/forum/posts/${postId}/like`, {
      method: "POST",
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      if (data.liked) {
        setLikedPosts(prev => new Set([...prev, postId!]));
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId!);
          return newSet;
        });
      }
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => apiRequest(`/api/forum/comments/${commentId}/like`, {
      method: "POST",
    }),
    onSuccess: (data, commentId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", postId] });
      if (data.liked) {
        setLikedComments(prev => new Set([...prev, commentId]));
      } else {
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      }
    },
  });

  const handleCreateComment = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/community/posts/${postId}`);
      setLocation('/login');
      return;
    }

    if (!newComment.trim()) {
      toast({ description: "Please enter a comment", variant: "destructive" });
      return;
    }

    createCommentMutation.mutate({
      content: newComment,
      postId: postId,
    });
  };

  const handleLikePost = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/community/posts/${postId}`);
      setLocation('/login');
      return;
    }
    likePostMutation.mutate();
  };

  const handleLikeComment = (commentId: number) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/community/posts/${postId}`);
      setLocation('/login');
      return;
    }
    likeCommentMutation.mutate(commentId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-battles-gold">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Post Not Found</h2>
          <Link href="/community">
            <Button className="bg-battles-gold text-black hover:bg-battles-gold/90">
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Use consistent navigation */}
      <Navigation />

      {/* Main Content with top spacing for fixed nav */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/community">
            <Button
              variant="ghost"
              className="text-battles-gold hover:text-battles-gold/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </div>
        {/* Main Post */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-battles-gold text-black">
                  {getInitials(post.author.firstName, post.author.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">
                    {post.author.firstName} {post.author.lastName}
                  </span>
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
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.viewCount} views
                  </span>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-white mb-4">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={`gap-2 ${likedPosts.has(post.id) ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
              >
                <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                {post.likeCount}
              </Button>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {post.replyCount} replies
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-battles-gold">
              Comments ({post.comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Comment Form */}
            {isAuthenticated ? (
              <div className="mb-8 p-4 bg-gray-800 rounded-lg">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-battles-gold text-black text-sm">
                      {user ? getInitials(user.firstName, user.lastName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-gray-700 border-gray-600 mb-3"
                    />
                    <Button 
                      onClick={handleCreateComment}
                      disabled={createCommentMutation.isPending}
                      className="bg-battles-gold text-black hover:bg-battles-gold/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-gray-400 mb-3">Join the conversation!</p>
                <Button 
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', `/community/posts/${postId}`);
                    setLocation('/login');
                  }}
                  className="bg-battles-gold text-black hover:bg-battles-gold/90"
                >
                  Login to Comment
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                post.comments?.map((comment: ForumComment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-800 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-battles-gold text-black text-sm">
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeComment(comment.id)}
                        className={`gap-2 ${likedComments.has(comment.id) ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                      >
                        <Heart className={`h-3 w-3 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        {comment.likeCount}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}