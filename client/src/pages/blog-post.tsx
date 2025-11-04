import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo/SEOHead";
import { SocialShare } from "@/components/social-share";
import { getCanonicalUrl, SITE_CONFIG } from "@/utils/seo";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error} = useQuery<BlogPost>({
    queryKey: [`/api/blog/slug/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-battles-black">
        <Navigation />
        <div className="pt-32 px-4 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-battles-black">
        <SEOHead
          title="Post Not Found - Garden of Weeden Blog"
          description="The blog post you're looking for could not be found."
          canonicalUrl={getCanonicalUrl("/blog")}
        />
        <Navigation />
        <div className="pt-32 px-4 max-w-4xl mx-auto text-center pb-16">
          <h1 className="font-enchanted text-4xl md:text-5xl text-parchment mb-6">
            Post Not Found
          </h1>
          <p className="font-garden text-lg text-gray-300 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button className="bg-green-500 hover:bg-green-600" data-testid="button-back-to-blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-battles-black">
      <SEOHead
        title={`${post.title} - Garden of Weeden Blog`}
        description={post.metaDescription || post.excerpt}
        keywords={post.metaKeywords || []}
        canonicalUrl={getCanonicalUrl(`/blog/${post.slug}`)}
        ogType="article"
        ogImage={post.featuredImage || undefined}
      />
      <Navigation />
      
      {/* Article Header */}
      <article className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blog">
            <Button 
              variant="ghost" 
              className="mb-8 text-green-400 hover:text-green-300 hover:bg-green-500/10"
              data-testid="button-back-to-blog"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-green-500" />
            <span className="text-green-400 font-garden text-sm uppercase tracking-wider" data-testid="text-category">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-enchanted text-4xl md:text-5xl lg:text-6xl text-parchment mb-6" data-testid="text-title">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-garden text-sm" data-testid="text-author">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time className="font-garden text-sm" data-testid="text-published-date">
                {post.publishedAt 
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  : 'Draft'}
              </time>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12 rounded-lg overflow-hidden border border-green-500/20">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-auto"
                data-testid="img-featured"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="mb-8 p-6 bg-midnight-grove/40 border-l-4 border-green-500 rounded-r-lg">
            <p className="font-storybook text-xl md:text-2xl text-green-400 italic">
              {post.excerpt}
            </p>
          </div>

          {/* Social Share */}
          <div className="mb-12">
            <SocialShare
              url={`${SITE_CONFIG.url}/blog/${post.slug}`}
              title={post.title}
              description={post.excerpt}
              variant="inline"
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg prose-invert max-w-none font-garden"
            data-testid="content-blog-post"
          >
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-green-500/20">
              <h3 className="font-storybook text-xl text-parchment mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-midnight-grove/60 border border-green-500/30 rounded-full text-sm text-green-400 font-garden"
                    data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Again */}
          <div className="mt-12 pt-8 border-t border-green-500/20">
            <h3 className="font-storybook text-xl text-parchment mb-4 text-center">Share This Article</h3>
            <div className="flex justify-center">
              <SocialShare
                url={`${SITE_CONFIG.url}/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
                variant="inline"
              />
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
