import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Navigation, 
  MessageSquare,
  Calendar,
  Award,
  BookOpen,
  Users,
  MapPin,
  Coffee,
  Leaf
} from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  element?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll';
  icon: React.ComponentType<any>;
  category: 'navigation' | 'features' | 'community' | 'rewards';
}

const guideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Battles Budz!',
    description: 'This is your gateway to New York\'s premium cannabis tourism experience. Let\'s take a quick tour of everything we offer.',
    position: 'center',
    icon: Leaf,
    category: 'navigation'
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    description: 'Use the top navigation to explore our retail products, book experiences, and access the community hub.',
    element: 'nav',
    position: 'bottom',
    icon: Navigation,
    category: 'navigation'
  },
  {
    id: 'retail',
    title: 'Premium Products',
    description: 'Discover our curated selection of Cosmic Chewz edibles, Freedom Fog Vapes, and premium flower strains.',
    element: '#retail',
    position: 'top',
    icon: Coffee,
    category: 'features'
  },
  {
    id: 'experiences',
    title: 'Book Your Experience',
    description: 'Schedule private tastings, educational workshops, or group tours at our consumption lounge.',
    element: '#events',
    position: 'top',
    icon: Calendar,
    category: 'features'
  },
  {
    id: 'community',
    title: 'Community Hub',
    description: 'Join discussions, access educational content, and connect with fellow cannabis enthusiasts.',
    element: '[href="/community"]',
    position: 'bottom',
    action: 'click',
    icon: Users,
    category: 'community'
  },
  {
    id: 'forum',
    title: 'Discussion Forums',
    description: 'Share experiences, ask questions, and learn from our community of cannabis tourists and locals.',
    position: 'top',
    icon: MessageSquare,
    category: 'community'
  },
  {
    id: 'education',
    title: 'Cannabis Education',
    description: 'Access our comprehensive guides on New York cannabis laws, consumption tips, and tourism etiquette.',
    position: 'top',
    icon: BookOpen,
    category: 'community'
  },
  {
    id: 'rewards',
    title: 'Rewards System',
    description: 'Earn points for community participation, unlock achievements, and compete on leaderboards!',
    position: 'top',
    icon: Award,
    category: 'rewards'
  },
  {
    id: 'location',
    title: 'Visit Us in Buffalo',
    description: 'Located in the heart of Western New York, we\'re your destination for authentic cannabis tourism.',
    element: '#about',
    position: 'top',
    icon: MapPin,
    category: 'features'
  }
];

interface UserGuideOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function UserGuideOverlay({ isOpen, onClose, onComplete }: UserGuideOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentGuideStep = guideSteps[currentStep];
  const progress = ((currentStep + 1) / guideSteps.length) * 100;

  useEffect(() => {
    if (isOpen && currentGuideStep?.element) {
      const element = document.querySelector(currentGuideStep.element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('guide-highlight');
        
        return () => {
          element.classList.remove('guide-highlight');
        };
      }
    }
  }, [currentStep, isOpen, currentGuideStep?.element]);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentGuideStep.id]);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentGuideStep.id]);
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'features':
        return 'bg-battles-gold/20 text-battles-gold border-battles-gold/30';
      case 'community':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rewards':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Background */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      
      {/* Guide Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-2xl mx-4">
        <Card className="bg-battles-black border-battles-gold/30 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-battles-gold/20">
                  <currentGuideStep.icon className="h-5 w-5 text-battles-gold" />
                </div>
                <div>
                  <CardTitle className="text-battles-gold text-xl">
                    {currentGuideStep.title}
                  </CardTitle>
                  <Badge variant="outline" className={getCategoryColor(currentGuideStep.category)}>
                    {currentGuideStep.category}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-battles-gold">{currentStep + 1} of {guideSteps.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Description */}
            <p className="text-gray-300 leading-relaxed text-lg">
              {currentGuideStep.description}
            </p>
            
            {/* Step Indicators */}
            <div className="flex gap-2 flex-wrap">
              {guideSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-battles-gold scale-125'
                      : index < currentStep
                      ? 'bg-battles-gold/60'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  title={step.title}
                />
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-gray-700 text-white hover:bg-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button variant="ghost" onClick={handleSkip} className="text-gray-400 hover:text-white">
                  Skip Tour
                </Button>
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-battles-gold text-battles-black hover:bg-yellow-600"
              >
                {currentStep === guideSteps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Tour
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Highlighting Styles */}
      <style>{`
        .guide-highlight {
          position: relative;
          z-index: 51 !important;
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3) !important;
          border-radius: 8px !important;
          animation: guide-pulse 2s infinite;
        }
        
        @keyframes guide-pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.5);
          }
        }
      `}</style>
    </>
  );
}