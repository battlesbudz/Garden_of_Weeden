import { Link } from 'wouter';
import cosmicChewzImg from "@assets/20240228_223118_1752399041772.png";
import freedomFogImg from "@assets/file_0000000084c86230b8826b578af0fa18_1752398828783.png";
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";
import cannabisFlower2 from "@assets/Screenshot_20250713_025012_Gallery_1752389462115.jpg";
import battleBrewImg from "@assets/file_00000000a95c61f9a7846b7990b6738f_1752399026270.png";

export default function RetailSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const products = [
    {
      name: "Heirloom Flower",
      description: "Small-batch, hand-trimmed premium flower from legacy genetics.",
      image: cannabisFlower1,
      route: "/products/heirloom-flower",
    },
    {
      name: "Battle Brew",
      description: "Our signature cannabis-infused sweet tea. 10mg THC per can, 12 FL OZ. Military-inspired design with bold Battles Budz branding.",
      image: battleBrewImg,
      route: "/products/battle-brew",
    },
    {
      name: "Cosmic Chewz",
      description: "100mg per package, 10mg per piece. Hard on the outside, soft on the inside. RSO infused with cosmic flavors including watermelon, blue raspberry, strawberry, banana, cherry, and cheesecake.",
      image: cosmicChewzImg,
      route: "/products/cosmic-chewz",
    },
    {
      name: "Freedom Fog Vapes",
      description: "Premium 1G vape cartridges with military-inspired camouflage design. High-quality cannabis extracts for the ultimate vaping experience.",
      image: freedomFogImg,
      route: "/products/freedom-fog-vapes",
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
              className="group cursor-pointer"
            >
              <div className="bg-transparent rounded-xl overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 md:h-96 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-center">
                  <Link href={product.route}>
                    <span className="text-battles-gold font-semibold hover:text-yellow-400 transition-colors cursor-pointer border-b border-battles-gold/30 hover:border-battles-gold pb-1">
                      Learn More & Join Waitlist →
                    </span>
                  </Link>
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
          >
            Get Notified When We Launch
          </button>
        </div>
      </div>
    </section>
  );
}
