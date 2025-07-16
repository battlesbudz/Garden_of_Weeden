import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  FileText, 
  Download,
  Calendar,
  DollarSign,
  Building,
  Users,
  BarChart3,
  Lock,
  Shield,
  Award,
  MapPin,
  Eye,
  Video,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";

export default function InvestorsPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ["/api/investor/updates"],
    enabled: isAuthenticated,
  });

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/investor/documents"],
    enabled: isAuthenticated,
  });

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black border-battles-gold">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-battles-gold mx-auto mb-4" />
            <CardTitle className="text-2xl font-playfair text-battles-gold">
              Battles Budz Investor Portal
            </CardTitle>
            <p className="text-white/80">
              Access investor updates, financial reports, and business documentation for our licensed NY cannabis microbusiness.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-400 space-y-2">
              <p>📍 19 North Main Street, Gloversville, NY</p>
              <p>🏛️ OCM License: OCMMICR-2023-000258</p>
              <p>💰 Current Round: $1M for 10% equity</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold w-full"
            >
              Sign In to Access Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadDocument = (doc: any) => {
    if (!doc.fileData) return;
    
    try {
      const byteCharacters = atob(doc.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: doc.mimeType || 'application/octet-stream' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', doc.fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-playfair font-bold text-battles-gold mb-4">
              Battles Budz Investor Portal
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Stay informed with the latest business updates, financial reports, and strategic developments
            </p>
            <div className="flex justify-center items-center mt-6 space-x-8">
              <div className="text-center">
                <Building className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                <p className="text-sm">Veteran-Owned</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                <p className="text-sm">Growing Market</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-battles-gold mx-auto mb-2" />
                <p className="text-sm">Strong Team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-battles-gold mr-2" />
            <p className="text-lg font-medium">Welcome, {user?.firstName} {user?.lastName}</p>
          </div>
          <Badge className="bg-battles-gold text-black">
            Investor Access
          </Badge>
        </div>

        {/* Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-battles-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">License Status</CardTitle>
              <Award className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Provisional Approved</div>
              <p className="text-xs text-muted-foreground">
                OCM License: OCMMICR-2023-000258
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-battles-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Round</CardTitle>
              <DollarSign className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1M for 10%</div>
              <p className="text-xs text-muted-foreground">
                Early investment secured
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-battles-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">Gloversville, NY</div>
              <p className="text-xs text-muted-foreground">
                19 North Main Street
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-battles-gold/20">
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

              <Card className="border-battles-gold/20">
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
              <Card className="border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Mission</h4>
                    <p className="text-gray-700">
                      To provide premium, small-batch cannabis products with a focus on landrace strains 
                      and an elevated consumption experience through our on-site lounge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Business Model</h4>
                    <p className="text-gray-700">
                      All-in-one microbusiness: Cultivation, Processing, Retail, and On-site Consumption. 
                      Targeting connoisseur market with organic production and unique strains.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-battles-gold mb-2">Expansion Strategy</h4>
                    <p className="text-gray-700">
                      Franchise model for scaling, potential syndication opportunities, 
                      MSO aspirations with IPO as long-term goal.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Leadership Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg">Justin Battles</h4>
                    <p className="text-battles-gold text-sm mb-2">Founder & CEO</p>
                    <p className="text-gray-700 text-sm">
                      Army veteran with formal cannabis horticulture education. 
                      Experienced cultivator focused on landrace strains and organic production methods.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Andrea Battles</h4>
                    <p className="text-battles-gold text-sm mb-2">Chief Operating Officer</p>
                    <p className="text-gray-700 text-sm">
                      15 years in sales and customer service. Cannabis advocate with personal experience 
                      using cannabis for PTSD and bipolar management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-battles-gold/20">
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

              <Card className="border-battles-gold/20">
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

            <Card className="border-battles-gold/20">
              <CardHeader>
                <CardTitle className="text-battles-gold">Financial Projections</CardTitle>
                <CardDescription className="text-yellow-600">
                  ⚠️ Projections pending final data input - Conservative estimates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  Detailed financial projections and revenue models will be provided upon completion 
                  of site approval and facility planning. Current estimates are based on industry 
                  benchmarks for similar microbusiness operations in New York.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Company Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-battles-gold mx-auto mb-2" />
                        <p className="text-gray-600">Pitch Video</p>
                        <p className="text-sm text-gray-500">Coming Soon</p>
                      </div>
                    </div>
                    <Button className="w-full bg-battles-gold text-black hover:bg-yellow-600">
                      Watch Introduction Video
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-battles-gold/20">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Media Appearances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <h4 className="font-medium mb-2">Cannabis Industry Podcast</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Discussion on veteran entrepreneurship in cannabis
                      </p>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        Listen Now
                      </Button>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg">
                      <h4 className="font-medium mb-2">Local Business Feature</h4>
                      <p className="text-sm text-gray-600 mb-2">
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

          <TabsContent value="updates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-battles-gold" />
                  Latest Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {updatesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {updates && updates.length > 0 ? (
                      updates.map((update: any) => (
                        <div key={update.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold">{update.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant={
                                    update.type === 'financial' ? 'default' :
                                    update.type === 'operational' ? 'secondary' :
                                    update.type === 'milestone' ? 'outline' : 'secondary'
                                  }
                                >
                                  {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                                </Badge>
                                {update.quarter && (
                                  <span className="text-sm text-gray-500">{update.quarter} {update.year}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(update.publishedAt || update.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="prose max-w-none">
                            <p className="text-gray-700">{update.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No updates published yet</p>
                        <div className="space-y-4 text-left max-w-md mx-auto">
                          <div className="border-l-4 border-green-500 pl-4">
                            <p className="font-medium">Q4 2024 - License Approval</p>
                            <p className="text-sm text-gray-400">Provisional microbusiness license approved by New York OCM</p>
                          </div>
                          <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-medium">Q1 2025 - Site Selection & Early Investment</p>
                            <p className="text-sm text-gray-400">Location secured and first investor commitment received</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-battles-gold" />
                  Document Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-battles-gold"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents && documents.length > 0 ? (
                      documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-battles-gold" />
                            <div>
                              <h4 className="font-medium">{doc.title}</h4>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline">{doc.category}</Badge>
                                {doc.fileSize && (
                                  <span className="text-xs text-gray-500">
                                    {formatFileSize(doc.fileSize)}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => downloadDocument(doc)}
                            variant="outline"
                            size="sm"
                            disabled={!doc.fileData}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Document library being prepared</p>
                        <div className="space-y-3 text-left max-w-md mx-auto">
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-battles-gold" />
                              <div>
                                <p className="font-medium text-sm">MIPA (Membership Interest Purchase Agreement)</p>
                                <p className="text-xs text-gray-500">Legal investment agreement</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-battles-gold" />
                              <div>
                                <p className="font-medium text-sm">Operating Agreement</p>
                                <p className="text-xs text-gray-500">Company operating procedures</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-battles-gold" />
                              <div>
                                <p className="font-medium text-sm">Pitch Deck</p>
                                <p className="text-xs text-gray-500">Business overview and projections</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <Card className="mt-8 border-battles-gold/20">
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
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
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