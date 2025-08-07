import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navigation from "@/components/navigation";
import InvestorAccessRequestForm from "@/components/investor-access-request-form";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle, CANNABIS_KEYWORDS } from "@/utils/seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertInvestorMessageSchema, type InsertInvestorMessage, type InvestorMessage } from "@shared/schema";
import battlesLogo from "@assets/BattlesBudz_Logo_1752301078028.png";
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  MessageCircle, 
  Video, 
  Shield,
  Calendar,
  DollarSign,
  MapPin,
  Award,
  Download,
  Eye,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Lock,
  Trophy,
  Newspaper,
  Mic,
  Users2,
  ExternalLink,
  Star,
  Play
} from "lucide-react";

export default function InvestorPortal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showInvestorLogin, setShowInvestorLogin] = useState(false);
  const [showAccessRequestForm, setShowAccessRequestForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const queryClient = useQueryClient();

  // Check if authenticated user has investor access
  const { data: accessCheck, isLoading: accessLoading } = useQuery<{ hasAccess: boolean }>({
    queryKey: ["/api/investor/check-access"],
    enabled: isAuthenticated,
  });

  const hasInvestorAccess = accessCheck?.hasAccess || false;

  // Load Calendly script when modal opens
  useEffect(() => {
    if (showCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendly]);

  // Query for user's own messages
  const { data: userMessages = [], isLoading: messagesLoading } = useQuery<InvestorMessage[]>({
    queryKey: ["/api/investor/my-messages"],
    enabled: isAuthenticated,
  });

  // Query for investor documents
  const { data: documentsData, isLoading: documentsLoading } = useQuery<{ documents: any[] }>({
    queryKey: ["/api/investor-docs/list"],
    enabled: isAuthenticated && hasInvestorAccess,
  });

  const investorDocuments = documentsData?.documents || [];

  // Message form for authenticated investors
  const messageForm = useForm<InsertInvestorMessage>({
    resolver: zodResolver(insertInvestorMessageSchema.extend({
      subject: insertInvestorMessageSchema.shape.subject.min(1, "Subject is required"),
      message: insertInvestorMessageSchema.shape.message.min(10, "Message must be at least 10 characters"),
    })),
    defaultValues: {
      investorId: user?.id || "",
      investorName: user ? `${user.firstName} ${user.lastName}` : "",
      investorEmail: user?.email || "",
      subject: "",
      message: "",
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (data: InsertInvestorMessage) => {
      await apiRequest("POST", "/api/investor/message", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the Battles Budz team. We'll respond within 24 hours.",
      });
      messageForm.reset({
        investorId: user?.id || "",
        investorName: user ? `${user.firstName} ${user.lastName}` : "",
        investorEmail: user?.email || "",
        subject: "",
        message: "",
      });
      // Refresh messages to show the new message
      queryClient.invalidateQueries({ queryKey: ["/api/investor/my-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update form defaults when user data changes
  useEffect(() => {
    if (user && messageForm) {
      messageForm.reset({
        investorId: user.id,
        investorName: `${user.firstName} ${user.lastName}`,
        investorEmail: user.email || "",
        subject: "",
        message: "",
      });
    }
  }, [user, messageForm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-battles-gold text-xl">Loading investor portal...</div>
      </div>
    );
  }

  // Investor Access Modal for non-authenticated users
  const InvestorAccessModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-black border-battles-gold">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-battles-gold mx-auto mb-4" />
          <CardTitle className="text-2xl font-playfair text-battles-gold">
            Investor Portal Access
          </CardTitle>
          <p className="text-white/80">
            Access detailed financials, documents, and exclusive investor updates
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-300">Already an approved investor?</p>
            <Button 
              onClick={() => {
                // Pass redirect URL as query parameter
                window.location.href = '/api/login?redirect=/investors';
              }}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold w-full"
            >
              <Shield className="h-4 w-4 mr-2" />
              Sign In to Portal
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-300">New to Battles Budz?</p>
            <Button 
              onClick={() => {
                setShowInvestorLogin(false);
                setShowAccessRequestForm(true);
              }}
              variant="outline"
              className="w-full border-battles-gold text-battles-gold hover:bg-battles-gold/10"
            >
              <Lock className="h-4 w-4 mr-2" />
              Request Investor Access
            </Button>
          </div>

          <Button 
            onClick={() => setShowInvestorLogin(false)}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Investor portal stats (using real data for Battles Budz)
  const businessStats = {
    licenseStatus: "Provisional - Approved",
    licenseNumber: "OCMMICR-2023-000258",
    location: "19 North Main Street, Gloversville, NY",
    fundingRound: "$1M for 10% equity",
    capitalRaised: "Funding in progress",
    nextMilestone: "Site approval completion"
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {showInvestorLogin && <InvestorAccessModal />}
      {showAccessRequestForm && (
        <InvestorAccessRequestForm onClose={() => setShowAccessRequestForm(false)} />
      )}
      
      {/* Use consistent navigation across all pages */}
      <Navigation />

      {/* Main Content - starts right after navigation */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Investor Access Section */}
        <div className="text-center mb-8 py-8 sm:py-12">
          {isAuthenticated ? (
            accessLoading ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  <img src={battlesLogo} alt="Battles Budz Logo" className="h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 object-contain drop-shadow-2xl" />
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-battles-gold px-4">Checking access...</h1>
                </div>
              </div>
            ) : hasInvestorAccess ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  <img src={battlesLogo} alt="Battles Budz Logo" className="h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 object-contain drop-shadow-2xl" />
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-battles-gold px-4">Battles Budz Investor Portal</h1>
                </div>
                <p className="text-base sm:text-lg text-gray-300 px-4">Licensed NY Cannabis Microbusiness</p>
                <Badge className="bg-battles-gold text-black text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Investor Access Approved
                </Badge>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  <img src={battlesLogo} alt="Battles Budz Logo" className="h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 object-contain drop-shadow-2xl" />
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-battles-gold px-4">Access Not Approved</h1>
                </div>
                <div className="max-w-md mx-auto text-center space-y-4">
                  <p className="text-gray-300">
                    Your account doesn't have approved investor access yet. Please contact us or submit a request to gain access to the investor portal.
                  </p>
                  <Button 
                    onClick={() => setShowAccessRequestForm(true)}
                    className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Request Investor Access
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col items-center space-y-6">
                <img src={battlesLogo} alt="Battles Budz Logo" className="h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 object-contain drop-shadow-2xl" />
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-battles-gold px-4">Battles Budz Investment Opportunity</h1>
              </div>
              <Button 
                onClick={() => setShowInvestorLogin(true)}
                className="bg-black text-battles-gold hover:bg-gray-800 text-lg sm:text-xl lg:text-2xl px-6 sm:px-8 lg:px-16 py-3 sm:py-4 lg:py-6 h-auto font-bold shadow-2xl border-2 border-battles-gold mx-4"
                size="lg"
              >
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 sm:mr-3 lg:mr-4" />
                Access Investor Portal
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-battles-gold">
            <CardHeader>
              <CardTitle className="text-battles-gold flex items-center">
                <Award className="h-5 w-5 mr-2" />
                License Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">{businessStats.licenseStatus}</p>
              <p className="text-sm text-gray-400 mt-1">{businessStats.licenseNumber}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-battles-gold">
            <CardHeader>
              <CardTitle className="text-battles-gold flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-200">{businessStats.location}</p>
              <p className="text-sm text-gray-400 mt-1">OCM License: OCMMICR-2023-000258</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-battles-gold">
            <CardHeader>
              <CardTitle className="text-battles-gold flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Current Round
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-200">{businessStats.fundingRound}</p>
              <p className="text-sm text-gray-400 mt-1">{businessStats.capitalRaised}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <>
        {/* Logo before tabs */}
        <div className="flex justify-center mb-6">
          <img src={battlesLogo} alt="Battles Budz Logo" className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain drop-shadow-xl" />
        </div>

        <Tabs defaultValue={isAuthenticated && hasInvestorAccess ? "dashboard" : "about"} className="space-y-6">
          <div className="w-full overflow-hidden">
            <TabsList className="flex w-full justify-start overflow-x-auto bg-gray-900 p-1 h-auto min-h-[40px] no-scrollbar">
              {/* Public tabs - always visible */}
              {!isAuthenticated && (
                <TabsTrigger value="overview" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                  Overview
                </TabsTrigger>
              )}
              <TabsTrigger value="about" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                About
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Media
              </TabsTrigger>
              
              {/* Investor tabs - only visible when logged in AND has investor access */}
              {isAuthenticated && hasInvestorAccess && (
                <>
                  <TabsTrigger value="dashboard" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="financials" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                    Financials
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                    Updates
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                    Messages
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {/* Public Overview Tab - Only for non-authenticated users */}
          {!isAuthenticated && (
            <TabsContent value="overview" className="space-y-6">
              {/* Hero Section */}
              <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-battles-gold">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img src={battlesLogo} alt="Battles Budz Logo" className="h-24 w-24 object-contain drop-shadow-xl" />
                  </div>
                  <CardTitle className="text-3xl font-playfair text-battles-gold mb-2">
                    Investment Opportunity
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg max-w-2xl mx-auto">
                    A premier cannabis microbusiness opportunity in New York's regulated market. 
                    Licensed, veteran-owned, and ready for growth.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Key Investment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-battles-gold text-center">
                  <CardContent className="p-6">
                    <DollarSign className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">$1,000,000</p>
                    <p className="text-gray-400">Funding Target</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-battles-gold text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">10%</p>
                    <p className="text-gray-400">Equity Offered</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-battles-gold text-center">
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                    <p className="text-lg font-bold text-green-400">Licensed & Ready</p>
                    <p className="text-gray-400">NY OCM Approved</p>
                  </CardContent>
                </Card>
              </div>

              {/* Business Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <Trophy className="h-6 w-6 mr-2" />
                      Key Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-white">Provisional License Secured</h4>
                      <p className="text-sm text-gray-300">OCM License: OCMMICR-2023-000258</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-white">SDVOB Certified</h4>
                      <p className="text-sm text-gray-300">Service-Disabled Veteran-Owned Business</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold text-white">Premium Facility Secured</h4>
                      <p className="text-sm text-gray-300">7,600 sq ft in Gloversville, NY</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <Star className="h-6 w-6 mr-2" />
                      Competitive Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Full vertical integration: cultivation, processing, retail, and consumption lounge</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Veteran leadership with proven business acumen</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Tourism destination with unique consumption experiences</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Proprietary product lines with premium positioning</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product Portfolio Highlight */}
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center">
                    <Building2 className="h-6 w-6 mr-2" />
                    Signature Product Lines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-battles-gold mb-2">Battle Brew</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Proprietary, full-spectrum cannabis-infused sweet tea engineered to deliver unmatched flavor and bioavailability without traditional nanoemulsion. Positioned as a market disruptor in the fastest-growing infused beverage segment, Battle Brew commands over 4× premium pricing compared to leading competitors.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-battles-gold mb-2">Cosmic Chewz</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Proprietary hard candy with a chewy, Starburst-like center infused with full-spectrum RSO. Each piece delivers 10 mg precision dosing and long shelf stability while providing effective pain relief. Cosmic Chewz combine consumer-friendly format with high-margin scalability across medical and adult-use markets.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-battles-gold mb-2">Freedom Fog Vapes</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Premium distillate vape line utilizing proprietary terpene ratio formulations to deliver enhanced flavor, smoother draw, and optimized effects. Positioned to capture share in the fastest-growing product category while maintaining superior unit economics.
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-battles-gold mb-2">Craft Cannabis</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Premium boutique hand-rolled joints and 2 g non-tobacco leaf blunts with glass tips, made exclusively with premium organic flower. Designed as connoisseur-grade SKUs that reinforce the Battles Budz brand ethos of small-batch, craft-quality cannabis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Model & Experience */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <Users2 className="h-6 w-6 mr-2" />
                      Unique Experience Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">
                      Beyond traditional dispensary retail, Battles Budz offers a comprehensive cannabis tourism destination:
                    </p>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <span className="text-battles-gold mr-2">•</span>
                        VIP consumption lounge with live entertainment
                      </li>
                      <li className="flex items-start">
                        <span className="text-battles-gold mr-2">•</span>
                        Educational tours of cultivation operations
                      </li>
                      <li className="flex items-start">
                        <span className="text-battles-gold mr-2">•</span>
                        Blunt & Breakfast Airbnb experiences
                      </li>
                      <li className="flex items-start">
                        <span className="text-battles-gold mr-2">•</span>
                        Table-side service and arcade gaming
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <MapPin className="h-6 w-6 mr-2" />
                      Strategic Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">
                      <strong>19 North Main Street, Gloversville, NY</strong>
                    </p>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• 7,600 sq ft facility with dedicated areas for:</p>
                      <p className="ml-4">- Cultivation and processing</p>
                      <p className="ml-4">- Retail dispensary operations</p>
                      <p className="ml-4">- Consumption lounge and entertainment</p>
                      <p className="ml-4">- Secure storage and fulfillment</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Positioned to serve both local markets and cannabis tourism from NYC and Albany metro areas.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-battles-gold">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <img src={battlesLogo} alt="Battles Budz Logo" className="h-20 w-20 object-contain drop-shadow-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-battles-gold mb-4">Ready to Join Our Journey?</h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Access detailed financials, business documents, progress updates, and exclusive investor communications in our secure portal.
                  </p>
                  <Button 
                    onClick={() => setShowInvestorLogin(true)}
                    className="bg-battles-gold text-black hover:bg-yellow-600 text-lg px-8 py-4 h-auto font-bold"
                    size="lg"
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Access Full Investor Portal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Dashboard Tab - Approved Investors Only */}
          {isAuthenticated && hasInvestorAccess && (
            <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <img src={battlesLogo} alt="Battles Budz Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-xl flex-shrink-0" />
                    <div>
                      <CardTitle className="text-battles-gold text-xl sm:text-2xl">Business Progress</CardTitle>
                      <CardDescription className="text-gray-300">Key milestones and achievements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">Provisional Microbusiness License</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">OCM Location Approval</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">Funding Round ($15K of $1M)</span>
                      <span className="text-blue-400">1.5%</span>
                    </div>
                    <Progress value={1.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <img src={battlesLogo} alt="Battles Budz Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-xl flex-shrink-0" />
                    <div>
                      <CardTitle className="text-battles-gold text-xl sm:text-2xl">Recent Activity</CardTitle>
                      <CardDescription className="text-gray-300">Latest business developments</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-battles-gold pl-4">
                      <p className="font-medium text-gray-200">Provisional License Approved</p>
                      <p className="text-sm text-gray-400">OCM approved microbusiness license</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-medium text-gray-200">Family Round Investment Secured</p>
                      <p className="text-sm text-gray-400">Initial family funding commitment received</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-gray-200">Site Selection Confirmed</p>
                      <p className="text-sm text-gray-400">19 North Main Street, Gloversville, NY</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <div className="flex items-center gap-4 mb-3">
                  <img src={battlesLogo} alt="Battles Budz Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain drop-shadow-xl flex-shrink-0" />
                  <CardTitle className="text-battles-gold text-xl sm:text-2xl">About Battles Budz</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-battles-gold mb-3">Mission Statement</h4>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    "To provide high-quality cannabis products while creating a fun, holistic experience through education and comfortable surroundings."
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-battles-gold mb-3">Business Model</h4>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Battles Budz is a licensed cannabis microbusiness in Gloversville, NY. We are fully vertically integrated with cultivation, processing, retail, delivery, and on-site consumption all under one license.
                    </p>
                    
                    <div>
                      <h5 className="font-medium text-battles-gold mb-2">Products & Manufacturing</h5>
                      <p className="text-gray-300 mb-4">
                        As part of Battles Budz' vertically integrated model, these products represent proprietary IP assets designed for scalability, premium positioning, and brand differentiation across multiple high-growth cannabis segments.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium text-battles-gold">Battle Brew</p>
                          <p className="text-gray-300 text-sm">
                            A proprietary, shelf-stable cannabis-infused southern-style sweet tea formulated to deliver exceptional taste in a market dominated by distillate-based beverages. Unlike traditional nanoemulsions, Battle Brew maintains full-spectrum infusion with strong bioavailability while offering a superior flavor profile. This formulation allows the product to command a premium price point—over four times higher than leading competitors—while positioning the brand as a category disruptor in the infused beverage space.
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-battles-gold">Cosmic Chewz</p>
                          <p className="text-gray-300 text-sm">
                            A proprietary candy line featuring a chewy center infused with full-spectrum RSO. Designed for long shelf stability and precision dosing at 10 mg per piece, Cosmic Chewz provide effective pain relief in a consumer-friendly format. The combination of medicinal value, broad appeal, and high-margin scalability makes this SKU a cornerstone of the Battles Budz product portfolio.
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-battles-gold">Freedom Fog Vapes</p>
                          <p className="text-gray-300 text-sm">
                            A premium vape line built around terpene preservation and smooth delivery, utilizing proprietary oil formulations. Positioned to capture market share in one of the fastest-growing product segments while reinforcing brand quality.
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-battles-gold">Hand-rolled 1g joints and 2g non-tobacco leaf blunts with glass tips</p>
                          <p className="text-gray-300 text-sm">
                            Boutique, connoisseur-grade SKUs crafted in-house to showcase premium flower quality and reinforce the brand's small-batch craftsmanship ethos.
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-battles-gold">Premium rosin</p>
                          <p className="text-gray-300 text-sm">
                            A solventless extraction line delivering full-spectrum flavor and potency. Supports vertical integration, premium positioning, and differentiation in the craft cannabis market.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-battles-gold mb-2">Consumption Lounge & Tourism</h5>
                      <p>
                        We have a consumption lounge designed as a tourism destination, with VIP experiences, live entertainment, arcade machines, and table-side service. We offer education on organic cultivation and natural farming methods to consumers as part of the experience.
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-battles-gold mb-2">Facility & Operations</h5>
                      <p>
                        Our facility includes a 7,600 sq ft building with cultivation rooms, processing kitchen, hash room, beverage production, candy lab, retail dispensary, fulfillment area, and a secured basement vault.
                      </p>
                      <p className="mt-2">
                        Our cultivation features two flowering rooms, drying and curing areas, and a tissue culture-based nursery with bulletproof glass windows for guests to view.
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-battles-gold mb-2">Unique Experiences</h5>
                      <p>
                        We will have Blunt & Breakfast Airbnb suites overlooking the grow, paired with private tours and premium experiences.
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-battles-gold mb-2">Brand Focus</h5>
                      <p>
                        We are building a premium craft cannabis brand focused on small-batch, connoisseur-quality products and sustainable production.
                      </p>
                    </div>
                    
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab - Approved Investors Only */}
          {isAuthenticated && hasInvestorAccess && (
            <TabsContent value="documents" className="space-y-6">
              <Card className="bg-gray-900 border-battles-gold w-full max-w-none">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Investor Documents</CardTitle>
                  <CardDescription className="text-gray-300">Legal documents and business materials</CardDescription>
                </CardHeader>
                <CardContent>
                  {documentsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-battles-gold">Loading documents...</div>
                    </div>
                  ) : investorDocuments.length === 0 ? (
                    <div className="text-center p-8">
                      <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">No documents available</p>
                      <p className="text-gray-500 text-sm">
                        Documents will appear here once they are assigned to you by an administrator.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {investorDocuments.map((doc: any) => (
                        <div key={doc.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-700 rounded-lg w-full gap-4">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <FileText className="h-8 w-8 text-battles-gold flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-white">{doc.title}</p>
                              <p className="text-sm text-gray-400">{doc.description || "Business document"}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {doc.fileName} • {Math.round(doc.fileSize / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 flex-shrink-0">
                            {doc.canView && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-battles-gold text-battles-gold"
                                onClick={() => window.open(`/api/investor-docs/${doc.id}/download`, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
                            {doc.canDownload && (
                              <Button 
                                size="sm" 
                                className="bg-battles-gold text-black hover:bg-yellow-600"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = `/api/investor-docs/${doc.id}/download`;
                                  link.download = doc.fileName;
                                  link.click();
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Financials Tab - Approved Investors Only */}
          {isAuthenticated && hasInvestorAccess && (
            <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Current Funding Round</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-white">$1,000,000</p>
                      <p className="text-gray-400">Target Amount</p>
                    </div>
                    <div>
                      <p className="text-xl text-white">10%</p>
                      <p className="text-gray-400">Equity Offered</p>
                    </div>
                    <div>
                      <p className="text-lg text-battles-gold">Funding Active</p>
                      <p className="text-gray-400">Seeking strategic investors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Use of Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-200">Facility Build-out</span>
                      <span className="text-battles-gold">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200">Initial Inventory</span>
                      <span className="text-battles-gold">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200">Manufacturing Equipment</span>
                      <span className="text-battles-gold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-200">Marketing & Operations</span>
                      <span className="text-battles-gold">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Financial Projections</CardTitle>
                <CardDescription className="text-yellow-400">
                  ⚠️ Projections pending final data input - Conservative estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 italic">
                  Detailed financial projections and revenue models will be provided upon completion 
                  of site approval and facility planning. Current estimates are based on industry 
                  benchmarks for similar microbusiness operations in New York.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Updates Tab - Approved Investors Only */}
          {isAuthenticated && hasInvestorAccess && (
            <TabsContent value="updates" className="space-y-6">
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Investor Updates</CardTitle>
                <CardDescription className="text-gray-300">Quarterly reports and milestone updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-200">Q4 2024 - License Approval</h4>
                      <span className="text-sm text-gray-400">December 2024</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Successfully obtained provisional microbusiness license from New York OCM. 
                      License number OCMMICR-2023-000258 approved for cultivation, processing, 
                      retail, and on-site consumption.
                    </p>
                    <Badge className="bg-green-900 text-green-300">Milestone Completed</Badge>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-200">Q1 2025 - Site Selection & Early Investment</h4>
                      <span className="text-sm text-gray-400">January 2025</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Secured location at 19 North Main Street, Gloversville, NY. Received first 
                      investor commitment and moving forward with site approval process. 
                      Working on GMP certification requirements.
                    </p>
                    <Badge className="bg-yellow-900 text-yellow-300">In Progress</Badge>
                  </div>

                  <div className="border-l-4 border-gray-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">Q2 2025 - Construction & Build-out</h4>
                      <span className="text-sm text-gray-400">Planned</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Upon completion of funding round, begin facility construction and equipment 
                      installation. Target completion by end of Q2 2025.
                    </p>
                    <Badge className="bg-gray-700 text-gray-300">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Messages Tab - Approved Investors Only */}
          {isAuthenticated && hasInvestorAccess && (
            <TabsContent value="messages" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Send New Message */}
                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send New Message
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Send a message to the Battles Budz team. We'll respond within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...messageForm}>
                      <form onSubmit={messageForm.handleSubmit((data) => messageMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={messageForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter message subject" 
                                  {...field} 
                                  className="bg-gray-800 border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={messageForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your message" 
                                  rows={6} 
                                  {...field} 
                                  className="bg-gray-800 border-gray-700 text-white resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-battles-gold text-black hover:bg-yellow-600"
                          disabled={messageMutation.isPending}
                        >
                          {messageMutation.isPending ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Message History */}
                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Message History
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Your conversation history with the Battles Budz team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {messagesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Clock className="h-6 w-6 animate-spin text-battles-gold mr-2" />
                        <span className="text-gray-400">Loading messages...</span>
                      </div>
                    ) : userMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">No messages yet</p>
                        <p className="text-sm text-gray-500">Send your first message to start the conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {userMessages.map((message) => (
                          <div key={message.id} className="border border-gray-700 rounded-lg p-4 space-y-3">
                            {/* Original Message */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-battles-gold">{message.subject}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={message.status === 'new' ? 'default' : message.status === 'replied' ? 'secondary' : 'outline'}
                                    className={
                                      message.status === 'new' 
                                        ? 'bg-blue-600 text-white' 
                                        : message.status === 'replied' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-600 text-white'
                                    }
                                  >
                                    {message.status === 'new' && 'New'}
                                    {message.status === 'read' && 'Read'}
                                    {message.status === 'replied' && 'Replied'}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Unknown date'}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-300 bg-gray-800 p-3 rounded">{message.message}</p>
                            </div>

                            {/* Admin Reply */}
                            {message.adminReply && (
                              <div className="border-l-4 border-battles-gold pl-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-4 w-4 text-battles-gold" />
                                  <span className="text-sm font-medium text-battles-gold">Team Response</span>
                                  {message.repliedAt && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(message.repliedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-300 bg-gray-800 p-3 rounded border border-battles-gold/20">
                                  {message.adminReply}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Media & Accomplishments Tab */}
          <TabsContent value="media" className="space-y-6">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-battles-gold">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img src={battlesLogo} alt="Battles Budz Logo" className="h-20 w-20 object-contain drop-shadow-xl" />
                </div>
                <CardTitle className="text-3xl font-playfair text-battles-gold mb-2">
                  Media & Accomplishments
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Justin Battles and Battles Budz have established a strong presence in the cannabis industry through strategic business milestones, 
                  media coverage, and thought leadership advocacy.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Business Milestones */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold flex items-center text-2xl">
                  <Trophy className="h-6 w-6 mr-3" />
                  Business Milestones
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Major achievements and operational milestones validating our business model
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-green-400" />
                        Provisional Microbusiness License
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Awarded by the NY OCM, allowing Battles Budz to operate as a fully vertically integrated microbusiness 
                        with cultivation, processing, retail, delivery, and an on-site consumption lounge.
                      </p>
                      <Badge className="bg-green-900 text-green-300 mt-2">OCM License: OCMMICR-2023-000258</Badge>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-400" />
                        Secured Premium Facility
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        7,600 sq. ft. building secured in Gloversville, NY for cultivation, retail, processing, 
                        and VIP consumption lounge operations.
                      </p>
                      <Badge className="bg-blue-900 text-blue-300 mt-2">19 North Main Street</Badge>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
                        First Investor Secured
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Early investor commitments secured, validating the business model and providing 
                        foundation for continued growth and expansion.
                      </p>
                      <Badge className="bg-yellow-900 text-yellow-300 mt-2">Investment Validated</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-purple-400" />
                        Battle Brew Development
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Created "Battle Brew," a southern-style cannabis-infused sweet tea that successfully 
                        passed taste and potency R&D testing phases.
                      </p>
                      <Badge className="bg-purple-900 text-purple-300 mt-2">Product Ready</Badge>
                    </div>

                    <div className="border-l-4 border-battles-gold pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-battles-gold" />
                        B.L.O.O.M. ROC Incubator Graduate
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Graduated from NY's first cannabis social equity incubator with a completed business plan, 
                        investor-ready pitch deck, and comprehensive SOPs.
                      </p>
                      <Badge className="bg-yellow-900 text-battles-gold mt-2">Program Complete</Badge>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6 py-3">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-400" />
                        SDVOB Certification
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Recognized as a certified Service-Disabled Veteran-Owned Business (SDVOB) by New York OGS, 
                        highlighting veteran leadership in cannabis entrepreneurship.
                      </p>
                      <Badge className="bg-green-900 text-green-300 mt-2">NY OGS Certified</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Articles & Press */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold flex items-center text-2xl">
                  <Newspaper className="h-6 w-6 mr-3" />
                  News Articles & Press Coverage
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Media coverage establishing Battles Budz as a thought leader in veteran cannabis advocacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white">Prioritizing Veterans in Cannabis Industry</h4>
                        <Badge className="bg-battles-gold text-black text-xs">March 2023</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Syracuse.com / New York Cannabis Insider</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Guest column by Justin Battles advocating for service-disabled veterans to be prioritized in NY cannabis licensing. 
                        Published on both Syracuse.com and NY Cannabis Insider, establishing thought leadership in equity policy.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                        onClick={() => window.open('https://www.syracuse.com/marijuana/2023/03/prioritizing-veterans-in-the-cannabis-industry-a-call-for-action-guest-column.html', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Article
                      </Button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white">Veterans Push for Cannabis Access</h4>
                        <Badge className="bg-battles-gold text-black text-xs">Jan 25, 2023</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">WWNY News</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        TV news profile of Justin Battles advocating for veteran inclusion in New York's cannabis industry 
                        and highlighting cannabis' role in treating PTSD and chronic pain.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                        onClick={() => window.open('https://www.wwnytv.com/2023/01/25/veterans-push-easier-access-cannabis-licenses/', '_blank')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white">SDVOB Recognition</h4>
                        <Badge className="bg-battles-gold text-black text-xs">Nov 10, 2023</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">New York OGS Press Release</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Battles Budz LLC recognized as a certified Service-Disabled Veteran-Owned Business (SDVOB), 
                        highlighting the company as a veteran-owned, vertically integrated cannabis microbusiness.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                        onClick={() => window.open('https://ogs.ny.gov/news/33-companies-receive-new-york-state-service-disabled-veteran-owned-business-certification', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Release
                      </Button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white">SUNY Cannabis Conference Feature</h4>
                        <Badge className="bg-battles-gold text-black text-xs">Jan 26, 2024</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">New York Weed Report</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Featured Justin Battles and Battles Budz at the SUNY Cannabis Conference, 
                        identifying him among New York's emerging cannabis entrepreneurs.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                        onClick={() => window.open('https://www.newyorkweedreport.com/p/dent-doctors-back-cannabis-for-autism', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Podcasts & Interviews */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold flex items-center text-2xl">
                  <Mic className="h-6 w-6 mr-3" />
                  Podcasts & Interviews
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Industry podcast appearances and interviews showcasing expertise and vision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Mic className="h-8 w-8 text-battles-gold" />
                      <Badge className="bg-battles-gold text-black text-xs">May 8, 2023</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2">NCIA Cannabis Industry Voice</h4>
                    <p className="text-sm text-gray-400 mb-3">Veterans & Cannabis Equity</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Justin Battles featured on NCIA's national podcast, discussing veteran equity 
                      and his journey from Army service to cannabis entrepreneurship.
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-battles-gold text-black hover:bg-yellow-600"
                      onClick={() => window.open('https://thecannabisindustry.org/podcasts/the-cannabis-industry-voice/veterans-and-cannabis-equity-in-new-york/', '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Now
                    </Button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Mic className="h-8 w-8 text-battles-gold" />
                      <Badge className="bg-battles-gold text-black text-xs">Sept 15, 2024</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2">The Funkast (Part 1)</h4>
                    <p className="text-sm text-gray-400 mb-3">Episode 7 - Battles Budz</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Part 1 of two-part interview featuring Justin and Andrea Battles on building a veteran-owned 
                      cannabis business and launching Battles Budz.
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-battles-gold text-black hover:bg-yellow-600"
                      onClick={() => window.open('https://www.audacy.com/podcast/the-funkast-1df2b/episodes/ep-7-part-1-battles-budz-78504', '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Part 1
                    </Button>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-battles-gold transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <Mic className="h-8 w-8 text-battles-gold" />
                      <Badge className="bg-battles-gold text-black text-xs">Sept 22, 2024</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2">The Funkast (Part 2)</h4>
                    <p className="text-sm text-gray-400 mb-3">Episode 8 - Battles Budz</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Part 2 of two-part interview featuring Justin and Andrea Battles on building a veteran-owned 
                      cannabis business and launching Battles Budz.
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-battles-gold text-black hover:bg-yellow-600"
                      onClick={() => window.open('https://podcasts.apple.com/us/podcast/ep-8-part-2-battles-budz/id1755200351?i=1000670334501', '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Part 2
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Advocacy & Social Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Public Advocacy */}
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center text-xl">
                    <Shield className="h-5 w-5 mr-3" />
                    Public Advocacy
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Leadership roles advancing veteran equity in cannabis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-battles-gold">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-battles-gold" />
                      Veterans Committee Co-Chair
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">Cannabis Association of New York</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Justin Battles serves as Co-Chair, advocating for veteran access to licenses, 
                      funding, and affordable products in the cannabis industry.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-battles-gold">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Newspaper className="h-4 w-4 mr-2 text-battles-gold" />
                      Thought Leadership
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">Policy & Equity Advocacy</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The Syracuse.com / NY Cannabis Insider guest column solidified Battles Budz 
                      as a voice in the state's cannabis equity conversation.
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-battles-gold">
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Users2 className="h-4 w-4 mr-2 text-battles-gold" />
                      NY Home Growers Roundtable
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">Host & Moderator (2025)</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      Justin Battles served as host/moderator for statewide panels connecting home growers 
                      with industry experts like Chris Trump and PotentPonics. Demonstrates leadership 
                      and community engagement in the cannabis industry.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black text-xs"
                        onClick={() => window.open('https://youtu.be/XPdq8QmbOXE?si=4K35L4hNlEjqUZ7K', '_blank')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        February Webinar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black text-xs"
                        onClick={() => window.open('https://youtu.be/g47d_dAvo3g?si=7NH_E10d2Sit7Aac', '_blank')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        March Webinar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black text-xs"
                        onClick={() => window.open('https://youtu.be/gwUm5o-pN78?si=rsNkTmCYNCyDxIO7', '_blank')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        April Webinar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </TabsContent>

          {/* Messages Tab - Authenticated Only */}
          {isAuthenticated && (
            <TabsContent value="messages" className="space-y-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Message to Battles Budz Team
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Direct communication with the leadership team - we respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...messageForm}>
                    <form 
                      onSubmit={messageForm.handleSubmit((data) => messageMutation.mutate(data))}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={messageForm.control}
                          name="investorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Your Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-gray-800 border-gray-600 text-white"
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={messageForm.control}
                          name="investorEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Your Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email" 
                                  className="bg-gray-800 border-gray-600 text-white"
                                  disabled
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={messageForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Subject</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="What would you like to discuss?"
                                className="bg-gray-800 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={messageForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={6}
                                placeholder="Share your questions, concerns, or feedback about the investment opportunity..."
                                className="bg-gray-800 border-gray-600 text-white resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={messageMutation.isPending}
                        className="w-full bg-battles-gold text-black hover:bg-yellow-600 font-semibold"
                      >
                        {messageMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Direct Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">For urgent matters, contact the team directly:</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a href="mailto:battlesbudz@gmail.com" className="flex items-center text-battles-gold hover:underline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          battlesbudz@gmail.com
                        </a>
                        <a href="tel:904-415-7635" className="flex items-center text-battles-gold hover:underline">
                          <Calendar className="h-4 w-4 mr-2" />
                          (904) 415-7635
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Contact Section */}
        <Card className="bg-gray-900 border-battles-gold mt-8">
          <CardHeader>
            <div className="flex flex-col items-center text-center gap-6 mb-6">
              <img src={battlesLogo} alt="Battles Budz Logo" className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 object-contain drop-shadow-2xl" />
              <CardTitle className="text-battles-gold flex items-center text-2xl sm:text-3xl lg:text-4xl">
                <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 mr-4" />
                Investor Communication
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-battles-gold text-black hover:bg-yellow-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message to Team
              </Button>
              <Button 
                onClick={() => setShowCalendly(true)}
                variant="outline" 
                className="flex-1 border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300">
                For urgent matters, contact Justin Battles directly at{" "}
                <a href="mailto:battlesbudz@gmail.com" className="text-battles-gold hover:underline">
                  battlesbudz@gmail.com
                </a>{" "}
                or call{" "}
                <a href="tel:904-415-7635" className="text-battles-gold hover:underline">
                  (904) 415-7635
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        </>
      </div>

      {/* Calendly Modal */}
      <Dialog open={showCalendly} onOpenChange={setShowCalendly}>
        <DialogContent className="max-w-4xl w-full h-[80vh] bg-white">
          <DialogHeader>
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <img src={battlesLogo} alt="Battles Budz Logo" className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain drop-shadow-2xl" />
              <DialogTitle className="text-black text-xl sm:text-2xl lg:text-3xl font-bold">Schedule a Meeting with Battles Budz</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/battlesbudz?hide_gdpr_banner=1" 
              style={{ minWidth: '320px', height: '100%', width: '100%' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}