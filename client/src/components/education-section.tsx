import { BookOpen, Video, Users, Leaf, FlaskConical, Award } from "lucide-react";

export default function EducationSection() {
  const blogPosts = [
    {
      id: 1,
      title: "Cannabis 101: Understanding Terpenes and Their Effects",
      excerpt: "Learn how terpenes influence the cannabis experience and why they're essential for choosing the right product.",
      category: "Education",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1566303612084-5177e19b8eab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      id: 2,
      title: "From Seed to Sale: Our Cultivation Process",
      excerpt: "Take a behind-the-scenes look at how we grow premium cannabis using sustainable, organic practices.",
      category: "Cultivation",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1574936019166-81fa21c0f80b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      id: 3,
      title: "Cannabis and Veterans: A Personal Journey",
      excerpt: "Justin Battles shares how cannabis transformed his approach to managing ADHD and post-military life.",
      category: "Personal",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
    {
      id: 4,
      title: "Responsible Consumption: Dosing and Safety Guidelines",
      excerpt: "Essential tips for new cannabis users on dosing, timing, and creating a safe consumption experience.",
      category: "Safety",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1609208261826-5b1a7bd2b1d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    },
  ];

  const educationResources = [
    {
      icon: BookOpen,
      title: "Cannabis Fundamentals",
      description: "Essential knowledge about cannabis science, effects, and consumption methods.",
    },
    {
      icon: Leaf,
      title: "Cultivation Insights",
      description: "Learn about organic growing practices, genetics, and sustainable cultivation.",
    },
    {
      icon: FlaskConical,
      title: "Processing & Extraction",
      description: "Understanding how cannabis products are made and quality standards.",
    },
    {
      icon: Award,
      title: "Legal & Compliance",
      description: "Stay informed about New York cannabis laws and responsible use guidelines.",
    },
  ];

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-battles-black mb-6">
            Cannabis <span className="text-battles-gold">Education</span>
          </h2>
          <p className="text-xl text-battles-gray max-w-3xl mx-auto">
            Knowledge empowers better choices. Explore our educational content to deepen your understanding 
            of cannabis culture, science, and responsible consumption.
          </p>
        </div>

        {/* Education Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {educationResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="bg-battles-gold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-battles-black h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-battles-black mb-2">
                  {resource.title}
                </h3>
                <p className="text-battles-gray text-sm">{resource.description}</p>
              </div>
            );
          })}
        </div>

        {/* Featured Blog Posts */}
        <div className="mb-12">
          <h3 className="text-3xl font-playfair font-bold text-center text-battles-black mb-12">
            Latest <span className="text-battles-gold">Articles</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-battles-gold text-battles-black px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <span className="text-battles-gray text-sm">{post.readTime}</span>
                  </div>
                  <h4 className="text-xl font-bold text-battles-black mb-3 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-battles-gray mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button className="text-battles-gold font-semibold hover:text-yellow-600 transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center bg-battles-black rounded-xl p-12">
          <h3 className="text-3xl font-playfair font-bold text-white mb-6">
            More Content <span className="text-battles-gold">Coming Soon</span>
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're developing comprehensive educational resources including video tutorials, 
            interactive guides, and expert-led workshops. Stay tuned for updates!
          </p>
          <div className="flex justify-center space-x-8 text-battles-gold">
            <div className="text-center">
              <Video className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Video Guides</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Live Workshops</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Interactive Content</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}