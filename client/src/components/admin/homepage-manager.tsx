import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Eye, Home, Sparkles } from "lucide-react";

interface HomepageSettings {
  heroTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  pillar1Title: string;
  pillar1Text: string;
  pillar2Title: string;
  pillar2Text: string;
  pillar3Title: string;
  pillar3Text: string;
  locationText: string;
  ctaButton1Text: string;
  ctaButton2Text: string;
  ctaButton3Text: string;
}

const defaultSettings: HomepageSettings = {
  heroTitle: "Garden of Weeden",
  heroTagline: "From Service to Soil",
  heroSubtitle: "Veteran-Owned Cannabis Microbusiness in Buffalo, NY",
  pillar1Title: "Veteran-Owned",
  pillar1Text: "Quality cultivation by those who served",
  pillar2Title: "Buffalo Roots",
  pillar2Text: "Grown in Western NY's micro-terroir",
  pillar3Title: "Wellness Focused",
  pillar3Text: "Supporting veteran healing journeys",
  locationText: "Proudly Cultivated in Buffalo, NY",
  ctaButton1Text: "Our Story",
  ctaButton2Text: "Learn More",
  ctaButton3Text: "Get Updates",
};

export default function HomepageManager() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<HomepageSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) {
      const loadedSettings: HomepageSettings = {
        heroTitle: settings.heroTitle || defaultSettings.heroTitle,
        heroTagline: settings.heroTagline || defaultSettings.heroTagline,
        heroSubtitle: settings.heroSubtitle || defaultSettings.heroSubtitle,
        pillar1Title: settings.pillar1Title || defaultSettings.pillar1Title,
        pillar1Text: settings.pillar1Text || defaultSettings.pillar1Text,
        pillar2Title: settings.pillar2Title || defaultSettings.pillar2Title,
        pillar2Text: settings.pillar2Text || defaultSettings.pillar2Text,
        pillar3Title: settings.pillar3Title || defaultSettings.pillar3Title,
        pillar3Text: settings.pillar3Text || defaultSettings.pillar3Text,
        locationText: settings.locationText || defaultSettings.locationText,
        ctaButton1Text: settings.ctaButton1Text || defaultSettings.ctaButton1Text,
        ctaButton2Text: settings.ctaButton2Text || defaultSettings.ctaButton2Text,
        ctaButton3Text: settings.ctaButton3Text || defaultSettings.ctaButton3Text,
      };
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
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-battles-gold" />
          <span className="text-gray-400">Customize your homepage content</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            className="bg-battles-gold text-black hover:bg-battles-gold/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-battles-gold" />
            Hero Section
          </h3>
          <div className="grid gap-4">
            <div>
              <Label className="text-white">Main Title</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                placeholder="Garden of Weeden"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <p className="text-gray-500 text-sm mt-1">The large headline at the top of your homepage</p>
            </div>
            <div>
              <Label className="text-white">Tagline</Label>
              <Input
                value={formData.heroTagline}
                onChange={(e) => handleChange("heroTagline", e.target.value)}
                placeholder="From Service to Soil"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <p className="text-gray-500 text-sm mt-1">A memorable phrase that captures your brand</p>
            </div>
            <div>
              <Label className="text-white">Subtitle</Label>
              <Textarea
                value={formData.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                placeholder="Veteran-Owned Cannabis Microbusiness in Buffalo, NY"
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={2}
              />
              <p className="text-gray-500 text-sm mt-1">Additional description shown below the tagline</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-white font-semibold mb-4">Feature Pillars</h3>
          <p className="text-gray-400 text-sm mb-4">Three key features or values displayed on the homepage</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label className="text-white">Pillar 1 Title</Label>
              <Input
                value={formData.pillar1Title}
                onChange={(e) => handleChange("pillar1Title", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <Label className="text-white">Pillar 1 Text</Label>
              <Input
                value={formData.pillar1Text}
                onChange={(e) => handleChange("pillar1Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-white">Pillar 2 Title</Label>
              <Input
                value={formData.pillar2Title}
                onChange={(e) => handleChange("pillar2Title", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <Label className="text-white">Pillar 2 Text</Label>
              <Input
                value={formData.pillar2Text}
                onChange={(e) => handleChange("pillar2Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-white">Pillar 3 Title</Label>
              <Input
                value={formData.pillar3Title}
                onChange={(e) => handleChange("pillar3Title", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
              <Label className="text-white">Pillar 3 Text</Label>
              <Input
                value={formData.pillar3Text}
                onChange={(e) => handleChange("pillar3Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-white font-semibold mb-4">Call-to-Action Buttons</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Primary Button</Label>
              <Input
                value={formData.ctaButton1Text}
                onChange={(e) => handleChange("ctaButton1Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Secondary Button</Label>
              <Input
                value={formData.ctaButton2Text}
                onChange={(e) => handleChange("ctaButton2Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Tertiary Button</Label>
              <Input
                value={formData.ctaButton3Text}
                onChange={(e) => handleChange("ctaButton3Text", e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h3 className="text-white font-semibold mb-4">Location Badge</h3>
          <div>
            <Label className="text-white">Location Text</Label>
            <Input
              value={formData.locationText}
              onChange={(e) => handleChange("locationText", e.target.value)}
              placeholder="Proudly Cultivated in Buffalo, NY"
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <p className="text-gray-500 text-sm mt-1">Shown at the bottom of the hero section</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => window.open("/", "_blank")}
          className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Homepage
        </Button>
      </div>
    </div>
  );
}
