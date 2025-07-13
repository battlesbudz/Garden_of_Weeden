import cosmicChewzImg from "@assets/20240228_223118_1752304447251.jpg";
import freedomFogImg from "@assets/20240303_120951_1752304725882.jpg";
import cannabisFlower1 from "@assets/Screenshot_20250713_025012_Gallery_1752391497264.jpg";
import cannabisFlower2 from "@assets/Screenshot_20250713_025012_Gallery_1752389462115.jpg";
import battleBrewImg from "@assets/file_00000000a95c61f9a7846b7990b6738f_1752394948359.png";

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
    },
    {
      name: "BattleBrew Infused Sweet Tea",
      description: "Our signature cannabis-infused sweet tea. 10mg THC per can, 12 FL OZ. Military-inspired design with bold Battles Budz branding.",
      image: battleBrewImg,
    },
    {
      name: "Cosmic Chewz",
      description: "100mg per package, 10mg per piece. Hard on the outside, soft on the inside. RSO infused with cosmic flavors including watermelon, blue raspberry, strawberry, banana, cherry, and cheesecake.",
      image: cosmicChewzImg,
    },
    {
      name: "Freedom Fog Vapes",
      description: "Premium 1G vape cartridges with military-inspired camouflage design. High-quality cannabis extracts for the ultimate vaping experience.",
      image: freedomFogImg,
    },
  ];

  return (
    <section id="retail" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
            Premium <span className="text-battles-gold">Products</span>
          </h2>
          <p className="text-xl text-battles-gray max-w-3xl mx-auto">
            Carefully cultivated, expertly processed, and thoughtfully curated
            for the discerning cannabis connoisseur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-battles-black mb-2">
                  {product.name}
                </h3>
                <p className="text-battles-gray mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-battles-gold text-battles-black px-4 py-2 rounded-lg font-semibold">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-battles-gray mb-6">
            <span className="text-battles-gold mr-2">📅</span>
            Retail operations launching 2025
          </p>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="bg-battles-black text-battles-gold px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Get Notified When We Launch
          </button>
        </div>
      </div>
    </section>
  );
}
