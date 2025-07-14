import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  BookOpen,
  Users,
  Video,
  Play,
  MapPin,
  Shield,
  Award,
  Leaf,
  Search,
  GraduationCap,
  FileText,
  ExternalLink,
  Clock,
  Zap,
  Home,
  Heart,
  ChevronDown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import cultivationImage from "@assets/360_F_499206936_DTB3BAfocgPpunIz14tRTBZwwy5PC1Oi_1752425020338.jpg";

// Interfaces
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
}

interface GuideStep {
  id: number;
  title: string;
  content: string;
  tips?: string;
  warnings?: string;
}

interface EducationGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  steps: GuideStep[];
  videoUrl?: string;
  thumbnail: string;
  tags: string[];
}

export default function EnhancedCommunityPage() {
  const [activeTab, setActiveTab] = useState("forum");
  const [newPost, setNewPost] = useState({ title: "", content: "", categoryId: "", videoUrl: "" });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [selectedGuide, setSelectedGuide] = useState<EducationGuide | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: number]: boolean }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [meetingRequest, setMeetingRequest] = useState({ 
    name: "", 
    email: "", 
    preferredDate: "", 
    duration: 30, 
    topic: "" 
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
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
      console.log("Sending post data:", postData);
      const response = await apiRequest('POST', '/api/forum/posts', postData);
      console.log("Post creation response:", response);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      setNewPost({ title: "", content: "", categoryId: "", videoUrl: "" });
      setShowCreatePost(false);
      toast({ description: "Post created successfully!" });
    },
    onError: (error: any) => {
      console.error("Post creation error:", error);
      const errorMessage = error?.message || error?.errors?.[0]?.message || "Failed to create post";
      toast({ description: errorMessage, variant: "destructive" });
    }
  });

  const requestMeetingMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const response = await apiRequest('POST', '/api/calendar/request', requestData);
      return response.json();
    },
    onSuccess: () => {
      setMeetingRequest({ name: "", email: "", preferredDate: "", duration: 30, topic: "" });
      toast({ description: "Expert session request submitted successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to submit request", variant: "destructive" });
    }
  });

  // Add comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (commentData: { content: string; postId: number }) => {
      const response = await apiRequest('POST', '/api/forum/comments', commentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      setNewComment("");
      toast({ description: "Comment posted successfully!" });
    },
    onError: (error: any) => {
      console.error("Comment creation error:", error);
      toast({ description: "Failed to post comment", variant: "destructive" });
    }
  });

  // Utility functions
  const extractYouTubeVideoId = (url: string) => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleCategory = (categoryId: number) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };



  // Handler functions
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/community');
      setLocation('/login');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ description: "Please fill in title and content", variant: "destructive" });
      return;
    }

    console.log("Creating post with user authenticated:", user);
    console.log("Post data:", newPost);

    const postData = {
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      categoryId: newPost.categoryId ? parseInt(newPost.categoryId) : null,
      videoUrl: newPost.videoUrl?.trim() || null,
    };

    console.log("Processed post data:", postData);
    createPostMutation.mutate(postData);
  };



  const handleRequestMeeting = () => {
    if (!meetingRequest.name || !meetingRequest.email || !meetingRequest.topic) {
      toast({ description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    requestMeetingMutation.mutate(meetingRequest);
  };

  const handleCreateComment = (postId: number) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/community');
      setLocation('/login');
      return;
    }

    if (!newComment.trim()) {
      toast({ description: "Please enter a comment", variant: "destructive" });
      return;
    }

    createCommentMutation.mutate({
      content: newComment.trim(),
      postId: postId,
    });
  };

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: (postId: number) => apiRequest('POST', `/api/forum/posts/${postId}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      toast({ description: "Post liked!" });
    },
    onError: () => {
      toast({ description: "Failed to like post", variant: "destructive" });
    }
  });

  const handleLikePost = (postId: number) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/community');
      setLocation('/login');
      return;
    }
    likePostMutation.mutate(postId);
  };

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => apiRequest('POST', `/api/forum/comments/${commentId}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      toast({ description: "Comment liked!" });
    },
    onError: () => {
      toast({ description: "Failed to like comment", variant: "destructive" });
    }
  });

  const handleLikeComment = (commentId: number) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/community');
      setLocation('/login');
      return;
    }
    likeCommentMutation.mutate(commentId);
  };

  // Education guides data
  const educationGuides: EducationGuide[] = [
    {
      id: "ny-cannabis-laws",
      title: "New York Cannabis Laws for Tourists",
      description: "Complete guide to legal cannabis consumption for visitors to New York State",
      category: "legal",
      difficulty: "Beginner",
      duration: "15 min",
      thumbnail: cultivationImage,
      tags: ["legal", "tourism", "new-york"],
      steps: [
        {
          id: 1,
          title: "Understanding Legal Age Requirements",
          content: "You must be 21 or older to purchase and consume cannabis in New York. Always carry valid ID.",
          tips: "Accepted ID includes driver's license, passport, or state-issued ID card.",
          warnings: "Penalties for underage possession can include fines and legal consequences."
        },
        {
          id: 2,
          title: "Purchase Limits and Locations",
          content: "You can purchase up to 3 ounces of flower or 24 grams of concentrate from licensed dispensaries.",
          tips: "Look for the official New York State cannabis license displayed in dispensaries.",
        },
        {
          id: 3,
          title: "Where You Can Consume",
          content: "Consumption is legal in private residences and designated consumption lounges like Battles Budz.",
          warnings: "Public consumption is prohibited and can result in fines. Never consume in vehicles."
        },
        {
          id: 4,
          title: "Transportation Rules",
          content: "Cannabis must be transported in sealed, original containers. Never drive under the influence.",
          tips: "Store cannabis in your trunk or a locked container when traveling by car."
        }
      ]
    },
    {
      id: "consumption-lounge-etiquette",
      title: "Cannabis Lounge Etiquette",
      description: "Learn proper etiquette for consumption lounges and social cannabis experiences",
      category: "culture",
      difficulty: "Beginner",
      duration: "10 min",
      thumbnail: cultivationImage,
      tags: ["etiquette", "social", "lounge"],
      steps: [
        {
          id: 1,
          title: "Arrival and Check-in",
          content: "Arrive on time for your reservation and present valid ID at check-in.",
          tips: "Call ahead if you're running late to maintain your reservation."
        },
        {
          id: 2,
          title: "Sharing and Social Consumption",
          content: "It's customary to offer to share, but never feel obligated to accept or share your personal cannabis.",
          tips: "Bring your own consumption tools and avoid sharing pieces for hygiene reasons."
        },
        {
          id: 3,
          title: "Respecting the Space",
          content: "Keep noise levels considerate, clean up after yourself, and respect others' experiences.",
          warnings: "Never touch or use someone else's cannabis without permission."
        }
      ]
    },
    {
      id: "strain-selection-guide",
      title: "Cannabis Strain Selection for Beginners",
      description: "Learn how to choose the right cannabis strains for your desired experience",
      category: "education",
      difficulty: "Beginner",
      duration: "20 min",
      thumbnail: cultivationImage,
      tags: ["strains", "effects", "beginner"],
      steps: [
        {
          id: 1,
          title: "Understanding Indica vs Sativa",
          content: "Indica strains typically provide relaxing effects, while Sativa strains are more energizing.",
          tips: "Hybrid strains combine both effects and are great for balanced experiences."
        },
        {
          id: 2,
          title: "THC and CBD Ratios",
          content: "THC provides psychoactive effects, while CBD offers therapeutic benefits without the high.",
          tips: "Start with lower THC products (5-10%) if you're new to cannabis."
        },
        {
          id: 3,
          title: "Reading Lab Reports",
          content: "Lab reports show cannabinoid profiles, terpenes, and safety testing results.",
          tips: "Look for recent test dates and proper licensing information."
        }
      ]
    }
  ];

  const filteredGuides = educationGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-battles-gold to-yellow-500 text-battles-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-battles-black hover:bg-battles-black/10">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-battles-black">Community Hub</h1>
          <p className="text-battles-black/80 text-lg">Connect, learn, and grow with the cannabis community</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-battles-black border border-battles-gold/20">
            <TabsTrigger value="forum" className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black text-white">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Community Discussions</h2>
              <Button 
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="bg-battles-gold text-battles-black hover:bg-yellow-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <Card className="bg-battles-black border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="bg-black border-gray-700 text-white"
                  />
                  <Select 
                    value={newPost.categoryId} 
                    onValueChange={(value) => setNewPost({ ...newPost, categoryId: value })}
                  >
                    <SelectTrigger className="bg-black border-gray-700 text-white">
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-battles-black border-gray-700">
                      {categories.map((category: ForumCategory) => (
                        <SelectItem key={category.id} value={category.id.toString()} className="text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="YouTube video URL (optional)"
                    value={newPost.videoUrl}
                    onChange={(e) => setNewPost({ ...newPost, videoUrl: e.target.value })}
                    className="bg-black border-gray-700 text-white"
                  />
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="bg-black border-gray-700 text-white min-h-[120px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createPostMutation.isPending}
                      className="bg-battles-gold text-battles-black hover:bg-yellow-600"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="border-gray-700 text-white hover:bg-gray-900"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forum Categories with Posts */}
            <div className="space-y-6">
              {categories.map((category: ForumCategory) => {
                const categoryPosts = posts.filter((post: ForumPost) => post.categoryId === category.id);
                
                return (
                  <div key={category.id} className="space-y-4">
                    <Card className="bg-battles-black border-battles-gold/20 cursor-pointer hover:border-battles-gold/40 transition-colors">
                      <CardContent className="p-4" onClick={() => toggleCategory(category.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-battles-gold"></div>
                            <div>
                              <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                              <p className="text-sm text-gray-400">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-battles-gold text-black">
                              {categoryPosts.length} posts
                            </Badge>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedCategories[category.id] ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Posts in this category */}
                    {categoryPosts.length > 0 && !collapsedCategories[category.id] && (
                      <div className="ml-6 space-y-4">
                        {categoryPosts.map((post: ForumPost) => (
                          <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-battles-gold/40 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-battles-gold text-black">
                                    {getInitials(post.author.firstName, post.author.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-white">{post.title}</h3>
                                    {post.isPinned && <Badge className="bg-battles-gold text-black">Pinned</Badge>}
                                  </div>
                                  <p className="text-gray-300 mb-3">{post.content}</p>
                                  
                                  {/* Video Embed */}
                                  {post.videoUrl && extractYouTubeVideoId(post.videoUrl) && (
                                    <div className="mb-4">
                                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                        <iframe
                                          src={`https://www.youtube.com/embed/${extractYouTubeVideoId(post.videoUrl)}`}
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
                                      onClick={() => handleLikePost(post.id)}
                                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                    >
                                      <Heart className="h-4 w-4" />
                                      <span>{post.likeCount}</span>
                                    </button>
                                    <button 
                                      onClick={() => toggleComments(post.id)}
                                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                      <span>{post.replyCount} comments</span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      <span>{post.viewCount}</span>
                                    </div>
                                    <span className="ml-auto">
                                      {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {/* Comments Section */}
                                  {showComments[post.id] && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                      <div className="space-y-3">
                                        {/* Add comment form */}
                                        <div className="flex gap-3">
                                          <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-battles-gold text-black text-xs">
                                              {user && getInitials(user.firstName, user.lastName)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <Textarea
                                              placeholder="Write a comment..."
                                              value={newComment}
                                              onChange={(e) => setNewComment(e.target.value)}
                                              className="bg-gray-900 border-gray-600 text-white text-sm min-h-[60px]"
                                            />
                                            <div className="flex gap-2 mt-2">
                                              <Button 
                                                size="sm" 
                                                onClick={() => handleCreateComment(post.id)}
                                                disabled={createCommentMutation.isPending}
                                                className="bg-battles-gold text-battles-black hover:bg-yellow-600"
                                              >
                                                {createCommentMutation.isPending ? "Posting..." : "Comment"}
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => setNewComment("")}
                                                className="text-gray-400 hover:text-white"
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Actual Comments Display */}
                                        {post.comments && post.comments.length > 0 ? (
                                          <div className="space-y-3">
                                            {post.comments.map((comment: any) => (
                                              <div key={comment.id} className="flex gap-3 p-3 bg-gray-900 rounded-lg">
                                                <Avatar className="w-8 h-8">
                                                  <AvatarFallback className="bg-battles-gold text-black text-xs">
                                                    {getInitials(comment.author.firstName, comment.author.lastName)}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-white text-sm">
                                                      {comment.author.firstName} {comment.author.lastName}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                      {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                  </div>
                                                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                                    {comment.content}
                                                  </p>
                                                  <div className="flex items-center gap-2 mt-2">
                                                    <button 
                                                      onClick={() => handleLikeComment(comment.id)}
                                                      className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
                                                    >
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
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Uncategorized Posts */}
              {(() => {
                const uncategorizedPosts = posts.filter((post: ForumPost) => !post.categoryId);
                return uncategorizedPosts.length > 0 && (
                  <div className="space-y-4">
                    <Card className="bg-battles-black border-battles-gold/20 cursor-pointer hover:border-battles-gold/40 transition-colors">
                      <CardContent className="p-4" onClick={() => toggleCategory(0)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <div>
                              <h3 className="font-semibold text-white text-lg">Uncategorized</h3>
                              <p className="text-sm text-gray-400">Posts without a specific category</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-500 text-white">
                              {uncategorizedPosts.length} posts
                            </Badge>
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${collapsedCategories[0] ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {!collapsedCategories[0] && (
                      <div className="ml-6 space-y-4">
                        {uncategorizedPosts.map((post: ForumPost) => (
                        <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-battles-gold/40 transition-colors">
                          <CardContent className="p-6">
                            {/* Same post structure as categorized posts but without category badge */}
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback className="bg-battles-gold text-black">
                                  {getInitials(post.author.firstName, post.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-white">{post.title}</h3>
                                  {post.isPinned && <Badge className="bg-battles-gold text-black">Pinned</Badge>}
                                </div>
                                <p className="text-gray-300 mb-3">{post.content}</p>
                                
                                {/* Post actions and comments sections would be the same */}
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                  <button 
                                    onClick={() => handleLikePost(post.id)}
                                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                  >
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likeCount}</span>
                                  </button>
                                  <button 
                                    onClick={() => toggleComments(post.id)}
                                    className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.replyCount} comments</span>
                                  </button>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewCount}</span>
                                  </div>
                                  <span className="ml-auto">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>


          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="mt-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-battles-gold">Cannabis Education Center</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Learn about cannabis tourism, legal consumption, strain selection, and industry best practices 
                from experienced professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Guidelines</h3>
                  <p className="text-gray-400 text-sm">
                    Understanding New York cannabis laws, regulations, and compliance requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Product Education</h3>
                  <p className="text-gray-400 text-sm">
                    Learn about different cannabis products, effects, and consumption methods.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Social Consumption</h3>
                  <p className="text-gray-400 text-sm">
                    Etiquette and best practices for consumption lounges and social experiences.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setActiveTab("guides")}
                className="bg-battles-gold text-battles-black hover:bg-yellow-600"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Education Guides
              </Button>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-battles-gold">Community Events</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Join our upcoming community workshops, Q&A sessions, and educational events. 
                All events are hosted via Zoom to connect our cannabis community.
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-6">
              <Card className="bg-battles-black border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-battles-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Cannabis 101 Workshop</h4>
                          <p className="text-sm text-gray-400">Learn the basics of cannabis consumption, safety, and legal guidelines</p>
                        </div>
                      </div>
                      <Badge className="bg-battles-gold text-black">Live</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Saturday, July 19th - 2:00 PM - 4:00 PM EST
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        15 spots available
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Zoom Meeting
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        onClick={() => window.open('mailto:battlesbudz@gmail.com?subject=Cannabis%20101%20Workshop%20Registration&body=I%20would%20like%20to%20register%20for%20the%20Cannabis%20101%20Workshop%20on%20July%2019th.', '_blank')}
                        className="bg-battles-gold text-battles-black hover:bg-yellow-600"
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-battles-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Community Q&A Session</h4>
                          <p className="text-sm text-gray-400">Ask questions and connect with other community members</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">Weekly</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Every Tuesday - 7:00 PM - 8:00 PM EST
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Open to all
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Zoom Meeting
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        onClick={() => window.open('mailto:battlesbudz@gmail.com?subject=Weekly%20Q&A%20Session%20Access&body=I%20would%20like%20to%20join%20the%20weekly%20Q&A%20sessions.', '_blank')}
                        variant="outline"
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                      >
                        Get Zoom Link
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-battles-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Product Deep Dive: Edibles</h4>
                          <p className="text-sm text-gray-400">Expert discussion on cannabis edibles, dosing, and effects</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white">Coming Soon</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Friday, July 25th - 6:00 PM - 7:30 PM EST
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        20 spots available
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Zoom Meeting
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        onClick={() => window.open('mailto:battlesbudz@gmail.com?subject=Edibles%20Deep%20Dive%20Registration&body=I%20would%20like%20to%20register%20for%20the%20Edibles%20Deep%20Dive%20workshop%20on%20July%2025th.', '_blank')}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Guidelines */}
              <Card className="bg-battles-black border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Event Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-battles-gold rounded-full mt-2"></div>
                    <p className="text-gray-300 text-sm">All participants must be 21+ and in a legal cannabis state/country</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-battles-gold rounded-full mt-2"></div>
                    <p className="text-gray-300 text-sm">Events are educational and informational only</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-battles-gold rounded-full mt-2"></div>
                    <p className="text-gray-300 text-sm">Zoom links will be provided 24 hours before each event</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-battles-gold rounded-full mt-2"></div>
                    <p className="text-gray-300 text-sm">Recording may be available for registered participants</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Educational Consultations</h3>
                  <p className="text-gray-400 text-sm">
                    Learn about cannabis fundamentals, legal requirements, and best practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Product Guidance</h3>
                  <p className="text-gray-400 text-sm">
                    Get personalized recommendations for strains, products, and consumption methods.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-battles-black border-battles-gold/20">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Business Opportunities</h3>
                  <p className="text-gray-400 text-sm">
                    Explore investment and partnership opportunities in the cannabis industry.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="mt-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search and Filters */}
              <div className="lg:w-1/4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-battles-gold">Search Guides</h3>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-battles-gold">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-black border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-battles-black border-gray-700">
                      <SelectItem value="all" className="text-white">All Categories</SelectItem>
                      <SelectItem value="legal" className="text-white">Legal</SelectItem>
                      <SelectItem value="culture" className="text-white">Culture</SelectItem>
                      <SelectItem value="education" className="text-white">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Guides Grid */}
              <div className="lg:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGuides.map((guide) => (
                    <Card key={guide.id} className="bg-battles-black border-battles-gold/20 hover:border-battles-gold/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedGuide(guide)}>
                      <div className="aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                        <img 
                          src={guide.thumbnail} 
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-battles-gold/20 text-battles-gold border-battles-gold/30">
                            {guide.difficulty}
                          </Badge>
                          <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="h-3 w-3" />
                            {guide.duration}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">{guide.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Guide Modal */}
      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-battles-black border-battles-gold/20">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle className="text-battles-gold text-xl">{selectedGuide.title}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedGuide.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className="bg-battles-gold/20 text-battles-gold border-battles-gold/30">
                    {selectedGuide.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    {selectedGuide.duration}
                  </span>
                  <span className="text-sm text-gray-400">
                    Step {currentStep + 1} of {selectedGuide.steps.length}
                  </span>
                </div>

                {/* Step Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedGuide.steps[currentStep]?.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedGuide.steps[currentStep]?.content}
                  </p>
                  
                  {selectedGuide.steps[currentStep]?.tips && (
                    <div className="bg-battles-gold/10 border border-battles-gold/20 rounded-lg p-4">
                      <h4 className="text-battles-gold font-semibold mb-2">💡 Pro Tip</h4>
                      <p className="text-gray-300">{selectedGuide.steps[currentStep].tips}</p>
                    </div>
                  )}
                  
                  {selectedGuide.steps[currentStep]?.warnings && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="text-red-400 font-semibold mb-2">⚠️ Important</h4>
                      <p className="text-gray-300">{selectedGuide.steps[currentStep].warnings}</p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="border-gray-700 text-white hover:bg-gray-900"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {selectedGuide.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-battles-gold' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setCurrentStep(Math.min(selectedGuide.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === selectedGuide.steps.length - 1}
                    className="bg-battles-gold text-battles-black hover:bg-yellow-600"
                  >
                    Next
                  </Button>
                </div>

                {/* Contact CTA */}
                {currentStep === selectedGuide.steps.length - 1 && (
                  <div className="bg-battles-gold/10 border border-battles-gold/20 rounded-lg p-6 text-center">
                    <h4 className="text-battles-gold font-semibold mb-2">Need More Help?</h4>
                    <p className="text-gray-300 mb-4">
                      Get personalized guidance from our cannabis experts through a one-on-one session.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedGuide(null);
                        setActiveTab("calendar");
                      }}
                      className="bg-battles-gold text-battles-black hover:bg-yellow-600"
                    >
                      Schedule Expert Session
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}