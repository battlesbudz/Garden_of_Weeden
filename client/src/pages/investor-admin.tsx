import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Upload, 
  FileText, 
  Users, 
  TrendingUp, 
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Menu,
  X,
  Home,
  LogOut,
  Settings
} from "lucide-react";

export default function InvestorAdmin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You need admin access to view this page. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-battles-gold text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Redirecting
  }

  const handleDocumentUpload = () => {
    toast({
      title: "Document Upload",
      description: "Document upload functionality will be implemented with file storage.",
    });
  };

  const handleUpdatePost = () => {
    toast({
      title: "Update Posted",
      description: "Investor update has been published successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-red-600 text-white border-b border-red-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Battles Budz Admin Portal</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="flex items-center hover:text-red-200 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Home
              </a>
              <a href="/investor-portal" className="flex items-center hover:text-red-200 transition-colors">
                <Shield className="h-4 w-4 mr-1" />
                Investor Portal
              </a>
              <a href="/dashboard" className="flex items-center hover:text-red-200 transition-colors">
                <Settings className="h-4 w-4 mr-1" />
                Dashboard
              </a>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={() => window.location.href = '/api/logout'}
                className="flex items-center hover:text-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-red-200"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-red-600 border-t border-red-700">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="flex items-center text-white hover:text-red-200 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </a>
              <a
                href="/investor-portal"
                className="flex items-center text-white hover:text-red-200 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Investor Portal
              </a>
              <a
                href="/dashboard"
                className="flex items-center text-white hover:text-red-200 px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </a>
              <div className="flex items-center text-white px-3 py-2 text-base font-medium">
                <Shield className="h-4 w-4 mr-2" />
                {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/api/logout';
                }}
                className="flex items-center text-white hover:text-red-200 px-3 py-2 text-base font-medium w-full text-left"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Header Content */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-6 pt-22">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Battles Budz Admin Portal</h1>
            <p className="text-lg mt-1">Investor Relations Management</p>
            <div className="mt-4">
              <Badge className="bg-white text-red-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="w-full overflow-hidden">
            <TabsList className="flex w-full justify-start overflow-x-auto bg-gray-900 p-1 h-auto min-h-[40px] no-scrollbar">
              <TabsTrigger value="overview" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Overview
              </TabsTrigger>
              <TabsTrigger value="investors" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Investors
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Documents
              </TabsTrigger>
              <TabsTrigger value="updates" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Updates
              </TabsTrigger>
              <TabsTrigger value="communications" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Communications
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Active Investors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-gray-400">Early investor secured</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Capital Raised
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-400">Committed</p>
                  <p className="text-sm text-gray-400">First investment secured</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-400">MIPA, Operating Agreement, Pitch Deck</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Round Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-400">25%</p>
                  <p className="text-sm text-gray-400">$1M target for 10% equity</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">First investor commitment received</p>
                      <p className="text-sm text-gray-400">January 15, 2025</p>
                    </div>
                    <Badge className="bg-green-900 text-green-300">Milestone</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Provisional license approved</p>
                      <p className="text-sm text-gray-400">December 20, 2024</p>
                    </div>
                    <Badge className="bg-blue-900 text-blue-300">Legal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Site selection confirmed</p>
                      <p className="text-sm text-gray-400">December 10, 2024</p>
                    </div>
                    <Badge className="bg-purple-900 text-purple-300">Operations</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Updates</h2>
              <Button className="bg-battles-gold text-black hover:bg-yellow-600">
                <Plus className="h-4 w-4 mr-2" />
                New Update
              </Button>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Create New Update</CardTitle>
                <CardDescription>Publish updates for investors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="update-title">Update Title</Label>
                    <Input 
                      id="update-title" 
                      placeholder="Q1 2025 Progress Report"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="update-type">Update Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="update-content">Content</Label>
                  <Textarea 
                    id="update-content" 
                    placeholder="Enter update content..."
                    className="bg-gray-800 border-gray-700 min-h-32"
                  />
                </div>
                <Button onClick={handleUpdatePost} className="bg-battles-gold text-black hover:bg-yellow-600">
                  Publish Update
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Published Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Q1 2025 - Site Approval Progress</h4>
                      <p className="text-sm text-gray-400">Published: January 2025 • Type: Operational</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Q4 2024 - License Approval</h4>
                      <p className="text-sm text-gray-400">Published: December 2024 • Type: Milestone</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Document Management</h2>
              <Button onClick={handleDocumentUpload} className="bg-battles-gold text-black hover:bg-yellow-600">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Current Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">MIPA (Membership Interest Purchase Agreement)</p>
                        <p className="text-sm text-gray-400">Uploaded: January 10, 2025 • Size: 2.1 MB</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">Operating Agreement</p>
                        <p className="text-sm text-gray-400">Uploaded: January 10, 2025 • Size: 1.8 MB</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-battles-gold" />
                      <div>
                        <p className="font-medium">Pitch Deck</p>
                        <p className="text-sm text-gray-400">Uploaded: January 10, 2025 • Size: 5.2 MB</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investors Tab */}
          <TabsContent value="investors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Management</h2>
              <Button className="bg-battles-gold text-black hover:bg-yellow-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Investor
              </Button>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Current Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium">Early Investor 1</h4>
                      <p className="text-sm text-gray-400">Committed Investment • Access Level: Investor</p>
                      <p className="text-sm text-gray-400">Joined: January 2025</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className="bg-green-900 text-green-300">Active</Badge>
                      <Button size="sm" variant="outline" className="border-battles-gold text-battles-gold">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Access Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <h4 className="font-medium text-battles-gold mb-2">Investor</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• View updates</li>
                      <li>• Access documents</li>
                      <li>• Financial reports</li>
                      <li>• Communication access</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <h4 className="font-medium text-battles-gold mb-2">Advisor</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• All investor access</li>
                      <li>• Strategic input</li>
                      <li>• Board meeting access</li>
                      <li>• Advanced reporting</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <h4 className="font-medium text-battles-gold mb-2">Board Member</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Full access</li>
                      <li>• Voting rights</li>
                      <li>• Strategic decisions</li>
                      <li>• Admin privileges</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Communications</h2>
              <Button className="bg-battles-gold text-black hover:bg-yellow-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Early Investor 1</p>
                        <span className="text-sm text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        "Looking forward to the Q1 update. When can we expect details on the site approval timeline?"
                      </p>
                      <Button size="sm" className="mt-2 bg-battles-gold text-black hover:bg-yellow-600">
                        Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-battles-gold">
                <CardHeader>
                  <CardTitle className="text-battles-gold">Communication Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Messages This Month</span>
                      <span className="text-battles-gold font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <span className="text-battles-gold font-semibold">&lt; 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meeting Requests</span>
                      <span className="text-battles-gold font-semibold">1 pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}