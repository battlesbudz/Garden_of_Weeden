import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Eye
} from "lucide-react";

export default function InvestorPortal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need investor access to view this portal. Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-battles-gold text-xl">Loading investor portal...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting
  }

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
      {/* Header */}
      <div className="bg-gradient-to-r from-battles-gold to-yellow-600 text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Battles Budz Investor Portal</h1>
              <p className="text-lg mt-2">Licensed NY Cannabis Microbusiness</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Welcome back</p>
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <Badge className="mt-2 bg-black text-battles-gold">
                <Shield className="h-3 w-3 mr-1" />
                Investor Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="container mx-auto px-4 py-8">
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
              <p className="text-lg">{businessStats.location}</p>
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
              <p className="text-lg">{businessStats.fundingRound}</p>
              <p className="text-sm text-gray-400 mt-1">{businessStats.capitalRaised}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-gray-900">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              About
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              Documents
            </TabsTrigger>
            <TabsTrigger value="financials" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              Financials
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              Updates
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black">
              Media
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Business Progress</CardTitle>
                  <CardDescription>Key milestones and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>License Approval</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Site Approval</span>
                      <span className="text-yellow-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Funding Round</span>
                      <span className="text-blue-400">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Recent Activity</CardTitle>
                  <CardDescription>Latest business developments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-battles-gold pl-4">
                      <p className="font-medium">Provisional License Approved</p>
                      <p className="text-sm text-gray-400">OCM approved microbusiness license</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <p className="font-medium">First Investment Secured</p>
                      <p className="text-sm text-gray-400">Early investor commitment received</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium">Site Selection Confirmed</p>
                      <p className="text-sm text-gray-400">19 North Main Street, Gloversville, NY</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                    <h4 className="font-semibold text-lg">Justin Battles</h4>
                    <p className="text-battles-gold text-sm mb-2">Founder & CEO</p>
                    <p className="text-gray-300 text-sm">
                      Army veteran with formal cannabis horticulture education. 
                      Experienced cultivator focused on landrace strains and organic production methods.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Andrea Battles</h4>
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

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Investor Documents</CardTitle>
                <CardDescription>Legal documents and business materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">MIPA (Membership Interest Purchase Agreement)</p>
                        <p className="text-sm text-gray-400">Legal investment agreement</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
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

                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">Operating Agreement</p>
                        <p className="text-sm text-gray-400">Company operating procedures</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
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

                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">Pitch Deck</p>
                        <p className="text-sm text-gray-400">Business overview and projections</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
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

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Current Funding Round</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">$1,000,000</p>
                      <p className="text-gray-400">Target Amount</p>
                    </div>
                    <div>
                      <p className="text-xl">10%</p>
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
                      <span>Facility Build-out</span>
                      <span className="text-battles-gold">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Initial Inventory</span>
                      <span className="text-battles-gold">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manufacturing Equipment</span>
                      <span className="text-battles-gold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing & Operations</span>
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

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Investor Updates</CardTitle>
                <CardDescription>Quarterly reports and milestone updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Q4 2024 - License Approval</h4>
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
                      <h4 className="font-semibold">Q1 2025 - Site Selection & Early Investment</h4>
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
                      <h4 className="font-semibold">Q2 2025 - Construction & Build-out</h4>
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
                      <h4 className="font-medium mb-2">Cannabis Industry Podcast</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Discussion on veteran entrepreneurship in cannabis
                      </p>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        Listen Now
                      </Button>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2">Local Business Feature</h4>
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
      </div>
    </div>
  );
}