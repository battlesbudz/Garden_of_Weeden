import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { src: string; alt: string; caption?: string }[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, isOpen, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
        data-testid="lightbox-overlay"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-green-500 transition-colors p-2 bg-black/50 rounded-full"
          aria-label="Close lightbox"
          data-testid="lightbox-close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-green-500 transition-colors p-2 bg-black/50 rounded-full"
              aria-label="Previous image"
              data-testid="lightbox-previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-green-500 transition-colors p-2 bg-black/50 rounded-full"
              aria-label="Next image"
              data-testid="lightbox-next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="max-w-7xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            data-testid="lightbox-image"
          />
          {currentImage.caption && (
            <p className="text-white text-center mt-4 text-lg font-garden">
              {currentImage.caption}
            </p>
          )}
          {images.length > 1 && (
            <p className="text-gray-400 text-center mt-2 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Gallery Grid Component for easy integration
interface ImageGalleryProps {
  images: { src: string; alt: string; caption?: string; thumbnail?: string }[];
  columns?: number;
  className?: string;
}

export function ImageGallery({ images, columns = 3, className = '' }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
        className={`grid gap-4 ${className}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="relative overflow-hidden rounded-lg group cursor-pointer aspect-square"
            data-testid={`gallery-image-${index}`}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        isOpen={lightboxOpen}
        initialIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
