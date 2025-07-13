import { Plus } from "lucide-react";
import teamPhotoImg from "@assets/Screenshot_20250712_032136_Gallery_1752304907026.jpg";
import JobApplicationForm from "./job-application-form";

export default function TeamSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const teamMembers = [
    {
      name: "Justin & Andrea Battles",
      role: "Founding Team",
      description: "Justin: 8-year Army veteran and CEO overseeing cultivation and product creation. Andrea: COO with 15 years in sales and customer service, leading dispensary operations and customer experience.",
      image: teamPhotoImg,
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
              <JobApplicationForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
