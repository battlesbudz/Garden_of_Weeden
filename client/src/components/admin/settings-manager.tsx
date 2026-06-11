import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

interface SiteSettings {
  siteName?: string;
  siteTagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  businessHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  footerText?: string;
  [key: string]: string | undefined;
}

// Default settings that match useSiteSettings.ts
const defaultSettings: SiteSettings = {
  siteName: "Garden of Weeden",
  siteTagline: "Farm to Flame Cannabis",
  contactEmail: "manager.gardenofweeden@gmail.com",
  contactPhone: "(716) 420-1591",
  address: "1455 Niagara St, Buffalo, NY 14213",
  businessHours: "Mon-Tue: 10am-7:30pm\nWed: 10am-8:30pm\nThu-Sat: 10am-10pm\nSun: 10am-6pm",
  facebookUrl: "",
  instagramUrl: "https://www.instagram.com/garden_of_weeden_ny",
  twitterUrl: "",
  footerText: "",
};

export default function SettingsManager() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SiteSettings>({...defaultSettings});

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || defaultSettings.siteName,
        siteTagline: settings.siteTagline || defaultSettings.siteTagline,
        contactEmail: settings.contactEmail || defaultSettings.contactEmail,
        contactPhone: settings.contactPhone || defaultSettings.contactPhone,
        address: settings.address || defaultSettings.address,
        businessHours: settings.businessHours || defaultSettings.businessHours,
        facebookUrl: settings.facebookUrl || defaultSettings.facebookUrl,
        instagramUrl: settings.instagramUrl || defaultSettings.instagramUrl,
        twitterUrl: settings.twitterUrl || defaultSettings.twitterUrl,
        footerText: settings.footerText || defaultSettings.footerText,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SiteSettings) => {
      return await apiRequest("POST", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-battles-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-battles-gold" />
            General Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Basic information about your site that appears across the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName" className="text-white">Site Name</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                placeholder="Garden of Weeden"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="siteTagline" className="text-white">Tagline</Label>
              <Input
                id="siteTagline"
                value={formData.siteTagline}
                onChange={(e) => handleChange("siteTagline", e.target.value)}
                placeholder="Farm to Flame cannabis in Buffalo, NY"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-battles-gold" />
            Contact Information
          </CardTitle>
          <CardDescription className="text-gray-400">
            Contact details shown in the footer and contact page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                placeholder="manager.gardenofweeden@gmail.com"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
                placeholder="(716) 420-1591"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address" className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="1455 Niagara St, Buffalo, NY 14213"
              className="bg-zinc-900 border-zinc-600 text-white"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="businessHours" className="text-white">Business Hours</Label>
            <Textarea
              id="businessHours"
              value={formData.businessHours}
              onChange={(e) => handleChange("businessHours", e.target.value)}
              placeholder="Mon-Tue: 10am-7:30pm&#10;Wed: 10am-8:30pm&#10;Thu-Sat: 10am-10pm&#10;Sun: 10am-6pm"
              className="bg-zinc-900 border-zinc-600 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Facebook className="w-5 h-5 text-battles-gold" />
            Social Media Links
          </CardTitle>
          <CardDescription className="text-gray-400">
            Links to your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="facebookUrl" className="text-white flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </Label>
              <Input
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/gardenofweeden"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl" className="text-white flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/gardenofweeden"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl" className="text-white flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter / X
              </Label>
              <Input
                id="twitterUrl"
                value={formData.twitterUrl}
                onChange={(e) => handleChange("twitterUrl", e.target.value)}
                placeholder="https://x.com/gardenofweeden"
                className="bg-zinc-900 border-zinc-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Footer Text</CardTitle>
          <CardDescription className="text-gray-400">
            Additional text that appears in the website footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="footerText"
            value={formData.footerText}
            onChange={(e) => handleChange("footerText", e.target.value)}
            placeholder="Farm to Flame cannabis microbusiness serving Buffalo and Western New York."
            className="bg-zinc-900 border-zinc-600 text-white"
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-battles-gold text-black hover:bg-battles-gold/90"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
