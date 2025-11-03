import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { toast } = useToast();
  const { register } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Welcome to Garden of Weeden!",
          description: "Your account has been created successfully.",
        });
        onSuccess?.();
      },
      onError: (error: any) => {
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-battles-gold">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-playfair text-battles-gold">
          Join Garden of Weeden
        </CardTitle>
        <p className="text-white">Create your account</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-battles-gold">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 border-battles-gold/30 text-white placeholder:text-gray-400"
                        placeholder="First name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-battles-gold">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 border-battles-gold/30 text-white placeholder:text-gray-400"
                        placeholder="Last name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      placeholder="Choose a username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-battles-gold">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="bg-white/10 border-battles-gold/30 text-white placeholder:text-gray-400"
                      placeholder="Enter your email"
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
                      placeholder="Create a password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
              disabled={register.isPending}
            >
              {register.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}