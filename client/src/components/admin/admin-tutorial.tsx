import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, ChevronLeft, CheckCircle2, PlayCircle, RotateCcw, HelpCircle, Tags, Package, Mail, Settings, FileText, Users, Image, ShoppingBag } from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetTab?: string;
  highlightSelector?: string;
  action?: string;
  tips?: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Admin Dashboard",
    description: "This tutorial will guide you through all 10 tabs of your admin dashboard. You'll learn how to manage products, process orders, customize your homepage, and more.",
    tips: [
      "Restart this tutorial anytime using the Help button",
      "Click tabs at the top to navigate between sections",
      "All changes save to your database and go live immediately"
    ]
  },
  {
    id: "brands",
    title: "Brands Tab",
    description: "Organize your products by brand. Customers can filter the shop by brand, making it easier to find what they want.",
    targetTab: "brands",
    tips: [
      "Add Brand: Create new brands with name, description, and logo",
      "Logo Upload: Square images work best (shown in shop sidebar)",
      "Display Order: Lower numbers appear first in the filter list",
      "Active Toggle: Hide a brand temporarily without deleting it",
      "Edit/Delete: Use pencil and trash icons on each row"
    ]
  },
  {
    id: "products",
    title: "Products Tab (Catalog)",
    description: "Your complete product catalog. This is where you define all product details - the Shop tab controls which ones are actually for sale.",
    targetTab: "products",
    tips: [
      "Add Product: Name, price, category, description, and images",
      "Brand Association: Link products to brands for filtering",
      "Stock Quantity: Track inventory levels",
      "Featured Toggle: Featured products appear on the homepage",
      "Categories: Flower, Edibles, Concentrates, Pre-Rolls, etc.",
      "Strain Types: Indica, Sativa, Hybrid (for customer preferences)"
    ]
  },
  {
    id: "shop",
    title: "Shop Tab (What's For Sale)",
    description: "Controls what appears on your public Shop page. Import products from your catalog, set sale prices, and manage stock quantities.",
    targetTab: "shop",
    tips: [
      "Import Product: Add catalog products to your shop",
      "Shop Price: Set a different price than the catalog price",
      "Quantity: How many you have in stock to sell",
      "Active Toggle: Hide items without removing them",
      "Auto Stock Sync: Quantity decreases when orders are placed",
      "Out of Stock: Items with 0 quantity show as unavailable"
    ]
  },
  {
    id: "orders",
    title: "Orders Tab",
    description: "View and manage all customer orders. See order details, update status, and track payments.",
    targetTab: "orders",
    tips: [
      "Order List: Shows order number, customer, total, and status",
      "Order Details: Click to see items, quantities, and customer info",
      "Status Updates: Mark orders as Processing, Completed, or Cancelled",
      "Payment Status: Pending, Paid, or Failed",
      "Customer Info: Name, email, phone, and delivery address",
      "Order History: All orders are preserved even if products are deleted"
    ]
  },
  {
    id: "subscribers",
    title: "Subscribers Tab",
    description: "Everyone who signed up for your newsletter. Export the list for email marketing.",
    targetTab: "subscribers",
    tips: [
      "Subscriber List: Email addresses and signup dates",
      "Export CSV: Download the full list for email services",
      "Auto-Updated: New signups appear immediately"
    ]
  },
  {
    id: "blog",
    title: "Blog Tab",
    description: "Create blog posts to share news, education, and updates. Posts can be saved as drafts before publishing.",
    targetTab: "blog",
    tips: [
      "Add Post: Title, content, featured image, and excerpt",
      "Draft/Publish: Save drafts that only you can see",
      "Categories & Tags: Organize posts for easy navigation",
      "SEO Fields: Custom meta title, description, and URL slug",
      "Featured Image: Displayed in blog listings and social shares",
      "Edit/Delete: Modify or remove posts anytime"
    ]
  },
  {
    id: "homepage",
    title: "Homepage Tab",
    description: "Customize every section of your homepage without any coding. Each section is collapsible for easy editing.",
    targetTab: "homepage",
    tips: [
      "Hero Section: Main headline, tagline, subtitle, and button text",
      "Trust Badges: Veteran-owned, Buffalo-Proud, and other badges",
      "Featured Products: Section title, subtitle, and placeholder text",
      "Brand Story: Your story text and button labels",
      "Urgency Banner: Limited-time offers and call-to-action",
      "Benefits Section: All 6 benefit cards (titles and descriptions)",
      "Newsletter Section: Headline, subtitle, and benefit bullets",
      "Preview Button: See changes before saving",
      "Reset Button: Restore all defaults if needed"
    ]
  },
  {
    id: "media",
    title: "Media Tab",
    description: "Upload and manage all your website images. Use these for products, blog posts, and branding.",
    targetTab: "media",
    tips: [
      "Upload: Drag-and-drop or click to upload images",
      "File Types: JPG, PNG, GIF, and WebP supported",
      "Size Limit: Up to 10MB per image",
      "Copy URL: Click any image to copy its URL",
      "Grid/List View: Toggle between viewing modes",
      "Search: Find images by filename",
      "Delete: Remove unused images to stay organized"
    ]
  },
  {
    id: "users",
    title: "Users Tab",
    description: "View all registered users and manage access levels. Control who can access this admin dashboard.",
    targetTab: "users",
    tips: [
      "User List: Email, name, role, and registration date",
      "Roles: Admin (full dashboard access) or Customer (shop only)",
      "Promote to Admin: Grant dashboard access to trusted users",
      "Demote to Customer: Remove admin access",
      "Cannot delete users: This protects order history integrity"
    ]
  },
  {
    id: "settings",
    title: "Settings Tab",
    description: "Configure your website's core business information. These appear throughout your site.",
    targetTab: "settings",
    tips: [
      "Site Name: Appears in footer and browser title",
      "Site Tagline: Shown under your brand name",
      "Contact Email: Creates clickable email link in footer",
      "Contact Phone: Creates clickable phone link in footer",
      "Business Address: Displayed in footer and contact pages",
      "Business Hours: Shown on contact pages",
      "Social Links: Facebook, Instagram, Twitter/X URLs",
      "Footer Text: Custom message at bottom of every page"
    ]
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You now know how to use every feature of your admin dashboard. All 10 tabs are at your command!",
    tips: [
      "Help Button: Restart this tutorial anytime",
      "Changes are instant: No need to republish",
      "Questions? Contact support for help"
    ]
  }
];

