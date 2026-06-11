import { Link } from "wouter";
import { ArrowRight, Package, ShoppingBag, Sparkles } from "lucide-react";

const menuCategories = ["Flower", "Pre-rolls", "Vapes", "Edibles", "Beverages", "Partner drops"];

export default function FeaturedProductsSection() {
  return (
    <section id="featured-products" className="bg-battles-black py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 border-y border-green-500/25 py-7 lg:grid-cols-[0.7fr_1.3fr_auto] lg:items-center">
          <div>
            <p className="font-garden text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
              Current Craft Menu
            </p>
            <h2 className="mt-2 font-storybook text-3xl text-parchment">Shop what is fresh now.</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {menuCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 font-garden text-sm text-gray-200"
              >
                {category === "Partner drops" ? (
                  <Sparkles className="mr-2 h-4 w-4 text-green-400" aria-hidden="true" />
                ) : (
                  <Package className="mr-2 h-4 w-4 text-green-400" aria-hidden="true" />
                )}
                {category}
              </span>
            ))}
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 font-garden text-sm font-bold text-white transition hover:bg-green-800"
          >
            <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
            View Menu
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
