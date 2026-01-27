import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, User as UserIcon } from "lucide-react";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: string | null;
}

export default function UsersManager() {
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User role updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user role", variant: "destructive" });
    },
  });

  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
        <UserIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
        <p className="text-gray-400">No users yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">
        Total users: <span className="text-battles-gold font-semibold">{users.length}</span>
      </div>
      
      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Joined</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={`${user.firstName || "User"}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <span className="text-white font-medium">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || "Unknown User"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {user.email || "No email"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={user.role === "admin" 
                      ? "bg-battles-gold text-black" 
                      : "bg-zinc-700 text-gray-300"
                    }
                  >
                    {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="customer" className="text-gray-300">
                        Customer
                      </SelectItem>
                      <SelectItem value="admin" className="text-battles-gold">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-battles-gold" />
          Role Permissions
        </h4>
        <div className="text-sm text-gray-400 space-y-1">
          <p><span className="text-battles-gold font-medium">Admin:</span> Full access to all admin features, can manage users, products, settings, and content.</p>
          <p><span className="text-gray-300 font-medium">Customer:</span> Standard user access, can browse the shop and manage their own account.</p>
        </div>
      </div>
    </div>
  );
}
