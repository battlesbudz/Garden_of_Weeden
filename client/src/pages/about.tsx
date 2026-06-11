import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { SocialShare } from "@/components/social-share";
import { getCanonicalUrl, SITE_CONFIG } from "@/utils/seo";
import { Award, Leaf, MapPin, Sparkles, Target, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/interactive/AnimatedCounter";
import { BuffaloMicroTerroirExplainer } from "@/components/storytelling/BuffaloMicroTerroirExplainer";
import { ServiceToSoilTimeline } from "@/components/storytelling/ServiceToSoilTimeline";
import { GrowingProcessInfographic } from "@/components/storytelling/GrowingProcessInfographic";
import { CannabisLeafPattern } from "@/components/patterns/BackgroundPatterns";
import { WaveDivider } from "@/components/patterns/SectionDividers";
import flowerCloseupImage from "@assets/AISelect_20251103_131526_Instagram_1762194447917.jpg";
import dryingRacksImage from "@assets/AISelect_20251103_131504_Instagram_1762194447955.jpg";

export default function About() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title="Farm to Flame - Garden of Weeden"
        description="Garden of Weeden is a NYS licensed microbusiness dispensary and on-site consumption lounge in Buffalo, NY, built around local Farm to Flame craft cannabis."
        keywords={[
          "Farm to Flame",
          "Garden of Weeden",
          "Buffalo cannabis dispensary",
          "NYS licensed microbusiness",
          "local cannabis farmers",
          "Forbidden Fruit lounge",
          "Central and Western NY cannabis",
          "craft cannabis Buffalo"
        ]}
        canonicalUrl={getCanonicalUrl("/about")}
        ogType="website"
      />
      <Navigation />

      <section className="relative pt-32 pb-16 px-4">
        <CannabisLeafPattern opacity={0.05} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-enchanted text-5xl md:text-6xl text-parchment mb-6">
            Farm to Flame
          </h1>
          <p className="font-storybook text-2xl md:text-3xl text-green-400 mb-8">
            Local Craft Cannabis
          </p>
          <div className="h-1 w-32 bg-green-500 mx-auto mb-8"></div>
          <p className="font-garden text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Garden of Weeden is a veteran owned boutique cannabis dispensary and NYS licensed
            microbusiness focused on local, small-batch cannabis products sourced from farmers
            and processors in the Central and Western NY regions.
          </p>

          <div className="flex justify-center mt-8">
            <SocialShare
              url={`${SITE_CONFIG.url}/about`}
              title="Farm to Flame - Garden of Weeden"
              description="Local Farm to Flame craft cannabis in Buffalo, NY."
              variant="inline"
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-b from-green-900/20 to-transparent relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-licensed" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">NYS Licensed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-local-focus" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Regional Focus</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={15} suffix="mi" duration={2.5} testId="stat-farm-distance" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Farm South of Buffalo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2.5} testId="stat-craft" />
              </div>
              <div className="text-sm md:text-base font-garden text-gray-400">Craft Commitment</div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="py-16 px-4 bg-midnight-grove/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="h-8 w-8 text-green-500" aria-hidden="true" />
                <h2 className="font-storybook text-4xl text-parchment">Our Approach</h2>
              </div>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                We practice a Farm to Flame concept where our budtenders have intimate knowledge of
                the farmer partners and cultivation practices behind the cannabis products we offer
                for sale. Products at GOW are sourced directly from our farm located 15 miles south
                of Buffalo and other NYS small craft growers.
              </p>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                Our mission is to support small family farms, women, veteran, and minority owned
                businesses instead of large corporate organizations. Many of our producer
                relationships are connected through the Cannabis Farmers Alliance. We care about
                the products we serve our community and believe patience, attention to detail, and
                unwavering commitment to excellence help us serve fantastic craft cannabis products.
              </p>
              <blockquote className="border-l-4 border-green-500 pl-6 font-script text-xl text-parchment italic">
                "Quality cannabis, grown with care and integrity."
              </blockquote>
            </div>
            <div className="relative">
              <img
                src={flowerCloseupImage}
                alt="Craft cannabis flower at Garden of Weeden"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <BuffaloMicroTerroirExplainer />

      <WaveDivider flip />

      <section className="py-16 px-4 bg-midnight-grove/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-green-500" aria-hidden="true" />
                <h2 className="font-storybook text-4xl text-parchment">Forbidden Fruit Lounge & Private Events</h2>
              </div>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                We believe in providing the community with both fun and educational cannabis events
                and experiences. The Forbidden Fruit lounge is our on-site cannabis consumption
                lounge, built as a place to chill, relax, and attend upcoming events.
              </p>
              <p className="font-garden text-gray-300 mb-6 leading-relaxed">
                From our events to your events, we offer services to enhance private gatherings,
                including a bookable mobile weed bar experience for parties and events, plus
                private event hosting in the Forbidden Fruit consumption lounge.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="font-storybook text-2xl text-parchment mb-4">Events & Services</h3>
                <ul className="space-y-3 font-garden text-gray-300">
                  <li className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>On-site Forbidden Fruit cannabis consumption lounge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>Fun and educational cannabis events and experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>Bookable mobile weed bar experience for parties and events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" aria-hidden="true" />
                    <span>Contact Jennifer Fornell at (716) 420-1591 for private event scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <img
                src={dryingRacksImage}
                alt="Small-batch craft cannabis production at Garden of Weeden"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceToSoilTimeline />
      <GrowingProcessInfographic />

      <section className="py-20 px-4 bg-green-500/10 border-y border-green-500/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-enchanted text-4xl md:text-5xl text-parchment mb-6">
            Proudly Rooted in Buffalo
          </h2>
          <p className="font-garden text-xl text-gray-300 mb-8 leading-relaxed">
            Farm to Flame. Locally sourced. Community-focused, with off-street parking for guests.
          </p>
          <blockquote className="font-script text-2xl text-green-500 italic mb-8">
            "Every harvest reflects our region, our farmer partners, and our commitment to craft cannabis."
          </blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
}
