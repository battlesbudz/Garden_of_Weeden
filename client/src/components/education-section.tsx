import { BookOpen, Video, Users, Leaf, FlaskConical, Award, MapPin, Car, Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import cultivationImage from "@assets/360_F_499206936_DTB3BAfocgPpunIz14tRTBZwwy5PC1Oi_1752425020338.jpg";

export default function EducationSection() {
  const tourismGuides = [
    {
      id: 1,
      title: "New York Cannabis Tourism Guide 2025",
      excerpt: "Everything you need to know about legal cannabis tourism in New York State, from dispensary visits to consumption lounges.",
      category: "Tourism",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: true,
    },
    {
      id: 2,
      title: "Consumption Lounge Etiquette: What Every Tourist Should Know",
      excerpt: "Learn proper etiquette, social norms, and safety guidelines for visiting cannabis consumption lounges in New York.",
      category: "Etiquette",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: true,
    },
    {
      id: 3,
      title: "Cannabis Strain Guide for Beginners",
      excerpt: "Understanding indica, sativa, and hybrid strains - effects, benefits, and what to expect during your cannabis experience.",
      category: "Education",
      readTime: "8 min read",
      image: cultivationImage,
      featured: true,
    },
    {
      id: 4,
      title: "Traveling to New York for Cannabis: Legal Guidelines",
      excerpt: "Important legal information for cannabis tourists including possession limits, where you can consume, and interstate travel rules.",
      category: "Legal",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: false,
    },
  ];

  const tourismResources = [
    {
      icon: MapPin,
      title: "Tourism Planning",
      description: "Plan your cannabis tourism journey with our comprehensive guides and local insights.",
    },
    {
      icon: Home,
      title: "Consumption Lounges",
      description: "Learn about consumption lounge experiences, etiquette, and what to expect.",
    },
    {
      icon: Car,
      title: "Transportation & Safety",
      description: "Safe transportation options and important safety guidelines for cannabis tourists.",
    },
    {
      icon: Shield,
      title: "Legal Compliance",
      description: "Stay compliant with New York cannabis laws and tourist-specific regulations.",
    },
    {
      icon: Leaf,
      title: "Product Education",
      description: "Understanding cannabis products, strains, dosing, and consumption methods.",
    },
    {
      icon: Users,
      title: "Community & Culture",
      description: "Connect with the cannabis community and understand local cannabis culture.",
    },
  ];

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
            Cannabis Tourism <span className="text-battles-gold">Education</span>
          </h2>
          <p className="text-xl text-battles-gray max-w-3xl mx-auto mb-8">
            Your complete guide to cannabis tourism in New York. Learn everything you need for a safe, 
            legal, and enjoyable cannabis experience in the Empire State.
          </p>
          <Link href="/education">
            <Button className="bg-battles-gold text-battles-black hover:bg-yellow-600 font-bold px-8 py-3">
              Explore Full Education Center
            </Button>
          </Link>
        </div>

        {/* Tourism Education Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tourismResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              >
                <div className="bg-battles-gold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <IconComponent className="text-battles-black h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-battles-black mb-2">
                  {resource.title}
                </h3>
                <p className="text-battles-gray text-sm">{resource.description}</p>
              </div>
            );
          })}
        </div>

        {/* Featured Tourism Guides */}
        <div className="mb-12">
          <h3 className="text-3xl font-playfair font-bold text-center text-battles-black mb-12">
            Featured Tourism <span className="text-battles-gold">Guides</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourismGuides.filter(guide => guide.featured).map((guide) => (
              <article
                key={guide.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-battles-gold text-battles-black px-3 py-1 rounded-full text-sm font-semibold">
                      {guide.category}
                    </span>
                    <span className="text-battles-gray text-sm">{guide.readTime}</span>
                  </div>
                  <h4 className="text-xl font-bold text-battles-black mb-3">
                    {guide.title}
                  </h4>
                  <p className="text-battles-gray mb-4">
                    {guide.excerpt}
                  </p>
                  <Link href="/education">
                    <Button variant="outline" className="w-full border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
                      Read Guide
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Enhanced Education Platform CTA */}
        <div className="text-center bg-battles-black rounded-xl p-12">
          <h3 className="text-3xl font-playfair font-bold text-white mb-6">
            Complete Cannabis Tourism <span className="text-battles-gold">Education Platform</span>
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Access our full educational platform with detailed guides, interactive maps, local insights, 
            and everything you need for the perfect cannabis tourism experience in New York.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-battles-gold">
            <div className="text-center">
              <Video className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Video Guides</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Interactive Maps</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Expert Workshops</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Comprehensive Guides</p>
            </div>
          </div>
          <Link href="/education">
            <Button className="bg-battles-gold text-battles-black hover:bg-yellow-600 font-bold px-8 py-3">
              Access Education Platform
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}