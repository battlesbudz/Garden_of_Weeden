import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

// Simple parallax container for any content
export function ParallaxSection({ children, offset = 50, className = '' }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// Parallax background image with overlay
interface ParallaxHeroProps {
  backgroundImage?: string;
  overlayOpacity?: number;
  height?: string;
  children: ReactNode;
  className?: string;
}

export function ParallaxHero({ 
  backgroundImage, 
  overlayOpacity = 0.7, 
  height = 'min-h-screen',
  children,
  className = ''
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className={`relative ${height} overflow-hidden ${className}`}>
      {/* Background Layer with Parallax */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={prefersReducedMotion ? {} : { y }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              transform: 'scale(1.2)', // Prevents white edges during parallax
            }}
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>
      )}

      {/* Content Layer */}
      <motion.div
        className="relative z-10 h-full"
        style={prefersReducedMotion ? {} : { opacity }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Multi-layer parallax with different speeds
interface ParallaxLayersProps {
  background?: ReactNode;
  midground?: ReactNode;
  foreground?: ReactNode;
  className?: string;
}

export function ParallaxLayers({ background, midground, foreground, className = '' }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const midgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);

  return (
    <div ref={ref} className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background Layer - Slowest */}
      {background && (
        <motion.div
          className="absolute inset-0 z-0"
          style={prefersReducedMotion ? {} : { y: backgroundY }}
        >
          {background}
        </motion.div>
      )}

      {/* Midground Layer - Medium Speed */}
      {midground && (
        <motion.div
          className="absolute inset-0 z-10"
          style={prefersReducedMotion ? {} : { y: midgroundY }}
        >
          {midground}
        </motion.div>
      )}

      {/* Foreground Layer - Fastest */}
      {foreground && (
        <div className="relative z-20">
          <motion.div style={prefersReducedMotion ? {} : { y: foregroundY }}>
            {foreground}
          </motion.div>
        </div>
      )}
    </div>
  );
}
