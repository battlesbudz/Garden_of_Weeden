import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { SocialShare } from "@/components/social-share";
import { getCanonicalUrl, SITE_CONFIG } from "@/utils/seo";
import { Leaf, Award, MapPin, Users, Target, Heart } from "lucide-react";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { ImageComparison } from "@/components/interactive/ImageComparison";
import { ServiceToSoilTimeline } from "@/components/storytelling/ServiceToSoilTimeline";
import { BuffaloMicroTerroirExplainer } from "@/components/storytelling/BuffaloMicroTerroirExplainer";
import { GrowingProcessInfographic } from "@/components/storytelling/GrowingProcessInfographic";
import { CannabisLeafPattern, MilitaryGeometricPattern } from "@/components/patterns/BackgroundPatterns";
import { WaveDivider } from "@/components/patterns/SectionDividers";
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
        <CannabisLeafPattern opacity={0.05} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
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

      {/* Stats Section with AnimatedCounters */}
      <section className="py-12 px-4 bg-gradient-to-b from-green-900/20 to-transparent relative">
        <MilitaryGeometricPattern opacity={0.03} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-veteran-owned" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Veteran-Owned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-buffalo-grown" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Buffalo-Grown</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={0} suffix="%" duration={2.5} testId="stat-pesticides" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Pesticides</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-dedication" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Dedication</div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

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

      {/* Image Comparison - Cultivation Process */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 relative">
        <CannabisLeafPattern opacity={0.04} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-storybook text-4xl md:text-5xl text-parchment mb-4">
              Cultivation Excellence
            </h2>
            <p className="font-garden text-gray-300 text-lg">
              See the transformation from seedling to harvest
            </p>
          </div>
          <ImageComparison
            beforeImage={fieldRowsImage}
            afterImage={flowerCloseupImage}
            beforeLabel="Early Growth"
            afterLabel="Peak Harvest"
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>

      <WaveDivider />

      {/* Buffalo Micro-Terroir - Enhanced with Explainer Component */}
      <BuffaloMicroTerroirExplainer />

      <WaveDivider flip />

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

      {/* Service to Soil Timeline */}
      <ServiceToSoilTimeline />

      {/* Growing Process Infographic */}
      <GrowingProcessInfographic />

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
