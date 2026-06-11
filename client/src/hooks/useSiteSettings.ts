import { useQuery } from "@tanstack/react-query";

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  footerText: string;
}

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

export function useSiteSettings() {
  const { data, isLoading, error } = useQuery<Record<string, string>>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const settings: SiteSettings = {
    siteName: data?.siteName || defaultSettings.siteName,
    siteTagline: data?.siteTagline || defaultSettings.siteTagline,
    contactEmail: data?.contactEmail || defaultSettings.contactEmail,
    contactPhone: data?.contactPhone || defaultSettings.contactPhone,
    address: data?.address || defaultSettings.address,
    businessHours: data?.businessHours || defaultSettings.businessHours,
    facebookUrl: data?.facebookUrl || defaultSettings.facebookUrl,
    instagramUrl: data?.instagramUrl || defaultSettings.instagramUrl,
    twitterUrl: data?.twitterUrl || defaultSettings.twitterUrl,
    footerText: data?.footerText || defaultSettings.footerText,
  };

  return { settings, isLoading, error };
}
