import { Link } from "wouter";
import { Flower2, Cigarette, Candy, Droplet, Wind, Pill, Heart, Moon, Zap, Wrench } from "lucide-react";

const categories = [
  { name: "Flower", icon: Flower2, path: "/shop?category=flower" },
  { name: "Pre-Rolls", icon: Cigarette, path: "/shop?category=pre-rolls" },
  { name: "Edibles", icon: Candy, path: "/shop?category=edibles" },
  { name: "Concentrates", icon: Droplet, path: "/shop?category=concentrates" },
  { name: "Vaporizers", icon: Wind, path: "/shop?category=vaporizers" },
  { name: "Tinctures", icon: Pill, path: "/shop?category=tinctures" },
  { name: "Topicals", icon: Heart, path: "/shop?category=topicals" },
  { name: "Sleepy Time", icon: Moon, path: "/shop?category=sleepy-time" },
  { name: "Pain Relief", icon: Zap, path: "/shop?category=pain-relief" },
  { name: "Accessories", icon: Wrench, path: "/shop?category=accessories" },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-300 text-lg">
            Find exactly what you're looking for
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} href={category.path}>
                <div
                  className="bg-gray-800 hover:bg-battles-gold/10 border border-battles-gold/30 hover:border-battles-gold rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-battles-gold/20"
                  data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="h-10 w-10 text-battles-gold mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-semibold text-sm group-hover:text-battles-gold transition-colors">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shop All Button */}
        <div className="text-center">
          <Link href="/shop">
            <button
              className="bg-battles-gold text-black px-8 py-3 rounded-lg font-bold text-base hover:bg-yellow-400 hover:shadow-lg hover:shadow-battles-gold/50 transform hover:scale-105 transition-all duration-300"
              data-testid="button-shop-all"
            >
              Shop All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
