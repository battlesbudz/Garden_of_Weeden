import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import cannabisFlower1 from "@assets/Screenshot_20250713_025017_Gallery_1752389462073.jpg";

export default function HeirloomFlowerPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribed(true);
    toast({
      title: "Success!",
      description: "You'll be notified when our landrace cannabis is available.",
    });
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-battles-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-battles-gold hover:text-yellow-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
                <span className="text-battles-gold">Landrace</span> Cannabis
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Authentic, unmodified cannabis genetics cultivated using traditional organic methods for a pure, natural experience.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={cannabisFlower1}
                alt="Heirloom Flower"
                className="w-full max-w-md h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is Landrace Cannabis */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-8 text-center">What is Landrace Cannabis?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Landrace cannabis refers to ancient, pure strains that evolved naturally in specific geographic regions over thousands of years. 
                These genetics haven't been heavily hybridized or modified by modern breeding practices.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At Battles Budz, we specialize in cultivating these authentic genetics, particularly long-flowering equatorial cultivars 
                that offer unique cannabinoid profiles with typically lower THC but higher concentrations of other beneficial compounds like CBD, CBG, and rare terpenes.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our flower is featured in boutique hand-rolled joints and non-tobacco leaf blunts with glass tips, 
                crafted for superior aroma, smoothness, and a truly authentic cannabis experience.
              </p>
            </div>
            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-4">Why Choose Landrace?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-battles-gold mr-2">•</span>
                  <span>Authentic genetics unchanged for centuries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-battles-gold mr-2">•</span>
                  <span>Complex cannabinoid and terpene profiles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-battles-gold mr-2">•</span>
                  <span>Unique effects from diverse compounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-battles-gold mr-2">•</span>
                  <span>Lower THC, higher therapeutic potential</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cultivation Methods */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-12 text-center">Our Cultivation Methods</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Organic Living Soil</h3>
                <p className="text-gray-300">
                  We use living soil ecosystems that naturally feed our plants through beneficial microorganisms, 
                  creating healthier plants with more complex flavors and effects.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">No-Till Beds</h3>
                <p className="text-gray-300">
                  Our no-till approach preserves soil structure and microbial networks, allowing plants to 
                  develop deeper root systems and access nutrients more efficiently.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Equatorial Genetics</h3>
                <p className="text-gray-300">
                  We specialize in long-flowering equatorial cultivars that require patience but reward with 
                  unique cannabinoid profiles and complex terpene expressions rarely found in modern strains.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-battles-gold/20">
                <h3 className="text-xl font-semibold text-battles-gold mb-4">Traditional Methods</h3>
                <p className="text-gray-300">
                  Our cultivation honors traditional growing practices, allowing plants to express their 
                  natural characteristics without forcing them into unnatural growth patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">What's the difference between landrace and hybrid strains?</h3>
              <p className="text-gray-300">
                Landrace strains are pure, original genetics that developed naturally in specific regions over thousands of years. 
                Hybrids are created by crossing different strains. Landraces offer more authentic experiences with complex, 
                balanced effects rather than the high-THC focus of many modern hybrids.
              </p>
            </div>
            
            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Why is the THC lower in landrace strains?</h3>
              <p className="text-gray-300">
                Landrace strains naturally contain balanced cannabinoid profiles. While THC might be lower (often 12-18%), 
                they're rich in CBD, CBG, and other compounds that create what's called the "entourage effect" - 
                a more holistic, therapeutic experience rather than just an intense high.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">What are equatorial cultivars?</h3>
              <p className="text-gray-300">
                Equatorial cultivars are cannabis strains that originated near the equator, like those from Colombia, Thailand, 
                or parts of Africa. These plants are adapted to consistent light cycles and often have longer flowering periods, 
                resulting in unique terpene profiles and effects you won't find in faster-finishing strains.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">What makes organic no-till cultivation special?</h3>
              <p className="text-gray-300">
                No-till organic cultivation mimics nature by never disturbing the soil ecosystem. This preserves beneficial 
                microorganisms that help plants absorb nutrients more effectively, resulting in cleaner, more flavorful 
                cannabis with enhanced therapeutic properties.
              </p>
            </div>

            <div className="bg-black p-6 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">How should I expect landrace cannabis to feel different?</h3>
              <p className="text-gray-300">
                Landrace strains typically provide more balanced, clear-headed effects with less anxiety or paranoia. 
                The experience is often described as more "natural" or "grounding" compared to high-THC hybrids. 
                Effects may be more subtle but longer-lasting and more therapeutic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-battles-gold mb-6">Get Notified</h2>
          <p className="text-lg text-gray-300 mb-8">
            Be the first to know when our authentic landrace cannabis becomes available
          </p>
          
          {isSubscribed ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-500 mb-2">You're all set!</h3>
              <p className="text-gray-300">We'll notify you as soon as our landrace cannabis is available.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold">
                Notify Me
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            <span className="text-battles-gold font-semibold">21+ Only</span> – Cannabis products pending release
          </p>
        </div>
      </footer>
    </div>
  );
}