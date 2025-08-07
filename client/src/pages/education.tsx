import { useState } from "react";
import { BookOpen, Video, Users, Leaf, FlaskConical, Award, MapPin, Car, Home, Shield, Clock, User, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import cultivationImage from "@assets/360_F_499206936_DTB3BAfocgPpunIz14tRTBZwwy5PC1Oi_1752425020338.jpg";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl, getPageTitle, CANNABIS_KEYWORDS } from "@/utils/seo";

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "tourism", name: "Tourism Planning", icon: MapPin },
    { id: "safety", name: "Safety & Transport", icon: Shield },
    { id: "legal", name: "Legal Guidelines", icon: Award },
    { id: "products", name: "Products & Strains", icon: Leaf },
    { id: "culture", name: "Culture & Etiquette", icon: Users },
  ];

  const guides = [
    {
      id: 1,
      title: "Complete New York Cannabis Tourism Guide 2025",
      excerpt: "Everything you need to know about legal cannabis tourism in New York State, from dispensary visits to consumption lounges.",
      category: "tourism",
      readTime: "15 min read",
      author: "Battles Budz Team",
      image: "https://images.unsplash.com/photo-1543716091-a840c05249ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: true,
      content: `
        <h2>Welcome to New York Cannabis Tourism</h2>
        <p>New York State has legalized recreational cannabis, creating exciting opportunities for cannabis tourism. This comprehensive guide covers everything you need to know for a safe and legal cannabis experience.</p>
        
        <h3>What's Legal in New York</h3>
        <ul>
          <li>Adults 21+ can possess up to 3 ounces of cannabis flower</li>
          <li>Up to 24 grams of concentrated cannabis</li>
          <li>Cannabis can be consumed in licensed consumption lounges</li>
          <li>Home cultivation of up to 6 plants (3 mature, 3 immature)</li>
        </ul>
        
        <h3>Where to Buy Cannabis</h3>
        <p>Licensed dispensaries are the only legal source for recreational cannabis in New York. Always verify licensing through the state's official database.</p>
        
        <h3>Consumption Lounges</h3>
        <p>Licensed consumption lounges like Battles Budz offer a safe, legal environment to consume cannabis products. These venues often provide:</p>
        <ul>
          <li>Educational experiences and expert guidance</li>
          <li>Social consumption opportunities</li>
          <li>Product tastings and pairings</li>
          <li>Community events and workshops</li>
        </ul>
      `
    },
    {
      id: 2,
      title: "Consumption Lounge Etiquette: A Visitor's Guide",
      excerpt: "Learn proper etiquette, social norms, and safety guidelines for visiting cannabis consumption lounges in New York.",
      category: "culture",
      readTime: "8 min read",
      author: "Justin Battles",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: true,
      content: `
        <h2>Cannabis Consumption Lounge Etiquette</h2>
        <p>Consumption lounges provide a unique social environment for cannabis use. Understanding proper etiquette ensures everyone has a positive experience.</p>
        
        <h3>Before You Visit</h3>
        <ul>
          <li>Make reservations when required</li>
          <li>Bring valid government-issued ID</li>
          <li>Arrive sober - don't pre-consume</li>
          <li>Research the venue's specific rules</li>
        </ul>
        
        <h3>Inside the Lounge</h3>
        <ul>
          <li>Respect others' personal space and preferences</li>
          <li>Don't share products with strangers for health reasons</li>
          <li>Be mindful of your consumption levels</li>
          <li>Tip your budtenders - they're cannabis professionals</li>
          <li>Keep conversations respectful and inclusive</li>
        </ul>
        
        <h3>Safety First</h3>
        <p>Always prioritize safety. Start with small doses, especially with edibles. Stay hydrated and don't drive under the influence.</p>
      `
    },
    {
      id: 3,
      title: "Cannabis Strain Guide: Indica, Sativa, and Hybrids",
      excerpt: "Understanding different cannabis strains, their effects, and what to expect during your cannabis experience.",
      category: "products",
      readTime: "12 min read",
      author: "Battles Budz Experts",
      image: cultivationImage,
      featured: true,
      content: `
        <h2>Understanding Cannabis Strains</h2>
        <p>Cannabis strains fall into three main categories, each offering different effects and experiences.</p>
        
        <h3>Indica Strains</h3>
        <p>Known for relaxing, body-focused effects. Often preferred for:</p>
        <ul>
          <li>Evening and nighttime use</li>
          <li>Relaxation and stress relief</li>
          <li>Sleep aid</li>
          <li>Pain and inflammation relief</li>
        </ul>
        
        <h3>Sativa Strains</h3>
        <p>Typically provide energizing, uplifting effects. Popular for:</p>
        <ul>
          <li>Daytime use</li>
          <li>Creative activities</li>
          <li>Social situations</li>
          <li>Focus and productivity</li>
        </ul>
        
        <h3>Hybrid Strains</h3>
        <p>Combine characteristics of both indica and sativa, offering balanced effects. Great for those seeking specific combinations of benefits.</p>
        
        <h3>Our Recommendations</h3>
        <p>Visit our consumption lounge to try our curated selection of premium strains, guided by our expert budtenders.</p>
      `
    },
    {
      id: 4,
      title: "Legal Guidelines for Cannabis Tourists",
      excerpt: "Important legal information for cannabis tourists including possession limits, where you can consume, and interstate travel rules.",
      category: "legal",
      readTime: "10 min read",
      author: "Battles Budz Legal Team",
      image: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: false,
      content: `
        <h2>New York Cannabis Laws for Tourists</h2>
        <p>Understanding the legal framework ensures your cannabis tourism experience stays within the bounds of the law.</p>
        
        <h3>Possession Limits</h3>
        <ul>
          <li>3 ounces of cannabis flower</li>
          <li>24 grams of concentrated cannabis</li>
          <li>These limits apply to both residents and tourists</li>
        </ul>
        
        <h3>Where You Can Consume</h3>
        <ul>
          <li>Licensed consumption lounges (like Battles Budz)</li>
          <li>Private residences (with property owner permission)</li>
          <li>Designated hotel rooms (where allowed by hotel policy)</li>
        </ul>
        
        <h3>Where You Cannot Consume</h3>
        <ul>
          <li>Public spaces (parks, streets, sidewalks)</li>
          <li>Schools and school grounds</li>
          <li>Workplaces</li>
          <li>Vehicles</li>
          <li>Federal property</li>
        </ul>
        
        <h3>Interstate Travel Warning</h3>
        <p>Do NOT transport cannabis across state lines, even to states where it's legal. This remains a federal offense.</p>
      `
    },
    {
      id: 5,
      title: "Safe Transportation and Cannabis Tourism",
      excerpt: "Transportation options, safety guidelines, and planning your cannabis tourism itinerary responsibly.",
      category: "safety",
      readTime: "7 min read",
      author: "Safety Team",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: false,
      content: `
        <h2>Transportation and Safety</h2>
        <p>Planning safe transportation is crucial for responsible cannabis tourism.</p>
        
        <h3>Transportation Options</h3>
        <ul>
          <li>Rideshare services (Uber, Lyft)</li>
          <li>Public transportation</li>
          <li>Walking when practical</li>
          <li>Designated driver (who remains sober)</li>
        </ul>
        
        <h3>Never Drive Under the Influence</h3>
        <p>Cannabis impairs your ability to drive safely. Plan alternative transportation before consuming.</p>
        
        <h3>Planning Your Day</h3>
        <ul>
          <li>Start early to allow time for effects to wear off</li>
          <li>Stay hydrated and eat regular meals</li>
          <li>Have a sober friend or plan check-ins</li>
          <li>Know your limits and pace yourself</li>
        </ul>
      `
    },
    {
      id: 6,
      title: "Cannabis Tourism Planning Checklist",
      excerpt: "Step-by-step planning guide for your New York cannabis tourism experience.",
      category: "tourism",
      readTime: "6 min read",
      author: "Battles Budz Team",
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      featured: false,
      content: `
        <h2>Planning Your Cannabis Tourism Trip</h2>
        <p>A well-planned trip ensures you make the most of your cannabis tourism experience.</p>
        
        <h3>Before You Travel</h3>
        <ul>
          <li>Research licensed dispensaries and consumption lounges</li>
          <li>Make reservations for consumption lounge experiences</li>
          <li>Plan your accommodation with cannabis-friendly policies</li>
          <li>Research local laws and regulations</li>
        </ul>
        
        <h3>What to Bring</h3>
        <ul>
          <li>Valid government-issued photo ID</li>
          <li>Cash (many dispensaries are cash-only)</li>
          <li>Comfortable clothing</li>
          <li>Water bottle for hydration</li>
        </ul>
        
        <h3>Making Reservations</h3>
        <p>Book your Battles Budz experience in advance to ensure availability. Our premium consumption lounge offers guided tastings and educational workshops.</p>
      `
    },
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredGuides = guides.filter(guide => guide.featured);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={getPageTitle("Cannabis Education & Tourism Guide")}
        description="Comprehensive cannabis education and tourism guide for New York State. Learn about legal cannabis use, dispensary visits, consumption lounges, and safe cannabis tourism practices."
        keywords={CANNABIS_KEYWORDS.education}
        canonicalUrl={getCanonicalUrl("/education")}
        ogType="website"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-battles-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-6">
              Cannabis Tourism <span className="text-battles-gold">Education Center</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your comprehensive guide to cannabis tourism in New York. Learn everything you need 
              for a safe, legal, and memorable cannabis experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#events">
                <Button className="bg-battles-gold text-battles-black hover:bg-yellow-600 font-bold px-8 py-3">
                  Book Lounge Experience
                </Button>
              </a>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-battles-black px-8 py-3">
                Download Tourism Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? "bg-battles-gold text-battles-black hover:bg-yellow-600" 
                      : "border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black"
                    }
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="featured" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="featured">Featured Guides</TabsTrigger>
              <TabsTrigger value="all">All Guides</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredGuides.map((guide) => (
                  <Card key={guide.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-battles-gold text-battles-black">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {guide.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-battles-black">
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="text-battles-gray">
                        {guide.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a href={`mailto:battlesbudz@gmail.com?subject=Request for ${guide.title}&body=Hi, I would like to read the full guide: ${guide.title}`}>
                        <Button className="w-full bg-battles-gold text-battles-black hover:bg-yellow-600">
                          Request Full Guide
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGuides.map((guide) => (
                  <Card key={guide.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="w-full h-48 object-cover"
                      />
                      {guide.featured && (
                        <Badge className="absolute top-4 left-4 bg-battles-gold text-battles-black">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {guide.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-battles-black">
                        {guide.title}
                      </CardTitle>
                      <CardDescription className="text-battles-gray">
                        {guide.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a href={`mailto:battlesbudz@gmail.com?subject=Request for ${guide.title}&body=Hi, I would like to read the full guide: ${guide.title}`}>
                        <Button className="w-full bg-battles-gold text-battles-black hover:bg-yellow-600">
                          Request Full Guide
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Integration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-battles-black mb-4">
              Join Our <span className="text-battles-gold">Learning Community</span>
            </h2>
            <p className="text-xl text-battles-gray max-w-3xl mx-auto">
              Connect with fellow cannabis tourists, share experiences, and continue learning in our 
              dedicated community forum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <CardTitle className="text-battles-black">Share Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-battles-gray mb-4">
                  Share your cannabis tourism experiences, tips, and recommendations with the community.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
                    Join Discussion
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <CardTitle className="text-battles-black">Ask Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-battles-gray mb-4">
                  Get your cannabis tourism questions answered by experts and experienced travelers.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
                    Ask Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-battles-gold mx-auto mb-4" />
                <CardTitle className="text-battles-black">Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-battles-gray mb-4">
                  Learn from industry professionals and experienced cannabis tourism guides.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="border-battles-gold text-battles-gold hover:bg-battles-gold hover:text-battles-black">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-battles-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold text-white mb-6">
            Ready to Experience <span className="text-battles-gold">Cannabis Tourism</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us at Battles Budz for a premium cannabis consumption lounge experience. 
            Book your guided tasting or educational workshop today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#events">
              <Button className="bg-battles-gold text-battles-black hover:bg-yellow-600 font-bold px-8 py-3">
                Book Your Experience
              </Button>
            </a>
            <a href="/#contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-battles-black px-8 py-3">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}