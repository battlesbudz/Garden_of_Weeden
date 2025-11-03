import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  BookOpen, 
  Calendar, 
  Users, 
  Award,
  Coffee,
  MapPin,
  Leaf,
  ArrowRight,
  CheckCircle,
  X,
  Home
} from 'lucide-react';

interface QuickStartOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  color: string;
  path?: string;
  scrollTo?: boolean;
  navigate?: boolean;
}

const quickStartOptions: QuickStartOption[] = [
  {
    id: 'products',
    title: 'Explore Products',
    description: 'Browse our premium cannabis selection including edibles, vapes, and flower.',
    icon: Coffee,
    action: 'View Products',
    color: 'bg-battles-gold/20 text-battles-gold border-battles-gold/30',
    path: '#retail'
  },
  {
    id: 'booking',
    title: 'Book an Experience',
    description: 'Schedule a private tasting, workshop, or group tour at our lounge.',
    icon: Calendar,
    action: 'Book Now',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    path: '#events',
    scrollTo: true
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Connect with fellow enthusiasts in our discussion forums.',
    icon: Users,
    action: 'Explore Community',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    path: '/community',
    navigate: true
  },
  {
    id: 'education',
    title: 'Learn About Cannabis',
    description: 'Access educational guides about cannabis laws and consumption.',
    icon: BookOpen,
    action: 'Start Learning',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    path: '/community?tab=education',
    navigate: true
  },
  {
    id: 'rewards',
    title: 'Earn Rewards',
    description: 'Participate in the community to earn points and unlock achievements.',
    icon: Award,
    action: 'View Rewards',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    path: '/community'
  },
  {
    id: 'location',
    title: 'Visit Our Location',
    description: 'Learn about our location and cannabis experiences.',
    icon: MapPin,
    action: 'Get Directions',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    path: '#about'
  }
];

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onOptionSelect: (path: string) => void;
}

export function QuickStartModal({ isOpen, onClose, onStartTour, onOptionSelect }: QuickStartModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (option: QuickStartOption) => {
    setSelectedOptions(prev => 
      prev.includes(option.id) 
        ? prev.filter(id => id !== option.id)
        : [...prev, option.id]
    );
    
    if (option.path) {
      if (option.navigate) {
        window.location.href = option.path;
      } else if (option.scrollTo) {
        const element = document.querySelector(option.path);
        if (element) {
          onClose();
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        onOptionSelect(option.path);
      }
    }
  };

  const handleStartTour = () => {
    onClose();
    onStartTour();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-battles-black border-battles-gold/30 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-battles-gold/20">
                <Leaf className="h-8 w-8 text-battles-gold" />
              </div>
              <DialogTitle className="text-2xl font-bold text-battles-gold">
                Welcome to Garden of Weeden!
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Choose how you would like to get started or take our guided tour to explore all features.
            </DialogDescription>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-gray-700 text-white hover:bg-gray-900"
              >
                <Home className="h-4 w-4 mr-2" />
                Skip to Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl">
            Your gateway to a premier cannabis experience. 
            Choose how you'd like to get started, or take our guided tour.
          </p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickStartOptions.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all hover:scale-105 bg-battles-black border-gray-700 hover:border-battles-gold/50 ${
                      isSelected ? 'ring-2 ring-battles-gold/50' : ''
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <option.icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-battles-gold ml-auto" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white mb-1">{option.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{option.description}</p>
                        <Badge variant="outline" className={option.color}>
                          {option.action}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Help Text */}
            <div className="text-center text-sm text-gray-500 py-4">
              <p>First time here? We recommend taking the guided tour to discover all our features.</p>
              <p>Returning visitor? Jump right into any section that interests you!</p>
            </div>
          </div>
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
          <Button
            onClick={handleStartTour}
            className="flex-1 bg-battles-gold text-battles-black hover:bg-yellow-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Take Guided Tour
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-700 text-white hover:bg-gray-900"
          >
            Explore on My Own
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}