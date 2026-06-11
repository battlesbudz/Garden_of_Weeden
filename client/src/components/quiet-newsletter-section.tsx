import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function QuietNewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const newsletterMutation = useMutation({
    mutationFn: async (value: string) => apiRequest("POST", "/api/newsletter/subscribe", { email: value }),
    onSuccess: () => {
      toast({
        title: "You're on the list",
        description: "Watch your inbox for Garden of Weeden updates.",
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <section id="newsletter" className="border-t border-white/10 bg-battles-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="font-garden text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
              Garden updates
            </p>
            <h2 className="mt-2 font-storybook text-3xl text-parchment">Hear about new drops and events.</h2>
            <p className="mt-2 font-garden text-sm leading-relaxed text-gray-400">
              A simple email list for Farm to Flame releases, local partner drops, and lounge updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="quiet-newsletter-email">
              Email address
            </label>
            <input
              id="quiet-newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-12 flex-1 border border-white/15 bg-white/5 px-4 font-garden text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-green-400"
              required
              data-testid="quiet-newsletter-email-input"
            />
            <button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-green-700 px-6 font-garden text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
              data-testid="quiet-newsletter-subscribe-button"
            >
              {newsletterMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Join the List
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
