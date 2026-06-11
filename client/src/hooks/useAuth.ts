import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { type User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user data after successful login
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const register = useMutation({
    mutationFn: async (details: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", details);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const updateMe = useMutation({
    mutationFn: async (details: {
      username?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      const response = await apiRequest("PATCH", "/api/auth/me", details);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!(user && user.role === 'admin'),
    login,
    register,
    updateMe,
  };
}
