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
  Users,
  Video,
  ChevronRight,
  ChevronLeft,
  Play,
  MapPin,
  Shield,
  Award,
  Leaf,
  Search,
  Filter,
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
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("forum");
  
  // Forum states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", categoryId: "", videoUrl: "" });
  
  // Education states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEducationCategory, setSelectedEducationCategory] = useState("all");
  const [selectedGuide, setSelectedGuide] = useState<EducationGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [meetingRequest, setMeetingRequest] = useState({
    name: "",
    email: "",
    topic: "",
    preferredDate: "",
    duration: "30"
  });

  // Queries
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

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/forum/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setNewPost({ title: "", content: "", categoryId: "", videoUrl: "" });
      setShowCreatePost(false);
      toast({ description: "Post created successfully!" });
    },
    onError: (error: any) => {
      console.error("Post creation error:", error);
      toast({ description: "Failed to create post. Please check all fields.", variant: "destructive" });
    },
  });

  const requestMeetingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/calendar/request", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      setMeetingRequest({ name: "", email: "", topic: "", preferredDate: "", duration: "30" });
      setShowCalendar(false);
      toast({ description: "Meeting request sent! We'll contact you soon." });
    },
    onError: () => {
      toast({ description: "Failed to send meeting request", variant: "destructive" });
    },
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
          content: "It's polite to share with your group, but always ask before using someone else's cannabis.",
          tips: "Bring extra to share - it creates a welcoming atmosphere."
        },
        {
          id: 3,
          title: "Respecting Space and Others",
          content: "Keep noise levels reasonable and be mindful of others' experiences.",
          warnings: "Respect personal space and don't pressure others to consume more than they're comfortable with."
        },
        {
          id: 4,
          title: "Safe Consumption Practices",
          content: "Start low and go slow, especially with edibles or concentrates.",
          tips: "Stay hydrated and have snacks available. Know your limits."
        }
      ]
    },
    {
      id: "strain-selection-guide",
      title: "Cannabis Strain Selection for Beginners",
      description: "Learn how to choose the right cannabis strains for your desired experience",
      category: "products",
      difficulty: "Intermediate",
      duration: "20 min",
      thumbnail: cultivationImage,
      tags: ["strains", "effects", "beginner"],
      steps: [
        {
          id: 1,
          title: "Understanding Indica vs Sativa",
          content: "Indica strains typically provide relaxing effects, while sativa strains are more energizing.",
          tips: "Hybrid strains combine both effects and are great for beginners."
        },
        {
          id: 2,
          title: "THC and CBD Ratios",
          content: "THC provides psychoactive effects, while CBD offers therapeutic benefits without the high.",
          tips: "Start with low THC (5-10%) or balanced THC:CBD ratios for your first experience."
        },
        {
          id: 3,
          title: "Terpene Profiles",
          content: "Terpenes affect both flavor and effects. Myrcene is relaxing, limonene is uplifting.",
          tips: "Ask your budtender about terpene profiles to find strains that match your goals."
        },
        {
          id: 4,
          title: "Consumption Methods",
          content: "Different methods have different onset times: smoking (immediate), edibles (30-120 minutes).",
          warnings: "Never drive after consuming. Effects from edibles can last 4-8 hours."
        }
      ]
    }
  ];

  const educationCategories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "legal", name: "Legal Guidelines", icon: Award },
    { id: "culture", name: "Culture & Etiquette", icon: Users },
    { id: "products", name: "Products & Strains", icon: Leaf },
    { id: "safety", name: "Safety & Transport", icon: Shield },
    { id: "tourism", name: "Tourism Planning", icon: MapPin },
  ];

  const filteredGuides = educationGuides.filter(guide => {
    const matchesCategory = selectedEducationCategory === "all" || guide.category === selectedEducationCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-battles-gold hover:text-battles-gold/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-battles-gold">Back to Home</span>
              </Button>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-battles-gold" />
                <h1 className="text-2xl font-bold text-battles-gold">Community & Education</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => setShowCreatePost(true)}
                    className="bg-battles-gold text-black hover:bg-battles-gold/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-black">New Post</span>
                  </Button>
                  <Button 
                    onClick={() => setShowCalendar(true)}
                    variant="outline"
                    className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-battles-gold hover:text-black">Schedule Call</span>
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', '/community');
                    setLocation('/login');
                  }}
                  className="bg-battles-gold text-black hover:bg-battles-gold/90"
                >
                  <span className="text-black">Login to Participate</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-700">
            <TabsTrigger value="forum" className="data-[state=active]:bg-[hsl(51,100%,50%)] data-[state=active]:text-black text-[hsl(51,100%,50%)] hover:bg-[hsl(51,100%,50%)]/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-[hsl(51,100%,50%)] data-[state=active]:text-black text-[hsl(51,100%,50%)] hover:bg-[hsl(51,100%,50%)]/10">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-[hsl(51,100%,50%)] data-[state=active]:text-black text-[hsl(51,100%,50%)] hover:bg-[hsl(51,100%,50%)]/10">
              <Calendar className="h-4 w-4 mr-2" />
              Expert Sessions
            </TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Forum Sidebar */}
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
              </div>

              {/* Forum Posts */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {posts.map((post: ForumPost) => (
                    <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-battles-gold/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-battles-gold text-black text-xs">
                                  {getInitials(post.author.firstName, post.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{post.author.firstName} {post.author.lastName}</p>
                                <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                              </div>
                              {post.category && (
                                <Badge 
                                  style={{ backgroundColor: post.category.color }}
                                  className="text-black text-xs"
                                >
                                  {post.category.name}
                                </Badge>
                              )}
                            </div>
                            <Link href={`/community/posts/${post.id}`}>
                              <h3 className="text-lg font-semibold text-battles-gold hover:text-battles-gold/80 cursor-pointer mb-2">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.viewCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likeCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.replyCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="mt-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search guides, topics, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <Select value={selectedEducationCategory} onValueChange={setSelectedEducationCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {educationCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <Card key={guide.id} className="bg-gray-900 border-gray-700 hover:border-battles-gold/30 transition-colors">
                    <div className="relative">
                      <img 
                        src={guide.thumbnail}
                        alt={guide.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-2 right-2 ${
                        guide.difficulty === 'Beginner' ? 'bg-green-600' :
                        guide.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-battles-gold mb-2">{guide.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {guide.duration}
                        </div>
                        <div className="flex gap-1">
                          {guide.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => setSelectedGuide(guide)}
                        className="w-full bg-battles-gold text-black hover:bg-battles-gold/90"
                      >
                        Start Guide
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Schedule Expert Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Session Types</label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-battles-gold" />
                            <div>
                              <h4 className="font-medium">Cannabis Education</h4>
                              <p className="text-sm text-gray-400">Learn about strains, effects, and consumption methods</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-battles-gold" />
                            <div>
                              <h4 className="font-medium">Group Experience Planning</h4>
                              <p className="text-sm text-gray-400">Plan your cannabis tourism experience</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-3">
                            <Leaf className="h-5 w-5 text-battles-gold" />
                            <div>
                              <h4 className="font-medium">Product Consultation</h4>
                              <p className="text-sm text-gray-400">Get personalized product recommendations</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowCalendar(true)}
                    className="w-full bg-battles-gold text-black hover:bg-battles-gold/90"
                  >
                    Request Session
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Upcoming Community Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-battles-gold" />
                        <h4 className="font-medium">Cannabis 101 Workshop</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Learn the basics of cannabis consumption and safety</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Next Saturday, 2:00 PM - 4:00 PM
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-battles-gold" />
                        <h4 className="font-medium">Community Q&A Session</h4>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Ask questions and connect with other community members</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Every Tuesday, 7:00 PM - 8:00 PM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Create New Post</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share your thoughts, questions, or experiences with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white min-h-32"
            />
            <Input
              placeholder="YouTube video URL (optional)"
              value={newPost.videoUrl}
              onChange={(e) => setNewPost({ ...newPost, videoUrl: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Select value={newPost.categoryId} onValueChange={(value) => setNewPost({ ...newPost, categoryId: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select a category (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {categories.map((category: ForumCategory) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Request Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Request Expert Session</DialogTitle>
            <DialogDescription className="text-gray-400">
              Schedule a personalized session with our cannabis experts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Your name"
              value={meetingRequest.name}
              onChange={(e) => setMeetingRequest({ ...meetingRequest, name: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Input
              placeholder="Email address"
              type="email"
              value={meetingRequest.email}
              onChange={(e) => setMeetingRequest({ ...meetingRequest, email: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Textarea
              placeholder="What would you like to discuss? (e.g., strain selection, consumption methods, tourism planning)"
              value={meetingRequest.topic}
              onChange={(e) => setMeetingRequest({ ...meetingRequest, topic: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Input
              type="datetime-local"
              value={meetingRequest.preferredDate}
              onChange={(e) => setMeetingRequest({ ...meetingRequest, preferredDate: e.target.value })}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Select value={meetingRequest.duration} onValueChange={(value) => setMeetingRequest({ ...meetingRequest, duration: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Session duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button 
                onClick={handleRequestMeeting}
                disabled={requestMeetingMutation.isPending}
                className="bg-battles-gold text-black hover:bg-battles-gold/90"
              >
                {requestMeetingMutation.isPending ? "Sending..." : "Send Request"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guide Viewer Dialog */}
      {selectedGuide && (
        <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-battles-gold text-xl">{selectedGuide.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Badge className={`${
                  selectedGuide.difficulty === 'Beginner' ? 'bg-green-600' :
                  selectedGuide.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {selectedGuide.difficulty}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedGuide.duration}
                </span>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Step {currentStep + 1} of {selectedGuide.steps.length}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-battles-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / selectedGuide.steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current step content */}
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-battles-gold mb-4">
                    {selectedGuide.steps[currentStep].title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {selectedGuide.steps[currentStep].content}
                  </p>
                  
                  {selectedGuide.steps[currentStep].tips && (
                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-300 text-sm">Pro Tip</h4>
                          <p className="text-blue-200 text-sm">{selectedGuide.steps[currentStep].tips}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedGuide.steps[currentStep].warnings && (
                    <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-red-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-300 text-sm">Important</h4>
                          <p className="text-red-200 text-sm">{selectedGuide.steps[currentStep].warnings}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="border-gray-600 text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < selectedGuide.steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-battles-gold text-black hover:bg-battles-gold/90"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedGuide(null);
                      setCurrentStep(0);
                      toast({ description: "Guide completed! Great job learning." });
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Guide
                    <Award className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}