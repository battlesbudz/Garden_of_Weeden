import { Award, Heart, Leaf } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Justin Battles, Founder"
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
              Our <span className="text-battles-gold">Story</span>
            </h2>

            <div className="space-y-6 text-lg text-battles-gray">
              <p>
                <strong className="text-battles-black">Justin Battles</strong>{" "}
                discovered cannabis at 14, finding it helped him focus and
                manage what would later be diagnosed as ADHD. His journey took
                him through military service as a paratrooper, where he
                sustained injuries that led to his medical retirement from the
                Army.
              </p>

              <p>
                After his service, Justin's ADHD diagnosis confirmed what he had
                intuitively known years earlier - cannabis wasn't just
                recreation for him, it was medicine. This realization
                transformed his relationship with the plant from personal use to
                passionate advocacy.
              </p>

              <p>
                Today, Justin channels his military discipline and personal
                cannabis journey into building{" "}
                <strong className="text-battles-gold">Battles Budz</strong> - a
                vertically integrated microbusiness that honors both the healing
                potential of cannabis and the highest standards of quality and
                service.
              </p>

              <div className="bg-battles-black text-white p-6 rounded-lg">
                <p className="italic text-battles-gold font-medium">
                  "My mission is to create a business that serves the community
                  with integrity, provides healing through quality cannabis, and
                  demonstrates that veteran entrepreneurs can lead positive
                  change in emerging industries."
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
