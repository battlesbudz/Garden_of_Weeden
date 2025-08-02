import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Upload, Download, Calendar, User, Shield, Plus } from "lucide-react";
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
  canView: boolean;
  canDownload: boolean;
}

interface DocumentUploadFormData {
  title: string;
  description: string;
}

export default function SecureDocuments() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState<DocumentUploadFormData>({
    title: "",
    description: "",
  });
  const [pendingUpload, setPendingUpload] = useState<{
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch investor documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ["/api/investor-docs/list"],
  });

  const documents = (documentsData as any)?.documents || [];

  // Upload URL mutation
  const getUploadUrlMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/investor-docs/upload", {
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
      return await apiRequest("/api/investor-docs/complete", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investor-docs/list"] });
      setShowUploadDialog(false);
      setUploadForm({ title: "", description: "" });
      setPendingUpload(null);
      toast({
        title: "Success",
        description: "Document uploaded successfully!",
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
    });
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/investor-docs/${documentId}/download`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Document downloaded successfully!",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
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

  if (isLoading) {
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
              Secure Documents
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your private document library and shared investment materials
            </p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-battles-gold hover:bg-battles-gold/90 text-battles-black">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Secure Document</DialogTitle>
                <DialogDescription>
                  Upload a document to your private library. Only you will have access to this document unless shared by an admin.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
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

                <Button
                  onClick={handleSubmitUpload}
                  disabled={!pendingUpload || !uploadForm.title.trim() || completeUploadMutation.isPending}
                  className="w-full bg-battles-gold hover:bg-battles-gold/90 text-battles-black"
                >
                  {completeUploadMutation.isPending ? "Saving..." : "Save Document"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>All documents are encrypted and secure</span>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <CardTitle className="mb-2">No Documents Yet</CardTitle>
            <CardDescription className="mb-6">
              Upload your first document or wait for admin-shared materials to appear here.
            </CardDescription>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="bg-battles-gold hover:bg-battles-gold/90 text-battles-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Document
                </Button>
              </DialogTrigger>
            </Dialog>
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
                    {doc.uploadedByRole === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                    {doc.ownerInvestorId && (
                      <Badge variant="outline" className="text-xs">
                        Private
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
                    <span className="capitalize">{doc.uploadedByRole}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {doc.canDownload && (
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="flex-1 bg-battles-gold hover:bg-battles-gold/90 text-battles-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {!doc.canDownload && doc.canView && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      disabled
                    >
                      View Only
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}