import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, RefreshCw, Eye, Home, Sparkles, ChevronDown, ChevronUp,
  Star, ShoppingBag, BookOpen, Clock, Award, Mail
} from "lucide-react";

interface HomepageSettings {
  // Hero Section
  heroTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  heroShopButtonText: string;
  heroStoryButtonText: string;
  heroVeteranBadge: string;

  // Social Proof Section
  socialProofSubtitle: string;
  trustBadge1Title: string;
  trustBadge1Desc: string;
  trustBadge2Title: string;
  trustBadge2Desc: string;
  trustBadge3Title: string;
  trustBadge3Desc: string;
  trustBadge4Title: string;
  trustBadge4Desc: string;
  socialProofQuote: string;

  // Featured Products Section
  featuredTitle: string;
  featuredSubtitle: string;
  featuredBadgeText: string;
  featuredCtaText: string;
  featuredShippingNote: string;
  placeholder1Name: string;
  placeholder1Desc: string;
  placeholder2Name: string;
  placeholder2Desc: string;
  placeholder3Name: string;
  placeholder3Desc: string;

  // Brand Story Section
  storyTitle: string;
  storyText: string;
  storyButton1Text: string;
  storyButton2Text: string;

  // Urgency Banner
  urgencyBadge: string;
  urgencyTitle: string;
  urgencyDesc: string;
  urgencyCtaText: string;

  // Benefits Section
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  benefit4Title: string;
  benefit4Desc: string;
  benefit5Title: string;
  benefit5Desc: string;
  benefit6Title: string;
  benefit6Desc: string;
  benefitsCtaText: string;

  // Newsletter Section
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterBenefit1: string;
  newsletterBenefit2: string;
  newsletterBenefit3: string;
  newsletterCtaText: string;
  newsletterDisclaimer: string;
}

