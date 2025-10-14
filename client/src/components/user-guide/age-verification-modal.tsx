import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Leaf } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onDenied: () => void;
}

export function AgeVerificationModal({ isOpen, onVerified, onDenied }: AgeVerificationModalProps) {
  const handleVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerifiedDate', new Date().toISOString());
    onVerified();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-battles-black border-battles-gold/30 text-white" hideClose>
        <DialogHeader>
          <DialogTitle className="sr-only">Age Verification</DialogTitle>
          <DialogDescription className="sr-only">
            You must verify that you are 21 years or older to access this cannabis website as required by New York State law.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-center">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-full bg-battles-gold/20">
                <Leaf className="h-12 w-12 text-battles-gold" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-battles-gold mb-3">Welcome to Battles Budz</h2>
              <p className="text-xl text-white mb-4">Are you 21 years or older?</p>
              <p className="text-sm text-gray-400">
                You must be 21+ to enter this cannabis website as required by New York State law.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onDenied}
              variant="outline"
              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            >
              No, I'm under 21
            </Button>
            
            <Button
              onClick={handleVerify}
              className="flex-1 bg-battles-gold text-battles-black hover:bg-yellow-600 font-semibold"
            >
              Yes, I'm 21+
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}