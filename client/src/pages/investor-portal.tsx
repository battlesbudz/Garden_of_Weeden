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
import Navigation from "@/components/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertInvestorMessageSchema, type InsertInvestorMessage, type InvestorMessage } from "@shared/schema";
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
  CheckCircle2
} from "lucide-react";

export default function InvestorPortal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showInvestorLogin, setShowInvestorLogin] = useState(false);
  const queryClient = useQueryClient();

  // Query for user's own messages
  const { data: userMessages = [], isLoading: messagesLoading } = useQuery<InvestorMessage[]>({
    queryKey: ["/api/investor/my-messages"],
    enabled: isAuthenticated,
  });

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

  // Investor Login Modal for non-authenticated users
  const InvestorLoginModal = () => (
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
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold w-full"
          >
            Sign In as Investor
          </Button>
          <Button 
            onClick={() => setShowInvestorLogin(false)}
            variant="outline"
            className="w-full border-battles-gold text-battles-gold"
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
    capitalRaised: "Early investment secured",
    nextMilestone: "Site approval completion"
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {showInvestorLogin && <InvestorLoginModal />}
      
      {/* Use consistent navigation across all pages */}
      <Navigation />

      {/* Main Content - starts right after navigation */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Investor Access Section */}
        <div className="text-center mb-8">
          {isAuthenticated ? (
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-battles-gold">Battles Budz Investor Portal</h1>
              <p className="text-lg text-gray-300">Licensed NY Cannabis Microbusiness</p>
              <Badge className="bg-battles-gold text-black text-lg px-6 py-3">
                <Shield className="h-5 w-5 mr-2" />
                Investor Access
              </Badge>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-battles-gold">Battles Budz Investment Opportunity</h1>
              <p className="text-lg text-gray-300">Seeking $1M investment for 10% equity</p>
              <Button 
                onClick={() => setShowInvestorLogin(true)}
                className="bg-black text-battles-gold hover:bg-gray-800 text-xl md:text-2xl px-8 md:px-16 py-4 md:py-6 h-auto font-bold shadow-2xl border-2 border-battles-gold"
                size="lg"
              >
                <Shield className="h-6 w-6 md:h-8 md:w-8 mr-3 md:mr-4" />
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
              <p className="text-sm text-gray-400 mt-1">Pending final OCM approval</p>
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
        <Tabs defaultValue={isAuthenticated ? "dashboard" : "about"} className="space-y-6">
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
              
              {/* Authenticated tabs - only visible when logged in */}
              {isAuthenticated && (
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold">Investment Opportunity</CardTitle>
                    <CardDescription className="text-gray-300">Premium cannabis microbusiness seeking funding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-white">$1,000,000</p>
                      <p className="text-gray-400">Funding Target</p>
                    </div>
                    <div>
                      <p className="text-xl text-white">10%</p>
                      <p className="text-gray-400">Equity Offered</p>
                    </div>
                    <div>
                      <p className="text-lg text-green-400">Licensed & Ready</p>
                      <p className="text-gray-400">NY OCM approved microbusiness</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-battles-gold">
                  <CardHeader>
                    <CardTitle className="text-battles-gold">Why Battles Budz?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300">Licensed NY microbusiness with all four verticals</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300">Veteran-owned with proven leadership team</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300">Premium location in Gloversville, NY</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-battles-gold rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300">Unique consumption lounge experience</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Large Access Button - covers more space */}
              <div className="mt-8">
                <Card className="bg-gray-900 border-battles-gold">
                  <CardContent className="p-4 sm:p-8 text-center">
                    <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-battles-gold mx-auto mb-4 sm:mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold text-battles-gold mb-4">Ready to Access Full Investor Portal?</h3>
                    <p className="text-gray-300 mb-6 max-w-md mx-auto">
                      Get exclusive access to detailed financials, business documents, progress updates, and secure investor communications.
                    </p>
                    <Button 
                      onClick={() => setShowInvestorLogin(true)}
                      className="bg-battles-gold text-black hover:bg-yellow-600 text-sm sm:text-lg md:text-xl px-4 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 h-auto font-bold w-full sm:w-auto"
                      size="lg"
                    >
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="truncate">Access Full Investor Portal</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Authenticated Dashboard Tab */}
          {isAuthenticated && (
            <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Business Progress</CardTitle>
                  <CardDescription className="text-gray-300">Key milestones and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">License Approval</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">Site Approval</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200">Funding Round</span>
                      <span className="text-blue-400">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-300">Latest business developments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-battles-gold pl-4">
                      <p className="font-medium text-gray-200">Provisional License Approved</p>
                      <p className="text-sm text-gray-400">OCM approved microbusiness license</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-medium text-gray-200">First Investment Secured</p>
                      <p className="text-sm text-gray-400">Early investor commitment received</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Mission</h4>
                    <p className="text-gray-300">
                      To provide premium, small-batch cannabis products with a focus on landrace strains 
                      and an elevated consumption experience through our on-site lounge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Business Model</h4>
                    <p className="text-gray-300">
                      All-in-one microbusiness: Cultivation, Processing, Retail, and On-site Consumption. 
                      Targeting connoisseur market with organic production and unique strains.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Expansion Strategy</h4>
                    <p className="text-gray-300">
                      Franchise model for scaling, potential syndication opportunities, 
                      MSO aspirations with IPO as long-term goal.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Leadership Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-200">Justin Battles</h4>
                    <p className="text-battles-gold text-sm mb-2">Founder & CEO</p>
                    <p className="text-gray-300 text-sm">
                      Army veteran with formal cannabis horticulture education. 
                      Experienced cultivator focused on landrace strains and organic production methods.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-200">Andrea Battles</h4>
                    <p className="text-battles-gold text-sm mb-2">Chief Operating Officer</p>
                    <p className="text-gray-300 text-sm">
                      15 years in sales and customer service. Cannabis advocate with personal experience 
                      using cannabis for PTSD and bipolar management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab - Authenticated Only */}
          {isAuthenticated && (
            <TabsContent value="documents" className="space-y-6">
              <Card className="bg-gray-900 border-battles-gold w-full max-w-none">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Investor Documents</CardTitle>
                  <CardDescription className="text-gray-300">Legal documents and business materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-700 rounded-lg w-full gap-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="h-8 w-8 text-battles-gold flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white">Financial Projections</p>
                          <p className="text-sm text-gray-400">Revenue models and growth projections</p>
                          <p className="text-xs text-yellow-400 mt-1">⚠️ Pending final facility approval data</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-battles-gold text-black hover:bg-yellow-600">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-700 rounded-lg w-full gap-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="h-8 w-8 text-battles-gold flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white">Business License Documentation</p>
                          <p className="text-sm text-gray-400">OCM License OCMMICR-2023-000258</p>
                          <p className="text-xs text-green-400 mt-1">✓ All four verticals approved</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-battles-gold text-black hover:bg-yellow-600">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Financials Tab - Authenticated Only */}
          {isAuthenticated && (
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
                      <p className="text-lg text-green-400">Early Investment Secured</p>
                      <p className="text-gray-400">First investor commitment received</p>
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

          {/* Updates Tab - Authenticated Only */}
          {isAuthenticated && (
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

          {/* Messages Tab - Authenticated Only */}
          {isAuthenticated && (
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

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Company Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-battles-gold mx-auto mb-2" />
                        <p className="text-gray-400">Pitch Video</p>
                        <p className="text-sm text-gray-500">Coming Soon</p>
                      </div>
                    </div>
                    <Button className="w-full bg-battles-gold text-black hover:bg-yellow-600">
                      Watch Introduction Video
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Media Appearances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 text-gray-200">Cannabis Industry Podcast</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Discussion on veteran entrepreneurship in cannabis
                      </p>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        Listen Now
                      </Button>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 text-gray-200">Local Business Feature</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Coverage of Battles Budz in local Gloversville media
                      </p>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        Read Article
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
            <CardTitle className="text-battles-gold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Investor Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-battles-gold text-black hover:bg-yellow-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message to Team
              </Button>
              <Button variant="outline" className="flex-1 border-battles-gold text-battles-gold">
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
    </div>
  );
}