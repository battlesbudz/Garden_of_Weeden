import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, ChevronLeft, CheckCircle2, PlayCircle, RotateCcw, HelpCircle, Tags, Package, Mail, Settings, FileText, Users, Image } from "lucide-react";

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
    description: "This tutorial will guide you through all the features available to manage your website. You'll learn how to add products, manage brands, and customize your site content.",
    tips: [
      "You can restart this tutorial anytime from the Help button",
      "Each section has its own tab - click the tabs to navigate",
      "Changes you make are saved automatically"
    ]
  },
  {
    id: "brands-intro",
    title: "Managing Brands",
    description: "Brands help organize your products. Each product can be associated with a brand, making it easier for customers to find what they're looking for.",
    targetTab: "brands",
    tips: [
      "Brands appear in the shop filter sidebar",
      "You can upload custom logos for each brand",
      "Use Display Order to control the order brands appear (lower numbers first)"
    ]
  },
  {
    id: "brands-add",
    title: "Adding a New Brand",
    description: "Click the 'Add Brand' button to create a new brand. Fill in the name, description, and optionally upload a logo image.",
    targetTab: "brands",
    action: "Try clicking 'Add Brand' to see the form",
    tips: [
      "Brand names should be unique",
      "Logos look best when they're square images",
      "Toggle 'Active' off to hide a brand without deleting it"
    ]
  },
  {
    id: "products-intro",
    title: "Managing Products",
    description: "Products are the main items displayed on your shop page. You can add, edit, and remove products at any time.",
    targetTab: "products",
    tips: [
      "Each product needs a name and price",
      "Categories help customers filter products",
      "Featured products get highlighted on the homepage"
    ]
  },
  {
    id: "products-add",
    title: "Adding a New Product",
    description: "Click 'Add Product' to create a new listing. You'll set the name, price, category, and can optionally associate it with a brand.",
    targetTab: "products",
    action: "Try clicking 'Add Product' to see all available options",
    tips: [
      "Upload high-quality product images for best results",
      "Set 'In Stock' to false to show products as unavailable",
      "Mark products as 'Featured' to highlight them"
    ]
  },
  {
    id: "products-edit",
    title: "Editing and Deleting Products",
    description: "Each product has edit (pencil) and delete (trash) buttons. Click edit to modify any details, or delete to remove a product entirely.",
    targetTab: "products",
    tips: [
      "Deleted products cannot be recovered",
      "Editing a product updates it immediately on the site",
      "You can change the brand association at any time"
    ]
  },
  {
    id: "subscribers",
    title: "Newsletter Subscribers",
    description: "View everyone who has signed up for email updates. You can see when they subscribed and export the list.",
    targetTab: "subscribers",
    tips: [
      "New subscribers appear automatically when they sign up",
      "You can download the subscriber list as a CSV file",
      "Use this list for email marketing campaigns"
    ]
  },
  {
    id: "blog",
    title: "Blog Management",
    description: "Create and manage blog posts to share news, updates, and educational content with your audience. You can save posts as drafts before publishing.",
    targetTab: "blog",
    tips: [
      "Draft posts are not visible to visitors until published",
      "Add a featured image to make posts more engaging",
      "Use categories and tags to help readers find related content"
    ]
  },
  {
    id: "homepage",
    title: "Homepage Content",
    description: "Customize the text and messaging on your homepage. Change headlines, taglines, and feature descriptions without needing technical skills.",
    targetTab: "homepage",
    tips: [
      "Preview changes before saving",
      "Keep headlines short and impactful",
      "Reset to defaults if you want to start over"
    ]
  },
  {
    id: "media",
    title: "Media Library",
    description: "Upload and manage images for use across your website. All your uploaded files are organized here for easy access.",
    targetTab: "media",
    tips: [
      "Click any image to copy its URL for use elsewhere",
      "Supports JPG, PNG, and GIF up to 10MB",
      "Delete unused images to keep things organized"
    ]
  },
  {
    id: "users",
    title: "User Management",
    description: "View all registered users and control their access levels. You can promote users to admin status or demote them back to regular customers.",
    targetTab: "users",
    tips: [
      "Admins have full access to this dashboard",
      "Customers can only browse the shop and manage their account",
      "Be careful when granting admin access - only give it to trusted people"
    ]
  },
  {
    id: "settings",
    title: "Site Settings",
    description: "Configure your website's core information like business name, contact details, and social media links. These appear throughout your site.",
    targetTab: "settings",
    tips: [
      "Update contact info so customers can reach you",
      "Add social media links to grow your following",
      "Business hours help customers know when you're available"
    ]
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You now know how to manage all the features of your admin dashboard. Remember, you can always restart this tutorial from the Help button in the top right.",
    tips: [
      "Check back regularly for new features",
      "Contact support if you need help with anything",
      "Your changes go live immediately after saving"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="pb-4">
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
        
        <CardContent className="space-y-4">
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

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
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
