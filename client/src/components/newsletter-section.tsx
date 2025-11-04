import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Instagram } from "lucide-react";
import { SITE_CONFIG } from "@/utils/seo";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing! We'll keep you updated on our launch.",
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/subscribers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-midnight-grove/20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-4">
          Stay Updated
        </h2>
        <div className="h-1 w-32 bg-green-500 mx-auto mb-6"></div>
        <p className="font-storybook text-xl md:text-2xl text-green-400 mb-4">
          Join Our Newsletter
        </p>
        <p className="font-garden text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Be the first to know when we launch, receive veteran wellness resources, 
          and get exclusive updates from our Buffalo cultivation operation.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800 text-white border-green-500/30 focus:border-green-500 font-garden"
              required
              data-testid="newsletter-email-input"
              aria-label="Subscribe to newsletter to get notified when we launch"
            />
            <Button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="bg-green-500 hover:bg-green-700 text-white font-garden font-semibold whitespace-nowrap"
              data-testid="newsletter-subscribe-button"
            >
              {newsletterMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
          <p className="font-garden text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>

        <div className="mt-12 border-t border-green-500/20 pt-8">
          <h3 className="font-storybook text-2xl mb-6 text-parchment">
            Follow Our Cultivation Journey
          </h3>
          <div className="flex justify-center">
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 hover:scale-110 text-2xl transition-all duration-300"
              title="Follow us on Instagram"
              data-testid="newsletter-social-instagram"
              aria-label={`Follow ${SITE_CONFIG.name} on Instagram`}
            >
              <Instagram className="h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
