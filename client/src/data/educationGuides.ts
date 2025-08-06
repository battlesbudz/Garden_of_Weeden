import cultivationImage from "@assets/360_F_499206936_DTB3BAfocgPpunIz14tRTBZwwy5PC1Oi_1752425020338.jpg";

export interface GuideStep {
  id: number;
  title: string;
  content: string;
  tips?: string;
  warnings?: string;
}

export interface EducationGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  steps: GuideStep[];
  videoUrl?: string;
  thumbnail: string;
  tags: string[];
}

export const educationGuides: EducationGuide[] = [
  {
    id: "ny-cannabis-laws",
    title: "New York Cannabis Laws for Tourists",
    description: "Complete guide to legal cannabis consumption for visitors to New York State",
    category: "legal",
    difficulty: "Beginner",
    duration: "15 min",
    thumbnail: cultivationImage,
    tags: ["legal", "tourism", "new-york"],
    steps: [
      {
        id: 1,
        title: "Understanding Legal Age Requirements",
        content: "You must be 21 or older to purchase and consume cannabis in New York. Always carry valid ID.",
        tips: "Accepted ID includes driver's license, passport, or state-issued ID card.",
        warnings: "Penalties for underage possession can include fines and legal consequences."
      },
      {
        id: 2,
        title: "Purchase Limits and Locations",
        content: "You can purchase up to 3 ounces of flower or 24 grams of concentrate from licensed dispensaries.",
        tips: "Look for the official New York State cannabis license displayed in dispensaries.",
      },
      {
        id: 3,
        title: "Where You Can Consume",
        content: "Consumption is legal in private residences and designated consumption lounges like Battles Budz.",
        warnings: "Public consumption is prohibited and can result in fines. Never consume in vehicles."
      },
      {
        id: 4,
        title: "Transportation Rules",
        content: "Cannabis must be transported in sealed, original containers. Never drive under the influence.",
        tips: "Store cannabis in your trunk or a locked container when traveling by car."
      }
    ]
  },
  {
    id: "consumption-lounge-etiquette",
    title: "Cannabis Lounge Etiquette",
    description: "Learn proper etiquette for consumption lounges and social cannabis experiences",
    category: "culture",
    difficulty: "Beginner",
    duration: "10 min",
    thumbnail: cultivationImage,
    tags: ["etiquette", "social", "lounge"],
    steps: [
      {
        id: 1,
        title: "Arrival and Check-in",
        content: "Arrive on time for your reservation and present valid ID at check-in.",
        tips: "Call ahead if you're running late to maintain your reservation."
      },
      {
        id: 2,
        title: "Sharing and Social Consumption",
        content: "It's customary to offer to share, but never feel obligated to accept or share your personal cannabis.",
        tips: "Always ask before using someone else's consumption devices or accessories."
      },
      {
        id: 3,
        title: "Respect Staff and Other Customers",
        content: "Be courteous to budtenders and fellow consumers. Keep noise levels appropriate.",
        tips: "Staff are knowledgeable - don't hesitate to ask questions about products or consumption methods."
      },
      {
        id: 4,
        title: "Cleanliness and Safety",
        content: "Keep your area clean and dispose of waste properly. Never leave the premises while impaired.",
        warnings: "Don't drive or operate machinery after consuming cannabis. Use ride-share or public transport."
      }
    ]
  },
  {
    id: "strain-selection-guide",
    title: "Understanding Cannabis Strains",
    description: "Learn the differences between Indica, Sativa, and Hybrid strains",
    category: "education",
    difficulty: "Beginner",
    duration: "20 min",
    thumbnail: cultivationImage,
    tags: ["strains", "indica", "sativa", "effects"],
    steps: [
      {
        id: 1,
        title: "Indica vs Sativa Basics",
        content: "Indica strains typically provide relaxing effects, while Sativa strains are more energizing.",
        tips: "Hybrid strains combine both effects and are great for balanced experiences."
      },
      {
        id: 2,
        title: "THC and CBD Ratios",
        content: "THC provides psychoactive effects, while CBD offers therapeutic benefits without the high.",
        tips: "Start with lower THC products if you're new to cannabis or have low tolerance."
      },
      {
        id: 3,
        title: "Terpene Profiles",
        content: "Terpenes are aromatic compounds that influence both flavor and effects of cannabis.",
        tips: "Common terpenes include myrcene (relaxing), limonene (uplifting), and pinene (alertness)."
      },
      {
        id: 4,
        title: "Choosing the Right Strain",
        content: "Consider your desired effects, time of day, and tolerance level when selecting strains.",
        tips: "Keep a consumption journal to track which strains work best for your needs."
      }
    ]
  },
  {
    id: "safe-consumption-practices",
    title: "Safe Cannabis Consumption",
    description: "Essential safety guidelines for responsible cannabis use",
    category: "safety",
    difficulty: "Beginner",
    duration: "25 min",
    thumbnail: cultivationImage,
    tags: ["safety", "dosage", "responsible-use"],
    steps: [
      {
        id: 1,
        title: "Start Low and Go Slow",
        content: "Begin with the smallest possible dose and wait at least 2 hours before consuming more.",
        warnings: "Edibles can take 30-120 minutes to take effect. Don't consume more if you don't feel effects immediately."
      },
      {
        id: 2,
        title: "Know Your Products",
        content: "Understand potency levels, serving sizes, and onset times for different consumption methods.",
        tips: "Smoking/vaping has immediate effects, while edibles have delayed but longer-lasting effects."
      },
      {
        id: 3,
        title: "Set and Setting",
        content: "Consume cannabis in a comfortable, safe environment with trusted people.",
        tips: "Have snacks, water, and entertainment ready. Avoid consuming before important activities."
      },
      {
        id: 4,
        title: "Managing Overconsumption",
        content: "If you consume too much, stay calm, hydrate, and rest in a safe space.",
        tips: "CBD can help counteract THC effects. Consider keeping CBD products on hand."
      }
    ]
  }
];