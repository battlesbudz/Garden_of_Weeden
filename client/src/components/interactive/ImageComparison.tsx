import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = ''
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg select-none ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      data-testid="image-comparison"
    >
      {/* After Image (Background) */}
      <div className="relative w-full">
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-auto block"
          draggable={false}
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Foreground with clip) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
        style={{ left: `${sliderPosition}%` }}
        animate={prefersReducedMotion ? {} : { x: '-50%' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-gray-800 absolute left-1" />
          <ChevronRight className="w-4 h-4 text-gray-800 absolute right-1" />
        </div>
      </motion.div>
    </div>
  );
}
