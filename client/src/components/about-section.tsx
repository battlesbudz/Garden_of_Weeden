import { Award, Heart, Leaf } from "lucide-react";

export default function AboutSection() {
  const values = [
    {
      icon: Award,
      title: "Excellence-Driven",
      description: "Unwavering commitment to quality and excellence in every aspect of our operation.",
    },
    {
      icon: Heart,
      title: "Community-Focused",
      description: "Building connections and supporting our local community through education and wellness.",
    },
    {
      icon: Leaf,
      title: "Sustainably Grown",
      description: "Eco-friendly cultivation practices and sustainable operations for a better future.",
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
                Founded on the belief that quality cannabis should be accessible to everyone, we're dedicated to providing premium products that enhance well-being and bring people together. Our journey began with a passion for the plant and a commitment to doing things right.
              </p>

              <p>
                We believe cannabis has the power to transform lives through its therapeutic and wellness benefits. That's why we've built our business on principles of quality, transparency, and community care.
              </p>

              <p>
                From seed to sale, we oversee every step of the process with meticulous attention to detail. Our team combines expertise in cultivation, processing, and customer service to deliver an exceptional cannabis experience.
              </p>

              <div className="bg-battles-black text-white p-6 rounded-lg">
                <p className="italic text-battles-gold font-medium">
                  "We're building more than just a dispensary—we're creating a community hub where people can safely enjoy cannabis, learn about the plant, and connect with others who share their interests."
                </p>
                <p className="mt-4 text-sm">— The Garden of Weeden Team</p>
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