interface AdminTutorialProps {
  onTabChange?: (tab: string) => void;
  currentTab?: string;
}

export default function AdminTutorial({ onTabChange, currentTab }: AdminTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("admin-tutorial-completed");
    if (!seen) {
      setIsOpen(true);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = useCallback(() => {
    setCompletedSteps(prev => new Set([...Array.from(prev), step.id]));
    
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = tutorialSteps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      if (nextStep.targetTab && onTabChange) {
        onTabChange(nextStep.targetTab);
      }
    } else {
      localStorage.setItem("admin-tutorial-completed", "true");
      setHasSeenTutorial(true);
      setIsOpen(false);
    }
  }, [currentStep, step.id, onTabChange]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = tutorialSteps[currentStep - 1];
      setCurrentStep(currentStep - 1);
      if (prevStep.targetTab && onTabChange) {
        onTabChange(prevStep.targetTab);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsOpen(true);
    if (tutorialSteps[0].targetTab && onTabChange) {
      onTabChange(tutorialSteps[0].targetTab);
    }
  };

  const handleClose = () => {
    localStorage.setItem("admin-tutorial-completed", "true");
    setHasSeenTutorial(true);
    setIsOpen(false);
  };

  const handleSkipToStep = (index: number) => {
    const targetStep = tutorialSteps[index];
    setCurrentStep(index);
    if (targetStep.targetTab && onTabChange) {
      onTabChange(targetStep.targetTab);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRestart}
        className="border-battles-gold/50 text-battles-gold hover:bg-battles-gold hover:text-black"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        {hasSeenTutorial ? "Restart Tutorial" : "Start Tutorial"}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6">
      <Card className="my-4 w-full max-w-lg bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="pb-4 sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-battles-gold/20">
                <PlayCircle className="w-5 h-5 text-battles-gold" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-zinc-800" />
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <p className="text-gray-300 leading-relaxed">{step.description}</p>
          
          {step.action && (
            <div className="p-3 rounded-lg bg-battles-gold/10 border border-battles-gold/30">
              <p className="text-battles-gold text-sm font-medium flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                {step.action}
              </p>
            </div>
          )}

          {step.tips && step.tips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Quick Tips:</h4>
              <ul className="space-y-1.5">
                {step.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-2">
            {tutorialSteps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleSkipToStep(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors flex-shrink-0 ${
                  index === currentStep
                    ? "bg-battles-gold text-black"
                    : completedSteps.has(s.id)
                    ? "bg-green-900 text-green-300 border border-green-700"
                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                }`}
              >
                {completedSteps.has(s.id) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>

          <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900 px-6 py-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-zinc-700 text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleRestart}
                className="text-gray-400 hover:text-white hover:bg-zinc-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-battles-gold text-black hover:bg-battles-gold/90"
              >
                {currentStep === tutorialSteps.length - 1 ? "Complete" : "Next"}
                {currentStep < tutorialSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
