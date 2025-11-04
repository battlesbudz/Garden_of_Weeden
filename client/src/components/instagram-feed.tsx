import { useQuery } from '@tanstack/react-query';
import { FaInstagram } from 'react-icons/fa';
import { SITE_CONFIG } from '@/utils/seo';

interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramFeedResponse {
  data: InstagramPost[];
  error?: string;
}

export function InstagramFeed() {
  const { data, isLoading, isError } = useQuery<InstagramFeedResponse>({
    queryKey: ['/api/instagram/feed'],
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    staleTime: 1000 * 60 * 10, // Consider data stale after 10 minutes
  });

  const posts = data?.data || [];
  const hasError = isError || data?.error;

  // Show loading state
  if (isLoading) {
    return (
      <div>
        <p className="text-sm text-gray-400 mb-3 font-garden">Latest from Instagram</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-800 border border-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // If no posts or error, show placeholder with link
  if (hasError || posts.length === 0) {
    return (
      <div>
        <p className="text-sm text-gray-400 mb-3 font-garden">Latest from Instagram</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <a
              key={i}
              href={SITE_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-colors group cursor-pointer"
              aria-label={`View Garden of Weeden on Instagram`}
            >
              <div className="w-full h-full bg-gradient-to-br from-green-900/40 to-gray-900/80 flex items-center justify-center">
                <FaInstagram className="h-6 w-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 font-garden">Visit Instagram to see our latest posts</p>
      </div>
    );
  }

  // Show actual Instagram posts
  return (
    <div>
      <p className="text-sm text-gray-400 mb-3 font-garden">Latest from Instagram</p>
      <div className="grid grid-cols-3 gap-2">
        {posts.slice(0, 3).map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300 hover:scale-105 group cursor-pointer"
            aria-label={post.caption ? `Instagram post: ${post.caption.substring(0, 50)}...` : 'View Instagram post'}
            data-testid={`instagram-post-${post.id}`}
          >
            <img
              src={post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url}
              alt={post.caption || 'Instagram post from Garden of Weeden'}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </a>
        ))}
      </div>
      <a
        href={SITE_CONFIG.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-500 hover:text-green-500 mt-2 font-garden inline-block transition-colors"
      >
        View more on Instagram →
      </a>
    </div>
  );
}
