import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Gift, Bell, Star, Instagram } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SITE_CONFIG } from "@/utils/seo";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const prefersReducedMotion = useReducedMotion();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Garden Guild!",
        description: "Check your inbox for exclusive member benefits.",
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

  const benefits = [
    { icon: Gift, text: "Exclusive member discounts" },
    { icon: Bell, text: "Early access to new strains" },
    { icon: Star, text: "VIP harvest notifications" },
  ];

  return (
    <section id="newsletter" className="relative py-24 bg-gradient-to-b from-battles-black via-midnight-grove/40 to-battles-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-midnight-grove/50 backdrop-blur-md border border-green-500/30 rounded-3xl p-10 md:p-14 shadow-2xl"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2 mb-6">
              <Gift className="h-4 w-4 text-green-400" />
              <span className="font-garden text-sm text-green-400 uppercase tracking-wide">Exclusive Benefits</span>
            </div>
            <h2 className="font-enchanted text-4xl md:text-5xl lg:text-6xl text-parchment mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Join the Garden Guild
            </h2>
            <p className="font-garden text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Get exclusive early access, member-only discounts, and be first to know about new harvests
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <IconComponent className="h-5 w-5 text-green-500" />
                  <span className="font-garden text-sm">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-battles-black/50 text-white border-green-500/30 focus:border-green-500 font-garden h-14 text-base px-5"
                required
                data-testid="newsletter-email-input"
                aria-label="Subscribe to newsletter"
              />
              <Button
                type="submit"
                disabled={newsletterMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white font-garden font-bold text-base h-14 px-8 shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all"
                data-testid="newsletter-subscribe-button"
              >
                {newsletterMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Now — It's Free"
                )}
              </Button>
            </div>
            <p className="font-garden text-gray-500 text-sm mt-4 text-center">
              No spam, ever. Unsubscribe anytime with one click.
            </p>
          </form>

          <div className="text-center border-t border-green-500/20 pt-8">
            <p className="font-garden text-gray-400 mb-4">Follow our cultivation journey</p>
            <a
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
              title="Follow us on Instagram"
              data-testid="newsletter-social-instagram"
              aria-label={`Follow ${SITE_CONFIG.name} on Instagram`}
            >
              <Instagram className="h-6 w-6" />
              <span className="font-garden text-sm">@gardenofweeden</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
