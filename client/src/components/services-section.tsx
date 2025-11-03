import { Award, Heart, Users, BookOpen, Leaf, Shield } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Award,
      title: "Veteran Excellence",
      description: "Our commitment to quality comes from years of service. From seed selection to final cure, we bring the same care and attention to detail that defined our work.",
    },
    {
      icon: Heart,
      title: "Veteran Wellness Advocacy",
      description: "Supporting fellow veterans' healing journeys through education, access, and community. Cannabis wellness rooted in service and compassion.",
    },
    {
      icon: Users,
      title: "Community Commitment",
      description: "Building Buffalo's cannabis community with integrity and transparency. Local cultivation supporting local wellness and economic growth.",
    },
    {
      icon: BookOpen,
      title: "Education & Resources",
      description: "Sharing cultivation knowledge and cannabis education. From plant science to consumption best practices, we're here to guide your journey.",
    },
    {
      icon: Leaf,
      title: "Sustainable Cultivation",
      description: "Outdoor growing that respects the land and honors Buffalo's micro-terroir. Sun-grown cannabis with minimal environmental impact.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous testing and quality control at every stage. Your safety and satisfaction are our mission, backed by veteran values of honor and integrity.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-battles-black to-midnight-grove/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-4">
            Our Values
          </h2>
          <div className="h-1 w-32 bg-green-500 mx-auto mb-6"></div>
          <p className="font-storybook text-xl md:text-2xl text-green-400 max-w-3xl mx-auto">
            Service, Quality, and Community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-midnight-grove/40 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 text-center hover:border-green-500/60 hover:bg-midnight-grove/60 transition-all duration-300 group"
              >
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-700/30 transition-colors">
                  <IconComponent className="text-green-500 h-8 w-8" />
                </div>
                <h3 className="font-storybook text-2xl mb-4 text-parchment">
                  {service.title}
                </h3>
                <p className="font-garden text-gray-300">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
