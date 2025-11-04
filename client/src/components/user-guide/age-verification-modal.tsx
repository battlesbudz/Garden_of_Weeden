import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shield, Sparkles, Award, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onDenied: () => void;
}

export function AgeVerificationModal({ isOpen, onVerified, onDenied }: AgeVerificationModalProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const handleVerify = () => {
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerifiedDate', new Date().toISOString());
    onVerified();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-verification-title"
      aria-describedby="age-verification-description"
    >
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src={fieldRowsImage} 
          alt="" 
          className="w-full h-full object-cover opacity-40"
          aria-hidden="true"
        />
        {/* Sophisticated gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-battles-black/90 to-battles-black"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-midnight-grove/20 to-battles-black"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl mx-4 my-4 bg-midnight-grove/60 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl p-4 shadow-2xl shadow-green-500/20"
        initial={prefersReducedMotion ? { scale: 1, y: 0 } : { scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
      >
        {/* Hidden labels for screen readers */}
        <h2 id="age-verification-title" className="sr-only">Age Verification Required</h2>
        <p id="age-verification-description" className="sr-only">
          You must verify that you are 21 years or older to access this cannabis website as required by New York State law.
        </p>

        <div className="space-y-3 text-center">
          {/* Logo/Icon */}
          <motion.div 
            className="flex items-center justify-center"
            initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/40 shadow-lg shadow-green-500/30 border border-green-500/40">
              <Sparkles className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.5 }}
          >
            <h3 className="font-enchanted text-2xl md:text-3xl text-parchment mb-1.5 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Welcome to<br />Garden of Weeden
            </h3>
            <div className="h-0.5 w-20 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto rounded-full shadow-lg shadow-green-500/50"></div>
          </motion.div>

          {/* Question */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.6 }}
            className="space-y-1.5"
          >
            <p className="font-storybook text-lg text-parchment">
              Are you 21 years or older?
            </p>
            <p className="font-garden text-xs text-gray-300 max-w-lg mx-auto leading-snug">
              You must be 21+ to enter this cannabis website as required by New York State law. 
              By entering, you acknowledge that you are of legal age.
            </p>
          </motion.div>

          {/* Brand Highlights */}
          <motion.div 
            className="grid grid-cols-3 gap-1.5 pt-1"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.7 }}
          >
            <div className="flex flex-col items-center gap-0.5 p-1.5 bg-midnight-grove/40 border border-green-500/20 rounded-lg">
              <Award className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span className="font-garden text-[10px] text-gray-300 leading-tight">Veteran-Owned</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 bg-midnight-grove/40 border border-green-500/20 rounded-lg">
              <MapPin className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span className="font-garden text-[10px] text-gray-300 leading-tight">Buffalo Roots</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 bg-midnight-grove/40 border border-green-500/20 rounded-lg">
              <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
              <span className="font-garden text-[10px] text-gray-300 leading-tight">Quality Assured</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-2 pt-2"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.8 }}
          >
            <Button
              onClick={onDenied}
              variant="outline"
              className="flex-1 border-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 font-garden font-semibold text-sm py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              data-testid="age-gate-deny-button"
              aria-label="I am under 21 years old - exit site"
            >
              No, I'm under 21
            </Button>
            
            <Button
              onClick={handleVerify}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-garden font-semibold text-sm py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300"
              data-testid="age-gate-verify-button"
              aria-label="I am 21 years or older - enter site"
            >
              Yes, I'm 21 or Older
            </Button>
          </motion.div>

          {/* Legal Notice */}
          <motion.p 
            className="font-garden text-xs text-gray-400 max-w-md mx-auto leading-relaxed"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.9 }}
          >
            This website contains cannabis products intended for adults 21 years or older. 
            Illegal to be distributed to anyone under 21. Keep out of reach of children.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}