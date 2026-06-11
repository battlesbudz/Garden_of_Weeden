import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: (response: any) => {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Check if there's a redirect URL stored (from where user came from)
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Redirect based on stored destination or user role
        const user = response?.user;
        if (redirectTo && redirectTo !== '/login') {
          window.location.href = redirectTo;
        } else if (user?.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
        
        onSuccess?.();
      },
      onError: (error: any) => {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-battles-gold">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-playfair text-battles-gold">
          Welcome Back
        </CardTitle>
        <p className="text-white">Sign in to your account</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-battles-gold">Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/10 border-battles-gold/30 text-white placeholder:text-gray-400"
                      placeholder="Enter your username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-battles-gold">Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      className="bg-white/10 border-battles-gold/30 text-white placeholder:text-gray-400"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
