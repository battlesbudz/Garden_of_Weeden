import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Note: ObjectUploader component needs to be available - commenting out for now
// import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// import type { UploadResult } from "@uppy/core";
import { 
  Upload, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  EyeOff
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

export function DocumentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFormData, setUploadFormData] = useState<DocumentUploadFormData>({
    title: "",
    description: "",
    assignedInvestorIds: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // Fetch documents
  const { data: documents = [] } = useQuery<SecureDocument[]>({
    queryKey: ['/api/admin/documents'],
  });

  // Fetch investors for assignment
  const { data: investors = [] } = useQuery<Investor[]>({
    queryKey: ['/api/admin/investors'],
  });

  // Document upload mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (documentData: any) => {
      const response = await apiRequest('POST', '/api/admin/documents/upload', documentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      setShowUploadDialog(false);
      setUploadFormData({ title: "", description: "", assignedInvestorIds: [] });
      setUploadedFiles([]);
      toast({ description: "Document uploaded successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to upload document", variant: "destructive" });
    }
  });

  // Toggle document visibility
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ documentId, isVisible }: { documentId: number; isVisible: boolean }) => {
      const response = await apiRequest('PATCH', `/api/admin/documents/${documentId}`, { isVisible });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      toast({ description: "Document visibility updated!" });
    },
    onError: () => {
      toast({ description: "Failed to update document visibility", variant: "destructive" });
    }
  });

  // Delete document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await apiRequest('DELETE', `/api/admin/documents/${documentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/documents'] });
      toast({ description: "Document deleted successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to delete document", variant: "destructive" });
    }
  });

  const handleUploadSuccess = (result: any) => {
    setUploadedFiles([result]);
  };

  const handleDocumentUpload = () => {
    if (!uploadedFiles.length || !uploadFormData.title.trim()) {
      toast({ description: "Please provide a title and upload a file", variant: "destructive" });
      return;
    }

    const documentData = {
      title: uploadFormData.title,
      description: uploadFormData.description,
      filePath: uploadedFiles[0].uploadURL,
      fileName: uploadedFiles[0].name,
      fileSize: uploadedFiles[0].size || 0,
      mimeType: uploadedFiles[0].type || 'application/octet-stream',
      assignedInvestorIds: uploadFormData.assignedInvestorIds,
    };

    uploadDocumentMutation.mutate(documentData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Management ({documents.length})
            </span>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                  <DialogDescription>
                    Upload a document and assign it to specific investors
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title *</Label>
                    <Input
                      id="title"
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter document title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadFormData.description}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter document description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>File Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">File upload component to be implemented</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Assign to Investors</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {investors.map((investor) => (
                        <label key={investor.id} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={uploadFormData.assignedInvestorIds.includes(investor.id)}
                            onCheckedChange={(checked) => {
                              setUploadFormData(prev => ({
                                ...prev,
                                assignedInvestorIds: checked
                                  ? [...prev.assignedInvestorIds, investor.id]
                                  : prev.assignedInvestorIds.filter(id => id !== investor.id)
                              }));
                            }}
                          />
                          <span className="text-sm">
                            {investor.firstName} {investor.lastName} ({investor.email})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDocumentUpload}
                    disabled={uploadDocumentMutation.isPending || !uploadFormData.title.trim() || !uploadedFiles.length}
                  >
                    {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Document"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Manage secure documents for investors</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{document.title}</h4>
                    {document.description && (
                      <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{document.fileName}</span>
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                      <Badge variant={document.isVisible ? "default" : "secondary"}>
                        {document.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVisibilityMutation.mutate({ 
                        documentId: document.id, 
                        isVisible: !document.isVisible 
                      })}
                      disabled={toggleVisibilityMutation.isPending}
                    >
                      {document.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(document.filePath, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDocumentMutation.mutate(document.id)}
                      disabled={deleteDocumentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}