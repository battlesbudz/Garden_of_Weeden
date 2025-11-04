import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { getCanonicalUrl } from "@/utils/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const categories = posts
    ? Array.from(new Set(posts.map(post => post.category))).sort()
    : [];

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title="Cannabis Blog - Garden of Weeden"
        description="Explore expert insights on cannabis cultivation, wellness, and Buffalo's craft cannabis scene from Garden of Weeden's veteran-owned team."
        keywords={[
          "cannabis blog",
          "Buffalo cannabis",
          "cannabis cultivation guide",
          "cannabis wellness",
          "craft cannabis",
          "micro-terroir cannabis",
          "veteran cannabis blog",
          "Buffalo NY cannabis",
          "cannabis education"
        ]}
        canonicalUrl={getCanonicalUrl("/blog")}
        ogType="website"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-enchanted text-5xl md:text-6xl text-parchment mb-6">
            The Garden Chronicles
          </h1>
          <p className="font-storybook text-2xl md:text-3xl text-green-400 mb-8">
            Stories from the Soil
          </p>
          <div className="h-1 w-32 bg-green-500 mx-auto mb-8"></div>
          <p className="font-garden text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Expert insights on craft cannabis cultivation, wellness advocacy, and Buffalo's 
            emerging cannabis scene from our veteran-owned team.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-midnight-grove/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                data-testid="input-search-blog"
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-midnight-grove/50 border-green-500/30 text-parchment placeholder:text-gray-500 focus:border-green-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                data-testid="button-category-all"
                onClick={() => setSelectedCategory(null)}
                variant={!selectedCategory ? "default" : "outline"}
                className={!selectedCategory ? "bg-green-500 hover:bg-green-600" : "border-green-500/50 text-parchment hover:bg-green-500/20"}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "border-green-500/50 text-parchment hover:bg-green-500/20"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-midnight-grove/40 rounded-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  data-testid={`link-blog-post-${post.slug}`}
                >
                  <article className="group bg-midnight-grove/40 rounded-lg overflow-hidden border border-green-500/20 hover:border-green-500 transition-all duration-300 hover:scale-105">
                    {post.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-400">{post.category}</span>
                      </div>
                      
                      {/* Title */}
                      <h2 className="font-storybook text-2xl text-parchment mb-3 group-hover:text-green-400 transition-colors">
                        {post.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="font-garden text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {post.publishedAt 
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : 'Draft'}
                          </span>
                        </div>
                        <span className="text-green-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-garden text-xl text-gray-400">
                No articles found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
