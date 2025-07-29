import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertInvestorAccessRequestSchema, type InsertInvestorAccessRequest } from "@shared/schema";
import { Shield, User, Building, DollarSign } from "lucide-react";

interface InvestorAccessRequestFormProps {
  onClose: () => void;
}

export default function InvestorAccessRequestForm({ onClose }: InvestorAccessRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertInvestorAccessRequest>({
    resolver: zodResolver(insertInvestorAccessRequestSchema.extend({
      firstName: insertInvestorAccessRequestSchema.shape.firstName.min(1, "First name is required"),
      lastName: insertInvestorAccessRequestSchema.shape.lastName.min(1, "Last name is required"),
      email: insertInvestorAccessRequestSchema.shape.email.email("Invalid email address"),
      investmentInterest: insertInvestorAccessRequestSchema.shape.investmentInterest.min(10, "Please provide more details about your investment interest"),
      reasonForInterest: insertInvestorAccessRequestSchema.shape.reasonForInterest.min(20, "Please provide a detailed reason for your interest"),
    })),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      investmentInterest: "",
      netWorth: "",
      investmentExperience: "",
      reasonForInterest: "",
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (data: InsertInvestorAccessRequest) => {
      await apiRequest("POST", "/api/investor/access-request", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your investor access request has been submitted. We'll review it and get back to you within 48 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit access request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInvestorAccessRequest) => {
    requestMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full bg-black border-battles-gold">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-battles-gold mx-auto mb-4" />
            <CardTitle className="text-2xl font-playfair text-battles-gold">
              Request Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/80">
              Thank you for your interest in investing with Battles Budz. We've received your access request and will review it within 48 hours.
            </p>
            <p className="text-battles-gold text-sm">
              We'll contact you at the email address you provided with our decision.
            </p>
            <Button 
              onClick={onClose}
              className="bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold w-full"
            >
              Continue Browsing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex py-8 px-4">
        <Card className="max-w-2xl w-full bg-black border-battles-gold m-auto">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-battles-gold mx-auto mb-4" />
          <CardTitle className="text-2xl font-playfair text-battles-gold">
            Request Investor Access
          </CardTitle>
          <p className="text-white/80">
            Please provide information about yourself and your investment interests to request access to our private investor portal.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-battles-gold">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field} 
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
                        <FormLabel className="text-white">Last Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Smith" 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="john@example.com" 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(555) 123-4567" 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-battles-gold">
                  <Building className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Professional Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Company Name" 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Position/Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="CEO, Investor, etc." 
                            className="bg-gray-900 border-gray-700 text-white"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Investment Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-battles-gold">
                  <DollarSign className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Investment Information</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="investmentInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Investment Interest *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your investment interest, preferred investment amount, and timeline..."
                          className="bg-gray-900 border-gray-700 text-white min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Provide details about your investment goals and preferred investment size.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="netWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Net Worth Range</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select net worth range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under-100k">Under $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                          <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                          <SelectItem value="5m-10m">$5,000,000 - $10,000,000</SelectItem>
                          <SelectItem value="over-10m">Over $10,000,000</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="investmentExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Investment Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your previous investment experience, particularly in cannabis or similar industries..."
                          className="bg-gray-900 border-gray-700 text-white min-h-[80px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Include any relevant investment experience, especially in cannabis, retail, or startups.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reasonForInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Why Battles Budz? *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please explain why you're interested in investing in Battles Budz specifically..."
                          className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Tell us what attracts you to our business model, market opportunity, or team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={requestMutation.isPending}
                  className="flex-1 bg-battles-gold hover:bg-battles-gold/90 text-black font-semibold"
                >
                  {requestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}