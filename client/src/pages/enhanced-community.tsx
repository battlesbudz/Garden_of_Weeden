import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMeetingRequestSchema, type InsertMeetingRequest } from "@shared/schema";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Users2,
  Home,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { GamificationWidget } from '../components/gamification/gamification-widget';
import { ForumSection } from '../components/community/ForumSection';
import { EducationGuides } from '../components/community/EducationGuides';
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle, CANNABIS_KEYWORDS } from "@/utils/seo";

export default function EnhancedCommunityPage() {
  const [activeTab, setActiveTab] = useState("forum");
  const { toast } = useToast();

  // Expert meeting request form
  const form = useForm<InsertMeetingRequest>({
    resolver: zodResolver(insertMeetingRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "",
      preferredDate: "",
      duration: "30",
    },
  });

  const requestMeetingMutation = useMutation({
    mutationFn: async (requestData: InsertMeetingRequest) => {
      const response = await apiRequest('POST', '/api/calendar/request', requestData);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({ description: "Expert session request submitted successfully!" });
    },
    onError: () => {
      toast({ description: "Failed to submit request", variant: "destructive" });
    }
  });

  const handleMeetingRequest = (values: InsertMeetingRequest) => {
    requestMeetingMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-battles-black via-gray-900 to-battles-black">
      <SEOHead
        title={getPageTitle("Cannabis Community Forum & Education Hub")}
        description="Join the premier cannabis community in New York. Connect with fellow enthusiasts, access educational resources, participate in discussions, and book expert consultations."
        keywords={CANNABIS_KEYWORDS.community}
        canonicalUrl={getCanonicalUrl("/community")}
        ogType="website"
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Community <span className="text-battles-gold">Hub</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect, learn, and grow with fellow cannabis enthusiasts in New York's premier community platform.
          </p>
        </div>

        {/* Gamification Widget */}
        <div className="mb-8">
          <GamificationWidget />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-black/50 backdrop-blur-sm border border-battles-gold/20">
              <TabsTrigger 
                value="forum" 
                className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Forum
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Learn
              </TabsTrigger>
              <TabsTrigger 
                value="experts" 
                className="data-[state=active]:bg-battles-gold data-[state=active]:text-battles-black"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Experts
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <ForumSection />
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <EducationGuides />
          </TabsContent>

          {/* Expert Sessions Tab */}
          <TabsContent value="experts" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Connect with Cannabis Experts</h2>
                <p className="text-gray-300">
                  Book a one-on-one session with industry professionals for personalized guidance.
                </p>
              </div>
              
              <div className="bg-black/50 backdrop-blur-sm border border-battles-gold/20 rounded-lg p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleMeetingRequest)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-battles-gold">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-900 border-gray-700 text-white" 
                              placeholder="Your full name"
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
                          <FormLabel className="text-battles-gold">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              className="bg-gray-900 border-gray-700 text-white" 
                              placeholder="your@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-battles-gold">Discussion Topic</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-900 border-gray-700 text-white" 
                              placeholder="What would you like to discuss?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-battles-gold">Preferred Date</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date"
                                className="bg-gray-900 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-battles-gold">Duration (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number"
                                min="15"
                                max="120"
                                step="15"
                                className="bg-gray-900 border-gray-700 text-white" 
                                placeholder="30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-battles-gold text-battles-black hover:bg-yellow-600"
                      disabled={requestMeetingMutation.isPending}
                    >
                      {requestMeetingMutation.isPending ? "Submitting..." : "Request Expert Session"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}