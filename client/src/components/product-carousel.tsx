import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface Product {
  id: number;
  name: string;
  brand?: string;
  strainType: string;
  thc?: string;
  price: string;
  image: string;
  route: string;
  isStaffPick?: boolean;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

  // Update items to show based on screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2); // Tablet: 2 items
      } else {
        setItemsToShow(4); // Desktop: 4 items
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  // Clamp currentIndex when itemsToShow or products change
  useEffect(() => {
    const maxIndex = Math.max(0, products.length - itemsToShow);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsToShow, products.length, currentIndex]);

  const maxIndex = Math.max(0, products.length - itemsToShow);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Calculate the width percentage for each item based on items to show
  const itemWidth = 100 / itemsToShow;

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button
                variant="outline"
                className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-black"
                data-testid="button-view-all"
              >
                View All
              </Button>
            </Link>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {products.length > itemsToShow && (
            <>
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-battles-gold text-black p-3 rounded-full hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                aria-label="Previous products"
                data-testid="button-carousel-previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-battles-gold text-black p-3 rounded-full hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                aria-label="Next products"
                data-testid="button-carousel-next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Products Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * itemWidth}%)`
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${itemWidth}%` }}
                  data-testid={`product-card-${index}`}
                >
                  <Link href={product.route}>
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-battles-gold/20 hover:border-battles-gold/60 transition-all cursor-pointer group h-full">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-black/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Staff Pick Badge */}
                        {product.isStaffPick && (
                          <Badge className="absolute top-2 left-2 bg-battles-gold text-black font-bold">
                            Staff Pick
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="text-xs text-gray-400 mb-1">{product.brand || "Battles Budz"}</p>
                        <h3 className="text-white font-semibold mb-2 line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>

                        {/* Strain Type */}
                        <p className="text-sm text-battles-gold mb-1">{product.strainType}</p>

                        {/* THC Info */}
                        {product.thc && (
                          <p className="text-xs text-gray-400 mb-3">THC: {product.thc}</p>
                        )}

                        {/* Price and Button */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-white">${product.price}</span>
                          <Button
                            size="sm"
                            className="bg-battles-gold hover:bg-yellow-400 text-black font-semibold"
                            data-testid={`button-view-item-${index}`}
                          >
                            View Item
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots (optional, for better UX) */}
          {products.length > itemsToShow && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-battles-gold' 
                      : 'w-2 bg-battles-gold/30 hover:bg-battles-gold/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  data-testid={`carousel-dot-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
