import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ObjectUploader } from "@/components/ObjectUploader";
import Navigation from "@/components/navigation";
import type { UploadResult } from "@uppy/core";
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
  EyeOff,
  Calendar,
  DollarSign,
  Settings,
  Clock,
  CheckCircle,
  Send,
  X,
  Reply
} from "lucide-react";

interface SecureDocument {
  id: number;
  title: string;
  description: string | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedByRole: "investor" | "admin";
  ownerInvestorId: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Investor {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "pending" | "approved" | "rejected";
}

interface DocumentUploadFormData {
  title: string;
  description: string;
  assignedInvestorIds: string[];
}

export default function InvestorAdmin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  // Document management state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedInvestorFilter, setSelectedInvestorFilter] = useState<string>("all");
  const [uploadForm, setUploadForm] = useState<DocumentUploadFormData>({
    title: "",
    description: "",
    assignedInvestorIds: [],
  });
  const [pendingUpload, setPendingUpload] = useState<{
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  } | null>(null);

  // Fetch investor messages
  const { data: investorMessages = [], isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ["/api/investor/messages"],
    enabled: isAuthenticated && (user as any)?.role === "admin"
  });

  // Fetch investor access requests
  const { data: accessRequests = [], isLoading: accessRequestsLoading } = useQuery({
    queryKey: ["/api/investor/access-requests"],
    enabled: isAuthenticated && (user as any)?.role === "admin"
  });

  // Fetch documents for admin management
  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/admin/investor-docs/list", selectedInvestorFilter],
    queryFn: () => {
      const params = selectedInvestorFilter !== "all" ? `?investorId=${selectedInvestorFilter}` : "";
      return apiRequest("GET", `/api/admin/investor-docs/list${params}`);
    },
    enabled: isAuthenticated && (user as any)?.role === "admin"
  });

  // Fetch investors for document assignment
  const { data: investorsData, isLoading: investorsLoading } = useQuery({
    queryKey: ["/api/admin/investors"],
    enabled: isAuthenticated && (user as any)?.role === "admin"
  });

  const documents = (documentsData as any)?.documents || [];
  const investors = (investorsData as any)?.investors || [];
  const approvedInvestors = investors.filter((inv: Investor) => inv.status === "approved");

  // Reply to message mutation
  const replyMutation = useMutation({
    mutationFn: async ({ messageId, reply }: { messageId: number; reply: string }) => {
      console.log("Sending reply:", { messageId, reply });
      const response = await apiRequest("POST", `/api/investor/message/${messageId}/reply`, { reply });
      console.log("Reply response:", response);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the investor and they'll receive an email notification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investor/messages"] });
      setReplyModalOpen(false);
      setReplyText("");
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      console.error("Reply mutation error:", error);
      toast({
        title: "Failed to Send Reply",
        description: error.message || "There was an error sending your reply. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest("PATCH", `/api/investor/message/${messageId}/read`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Marked as Read",
        description: "The message status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investor/messages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Status",
        description: error.message || "There was an error updating the message status.",
        variant: "destructive",
      });
    }
  });

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({
        title: "Reply Required",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }
    replyMutation.mutate({ messageId: selectedMessage.id, reply: replyText.trim() });
  };

  const handleMarkAsRead = (messageId: number) => {
    markAsReadMutation.mutate(messageId);
  };

  // Access request approval mutation
  const accessRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, adminNotes }: { requestId: number; status: string; adminNotes: string }) => {
      const response = await apiRequest("PATCH", `/api/investor/access-request/${requestId}`, { 
        status, 
        adminNotes 
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: "Access request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investor/access-requests"] });
    },
    onError: (error: any) => {
      console.error("Access request update error:", error);
      toast({
        title: "Error",
        description: "Failed to update access request",
        variant: "destructive",
      });
    },
  });

  // Document management mutations
  const getUploadUrlMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/investor-docs/upload", {});
    },
    onError: (error) => {
      console.error("Upload URL error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to get upload URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeUploadMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/investor-docs/complete", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      setShowUploadDialog(false);
      setUploadForm({ title: "", description: "", assignedInvestorIds: [] });
      setPendingUpload(null);
      toast({
        title: "Success",
        description: "Document uploaded and assigned successfully!",
      });
    },
    onError: (error) => {
      console.error("Complete upload error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to complete upload. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ documentId, isVisible }: { documentId: number; isVisible: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/investor-docs/${documentId}/visibility`, { isVisible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      toast({
        title: "Success",
        description: "Document visibility updated successfully!",
      });
    },
    onError: (error) => {
      console.error("Visibility toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to update document visibility.",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      return await apiRequest("DELETE", `/api/admin/investor-docs/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      toast({
        title: "Success",
        description: "Document deleted successfully!",
      });
    },
    onError: (error) => {
      console.error("Delete document error:", error);
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive",
      });
    },
  });

  // Document management handlers
  const handleGetUploadParameters = async () => {
    const result = await getUploadUrlMutation.mutateAsync();
    return {
      method: "PUT" as const,
      url: (result as any)?.uploadURL || "",
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0];
      setPendingUpload({
        fileName: file.name,
        filePath: (file as any).uploadURL || "",
        fileSize: file.size || 0,
        mimeType: file.type || "application/octet-stream",
      });
    }
  };

  const handleSubmitUpload = () => {
    if (!pendingUpload || !uploadForm.title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the title and upload a file.",
        variant: "destructive",
      });
      return;
    }

    completeUploadMutation.mutate({
      title: uploadForm.title,
      description: uploadForm.description,
      fileName: pendingUpload.fileName,
      filePath: pendingUpload.filePath,
      fileSize: pendingUpload.fileSize,
      mimeType: pendingUpload.mimeType,
      assignedInvestorIds: uploadForm.assignedInvestorIds,
    });
  };

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/admin/investor-docs/${documentId}/download`, {
        method: "GET",
        credentials: "include", // Use session-based auth instead of token
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Check admin access
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user as any)?.role !== "admin")) {
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

  if (!isAuthenticated || (user as any)?.role !== "admin") {
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
      {/* Use consistent navigation across all pages */}
      <Navigation />

      {/* Main Content with proper spacing for fixed nav */}
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Admin Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-battles-gold mb-2">Admin Portal</h1>
          <p className="text-gray-300 mb-4">Manage investor content and business data</p>
          <Badge className="bg-battles-gold text-black">
            <Shield className="h-3 w-3 mr-1" />
            Admin Access
          </Badge>
        </div>
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
              <TabsTrigger value="access-requests" className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2 flex-shrink-0">
                Access Requests
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
                  <div>
                    <p className="text-2xl font-bold text-green-400">Committed</p>
                    <p className="text-sm text-gray-400">First investment secured</p>
                  </div>
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
                  <p className="text-2xl font-bold text-gray-200">3</p>
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
                      <p className="font-medium text-gray-200">First investor commitment received</p>
                      <p className="text-sm text-gray-400">January 15, 2025</p>
                    </div>
                    <Badge className="bg-green-900 text-green-300">Milestone</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-200">Provisional license approved</p>
                      <p className="text-sm text-gray-400">December 20, 2024</p>
                    </div>
                    <Badge className="bg-blue-900 text-blue-300">Legal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-200">Site selection confirmed</p>
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
                <CardDescription className="text-gray-300">Publish updates for investors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="update-title" className="text-gray-200">Update Title</Label>
                    <Input 
                      id="update-title" 
                      placeholder="Q1 2025 Progress Report"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="update-type" className="text-gray-200">Update Type</Label>
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
                  <Label htmlFor="update-content" className="text-gray-200">Content</Label>
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
                      <h4 className="font-medium text-gray-200">Q1 2025 - Site Approval Progress</h4>
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
                      <h4 className="font-medium text-gray-200">Q4 2024 - License Approval</h4>
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
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-battles-gold text-black hover:bg-yellow-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-battles-gold text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-battles-gold">Upload New Document</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Upload and assign documents to investors. You can control visibility and access per investor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Title *</Label>
                      <Input
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        placeholder="Document title"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Description</Label>
                      <Textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                        placeholder="Optional document description"
                        className="bg-gray-800 border-gray-700 text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Assign to Investors</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {approvedInvestors.map((investor: Investor) => (
                          <div key={investor.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={investor.id}
                              checked={uploadForm.assignedInvestorIds.includes(investor.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setUploadForm({
                                    ...uploadForm,
                                    assignedInvestorIds: [...uploadForm.assignedInvestorIds, investor.id]
                                  });
                                } else {
                                  setUploadForm({
                                    ...uploadForm,
                                    assignedInvestorIds: uploadForm.assignedInvestorIds.filter(id => id !== investor.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={investor.id} className="text-white">
                              {investor.firstName} {investor.lastName} ({investor.email})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">File Upload</Label>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={50485760} // 50MB
                        onGetUploadParameters={handleGetUploadParameters}
                        onComplete={handleUploadComplete}
                        buttonClassName="w-full bg-gray-800 hover:bg-gray-700 border-gray-600"
                      >
                        <div className="flex items-center justify-center space-x-2 py-3">
                          <Upload className="h-4 w-4" />
                          <span>Choose File to Upload</span>
                        </div>
                      </ObjectUploader>
                      {pendingUpload && (
                        <div className="mt-2 p-2 bg-gray-800 rounded border border-battles-gold/30">
                          <p className="text-sm text-battles-gold">✓ File ready: {pendingUpload.fileName}</p>
                          <p className="text-xs text-gray-400">Size: {formatFileSize(pendingUpload.fileSize)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSubmitUpload}
                      disabled={!pendingUpload || !uploadForm.title.trim() || completeUploadMutation.isPending}
                      className="bg-battles-gold text-black hover:bg-yellow-600"
                    >
                      {completeUploadMutation.isPending ? "Uploading..." : "Upload Document"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filter Controls */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Label className="text-white">Filter by Investor:</Label>
                  <Select value={selectedInvestorFilter} onValueChange={setSelectedInvestorFilter}>
                    <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                      <SelectValue placeholder="All Investors" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-battles-gold">
                      <SelectItem value="all">All Investors</SelectItem>
                      {approvedInvestors.map((investor: Investor) => (
                        <SelectItem key={investor.id} value={investor.id}>
                          {investor.firstName} {investor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Document Library</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage document visibility and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-battles-gold">Loading documents...</div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-battles-gold opacity-50" />
                    <p className="text-lg mb-2">No documents uploaded yet</p>
                    <p className="text-sm">Upload your first document to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc: SecureDocument) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-battles-gold" />
                          <div>
                            <p className="font-medium text-white">{doc.title}</p>
                            {doc.description && (
                              <p className="text-sm text-gray-400 mt-1">{doc.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <p className="text-xs text-gray-500">
                                Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {formatFileSize(doc.fileSize)}
                              </p>
                              <p className="text-xs text-gray-500">
                                By: {doc.uploadedByRole === "admin" ? "Admin" : "Investor"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm text-gray-300">Visible:</Label>
                            <Switch
                              checked={doc.isVisible}
                              onCheckedChange={(checked) =>
                                toggleVisibilityMutation.mutate({ documentId: doc.id, isVisible: checked })
                              }
                              disabled={toggleVisibilityMutation.isPending}
                            />
                          </div>
                          <div className="flex space-x-1">
                            {doc.isVisible ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-red-500" />
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-battles-gold text-battles-gold"
                              onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                                  deleteDocumentMutation.mutate(doc.id);
                                }
                              }}
                              disabled={deleteDocumentMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                      <h4 className="font-medium text-gray-200">Early Investor 1</h4>
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

          {/* Access Requests Tab */}
          <TabsContent value="access-requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Access Requests</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-battles-gold border-battles-gold">
                  {accessRequests?.length || 0} Total Requests
                </Badge>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  {accessRequests?.filter((req: any) => req.status === 'pending').length || 0} Pending
                </Badge>
              </div>
            </div>

            {accessRequestsLoading ? (
              <Card className="bg-gray-900 border-battles-gold">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <div className="text-battles-gold">Loading access requests...</div>
                  </div>
                </CardContent>
              </Card>
            ) : !accessRequests || accessRequests.length === 0 ? (
              <Card className="bg-gray-900 border-battles-gold">
                <CardContent className="p-6">
                  <div className="text-center text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-battles-gold opacity-50" />
                    <p className="text-lg mb-2">No access requests yet</p>
                    <p className="text-sm">Access requests from potential investors will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {accessRequests.map((request: any) => (
                  <Card key={request.id} className="bg-gray-900 border-battles-gold">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-battles-gold text-lg">
                            {request.firstName} {request.lastName}
                          </CardTitle>
                          <CardDescription className="text-gray-300">
                            {request.email} • {request.phone || 'No phone provided'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'approved' ? 'default' : 'destructive'
                            }
                            className={
                              request.status === 'pending' ? 'bg-yellow-600 text-white' :
                              request.status === 'approved' ? 'bg-green-600 text-white' :
                              'bg-red-600 text-white'
                            }
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Professional Information */}
                      {(request.company || request.position) && (
                        <div>
                          <h4 className="font-semibold text-battles-gold mb-2">Professional Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {request.company && (
                              <div>
                                <span className="text-gray-400">Company:</span>
                                <span className="text-white ml-2">{request.company}</span>
                              </div>
                            )}
                            {request.position && (
                              <div>
                                <span className="text-gray-400">Position:</span>
                                <span className="text-white ml-2">{request.position}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Investment Information */}
                      <div>
                        <h4 className="font-semibold text-battles-gold mb-2">Investment Interest</h4>
                        <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded">
                          {request.investmentInterest}
                        </p>
                      </div>

                      {request.netWorth && (
                        <div>
                          <h4 className="font-semibold text-battles-gold mb-2">Net Worth Range</h4>
                          <p className="text-gray-300 text-sm">
                            {request.netWorth.replace('-', ' - ').replace('k', 'K').replace('m', 'M')}
                          </p>
                        </div>
                      )}

                      {request.investmentExperience && (
                        <div>
                          <h4 className="font-semibold text-battles-gold mb-2">Investment Experience</h4>
                          <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded">
                            {request.investmentExperience}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-battles-gold mb-2">Why Battles Budz?</h4>
                        <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded">
                          {request.reasonForInterest}
                        </p>
                      </div>

                      {/* Admin Notes */}
                      {request.adminNotes && (
                        <div>
                          <h4 className="font-semibold text-battles-gold mb-2">Admin Notes</h4>
                          <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded border border-battles-gold/20">
                            {request.adminNotes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons - Only show for pending requests */}
                      {request.status === 'pending' && (
                        <div className="flex space-x-2 pt-4 border-t border-gray-700">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-battles-gold text-white">
                              <DialogHeader>
                                <DialogTitle className="text-battles-gold">
                                  Approve Access Request
                                </DialogTitle>
                                <DialogDescription className="text-gray-300">
                                  Approve {request.firstName} {request.lastName}'s investor access request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white">Admin Notes (Optional)</Label>
                                  <Textarea 
                                    placeholder="Add any notes about this approval..."
                                    className="bg-gray-800 border-gray-700 text-white"
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    accessRequestMutation.mutate({
                                      requestId: request.id,
                                      status: 'approved',
                                      adminNotes: replyText || 'Approved for investor access'
                                    });
                                    setReplyText('');
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  disabled={accessRequestMutation.isPending}
                                >
                                  {accessRequestMutation.isPending ? 'Approving...' : 'Approve Request'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-battles-gold text-white">
                              <DialogHeader>
                                <DialogTitle className="text-battles-gold">
                                  Deny Access Request
                                </DialogTitle>
                                <DialogDescription className="text-gray-300">
                                  Deny {request.firstName} {request.lastName}'s investor access request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white">Reason for Denial (Required)</Label>
                                  <Textarea 
                                    placeholder="Please provide a reason for denial..."
                                    className="bg-gray-800 border-gray-700 text-white"
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    if (!replyText.trim()) {
                                      toast({
                                        title: "Reason Required",
                                        description: "Please provide a reason for denial.",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    accessRequestMutation.mutate({
                                      requestId: request.id,
                                      status: 'denied',
                                      adminNotes: replyText
                                    });
                                    setReplyText('');
                                  }}
                                  variant="destructive"
                                  disabled={accessRequestMutation.isPending}
                                >
                                  {accessRequestMutation.isPending ? 'Denying...' : 'Deny Request'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Messages</h2>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-battles-gold border-battles-gold">
                  {investorMessages?.length || 0} Total Messages
                </Badge>
              </div>
            </div>

            {messagesLoading ? (
              <Card className="bg-gray-900 border-battles-gold">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <div className="text-battles-gold">Loading messages...</div>
                  </div>
                </CardContent>
              </Card>
            ) : messagesError ? (
              <Card className="bg-gray-900 border-red-500">
                <CardContent className="p-6">
                  <div className="text-red-400">Failed to load messages. Please refresh the page.</div>
                </CardContent>
              </Card>
            ) : !investorMessages || investorMessages.length === 0 ? (
              <Card className="bg-gray-900 border-battles-gold">
                <CardContent className="p-6">
                  <div className="text-center text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-battles-gold opacity-50" />
                    <p className="text-lg mb-2">No investor messages yet</p>
                    <p className="text-sm">Messages from investors will appear here when they contact you through the portal.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {investorMessages.map((message: any) => (
                  <Card key={message.id} className="bg-gray-900 border-battles-gold">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-battles-gold text-lg mb-2 truncate">
                            {message.subject}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-white">{message.investorName}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 truncate">{message.investorEmail}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Badge 
                            variant={message.status === 'unread' ? 'default' : message.adminReply ? 'secondary' : 'outline'}
                            className={
                              message.status === 'unread' 
                                ? 'bg-yellow-500 text-black font-medium' 
                                : message.adminReply 
                                  ? 'bg-green-600 text-white'
                                  : 'text-battles-gold border-battles-gold'
                            }
                          >
                            {message.status === 'unread' ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                New
                              </>
                            ) : message.adminReply ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Replied
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Read
                              </>
                            )}
                          </Badge>
                          <span className="text-xs text-gray-400 text-right">
                            {new Date(message.createdAt).toLocaleDateString()}<br/>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                        </div>

                        {message.adminReply && (
                          <div className="p-4 bg-battles-gold/10 rounded-lg border border-battles-gold/30">
                            <p className="text-sm text-battles-gold font-medium mb-2">Admin Reply:</p>
                            <p className="text-gray-300 whitespace-pre-wrap">{message.adminReply}</p>
                            {message.repliedAt && (
                              <p className="text-xs text-gray-400 mt-2">
                                Replied on {new Date(message.repliedAt).toLocaleDateString()} at {new Date(message.repliedAt).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-battles-gold text-black hover:bg-yellow-600"
                            onClick={() => handleReply(message)}
                            disabled={replyMutation.isPending}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                          {message.status === 'unread' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                              onClick={() => handleMarkAsRead(message.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Message Stats */}
            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Message Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-battles-gold">
                      {investorMessages?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Total Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {investorMessages?.filter((m: any) => m.status === 'unread').length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Unread</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {investorMessages?.filter((m: any) => m.adminReply).length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Replied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="bg-gray-900 border-battles-gold text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Reply to Investor Message</DialogTitle>
            <DialogDescription className="text-gray-300">
              Send a reply to {selectedMessage?.investorName} regarding: "{selectedMessage?.subject}"
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              {/* Original Message Display */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-medium text-battles-gold mb-2">Original Message:</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>From:</strong> {selectedMessage.investorName} ({selectedMessage.investorEmail})</p>
                  <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                  <p><strong>Sent:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="mt-3 p-3 bg-gray-700 rounded border-l-3 border-battles-gold">
                  <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Reply Input */}
              <div className="space-y-2">
                <Label htmlFor="reply-text" className="text-battles-gold">Your Reply:</Label>
                <Textarea
                  id="reply-text"
                  placeholder="Type your professional reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[120px] bg-gray-800 border-gray-600 text-white focus:border-battles-gold"
                  disabled={replyMutation.isPending}
                />
                <p className="text-xs text-gray-400">
                  The investor will receive your reply via email and can view it in their investor portal.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setReplyModalOpen(false);
                setReplyText("");
                setSelectedMessage(null);
              }}
              disabled={replyMutation.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply}
              disabled={replyMutation.isPending || !replyText.trim()}
              className="bg-battles-gold text-black hover:bg-yellow-600"
            >
              {replyMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}