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
  Home
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
  const [selectedGuide, setSelectedGuide] = useState<EducationGuide | null>(null);
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
      return apiRequest('/api/forum/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      setNewPost({ title: "", content: "", categoryId: "", videoUrl: "" });
      setShowCreatePost(false);
      toast({ description: "Post created successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to create post", variant: "destructive" });
    }
  });

  const requestMeetingMutation = useMutation({
    mutationFn: async (requestData: any) => {
      return apiRequest('/api/calendar/request', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      setMeetingRequest({ name: "", email: "", preferredDate: "", duration: 30, topic: "" });
      toast({ description: "Expert session request submitted successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to submit request", variant: "destructive" });
    }
  });

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

    createPostMutation.mutate({
      title: newPost.title,
      content: newPost.content,
      categoryId: newPost.categoryId ? parseInt(newPost.categoryId) : null,
      videoUrl: newPost.videoUrl || null,
    });
  };

  const extractVideoId = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const handleRequestMeeting = () => {
    if (!meetingRequest.name || !meetingRequest.email || !meetingRequest.topic) {
      toast({ description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    requestMeetingMutation.mutate(meetingRequest);
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
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-black hover:bg-black/10">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Community Hub</h1>
          <p className="text-black/80 text-lg">Connect, learn, and grow with the cannabis community</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-yellow-500/20">
            <TabsTrigger value="forum" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <MessageSquare className="h-4 w-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <BookOpen className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-500">Community Discussions</h2>
              <Button 
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <Card className="bg-gray-900 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Create New Post</CardTitle>
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
                    <SelectContent className="bg-gray-900 border-gray-700">
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
                      className="bg-yellow-500 text-black hover:bg-yellow-600"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forum Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category: ForumCategory) => (
                <Card key={category.id} className="bg-gray-900 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Forum Posts */}
            <div className="space-y-4">
              {posts.map((post: ForumPost) => (
                <Card key={post.id} className="bg-gray-900 border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-yellow-500 text-black">
                          {getInitials(post.author.firstName, post.author.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{post.title}</h3>
                          {post.isPinned && <Badge className="bg-yellow-500 text-black">Pinned</Badge>}
                          {post.category && (
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {post.category.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3">{post.content}</p>
                        
                        {/* Video Embed */}
                        {post.videoUrl && extractVideoId(post.videoUrl) && (
                          <div className="mb-4">
                            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                              <iframe
                                src={`https://www.youtube.com/embed/${extractVideoId(post.videoUrl)}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author.firstName} {post.author.lastName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likeCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {post.replyCount}
                          </span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="mt-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-yellow-500">Cannabis Education Center</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Learn about cannabis tourism, legal consumption, strain selection, and industry best practices 
                from experienced professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Guidelines</h3>
                  <p className="text-gray-400 text-sm">
                    Understanding New York cannabis laws, regulations, and compliance requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Product Education</h3>
                  <p className="text-gray-400 text-sm">
                    Learn about different cannabis products, effects, and consumption methods.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
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
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Education Guides
              </Button>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6 space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-yellow-500">Expert Sessions</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Schedule one-on-one sessions with cannabis industry experts for personalized guidance 
                on products, consumption, or business opportunities.
              </p>
            </div>

            <Card className="bg-gray-900 border-yellow-500/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-yellow-500">Request Expert Session</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below to request a personalized consultation session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={meetingRequest.name}
                    onChange={(e) => setMeetingRequest({ ...meetingRequest, name: e.target.value })}
                    className="bg-black border-gray-700 text-white"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={meetingRequest.email}
                    onChange={(e) => setMeetingRequest({ ...meetingRequest, email: e.target.value })}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={meetingRequest.preferredDate}
                    onChange={(e) => setMeetingRequest({ ...meetingRequest, preferredDate: e.target.value })}
                    className="bg-black border-gray-700 text-white"
                  />
                  <Select 
                    value={meetingRequest.duration.toString()} 
                    onValueChange={(value) => setMeetingRequest({ ...meetingRequest, duration: parseInt(value) })}
                  >
                    <SelectTrigger className="bg-black border-gray-700 text-white">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="30" className="text-white">30 minutes</SelectItem>
                      <SelectItem value="60" className="text-white">1 hour</SelectItem>
                      <SelectItem value="90" className="text-white">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="What would you like to discuss? (e.g., product recommendations, consumption methods, business opportunities)"
                  value={meetingRequest.topic}
                  onChange={(e) => setMeetingRequest({ ...meetingRequest, topic: e.target.value })}
                  className="bg-black border-gray-700 text-white min-h-[100px]"
                />
                <Button 
                  onClick={handleRequestMeeting}
                  disabled={requestMeetingMutation.isPending}
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  {requestMeetingMutation.isPending ? "Submitting..." : "Request Session"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Educational Consultations</h3>
                  <p className="text-gray-400 text-sm">
                    Learn about cannabis fundamentals, legal requirements, and best practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Product Guidance</h3>
                  <p className="text-gray-400 text-sm">
                    Get personalized recommendations for strains, products, and consumption methods.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-500/20">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
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
                  <h3 className="text-lg font-semibold text-yellow-500">Search Guides</h3>
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
                  <h3 className="text-lg font-semibold text-yellow-500">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-black border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
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
                    <Card key={guide.id} className="bg-gray-900 border-yellow-500/20 hover:border-yellow-500/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedGuide(guide)}>
                      <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                        <img 
                          src={guide.thumbnail} 
                          alt={guide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-yellow-500/20">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle className="text-yellow-500 text-xl">{selectedGuide.title}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedGuide.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
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
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <h4 className="text-yellow-500 font-semibold mb-2">💡 Pro Tip</h4>
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
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {selectedGuide.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => setCurrentStep(Math.min(selectedGuide.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === selectedGuide.steps.length - 1}
                    className="bg-yellow-500 text-black hover:bg-yellow-600"
                  >
                    Next
                  </Button>
                </div>

                {/* Contact CTA */}
                {currentStep === selectedGuide.steps.length - 1 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
                    <h4 className="text-yellow-500 font-semibold mb-2">Need More Help?</h4>
                    <p className="text-gray-300 mb-4">
                      Get personalized guidance from our cannabis experts through a one-on-one session.
                    </p>
                    <Button 
                      onClick={() => {
                        setSelectedGuide(null);
                        setActiveTab("calendar");
                      }}
                      className="bg-yellow-500 text-black hover:bg-yellow-600"
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