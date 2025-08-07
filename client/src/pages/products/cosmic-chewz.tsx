import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import cosmicChewzImg from "@assets/20240228_223118_1752399041772.png";
import SEOHead from '@/components/seo/SEOHead';
import { getCanonicalUrl, getPageTitle, getProductSchema } from '@/utils/seo';

export default function CosmicChewzPage() {
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
      description: "You'll be notified when Cosmic Chewz are available.",
    });
    setEmail('');
  };

  const productStructuredData = getProductSchema({
    name: "Cosmic Chewz - Premium Cannabis Edibles",
    description: "Premium cannabis-infused edibles with precise dosing and cosmic flavors. Launching 2025 from Battles Budz.",
    price: "TBD",
    category: "Cannabis Edibles",
    imageUrl: cosmicChewzImg,
    inStock: false
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <SEOHead
        title={getPageTitle("Cosmic Chewz - Premium Cannabis Edibles")}
        description="Premium cannabis-infused edibles with precise dosing and cosmic flavors. Join the waitlist for early access to Battles Budz' innovative edible products."
        keywords={["cannabis edibles", "premium edibles", "cannabis gummies", "precise dosing", "Battles Budz edibles", "New York cannabis edibles", "veteran owned cannabis", "cosmic chewz"]}
        canonicalUrl={getCanonicalUrl("/products/cosmic-chewz")}
        structuredData={productStructuredData}
        ogType="product"
        ogImage={cosmicChewzImg}
      />
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
                <span className="text-battles-gold">Cosmic</span> Chewz
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Hard candy with a chewy center, infused with full-spectrum RSO for long-lasting effects.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={cosmicChewzImg}
                alt="Cosmic Chewz"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-8 text-center">About Cosmic Chewz</h2>
          <p className="text-lg text-gray-300 leading-relaxed text-center">
            Hard candy with a chewy, Starburst-like center infused with full-spectrum RSO. Each piece contains 10 mg THC 
            and is crafted for great flavor and reliable, long-lasting effects. Designed for both enjoyment and relief.
          </p>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-battles-gold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Format</h3>
              <p className="text-gray-300">10mg THC per piece, 100mg per package</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Infusion Type</h3>
              <p className="text-gray-300">Full-spectrum RSO</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Experience</h3>
              <p className="text-gray-300">Long-lasting effects, great flavor</p>
            </div>
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-battles-gold/20">
              <h3 className="text-xl font-semibold text-battles-gold mb-3">Audience</h3>
              <p className="text-gray-300">Recreational use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-battles-gold mb-6">Get Notified</h2>
          <p className="text-lg text-gray-300 mb-8">
            Be the first to know when Cosmic Chewz become available
          </p>
          
          {isSubscribed ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-500 mb-2">You're all set!</h3>
              <p className="text-gray-300">We'll notify you as soon as Cosmic Chewz are available.</p>
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