import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface HelpOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

interface HelpButtonProps {
  onStartTour: () => void;
  onShowGuide: () => void;
}

export function HelpButton({ onStartTour, onShowGuide }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const helpOptions: HelpOption[] = [
    {
      id: 'tour',
      title: 'Take Tour',
      description: 'Find the story, lounge, and event options',
      icon: Play,
      action: () => {
        setIsOpen(false);
        onStartTour();
      }
    },
    {
      id: 'guide',
      title: 'Quick Start',
      description: 'Start with the most common visitor actions',
      icon: BookOpen,
      action: () => {
        setIsOpen(false);
        onShowGuide();
      }
    },
    {
      id: 'community',
      title: 'Visit Location',
      description: 'Find hours, parking, and contact details',
      icon: MapPin,
      action: () => {
        setIsOpen(false);
        window.location.href = '/about#contact';
      }
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Ask about visits or event bookings',
      icon: Mail,
      action: () => {
        setIsOpen(false);
        window.location.href = 'mailto:manager.gardenofweeden@gmail.com';
      }
    }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-40 bg-battles-gold text-battles-black border-battles-gold hover:bg-yellow-600 shadow-lg"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 bg-battles-black border-battles-gold/30 text-white" 
        side="top"
        align="end"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-battles-gold mb-1">Need Help?</h3>
            <p className="text-sm text-gray-400">Choose how you'd like to get assistance</p>
          </div>
          
          <div className="space-y-2">
            {helpOptions.map((option) => (
              <Card 
                key={option.id}
                className="cursor-pointer transition-all hover:scale-105 bg-battles-black/50 border-gray-700 hover:border-battles-gold/50"
                onClick={option.action}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-battles-gold/20">
                      <option.icon className="h-4 w-4 text-battles-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{option.title}</h4>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Questions about Garden of Weeden?
            </p>
            <Button
              variant="link"
              size="sm"
              className="text-battles-gold p-0 h-auto"
              onClick={() => window.open('tel:+17164201591')}
            >
              <Phone className="h-3 w-3 mr-1" />
              (716) 420-1591
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
