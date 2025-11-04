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
    <section id="services" className="relative py-24 text-white overflow-hidden">
      {/* Enhanced gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-battles-black via-midnight-grove/30 to-battles-black"></div>
      <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-enchanted text-5xl md:text-6xl lg:text-7xl text-parchment mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            Our Values
          </h2>
          <div className="h-1.5 w-40 bg-gradient-to-r from-green-400 via-green-500 to-green-600 mx-auto mb-8 rounded-full shadow-lg shadow-green-500/50"></div>
          <p className="font-storybook text-2xl md:text-3xl text-green-400 max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Service, Quality, and Community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-midnight-grove/40 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 text-center hover:border-green-500/70 hover:bg-midnight-grove/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-green-500/0 group-hover:to-green-500/10 rounded-2xl transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:from-green-400/30 group-hover:to-green-600/40 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-green-500/20">
                    <IconComponent className="text-green-500 h-10 w-10 group-hover:text-green-400 transition-colors" />
                  </div>
                  <h3 className="font-storybook text-2xl md:text-3xl mb-4 text-parchment group-hover:text-green-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-garden text-base text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
