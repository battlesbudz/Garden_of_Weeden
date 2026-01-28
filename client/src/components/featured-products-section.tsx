import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl?: string;
}

interface SiteSettings {
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredBadgeText?: string;
  featuredCtaText?: string;
  featuredShippingNote?: string;
  placeholder1Name?: string;
  placeholder1Desc?: string;
  placeholder2Name?: string;
  placeholder2Desc?: string;
  placeholder3Name?: string;
  placeholder3Desc?: string;
}

export default function FeaturedProductsSection() {
  const prefersReducedMotion = useReducedMotion();

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const featuredTitle = settings?.featuredTitle || "Discover Our Harvest";
  const featuredSubtitle = settings?.featuredSubtitle || "Carefully cultivated in Buffalo's unique micro-terroir for exceptional quality and flavor";
  const featuredBadgeText = settings?.featuredBadgeText || "Featured Collection";
  const featuredCtaText = settings?.featuredCtaText || "View Full Collection";
  const featuredShippingNote = settings?.featuredShippingNote || "Free local delivery on orders over $100";

  const realProducts = products?.slice(0, 3) || [];

  const placeholderProducts = [
    {
      id: "placeholder-1",
      name: settings?.placeholder1Name || "Premium Flower",
      description: settings?.placeholder1Desc || "Hand-selected craft cannabis",
      image: flowerCloseupImage,
      tag: "Coming Soon",
      isPlaceholder: true
    },
    {
      id: "placeholder-2",
      name: settings?.placeholder2Name || "Artisan Pre-Rolls",
      description: settings?.placeholder2Desc || "Expertly rolled for convenience",
      image: dryingRacksImage,
      tag: "Coming Soon",
      isPlaceholder: true
    },
    {
      id: "placeholder-3",
      name: settings?.placeholder3Name || "Seasonal Harvest",
      description: settings?.placeholder3Desc || "Limited batch releases",
      image: flowerCloseupImage,
      tag: "Coming Soon",
      isPlaceholder: true
    }
  ];

  const displayProducts = [
    ...realProducts.map(p => ({ ...p, isPlaceholder: false })),
    ...placeholderProducts.slice(realProducts.length)
  ].slice(0, 3);

  return (
    <section id="featured-products" className="relative py-20 bg-gradient-to-b from-midnight-grove/30 via-battles-black to-battles-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-green-400" />
            <span className="font-garden text-sm text-green-400 uppercase tracking-wide">{featuredBadgeText}</span>
          </div>
          <h2 className="font-enchanted text-4xl md:text-5xl lg:text-6xl text-parchment mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {featuredTitle}
          </h2>
          <p className="font-garden text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {featuredSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : index * 0.15 
              }}
            >
              <div className="bg-midnight-grove/40 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.isPlaceholder ? (product as typeof placeholderProducts[0]).image : ((product as unknown as Product).imageUrl || flowerCloseupImage)}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-battles-black/80 via-transparent to-transparent"></div>
                  {product.isPlaceholder && (
                    <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full font-garden text-xs font-semibold">
                      {(product as typeof placeholderProducts[0]).tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-storybook text-xl text-parchment mb-2 group-hover:text-green-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-garden text-sm text-gray-400 mb-4">
                    {product.isPlaceholder ? (product as typeof placeholderProducts[0]).description : (product as unknown as Product).category}
                  </p>
                  {!product.isPlaceholder && (
                    <p className="font-garden text-lg text-green-500 font-semibold">
                      ${(product as unknown as Product).price}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
        >
          <Link href="/shop">
            <button className="group bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-garden font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              <span>{featuredCtaText}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="font-garden text-sm text-gray-500 mt-4">
            {featuredShippingNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