const defaultSettings: HomepageSettings = {
  // Hero Section
  heroTitle: "Garden of Weeden",
  heroTagline: "Farm to Flame Cannabis",
  heroSubtitle: "Local, small-batch cannabis products sourced from our farm south of Buffalo and small craft growers across Central and Western NY.",
  heroShopButtonText: "Shop Farm to Flame",
  heroStoryButtonText: "Our Story",
  heroVeteranBadge: "Farm to Flame",

  // Social Proof Section
  socialProofSubtitle: "Trusted by Buffalo & Beyond",
  trustBadge1Title: "Licensed & Compliant",
  trustBadge1Desc: "NYS Cannabis License Holder",
  trustBadge2Title: "Craft Farmer Network",
  trustBadge2Desc: "Regional small-batch partners",
  trustBadge3Title: "Sun-Grown Quality",
  trustBadge3Desc: "Natural outdoor cultivation",
  trustBadge4Title: "Buffalo Proud",
  trustBadge4Desc: "Local roots, local impact",
  socialProofQuote: "Farm to Flame - local craft cannabis from people who know the farmers behind the flower",

  // Featured Products Section
  featuredTitle: "Discover Our Harvest",
  featuredSubtitle: "Small-batch cannabis products sourced through our Farm to Flame network in Central and Western NY",
  featuredBadgeText: "Farm to Flame",
  featuredCtaText: "View Current Menu",
  featuredShippingNote: "Ask our team about current local farm partner releases and seasonal NYS craft products.",
  placeholder1Name: "Premium Flower",
  placeholder1Desc: "Hand-selected local craft cannabis",
  placeholder2Name: "Artisan Pre-Rolls",
  placeholder2Desc: "Craft pre-roll selections from NYS growers",
  placeholder3Name: "Seasonal Harvest",
  placeholder3Desc: "Limited batch releases",

  // Brand Story Section
  storyTitle: "Farm to Flame",
  storyText: "Garden of Weeden is a NYS licensed microbusiness and boutique cannabis dispensary built around a Farm to Flame concept. Our budtenders know the farmer partners, cultivation practices, and craft products we offer.",
  storyButton1Text: "Read Our Farm Story",
  storyButton2Text: "Shop Craft Products",

  // Urgency Banner
  urgencyBadge: "Farm to Flame Drop",
  urgencyTitle: "Small-Batch Craft Products",
  urgencyDesc: "Ask about current local farm partner releases and seasonal NYS craft products.",
  urgencyCtaText: "Shop Current Menu",

  // Benefits Section
  benefitsTitle: "Why Choose Garden of Weeden?",
  benefitsSubtitle: "Farm to Flame means local farmers, small-batch craft products, and budtenders who know the story behind the cannabis.",
  benefit1Title: "Local Farm Partners",
  benefit1Desc: "Products sourced from our farm and NYS small craft growers",
  benefit2Title: "Sun-Grown Excellence",
  benefit2Desc: "Natural outdoor cultivation",
  benefit3Title: "Lab-Tested Products",
  benefit3Desc: "Compliance-minded quality standards",
  benefit4Title: "Small-Batch Freshness",
  benefit4Desc: "Limited harvests, maximum care",
  benefit5Title: "Forbidden Fruit Lounge",
  benefit5Desc: "On-site consumption space for relaxing, events, and community",
  benefit6Title: "Buffalo Local",
  benefit6Desc: "Community-rooted cultivation",
  benefitsCtaText: "Shop Farm to Flame",

  // Newsletter Section
  newsletterTitle: "Join the Garden List",
  newsletterSubtitle: "Get updates on new harvests, local farm partner releases, Forbidden Fruit lounge events, and Farm to Flame drops.",
  newsletterBenefit1: "Early access to limited batches",
  newsletterBenefit2: "Event and lounge updates",
  newsletterBenefit3: "Buffalo cannabis community updates",
  newsletterCtaText: "Join the List",
  newsletterDisclaimer: "No spam, ever. Unsubscribe anytime.",
};

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-green-500">{icon}</span>
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 pt-2 border-t border-zinc-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function HomepageManager() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<HomepageSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) {
      const loadedSettings: HomepageSettings = {} as HomepageSettings;
      for (const key of Object.keys(defaultSettings) as (keyof HomepageSettings)[]) {
        loadedSettings[key] = settings[key] || defaultSettings[key];
      }
      setFormData(loadedSettings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: HomepageSettings) => {
      await apiRequest("POST", "/api/admin/settings", data as unknown as Record<string, string>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      setHasChanges(false);
      toast({ title: "Homepage content saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save homepage content", variant: "destructive" });
    },
  });

  const handleChange = (key: keyof HomepageSettings, value: string) => {
    setFormData({ ...formData, [key]: value });
    setHasChanges(true);
  };

  const handleReset = () => {
    if (confirm("Reset all homepage content to defaults? This cannot be undone.")) {
      setFormData(defaultSettings);
      saveMutation.mutate(defaultSettings);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 mb-4 sticky top-0 bg-zinc-900 py-4 z-10">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-gray-400 text-sm">Customize every section of your homepage</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => window.open("/", "_blank")}
            className="border-zinc-700 text-gray-300 hover:bg-zinc-800 flex-1 sm:flex-none"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-zinc-700 text-gray-300 hover:bg-zinc-800 flex-1 sm:flex-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Hero Section */}
        <CollapsibleSection title="Hero Section" icon={<Sparkles className="w-5 h-5" />} defaultOpen={true}>
          <div className="grid gap-4">
            <div>
              <Label className="text-white">Main Title</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
              <p className="text-gray-500 text-xs mt-1">The large headline at the top</p>
            </div>
            <div>
              <Label className="text-white">Tagline</Label>
              <Input
                value={formData.heroTagline}
                onChange={(e) => handleChange("heroTagline", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Subtitle</Label>
              <Textarea
                value={formData.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Shop Button Text</Label>
                <Input
                  value={formData.heroShopButtonText}
                  onChange={(e) => handleChange("heroShopButtonText", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Story Button Text</Label>
                <Input
                  value={formData.heroStoryButtonText}
                  onChange={(e) => handleChange("heroStoryButtonText", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Veteran Badge Text</Label>
              <Input
                value={formData.heroVeteranBadge}
                onChange={(e) => handleChange("heroVeteranBadge", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Social Proof Section */}
        <CollapsibleSection title="Trust Badges" icon={<Star className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Section Subtitle</Label>
              <Input
                value={formData.socialProofSubtitle}
                onChange={(e) => handleChange("socialProofSubtitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-zinc-900 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Badge {num}</p>
                  <div className="space-y-2">
                    <Input
                      value={formData[`trustBadge${num}Title` as keyof HomepageSettings]}
                      onChange={(e) => handleChange(`trustBadge${num}Title` as keyof HomepageSettings, e.target.value)}
                      placeholder="Title"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <Input
                      value={formData[`trustBadge${num}Desc` as keyof HomepageSettings]}
                      onChange={(e) => handleChange(`trustBadge${num}Desc` as keyof HomepageSettings, e.target.value)}
                      placeholder="Description"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-white">Bottom Quote</Label>
              <Input
                value={formData.socialProofQuote}
                onChange={(e) => handleChange("socialProofQuote", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Featured Products Section */}
        <CollapsibleSection title="Featured Products" icon={<ShoppingBag className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Badge Text</Label>
              <Input
                value={formData.featuredBadgeText}
                onChange={(e) => handleChange("featuredBadgeText", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Section Title</Label>
              <Input
                value={formData.featuredTitle}
                onChange={(e) => handleChange("featuredTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Section Subtitle</Label>
              <Textarea
                value={formData.featuredSubtitle}
                onChange={(e) => handleChange("featuredSubtitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            
            <div className="border-t border-zinc-700 pt-4 mt-4">
              <p className="text-gray-400 text-sm mb-3">Placeholder Cards (shown when real products aren't available)</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="bg-zinc-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Card {num}</p>
                    <div className="space-y-2">
                      <Input
                        value={formData[`placeholder${num}Name` as keyof HomepageSettings]}
                        onChange={(e) => handleChange(`placeholder${num}Name` as keyof HomepageSettings, e.target.value)}
                        placeholder="Product Name"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <Input
                        value={formData[`placeholder${num}Desc` as keyof HomepageSettings]}
                        onChange={(e) => handleChange(`placeholder${num}Desc` as keyof HomepageSettings, e.target.value)}
                        placeholder="Description"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">CTA Button Text</Label>
                <Input
                  value={formData.featuredCtaText}
                  onChange={(e) => handleChange("featuredCtaText", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Shipping Note</Label>
                <Input
                  value={formData.featuredShippingNote}
                  onChange={(e) => handleChange("featuredShippingNote", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Brand Story Section */}
        <CollapsibleSection title="Brand Story" icon={<BookOpen className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Section Title</Label>
              <Input
                value={formData.storyTitle}
                onChange={(e) => handleChange("storyTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Story Text</Label>
              <Textarea
                value={formData.storyText}
                onChange={(e) => handleChange("storyText", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
                rows={4}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Story Button Text</Label>
                <Input
                  value={formData.storyButton1Text}
                  onChange={(e) => handleChange("storyButton1Text", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Products Button Text</Label>
                <Input
                  value={formData.storyButton2Text}
                  onChange={(e) => handleChange("storyButton2Text", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Urgency Banner */}
        <CollapsibleSection title="Urgency Banner" icon={<Clock className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Badge Text</Label>
                <Input
                  value={formData.urgencyBadge}
                  onChange={(e) => handleChange("urgencyBadge", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white">CTA Button Text</Label>
                <Input
                  value={formData.urgencyCtaText}
                  onChange={(e) => handleChange("urgencyCtaText", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Heading</Label>
              <Input
                value={formData.urgencyTitle}
                onChange={(e) => handleChange("urgencyTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Input
                value={formData.urgencyDesc}
                onChange={(e) => handleChange("urgencyDesc", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Benefits Section */}
        <CollapsibleSection title="Benefits Section" icon={<Award className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Section Title</Label>
              <Input
                value={formData.benefitsTitle}
                onChange={(e) => handleChange("benefitsTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Section Subtitle</Label>
              <Textarea
                value={formData.benefitsSubtitle}
                onChange={(e) => handleChange("benefitsSubtitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            
            <div className="border-t border-zinc-700 pt-4">
              <p className="text-gray-400 text-sm mb-3">Benefit Cards (6 cards displayed in a grid)</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="bg-zinc-900 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2">Card {num}</p>
                    <div className="space-y-2">
                      <Input
                        value={formData[`benefit${num}Title` as keyof HomepageSettings]}
                        onChange={(e) => handleChange(`benefit${num}Title` as keyof HomepageSettings, e.target.value)}
                        placeholder="Title"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <Input
                        value={formData[`benefit${num}Desc` as keyof HomepageSettings]}
                        onChange={(e) => handleChange(`benefit${num}Desc` as keyof HomepageSettings, e.target.value)}
                        placeholder="Description"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-white">CTA Button Text</Label>
              <Input
                value={formData.benefitsCtaText}
                onChange={(e) => handleChange("benefitsCtaText", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Newsletter Section */}
        <CollapsibleSection title="Newsletter Section" icon={<Mail className="w-5 h-5" />}>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Section Title</Label>
              <Input
                value={formData.newsletterTitle}
                onChange={(e) => handleChange("newsletterTitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Subtitle</Label>
              <Textarea
                value={formData.newsletterSubtitle}
                onChange={(e) => handleChange("newsletterSubtitle", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white mt-1"
                rows={2}
              />
            </div>
            
            <div className="border-t border-zinc-700 pt-4">
              <p className="text-gray-400 text-sm mb-3">Member Benefits (shown as bullet points)</p>
              <div className="space-y-2">
                <div>
                  <Label className="text-white text-sm">Benefit 1</Label>
                  <Input
                    value={formData.newsletterBenefit1}
                    onChange={(e) => handleChange("newsletterBenefit1", e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Benefit 2</Label>
                  <Input
                    value={formData.newsletterBenefit2}
                    onChange={(e) => handleChange("newsletterBenefit2", e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Benefit 3</Label>
                  <Input
                    value={formData.newsletterBenefit3}
                    onChange={(e) => handleChange("newsletterBenefit3", e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-white mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Button Text</Label>
                <Input
                  value={formData.newsletterCtaText}
                  onChange={(e) => handleChange("newsletterCtaText", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-white">Disclaimer Text</Label>
                <Input
                  value={formData.newsletterDisclaimer}
                  onChange={(e) => handleChange("newsletterDisclaimer", e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-white mt-1"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
