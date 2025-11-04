import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingCart, Info, Leaf, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProductCardData {
  id: string;
  name: string;
  brand?: string;
  strainType?: 'Indica' | 'Sativa' | 'Hybrid';
  thcContent?: string;
  price: number;
  image: string;
  additionalImages?: string[];
  description: string;
  effects?: string[];
  terpenes?: string[];
  rating?: number;
  inStock?: boolean;
}

interface InteractiveProductCardProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
  onViewDetails?: (product: ProductCardData) => void;
}

export function InteractiveProductCard({ product, onAddToCart, onViewDetails }: InteractiveProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const images = [product.image, ...(product.additionalImages || [])];

  const handleImageCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const strainColors = {
    Indica: 'from-purple-600 to-purple-800',
    Sativa: 'from-green-600 to-green-800',
    Hybrid: 'from-yellow-600 to-orange-700'
  };

  const strainColor = product.strainType ? strainColors[product.strainType] : 'from-gray-600 to-gray-800';

  return (
    <div 
      className="perspective-1000 h-[450px]"
      data-testid={`product-card-${product.id}`}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.6, 
          type: "spring", 
          stiffness: 100 
        }}
        style={{ 
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => !prefersReducedMotion && setIsFlipped(true)}
        onMouseLeave={() => !prefersReducedMotion && setIsFlipped(false)}
        onClick={() => prefersReducedMotion && setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-full bg-gray-800 border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-shadow">
            {/* Image Section */}
            <div className="relative h-64 bg-gray-900 overflow-hidden group">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={handleImageCycle}
                data-testid="product-image"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Strain Badge */}
              {product.strainType && (
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${strainColor} shadow-lg`}>
                  {product.strainType}
                </div>
              )}

              {/* Stock Status */}
              {!product.inStock && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600 shadow-lg">
                  Out of Stock
                </div>
              )}

              {/* Image Indicator Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-green-500 w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-parchment font-garden line-clamp-1" data-testid="product-name">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-sm text-gray-400 font-garden">{product.brand}</p>
                  )}
                </div>
                {product.rating && (
                  <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-white">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* THC Content */}
              {product.thcContent && (
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-400 font-semibold">
                    THC: {product.thcContent}
                  </span>
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div>
                  <motion.div
                    className="text-2xl font-bold text-green-500"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    data-testid="product-price"
                  >
                    ${product.price.toFixed(2)}
                  </motion.div>
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(product);
                  }}
                  data-testid="view-details-btn"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500 rounded-lg overflow-hidden shadow-lg p-6 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-parchment font-garden mb-2">
                {product.name}
              </h3>
              <div className="h-1 w-16 bg-green-500 rounded-full" />
            </div>

            {/* Description */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <p className="text-sm text-gray-300 font-garden">
                {product.description}
              </p>

              {/* Effects */}
              {product.effects && product.effects.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Effects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.effects.map((effect, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-green-600/20 text-green-300 px-2 py-1 rounded-full border border-green-600/30"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Terpenes */}
              {product.terpenes && product.terpenes.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Terpenes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.terpenes.map((terpene, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full border border-purple-600/30"
                      >
                        {terpene}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-500">
                  ${product.price.toFixed(2)}
                </span>
                {product.strainType && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${strainColor}`}>
                    {product.strainType}
                  </span>
                )}
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(product);
                }}
                disabled={!product.inStock}
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
