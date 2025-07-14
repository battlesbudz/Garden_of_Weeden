import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
} from 'lucide-react';

interface QuickStartOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  color: string;
  path?: string;
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
    path: '#events'
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Connect with fellow enthusiasts in our discussion forums.',
    icon: Users,
    action: 'Explore Community',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    path: '/community'
  },
  {
    id: 'education',
    title: 'Learn About Cannabis',
    description: 'Access educational guides about NY cannabis laws and consumption.',
    icon: BookOpen,
    action: 'Start Learning',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    path: '/education'
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
    description: 'Learn about our Gloversville, NY location and cannabis tourism.',
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
      onOptionSelect(option.path);
    }
  };

  const handleStartTour = () => {
    onClose();
    onStartTour();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-battles-black border-battles-gold/30 text-white">
        <DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-battles-gold/20">
                <Leaf className="h-8 w-8 text-battles-gold" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-battles-gold">
              Welcome to Battles Budz!
            </DialogTitle>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Your gateway to New York's premier cannabis tourism experience. 
              Choose how you'd like to get started, or take our guided tour.
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
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
          
          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>First time here? We recommend taking the guided tour to discover all our features.</p>
            <p>Returning visitor? Jump right into any section that interests you!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}