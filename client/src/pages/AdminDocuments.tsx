import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Upload, Download, Calendar, User, Shield, Plus, Eye, EyeOff, Trash2, Settings } from "lucide-react";
import type { UploadResult } from "@uppy/core";

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

export default function AdminDocuments() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedDocumentForPermissions, setSelectedDocumentForPermissions] = useState<SecureDocument | null>(null);
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
  const [documentPermissions, setDocumentPermissions] = useState<{[investorId: string]: {canView: boolean, canDownload: boolean}}>({})

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch documents with optional investor filter
  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/admin/investor-docs/list", selectedInvestorFilter],
    queryFn: () => {
      const params = selectedInvestorFilter !== "all" ? `?investorId=${selectedInvestorFilter}` : "";
      return apiRequest(`/api/admin/investor-docs/list${params}`);
    },
  });

  // Fetch investors for assignment UI
  const { data: investorsData, isLoading: investorsLoading } = useQuery({
    queryKey: ["/api/admin/investors"],
  });

  const documents = (documentsData as any)?.documents || [];
  const investors = (investorsData as any)?.investors || [];
  const approvedInvestors = investors.filter((inv: Investor) => inv.status === "approved");

  // Upload URL mutation
  const getUploadUrlMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/admin/investor-docs/upload", {
        method: "POST",
        body: JSON.stringify({}),
      });
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

  // Complete upload mutation
  const completeUploadMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/investor-docs/complete", {
        method: "POST",
        body: JSON.stringify(data),
      });
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

  // Visibility toggle mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: number; isVisible: boolean }) => {
      return await apiRequest(`/api/admin/investor-docs/${id}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ isVisible }),
      });
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/investor-docs/${id}`, {
        method: "DELETE",
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investor-docs/list"] });
      toast({
        title: "Success",
        description: "Document deleted successfully!",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
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
      return await apiRequest(`/api/admin/investor-docs/${documentId}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ investorId, canView, canDownload }),
      });
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

  const handleGetUploadParameters = async () => {
    const result = await getUploadUrlMutation.mutateAsync();
    return {
      method: "PUT" as const,
      url: (result as any).uploadURL,
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

  const handleInvestorToggle = (investorId: string) => {
    setUploadForm(prev => ({
      ...prev,
      assignedInvestorIds: prev.assignedInvestorIds.includes(investorId)
        ? prev.assignedInvestorIds.filter(id => id !== investorId)
        : [...prev.assignedInvestorIds, investorId]
    }));
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

  const handleDownload = (documentId: number, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/admin/investor-docs/${documentId}/download`;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInvestorName = (investorId: string) => {
    const investor = investors.find((inv: Investor) => inv.id === investorId);
    if (!investor) return investorId;
    return investor.firstName && investor.lastName 
      ? `${investor.firstName} ${investor.lastName}`
      : investor.email;
  };

  if (documentsLoading || investorsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-battles-black dark:text-battles-gold">
              Document Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage secure documents and investor access permissions
            </p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-battles-gold hover:bg-battles-gold/90 text-battles-black">
                <Plus className="w-4 h-4 mr-2" />
                Upload & Assign Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload & Assign Document</DialogTitle>
                <DialogDescription>
                  Upload a document and assign it to specific investors. They will receive view and download permissions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter document title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </div>
                  </ObjectUploader>
                  
                  {pendingUpload && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      ✓ File uploaded: {pendingUpload.fileName}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Assign to Investors</Label>
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                    {approvedInvestors.length === 0 ? (
                      <p className="text-sm text-gray-500">No approved investors available</p>
                    ) : (
                      <div className="space-y-3">
                        {approvedInvestors.map((investor: Investor) => (
                          <div key={investor.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={investor.id}
                              checked={uploadForm.assignedInvestorIds.includes(investor.id)}
                              onCheckedChange={() => handleInvestorToggle(investor.id)}
                            />
                            <Label htmlFor={investor.id} className="text-sm font-normal cursor-pointer">
                              {getInvestorName(investor.id)}
                              <span className="text-gray-500 ml-2">({investor.email})</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Selected investors will receive view and download permissions for this document.
                  </p>
                </div>

                <Button
                  onClick={handleSubmitUpload}
                  disabled={!pendingUpload || !uploadForm.title.trim() || completeUploadMutation.isPending}
                  className="w-full bg-battles-gold hover:bg-battles-gold/90 text-battles-black"
                >
                  {completeUploadMutation.isPending ? "Uploading..." : "Upload & Assign Document"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="investor-filter">Filter by Investor:</Label>
            <Select value={selectedInvestorFilter} onValueChange={setSelectedInvestorFilter}>
              <SelectTrigger id="investor-filter" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                {approvedInvestors.map((investor: Investor) => (
                  <SelectItem key={investor.id} value={investor.id}>
                    {getInvestorName(investor.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Admin access to all investor documents</span>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <CardTitle className="mb-2">No Documents Found</CardTitle>
            <CardDescription className="mb-6">
              {selectedInvestorFilter === "all" 
                ? "No documents have been uploaded yet. Upload your first document to get started."
                : `No documents found for the selected investor.`}
            </CardDescription>
            {selectedInvestorFilter === "all" && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-battles-gold hover:bg-battles-gold/90 text-battles-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc: SecureDocument) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 line-clamp-2">
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {doc.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant={doc.uploadedByRole === "admin" ? "default" : "secondary"} className="text-xs">
                      {doc.uploadedByRole}
                    </Badge>
                    {doc.ownerInvestorId && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                    {!doc.isVisible && (
                      <Badge variant="destructive" className="text-xs">
                        Hidden
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{formatFileSize(doc.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">
                      {doc.ownerInvestorId ? getInvestorName(doc.ownerInvestorId) : "Admin"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={doc.isVisible}
                      onCheckedChange={(checked) => 
                        toggleVisibilityMutation.mutate({ id: doc.id, isVisible: checked })
                      }
                      disabled={toggleVisibilityMutation.isPending}
                    />
                    <Label className="text-sm">
                      {doc.isVisible ? "Visible" : "Hidden"}
                    </Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManagePermissions(doc)}
                      className="text-battles-gold hover:text-battles-gold/80"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Permissions Management Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Document Permissions</DialogTitle>
            <DialogDescription>
              Assign viewing and download permissions for "{selectedDocumentForPermissions?.title}" to specific investors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {approvedInvestors.length === 0 ? (
              <p className="text-sm text-gray-500">No approved investors available</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 border-b pb-2">
                  <div>Investor</div>
                  <div className="text-center">Can View</div>
                  <div className="text-center">Can Download</div>
                </div>
                
                {approvedInvestors.map((investor: Investor) => (
                  <div key={investor.id} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm">
                      <div className="font-medium">{getInvestorName(investor.id)}</div>
                      <div className="text-gray-500 text-xs">{investor.email}</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={documentPermissions[investor.id]?.canView || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(investor.id, 'canView', checked as boolean)
                        }
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <Checkbox
                        checked={documentPermissions[investor.id]?.canDownload || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(investor.id, 'canDownload', checked as boolean)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSavePermissions}
                disabled={updatePermissionsMutation.isPending}
                className="flex-1 bg-battles-gold hover:bg-battles-gold/90 text-battles-black"
              >
                {updatePermissionsMutation.isPending ? "Saving..." : "Save Permissions"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPermissionsDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}