import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, CheckCircle, X } from "lucide-react";

interface Investor {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: "pending" | "approved" | "rejected";
}

interface InvestorAccessRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  investmentInterest: string;
  netWorth: string | null;
  investmentExperience: string | null;
  reasonForInterest: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<InvestorAccessRequest | null>(null);

  // Fetch investor access requests
  const { data: accessRequests = [] } = useQuery<InvestorAccessRequest[]>({
    queryKey: ['/api/admin/investor-requests'],
  });

  // Fetch investors
  const { data: investors = [] } = useQuery<Investor[]>({
    queryKey: ['/api/admin/investors'],
  });

  // Handle approval/rejection of access requests
  const handleAccessRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: number; action: 'approve' | 'reject' }) => {
      const response = await apiRequest('PATCH', `/api/admin/investor-requests/${requestId}`, { 
        status: action === 'approve' ? 'approved' : 'denied' 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/investor-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/investors'] });
      toast({ description: "Request updated successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to update request", variant: "destructive" });
    }
  });

  const pendingRequests = accessRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Access Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Access Requests ({pendingRequests.length})
          </CardTitle>
          <CardDescription>Review and approve investor access requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{request.firstName} {request.lastName}</h4>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    {request.company && (
                      <p className="text-sm text-gray-600">{request.position} at {request.company}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Investor Access Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-semibold">Name</label>
                                <p>{selectedRequest.firstName} {selectedRequest.lastName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-semibold">Email</label>
                                <p>{selectedRequest.email}</p>
                              </div>
                              {selectedRequest.phone && (
                                <div>
                                  <label className="text-sm font-semibold">Phone</label>
                                  <p>{selectedRequest.phone}</p>
                                </div>
                              )}
                              {selectedRequest.company && (
                                <div>
                                  <label className="text-sm font-semibold">Company</label>
                                  <p>{selectedRequest.company}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-semibold">Investment Interest</label>
                              <p className="mt-1">{selectedRequest.investmentInterest}</p>
                            </div>
                            <div>
                              <label className="text-sm font-semibold">Reason for Interest</label>
                              <p className="mt-1">{selectedRequest.reasonForInterest}</p>
                            </div>
                            {selectedRequest.investmentExperience && (
                              <div>
                                <label className="text-sm font-semibold">Investment Experience</label>
                                <p className="mt-1">{selectedRequest.investmentExperience}</p>
                              </div>
                            )}
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleAccessRequestMutation.mutate({ 
                                requestId: selectedRequest!.id, 
                                action: 'reject' 
                              });
                              setSelectedRequest(null);
                            }}
                            disabled={handleAccessRequestMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => {
                              handleAccessRequestMutation.mutate({ 
                                requestId: selectedRequest!.id, 
                                action: 'approve' 
                              });
                              setSelectedRequest(null);
                            }}
                            disabled={handleAccessRequestMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      onClick={() => handleAccessRequestMutation.mutate({ 
                        requestId: request.id, 
                        action: 'approve' 
                      })}
                      disabled={handleAccessRequestMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAccessRequestMutation.mutate({ 
                        requestId: request.id, 
                        action: 'reject' 
                      })}
                      disabled={handleAccessRequestMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Investors */}
      <Card>
        <CardHeader>
          <CardTitle>Active Investors ({investors.length})</CardTitle>
          <CardDescription>Manage current investor accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {investors.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active investors</p>
          ) : (
            <div className="space-y-4">
              {investors.map((investor) => (
                <div key={investor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">
                      {investor.firstName} {investor.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{investor.email}</p>
                    <Badge variant={investor.status === 'approved' ? 'default' : 'secondary'}>
                      {investor.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={investor.status === 'approved'}
                      onCheckedChange={(checked) => {
                        // Handle status toggle logic here
                        console.log(`Toggle investor ${investor.id} status to ${checked ? 'approved' : 'inactive'}`);
                      }}
                    />
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