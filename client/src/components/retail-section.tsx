import { Badge } from '@/components/ui/badge';
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";

export default function RetailSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const products = [
    {
      name: "Premium Flower",
      description: "Small-batch, hand-trimmed cannabis flower cultivated with care and precision.",
      image: cannabisFlower1,
      comingSoon: true,
    },
    {
      name: "Edibles",
      description: "Precisely dosed cannabis-infused edibles for a consistent experience.",
      image: cannabisFlower1,
      comingSoon: true,
    },
    {
      name: "Vapes",
      description: "Premium vape cartridges featuring high-quality cannabis extracts.",
      image: cannabisFlower1,
      comingSoon: true,
    },
    {
      name: "Concentrates",
      description: "Expertly processed cannabis concentrates for enhanced potency and flavor.",
      image: cannabisFlower1,
      comingSoon: true,
    },
  ];

  return (
    <section id="retail" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Premium <span className="text-battles-gold">Products</span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Carefully cultivated, expertly processed, and thoughtfully curated
            for the discerning cannabis connoisseur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-6 border border-battles-gold/20 relative">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-battles-gold text-battles-black font-semibold px-3 py-1">
                    Coming Soon
                  </Badge>
                </div>
                <div className="opacity-40 grayscale">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 md:h-96 object-contain"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => scrollToSection("newsletter")}
                    className="text-battles-gold font-semibold hover:text-yellow-400 transition-colors border-b border-battles-gold/30 hover:border-battles-gold pb-1"
                    aria-label={`Get notified when ${product.name} launches`}
                  >
                    Join Waitlist →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-300 mb-6">
            <span className="text-battles-gold mr-2">📅</span>
            Retail operations launching 2025
          </p>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="bg-battles-gold text-battles-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            aria-label="Subscribe to newsletter to get notified when we launch"
          >
            Get Notified When We Launch
          </button>
        </div>
      </div>
    </section>
  );
}
