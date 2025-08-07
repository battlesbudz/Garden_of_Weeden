import { Award, Heart, Leaf } from "lucide-react";
import cultivationImg from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";

export default function AboutSection() {
  const values = [
    {
      icon: Award,
      title: "Veteran-Led",
      description: "Military discipline and values guide every aspect of our operation.",
    },
    {
      icon: Heart,
      title: "Community-Focused",
      description: "Building connections and supporting our local Mohawk Valley community.",
    },
    {
      icon: Leaf,
      title: "Quality-Driven",
      description: "Uncompromising standards from cultivation to consumption.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
              Our <span className="text-battles-gold">Story</span>
            </h2>

            <div className="space-y-6 text-lg text-battles-gray">
              <p>
                <strong className="text-battles-black">Justin Battles</strong> first turned to cannabis at 14 as the only thing that helped him feel calm and focused. Later, during his eight years in the Army, he was diagnosed with ADHD and tried medications like Adderall and Ritalin, but they didn't help. They killed his appetite, caused insomnia, and left him unfocused.
              </p>

              <p>
                During his military service, Justin injured his knees jumping out of planes, leading to his medical retirement. Cannabis was the one thing that helped him manage pain and stay clear-headed, inspiring him to learn everything he could about the plant.
              </p>

              <p>
                That passion led him to study cultivation and processing and grow medical cannabis for himself and his wife. At Battles Budz, Justin oversees cultivation and product creation, channeling his military discipline into building a business that serves the community with integrity.
              </p>

              <div className="bg-battles-black text-white p-6 rounded-lg">
                <p className="italic text-battles-gold font-medium">
                  "We're building a facility that will house a dispensary and an indoor consumption lounge, allowing people to safely enjoy cannabis while seeing how it's grown and made. We're excited to launch, grow, and take Battles Budz national."
                </p>
                <p className="mt-4 text-sm">— Justin Battles, Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Values */}
        <div className="mt-20">
          <h3 className="text-3xl font-playfair font-bold text-center text-battles-black mb-12">
            Our <span className="text-battles-gold">Values</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-battles-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-battles-black h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-battles-black mb-2">
                    {value.title}
                  </h4>
                  <p className="text-battles-gray">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
