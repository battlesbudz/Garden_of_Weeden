import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  FileText, 
  Download,
  Calendar,
  DollarSign,
  Building,
  Users,
  BarChart3,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";

export default function InvestorsPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("updates");

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
              Investor Portal Access
            </CardTitle>
            <p className="text-white/80">
              Sign in to access investor updates and documentation
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => {
                sessionStorage.setItem('redirectAfterLogin', '/investors');
                window.location.href = '/login';
              }}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
            >
              Sign In to Continue
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
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
              <DollarSign className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.5M</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+35%</div>
              <p className="text-xs text-muted-foreground">
                Year over year growth
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Position</CardTitle>
              <TrendingUp className="h-4 w-4 text-battles-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#3</div>
              <p className="text-xs text-muted-foreground">
                In regional market share
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="updates">Business Updates</TabsTrigger>
            <TabsTrigger value="documents">Documents & Reports</TabsTrigger>
          </TabsList>

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
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No updates available yet</p>
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
                        <p className="text-gray-500">No documents available yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}