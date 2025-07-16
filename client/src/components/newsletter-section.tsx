import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

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
    <section id="newsletter" className="py-20 bg-battles-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
          Stay <span className="text-battles-gold">Connected</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Be the first to know when we launch retail operations, special events,
          and exclusive product releases.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-gray-800 text-white border-gray-700 focus:border-battles-gold"
              required
            />
            <Button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold whitespace-nowrap"
            >
              {newsletterMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Get Updates"
              )}
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <h3 className="text-2xl font-bold mb-6 text-battles-gold">
            Follow Our Journey
          </h3>
          <div className="flex justify-center space-x-6">
            <a
              href="https://instagram.com/battles_budz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-battles-gold text-2xl transition-colors"
              title="Follow @battles_budz on Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100095028196403"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-battles-gold text-2xl transition-colors"
              title="Follow Battles Budz on Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/BattlesBudz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-battles-gold text-2xl transition-colors"
              title="Follow @BattlesBudz on Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/justin-battles-5548a018a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-battles-gold text-2xl transition-colors"
              title="Connect with Justin Battles on LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
