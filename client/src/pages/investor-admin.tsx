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
import Navigation from "@/components/navigation";
import { UserManagement } from "@/components/admin/UserManagement";
import { DocumentManagement } from "@/components/admin/DocumentManagement";
import { InvestorOverview } from "@/components/admin/InvestorOverview";
import { AccessRequestsManager } from "@/components/admin/AccessRequestsManager";
import { 
  Shield, 
  TrendingUp, 
  MessageCircle,
  Settings,
  Clock,
  Send,
  Reply,
  Users,
  DollarSign,
  FileText,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Download,
  CheckCircle,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ObjectUploader } from "@/components/ObjectUploader";

// Add UploadResult interface for ObjectUploader callback
interface UploadResult<T, K> {
  successful: Array<{
    name: string;
    size?: number;
    type?: string;
  }>;
  failed: Array<any>;
}

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
  const [currentUploadURL, setCurrentUploadURL] = useState<string>("");
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedDocumentForPermissions, setSelectedDocumentForPermissions] = useState<SecureDocument | null>(null);
  const [documentPermissions, setDocumentPermissions] = useState<{[investorId: string]: {canView: boolean, canDownload: boolean}}>({});

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
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ["/api/admin/investor-docs/list", selectedInvestorFilter],
    queryFn: async () => {
      const params = selectedInvestorFilter !== "all" ? `?investorId=${selectedInvestorFilter}` : "";
      const response = await fetch(`/api/admin/investor-docs/list${params}`, { 
        credentials: 'include' 
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }
      return response.json();
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



  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      console.log("🔍 [FRONTEND] Getting upload URL...");
      const response = await fetch("/api/admin/investor-docs/upload", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("✅ [FRONTEND] Upload URL received:", result);
      return result;
    },
    onError: (error) => {
      console.error("❌ [FRONTEND] Upload URL error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to get upload URL. Please try again.",
        variant: "destructive",
      });
    },
  });

  const completeUploadMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("🔍 [FRONTEND] Completing upload with data:", data);
      
      try {
        const response = await fetch("/api/admin/investor-docs/complete", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to complete upload: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("✅ [FRONTEND] Upload completion result:", result);
        return result;
      } catch (error) {
        console.error("❌ [FRONTEND] Complete upload fetch error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ [FRONTEND] Upload mutation success, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      setShowUploadDialog(false);
      setUploadForm({ title: "", description: "", assignedInvestorIds: [] });
      setPendingUpload(null);
      toast({
        title: "Success",
        description: "Document uploaded and assigned successfully!",
      });
      console.log("✅ [FRONTEND] Upload flow completed successfully");
    },
    onError: (error) => {
      console.error("❌ [FRONTEND] Complete upload error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to complete upload. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ documentId, isVisible }: { documentId: number; isVisible: boolean }) => {
      const response = await fetch(`/api/admin/investor-docs/${documentId}/visibility`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update visibility: ${response.statusText}`);
      }
      return response.json();
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
      const response = await fetch(`/api/admin/investor-docs/${documentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }
      return response.json();
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

  // Document permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ documentId, investorId, canView, canDownload }: { 
      documentId: number; 
      investorId: string; 
      canView: boolean; 
      canDownload: boolean; 
    }) => {
      const response = await fetch(`/api/admin/investor-docs/${documentId}/permissions`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId, canView, canDownload }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update permissions: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      toast({
        title: "Success",
        description: "Document permissions updated successfully!",
      });
    },
    onError: (error) => {
      console.error("Permissions update error:", error);
      toast({
        title: "Error",
        description: "Failed to update document permissions.",
        variant: "destructive",
      });
    },
  });

  // Document management handlers
  const handleGetUploadParameters = async () => {
    console.log("🔍 [FRONTEND] ========== GETTING UPLOAD PARAMETERS ==========");
    console.log("🔍 [FRONTEND] Making direct API request...");
    
    try {
      const response = await fetch("/api/admin/investor-docs/upload", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.statusText}`);
      }
      
      const result = await response.json();
      const uploadURL = result?.uploadURL || "";
      
      console.log("✅ [FRONTEND] Upload URL received:");
      console.log("🔍 [FRONTEND] Full result:", JSON.stringify(result, null, 2));
      console.log("🔍 [FRONTEND] Extracted uploadURL:", uploadURL);
      console.log("🔍 [FRONTEND] Storing upload URL in state for completion");
      setCurrentUploadURL(uploadURL);
      
      const params = {
        method: "PUT" as const,
        url: uploadURL,
      };
      console.log("🔍 [FRONTEND] Returning parameters to Uppy:", params);
      return params;
    } catch (error) {
      console.error("❌ [FRONTEND] Error getting upload parameters:", error);
      throw error;
    }
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    console.log("🎯 [FRONTEND] ========== UPLOAD COMPLETE CALLBACK ==========");
    console.log("🔍 [FRONTEND] Upload complete callback triggered with result:", JSON.stringify(result, null, 2));
    console.log("🔍 [FRONTEND] Current upload URL stored:", currentUploadURL);
    
    let uploadData: {fileName: string; filePath: string; fileSize: number; mimeType: string} | null = null;

    // Handle both successful uploads and CORS ETag errors (which still succeed)
    if (result.successful && result.successful.length > 0) {
      const file = result.successful[0];
      console.log("✅ [FRONTEND] Successful upload detected:", file);
      
      uploadData = {
        fileName: file.name,
        filePath: currentUploadURL || "",
        fileSize: file.size || 0,
        mimeType: file.type || "application/octet-stream",
      };
      console.log("🔍 [FRONTEND] Created upload data from successful:", uploadData);
      
    } else if (result.failed && result.failed.length > 0) {
      const failedFile = result.failed[0];
      console.log("⚠️ [FRONTEND] Failed upload detected:", failedFile);
      
      // Check if it's just a CORS ETag issue (upload actually succeeded)
      if (failedFile.error?.message?.includes('ETag') || failedFile.error?.message?.includes('CORS')) {
        console.log("✅ [FRONTEND] CORS ETag error detected, treating as successful");
        console.log("🔍 [FRONTEND] Failed file object:", failedFile);
        
        uploadData = {
          fileName: failedFile.name,
          filePath: currentUploadURL,
          fileSize: failedFile.size || 0,
          mimeType: failedFile.type || "application/octet-stream",
        };
        console.log("🔍 [FRONTEND] Created upload data from CORS case:", uploadData);
        
      } else {
        console.error("❌ [FRONTEND] Actual upload failure:", failedFile.error);
        toast({
          title: "Upload Failed",
          description: failedFile.error?.message || "Unknown error occurred",
          variant: "destructive",
        });
        return;
      }
    } else {
      console.log("⚠️ [FRONTEND] No successful or failed files in result");
      return;
    }

    if (uploadData) {
      console.log("🚀 [FRONTEND] Setting pending upload and showing form dialog");
      
      // Ensure we have a valid file path - use currentUploadURL if uploadData.filePath is empty
      const finalFilePath = uploadData.filePath || currentUploadURL;
      console.log("🔍 [FRONTEND] Final file path for completion:", finalFilePath);
      
      if (!finalFilePath) {
        console.error("❌ [FRONTEND] No file path available for completion");
        toast({
          title: "Upload Error",
          description: "Upload completed but file path is missing. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      const pendingUploadData = {
        fileName: uploadData.fileName,
        filePath: finalFilePath,
        fileSize: uploadData.fileSize,
        mimeType: uploadData.mimeType,
      };
      
      console.log("🔍 [FRONTEND] Setting pending upload data:", pendingUploadData);
      setPendingUpload(pendingUploadData);
      
      toast({
        title: "Upload Complete",
        description: `File "${uploadData.fileName}" uploaded successfully. Please fill in the document details below.`,
      });

      setShowUploadDialog(true);
    }
  };

  const handleSubmitUpload = () => {
    console.log("🔍 [FRONTEND] Submit upload triggered");
    console.log("🔍 [FRONTEND] Pending upload:", pendingUpload);
    console.log("🔍 [FRONTEND] Upload form:", uploadForm);
    
    if (!pendingUpload || !uploadForm.title.trim()) {
      console.log("❌ [FRONTEND] Validation failed - missing pendingUpload or title");
      toast({
        title: "Error",
        description: "Please fill in the title and upload a file.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      title: uploadForm.title,
      description: uploadForm.description,
      fileName: pendingUpload.fileName,
      filePath: pendingUpload.filePath,
      fileSize: pendingUpload.fileSize,
      mimeType: pendingUpload.mimeType,
      assignedInvestorIds: uploadForm.assignedInvestorIds,
    };
    
    console.log("🔍 [FRONTEND] Submitting completion data:", submitData);
    completeUploadMutation.mutate(submitData);
  };

  const handleManagePermissions = (document: SecureDocument) => {
    setSelectedDocumentForPermissions(document);
    // Initialize permissions state - for existing documents, assume no permissions initially
    const initialPermissions: {[investorId: string]: {canView: boolean, canDownload: boolean}} = {};
    approvedInvestors.forEach((investor: Investor) => {
      initialPermissions[investor.id] = { canView: false, canDownload: false };
    });
    setDocumentPermissions(initialPermissions);
    setShowPermissionsDialog(true);
  };

  const handlePermissionChange = (investorId: string, permission: 'canView' | 'canDownload', value: boolean) => {
    setDocumentPermissions(prev => ({
      ...prev,
      [investorId]: {
        ...prev[investorId],
        [permission]: value
      }
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedDocumentForPermissions) return;
    
    // Update permissions for each investor
    const promises = Object.entries(documentPermissions).map(([investorId, permissions]) => {
      if (permissions.canView || permissions.canDownload) {
        return updatePermissionsMutation.mutateAsync({
          documentId: selectedDocumentForPermissions.id,
          investorId,
          canView: permissions.canView,
          canDownload: permissions.canDownload,
        });
      }
      return Promise.resolve();
    });

    Promise.all(promises).then(() => {
      setShowPermissionsDialog(false);
      setSelectedDocumentForPermissions(null);
      setDocumentPermissions({});
    }).catch((error) => {
      console.error('Error saving permissions:', error);
    });
  };

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      console.log(`🔽 Starting download for document ${documentId}: ${fileName}`);
      
      // Check authentication first
      const authCheck = await fetch('/api/auth/user', { credentials: 'include' });
      if (!authCheck.ok) {
        toast({
          title: "Authentication Required",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/admin/investor-docs/${documentId}/download`, {
        method: "GET",
        credentials: "include",
      });

      console.log(`🔽 Download response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please refresh the page and try again",
            variant: "destructive",
          });
          return;
        }
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log(`🔽 Blob created, size: ${blob.size} bytes`);
      
      // Try multiple download methods for better mobile compatibility
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName)] })) {
        // Use Web Share API on mobile if available
        const file = new File([blob], fileName, { type: blob.type });
        await navigator.share({ files: [file] });
        console.log(`🔽 Shared via Web Share API: ${fileName}`);
        toast({
          title: "File Shared",
          description: `${fileName} shared successfully`,
          variant: "default",
        });
      } else {
        // Fallback to traditional download
        const url = window.URL.createObjectURL(blob);
        
        // Try opening in new tab first (works better on mobile)
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // If popup blocked, use traditional download
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = fileName;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        
        // Clean up after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
        
        console.log(`🔽 Download initiated for: ${fileName}`);
        toast({
          title: "File Ready", 
          description: `${fileName} ready to share`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Share Error",
        description: "Failed to share document. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add a direct link handler for mobile users who want to open in browser
  const handleViewDocument = async (documentId: number, fileName: string) => {
    try {
      // First check if user is still authenticated
      const authCheck = await fetch('/api/auth/user', { credentials: 'include' });
      if (!authCheck.ok) {
        toast({
          title: "Authentication Required",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
        return;
      }

      const directUrl = `/api/admin/investor-docs/${documentId}/download`;
      
      // For mobile, try to fetch and show the document inline first
      if (window.innerWidth <= 768) {
        try {
          const response = await fetch(directUrl, { credentials: 'include' });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            throw new Error('Download failed');
          }
        } catch (error) {
          // Fallback to direct URL
          window.open(directUrl, '_blank');
        }
      } else {
        // Desktop - direct link works fine
        window.open(directUrl, '_blank');
      }
      
      toast({
        title: "Opening Document",
        description: `Opening ${fileName}`,
        variant: "default",
      });
    } catch (error) {
      console.error("View document error:", error);
      toast({
        title: "View Error", 
        description: "Failed to open document. Please try again.",
        variant: "destructive",
      });
    }
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
            <InvestorOverview 
              accessRequests={accessRequests}
              totalInvestors={1}
              activeInvestors={1}
              totalInvestment="Committed"
              monthlyGrowth="100%"
            />
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
                              {investor.firstName} {investor.lastName}
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
                      <div key={doc.id} className="p-4 border border-gray-700 rounded-lg">
                        {/* Document Header - Title and Info */}
                        <div className="flex items-start space-x-3 mb-3">
                          <FileText className="h-8 w-8 text-battles-gold flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-lg mb-1">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-400 mb-2">{doc.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</span>
                              <span>Size: {formatFileSize(doc.fileSize)}</span>
                              <span>By: {doc.uploadedByRole === "admin" ? "Admin" : "Investor"}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Controls Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-700 gap-3">
                          <div className="flex items-center space-x-3">
                            <Label className="text-sm text-gray-300">Visible:</Label>
                            <Switch
                              checked={doc.isVisible}
                              onCheckedChange={(checked) =>
                                toggleVisibilityMutation.mutate({ documentId: doc.id, isVisible: checked })
                              }
                              disabled={toggleVisibilityMutation.isPending}
                            />
                            {doc.isVisible ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black flex-shrink-0"
                              onClick={() => handleManagePermissions(doc)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black flex-shrink-0"
                              onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-shrink-0"
                              onClick={() => handleViewDocument(doc.id, doc.fileName)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-shrink-0"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                                  deleteDocumentMutation.mutate(doc.id);
                                }
                              }}
                              disabled={deleteDocumentMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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
            <AccessRequestsManager accessRequests={accessRequests} />
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-battles-gold">Investor Communications</h2>
              <Button className="bg-battles-gold text-black hover:bg-yellow-600">
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <Card className="bg-gray-900 border-battles-gold">
              <CardHeader>
                <CardTitle className="text-battles-gold">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-gray-400 py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-battles-gold opacity-50" />
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Investor communications will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}