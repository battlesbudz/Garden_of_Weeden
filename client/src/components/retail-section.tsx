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
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    },
    {
      name: "Battle Brew Sweet Tea",
      description: "Our signature cannabis-infused sweet tea, crafted with regional pride.",
      image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    },
    {
      name: "Cosmic Chewz",
      description: "Premium cannabis-infused candy with precise dosing and amazing flavors.",
      image: "https://images.unsplash.com/photo-1519047336400-d923dd4b1000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    },
    {
      name: "Freedom Fog Vapes",
      description: "High-quality vape cartridges featuring pure cannabis extracts.",
      image: "https://images.unsplash.com/photo-1549140725-6a1f87dc8e27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
