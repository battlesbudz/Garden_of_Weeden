import logoPath from "@assets/BattlesBudz_Logo_1752301078028.png";

// For now using placeholder logos - these would be replaced with actual brand logos
const brands = [
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
  { name: "Battles Budz", logo: logoPath },
];

export default function BrandShowcase() {
  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shop by Brand
          </h2>
          <p className="text-gray-300 text-lg">
            Premium cannabis brands we're proud to carry
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-battles-gold/20 rounded-lg p-6 flex items-center justify-center hover:border-battles-gold/60 transition-all cursor-pointer group hover:scale-105 hover:shadow-lg hover:shadow-battles-gold/20"
              data-testid={`brand-${index}`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-24 object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>

        {/* View All Brands Button */}
        <div className="text-center">
          <button
            className="border-2 border-battles-gold text-battles-gold px-8 py-3 rounded-lg font-bold text-base hover:bg-battles-gold hover:text-black hover:shadow-lg hover:shadow-battles-gold/50 transform hover:scale-105 transition-all duration-300"
            data-testid="button-all-brands"
          >
            All Brands
          </button>
        </div>
      </div>
    </section>
  );
}
