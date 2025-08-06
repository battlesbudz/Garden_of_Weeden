import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, X, Eye } from "lucide-react";

interface AccessRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  investmentAmount: string;
  investmentType: string;
  experience: string;
  motivation: string;
  status: string;
  createdAt: string;
}

interface AccessRequestsManagerProps {
  accessRequests: AccessRequest[];
}

export function AccessRequestsManager({ accessRequests }: AccessRequestsManagerProps) {
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutations for handling requests
  const approveRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest('POST', `/api/investor/access-requests/${requestId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investor/access-requests"] });
      setApprovalModalOpen(false);
      setSelectedRequest(null);
      toast({
        title: "Success",
        description: "Access request approved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve access request.",
        variant: "destructive",
      });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: number; reason: string }) => {
      const response = await apiRequest('POST', `/api/investor/access-requests/${requestId}/reject`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investor/access-requests"] });
      setRejectionModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Access request rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject access request.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (request: AccessRequest) => {
    setSelectedRequest(request);
    setApprovalModalOpen(true);
  };

  const handleReject = (request: AccessRequest) => {
    setSelectedRequest(request);
    setRejectionModalOpen(true);
  };

  const handleViewDetails = (request: AccessRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const confirmApproval = () => {
    if (selectedRequest) {
      approveRequestMutation.mutate(selectedRequest.id);
    }
  };

  const confirmRejection = () => {
    if (selectedRequest && rejectionReason.trim()) {
      rejectRequestMutation.mutate({
        requestId: selectedRequest.id,
        reason: rejectionReason,
      });
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Pending Requests */}
      <div className="space-y-4">
        {accessRequests?.filter((req: AccessRequest) => req.status === 'pending').length > 0 ? (
          accessRequests
            .filter((req: AccessRequest) => req.status === 'pending')
            .map((request: AccessRequest) => (
              <Card key={request.id} className="bg-gray-900 border-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-battles-gold">
                          {request.firstName} {request.lastName}
                        </h3>
                        <Badge className="bg-yellow-900 text-yellow-300">Pending Review</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-gray-200 ml-2">{request.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Company:</span>
                          <span className="text-gray-200 ml-2">{request.company}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Investment Amount:</span>
                          <span className="text-gray-200 ml-2">{request.investmentAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Investment Type:</span>
                          <span className="text-gray-200 ml-2">{request.investmentType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                        className="border-gray-600 text-gray-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No pending access requests</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Processed Requests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-battles-gold">Processed Requests</h3>
        {accessRequests?.filter((req: AccessRequest) => req.status !== 'pending').length > 0 ? (
          accessRequests
            .filter((req: AccessRequest) => req.status !== 'pending')
            .map((request: AccessRequest) => (
              <Card key={request.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-200">
                          {request.firstName} {request.lastName}
                        </h3>
                        <Badge
                          className={
                            request.status === 'approved'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }
                        >
                          {request.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {request.email} • {request.company}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(request)}
                      className="border-gray-600 text-gray-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No processed requests</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approval Modal */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent className="bg-gray-900 border-battles-gold">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Approve Access Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to approve this investor access request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalModalOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              disabled={approveRequestMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {approveRequestMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="bg-gray-900 border-battles-gold">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Reject Access Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason" className="text-battles-gold">
                Rejection Reason
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please explain why this request is being rejected..."
                className="bg-gray-800 border-gray-600 text-gray-200 mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectionModalOpen(false);
                setRejectionReason("");
              }}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejection}
              disabled={!rejectionReason.trim() || rejectRequestMutation.isPending}
            >
              {rejectRequestMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="bg-gray-900 border-battles-gold max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-battles-gold">Request Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Full details of the investor access request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-battles-gold">Name</Label>
                  <p className="text-gray-200">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                </div>
                <div>
                  <Label className="text-battles-gold">Email</Label>
                  <p className="text-gray-200">{selectedRequest.email}</p>
                </div>
                <div>
                  <Label className="text-battles-gold">Phone</Label>
                  <p className="text-gray-200">{selectedRequest.phone}</p>
                </div>
                <div>
                  <Label className="text-battles-gold">Company</Label>
                  <p className="text-gray-200">{selectedRequest.company}</p>
                </div>
                <div>
                  <Label className="text-battles-gold">Investment Amount</Label>
                  <p className="text-gray-200">{selectedRequest.investmentAmount}</p>
                </div>
                <div>
                  <Label className="text-battles-gold">Investment Type</Label>
                  <p className="text-gray-200">{selectedRequest.investmentType}</p>
                </div>
              </div>
              <div>
                <Label className="text-battles-gold">Experience</Label>
                <p className="text-gray-200 mt-1">{selectedRequest.experience}</p>
              </div>
              <div>
                <Label className="text-battles-gold">Motivation</Label>
                <p className="text-gray-200 mt-1">{selectedRequest.motivation}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsModalOpen(false)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}