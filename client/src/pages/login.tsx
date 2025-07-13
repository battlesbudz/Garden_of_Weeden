import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    
    if (redirectTo && redirectTo !== '/login') {
      setLocation(redirectTo);
    } else if (isAdmin) {
      setLocation("/dashboard");
    } else {
      setLocation("/");
    }
    return null;
  }

  const handleAuthSuccess = () => {
    // Check if there's a redirect URL stored
    const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    
    // After successful login, redirect to intended destination
    setTimeout(() => {
      if (redirectTo && redirectTo !== '/login') {
        setLocation(redirectTo);
      } else if (isAdmin) {
        setLocation("/dashboard");
      } else {
        setLocation("/");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-battles-gold hover:text-battles-gold/80 hover:bg-battles-gold/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-battles-gold mb-2">
            Battles Budz
          </h1>
          <p className="text-white/80">
            Your premium cannabis experience awaits
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-battles-gold/30">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="register"
              className="data-[state=active]:bg-battles-gold data-[state=active]:text-black text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            By signing up, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}