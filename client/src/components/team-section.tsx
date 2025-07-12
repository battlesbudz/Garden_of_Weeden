import { Plus } from "lucide-react";

export default function TeamSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const teamMembers = [
    {
      name: "Justin Battles",
      role: "Founder & CEO",
      description: "Army veteran and cannabis advocate committed to building a business that serves the community with integrity and quality.",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
    {
      name: "Andrea",
      role: "Co-Founder & Customer Experience Director",
      description: "15 years in sales and customer service. Personal advocate for cannabis in managing PTSD and bipolar conditions.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    },
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
            Meet the <span className="text-battles-gold">Team</span>
          </h2>
          <p className="text-xl text-battles-gray max-w-3xl mx-auto">
            Passionate professionals united by a shared commitment to excellence
            and community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-lg text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-battles-black mb-2">
                  {member.name}
                </h3>
                <p className="text-battles-gold font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-battles-gray text-sm">
                  {member.description}
                </p>
              </div>
            </div>
          ))}

          {/* Future Team Member */}
          <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg text-center border-2 border-dashed border-battles-gold">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Plus className="text-battles-gold h-16 w-16 mb-4 mx-auto" />
                <p className="text-battles-gray font-semibold">Join Our Team</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-battles-black mb-2">
                You?
              </h3>
              <p className="text-battles-gold font-semibold mb-4">
                Future Team Member
              </p>
              <p className="text-battles-gray text-sm mb-4">
                We're looking for passionate individuals who share our
                commitment to quality and community service.
              </p>
              <button
                onClick={() => scrollToSection("contact")}
                className="bg-battles-gold text-battles-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
