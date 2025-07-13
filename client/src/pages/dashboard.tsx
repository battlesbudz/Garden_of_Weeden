import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import AdminDashboard from "./admin";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (!isLoading && isAuthenticated && !isAdmin) {
      setLocation("/shop");
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <AdminDashboard />;
}