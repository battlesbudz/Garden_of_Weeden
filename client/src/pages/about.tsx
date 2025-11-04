import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { SocialShare } from "@/components/social-share";
import { getCanonicalUrl, SITE_CONFIG } from "@/utils/seo";
import { Leaf, Award, MapPin, Users, Target, Heart } from "lucide-react";
import fieldRowsImage from "@assets/AISelect_20251103_131607_Instagram_1762194447870.jpg";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

export default function About() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title="Our Veteran Story - Garden of Weeden"
        description="From service to soil: Learn how Garden of Weeden's veteran-owned team cultivates premium craft cannabis in Buffalo, NY."
        keywords={[
          "veteran-owned cannabis",
          "Buffalo cannabis",
          "craft cultivation",
          "craft cannabis cultivation",
          "veteran business Buffalo",
          "micro-terroir cannabis",
          "Western New York cannabis",
          "veteran wellness",
          "Garden of Weeden story"
        ]}
        canonicalUrl={getCanonicalUrl("/about")}
        ogType="website"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-enchanted text-5xl md:text-6xl text-parchment mb-6">
            From Service to Soil
          </h1>
          <p className="font-storybook text-2xl md:text-3xl text-green-400 mb-8">
            Our Veteran Story
          </p>
          <div className="h-1 w-32 bg-green-500 mx-auto mb-8"></div>
          <p className="font-garden text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Garden of Weeden is a veteran-owned cannabis microbusiness rooted in Buffalo, NY. 
            Our journey from service to cultivation tells a story of dedication, 
            resilience, and commitment to quality.
          </p>
          
          {/* Social Share - Inline */}
          <div className="flex justify-center mt-8">
            <SocialShare
              url={`${SITE_CONFIG.url}/about`}
              title="Our Veteran Story - Garden of Weeden"
              description="From service to soil: Learn how Garden of Weeden's veteran-owned team cultivates premium craft cannabis in Buffalo, NY."
              variant="inline"
            />
          </div>
        </div>
      </section>

      {/* Service-Forged Mastery */}
      <section className="py-16 px-4 bg-midnight-grove/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-green-500" />
                <h2 className="font-storybook text-4xl text-parchment">Our Approach</h2>
              </div>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                Years of service taught us patience, attention to detail, and unwavering commitment to excellence. 
                After transitioning from the military, we discovered that the same principles that guided us 
                could be applied to craft cannabis cultivation.
              </p>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                We bring that same commitment to quality to every plant we nurture. Our veteran team 
                understands that excellence isn't optional—it's the foundation of everything we do.
              </p>
              <blockquote className="border-l-4 border-green-500 pl-6 font-script text-xl text-parchment italic">
                "Quality cannabis, grown with care and integrity."
              </blockquote>
            </div>
            <div className="relative">
              <img 
                src={flowerCloseupImage} 
                alt="Premium cannabis flower showing craft cultivation quality" 
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Buffalo Micro-Terroir */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <img 
                src={fieldRowsImage} 
                alt="Outdoor cannabis cultivation rows in Buffalo, NY" 
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-8 w-8 text-green-500" />
                <h2 className="font-storybook text-4xl text-parchment">Buffalo Micro-Terroir</h2>
              </div>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                Grown where Lake Erie winds meet Western New York soil. Our garden thrives in Buffalo's 
                distinct climate, creating flavors you won't find anywhere else.
              </p>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                Buffalo's lake-effect weather isn't just winter storms—it's our secret ingredient. Cold nights, 
                humid summers, and resilient soil forge hardy, flavorful plants that embody the grit and 
                character of our city.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-storybook text-xl text-parchment mb-2">Lake Erie Climate</h3>
                    <p className="font-garden text-gray-400">Unique humidity and temperature patterns create ideal growing conditions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-storybook text-xl text-parchment mb-2">Western NY Soil</h3>
                    <p className="font-garden text-gray-400">Rich, mineral-dense earth that produces robust, flavorful plants</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-storybook text-xl text-parchment mb-2">Seasonal Excellence</h3>
                    <p className="font-garden text-gray-400">Buffalo's distinct seasons create natural cultivation cycles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Veteran Wellness Mission */}
      <section className="py-16 px-4 bg-midnight-grove/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-8 w-8 text-green-500" />
                <h2 className="font-storybook text-4xl text-parchment">Veteran Wellness Advocacy</h2>
              </div>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                Every harvest strengthens those who served. We're committed to veteran wellness, PTSD education, 
                and creating safe spaces for healing through natural alternatives.
              </p>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                From service member to wellness advocate, we understand the unique needs of veterans seeking 
                cannabis for therapeutic purposes. Our mission goes beyond cultivation—it's about supporting 
                the community that shaped who we are.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="font-storybook text-2xl text-parchment mb-4">Our Commitment</h3>
                <ul className="space-y-3 font-garden text-gray-300">
                  <li className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Veteran-focused education and resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>PTSD and wellness support programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Community partnerships with veteran organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Giving back to those who serve</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <img 
                src={dryingRacksImage} 
                alt="Cannabis drying racks showing craft process expertise" 
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="h-8 w-8 text-green-500" />
            <h2 className="font-storybook text-4xl text-parchment">From Service to Cure</h2>
          </div>
          <p className="font-garden text-gray-300 mb-12 leading-relaxed text-lg">
            Our cultivation process reflects the discipline and precision learned through service. 
            Every step—from seedling to final cure—receives the same meticulous attention we once 
            brought to our missions.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-midnight-grove/20 p-6 rounded-lg border border-green-500/20">
              <div className="text-5xl font-enchanted text-green-500 mb-4">01</div>
              <h3 className="font-storybook text-2xl text-parchment mb-3">Cultivation</h3>
              <p className="font-garden text-gray-400">
                Outdoor growing in Buffalo's micro-terroir with military-grade precision
              </p>
            </div>
            <div className="bg-midnight-grove/20 p-6 rounded-lg border border-green-500/20">
              <div className="text-5xl font-enchanted text-green-500 mb-4">02</div>
              <h3 className="font-storybook text-2xl text-parchment mb-3">Harvest</h3>
              <p className="font-garden text-gray-400">
                Careful timing and expert handling preserve every plant's unique character
              </p>
            </div>
            <div className="bg-midnight-grove/20 p-6 rounded-lg border border-green-500/20">
              <div className="text-5xl font-enchanted text-green-500 mb-4">03</div>
              <h3 className="font-storybook text-2xl text-parchment mb-3">Cure</h3>
              <p className="font-garden text-gray-400">
                Patient, controlled curing develops complex flavors and optimal potency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buffalo Pride CTA */}
      <section className="py-20 px-4 bg-green-500/10 border-y border-green-500/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-6">
            Proudly Rooted in Buffalo
          </h2>
          <p className="font-garden text-xl text-gray-300 mb-8 leading-relaxed">
            Veteran-owned. Buffalo-grown. Community-focused.
          </p>
          <blockquote className="font-script text-2xl text-green-500 italic mb-8">
            "Every harvest reflects our city's grit, resilience, and natural beauty."
          </blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
}
