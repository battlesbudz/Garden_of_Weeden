import { Sprout, Award, Heart, MapPin } from "lucide-react";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

export default function RetailSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="retail" className="py-20 bg-battles-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buffalo Micro-Terroir Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-4">
              Buffalo Micro-Terroir
            </h2>
            <div className="h-1 w-32 bg-evergreen mx-auto mb-6"></div>
            <p className="font-storybook text-xl md:text-2xl text-evergreen max-w-3xl mx-auto mb-4">
              Where Lake Erie Winds Meet Western New York Soil
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={flowerCloseupImage} 
                alt="Garden of Weeden premium cannabis flower close-up" 
                className="rounded-lg shadow-2xl border-2 border-evergreen/30"
              />
            </div>
            <div className="space-y-6 font-garden text-gray-300">
              <p className="text-lg">
                Our Buffalo cultivation site harnesses the unique environmental conditions of Western New York. 
                Lake Erie's moderating influence creates ideal temperature swings, while mineral-rich glacial soils 
                provide the foundation for exceptional cannabis cultivation.
              </p>
              <div className="bg-midnight-grove/40 border border-evergreen/30 rounded-lg p-6">
                <h3 className="font-storybook text-xl text-parchment mb-3 flex items-center">
                  <MapPin className="h-5 w-5 text-evergreen mr-2" />
                  Terroir Advantages
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong className="text-evergreen">Lake Effect Climate:</strong> Cooler summers, moderated winters</li>
                  <li>• <strong className="text-evergreen">Glacial Soils:</strong> Mineral-dense growing medium</li>
                  <li>• <strong className="text-evergreen">Outdoor Cultivation:</strong> Sun-grown for natural terpene development</li>
                  <li>• <strong className="text-evergreen">Buffalo Pride:</strong> Supporting local Western NY economy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cultivation Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-4">
              Our Cultivation Process
            </h2>
            <div className="h-1 w-32 bg-evergreen mx-auto mb-6"></div>
            <p className="font-storybook text-xl md:text-2xl text-evergreen max-w-3xl mx-auto">
              Quality and Consistency in Every Harvest
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 font-garden text-gray-300 order-2 md:order-1">
              <p className="text-lg">
                Every plant receives careful attention throughout its lifecycle. Our cultivation approach 
                combines time-tested methods with hands-on experience, ensuring consistent quality 
                and excellence in every harvest.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-midnight-grove/40 border border-evergreen/30 rounded-lg p-4 text-center">
                  <Sprout className="h-8 w-8 text-evergreen mx-auto mb-2" />
                  <h4 className="font-storybook text-parchment mb-1">Cultivation</h4>
                  <p className="text-sm">Outdoor growing in Buffalo's micro-terroir</p>
                </div>
                <div className="bg-midnight-grove/40 border border-evergreen/30 rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 text-evergreen mx-auto mb-2" />
                  <h4 className="font-storybook text-parchment mb-1">Harvest</h4>
                  <p className="text-sm">Hand-trimmed with veteran precision</p>
                </div>
                <div className="bg-midnight-grove/40 border border-evergreen/30 rounded-lg p-4 text-center">
                  <Heart className="h-8 w-8 text-evergreen mx-auto mb-2" />
                  <h4 className="font-storybook text-parchment mb-1">Cure</h4>
                  <p className="text-sm">Slow-cured for optimal flavor</p>
                </div>
                <div className="bg-midnight-grove/40 border border-evergreen/30 rounded-lg p-4 text-center">
                  <MapPin className="h-8 w-8 text-evergreen mx-auto mb-2" />
                  <h4 className="font-storybook text-parchment mb-1">Local</h4>
                  <p className="text-sm">Buffalo-proud, veteran-owned</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src={dryingRacksImage} 
                alt="Garden of Weeden drying racks showing craft curing process" 
                className="rounded-lg shadow-2xl border-2 border-evergreen/30"
              />
            </div>
          </div>
        </div>

        {/* Coming Soon CTA */}
        <div className="text-center bg-midnight-grove/40 border border-evergreen/30 rounded-xl p-12">
          <h3 className="font-storybook text-3xl text-parchment mb-4">
            The Harvest is Coming
          </h3>
          <p className="font-garden text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Be among the first to experience Buffalo's veteran-owned cannabis cultivation. 
            Join the Garden Guild to receive exclusive updates when we launch.
          </p>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="bg-evergreen hover:bg-canopy text-white px-8 py-4 rounded-lg font-garden font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-evergreen/30 transform hover:scale-105 transition-all duration-300"
            aria-label="Subscribe to newsletter to get notified when we launch"
            data-testid="retail-join-waitlist"
          >
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
