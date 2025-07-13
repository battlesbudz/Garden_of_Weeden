import { Sprout, FlaskConical, Store, Truck, Sofa, Calendar } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Sprout,
      title: "Cultivation",
      description: "State-of-the-art indoor cultivation using sustainable practices and premium genetics for consistent, high-quality flower.",
    },
    {
      icon: FlaskConical,
      title: "Processing",
      description: "Expert extraction and infusion capabilities for edibles, beverages, and concentrates using cutting-edge technology.",
    },
    {
      icon: Store,
      title: "Retail",
      description: "Premium cannabis retail experience featuring our signature products including Cosmic Chewz, Freedom Fog Vapes, and BattleBrew.",
    },
    {
      icon: Truck,
      title: "Delivery",
      description: "Fast, reliable delivery service bringing premium Battles Budz products directly to your door with professional service.",
    },
    {
      icon: Sofa,
      title: "On-Site Consumption Lounge",
      description: "Premium consumption experience with comfortable seating, entertainment, and guided tastings in a welcoming environment.",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Educational workshops, cultivation classes, and entertaining events like smoke and paint, laugh and smoke sessions, live bands, and glass blowing demonstrations.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-battles-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            <span className="text-battles-gold">Vertically Integrated</span>{" "}
            Excellence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From seed to sale, we control every aspect of the cannabis
            experience to ensure uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-8 text-center hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="bg-battles-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="text-battles-black h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-battles-gold">
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
