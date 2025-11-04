import { useState } from 'react';
import { FaInstagram, FaLink } from 'react-icons/fa';
import { Share2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SITE_CONFIG } from '@/utils/seo';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'inline' | 'floating';
}

export function SocialShare({ url, title, description, variant = 'inline' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');

  const instagramLink = SITE_CONFIG.social.instagram;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleInstagramClick = () => {
    window.open(instagramLink, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'floating') {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        <div className="text-xs font-garden text-gray-400 writing-mode-vertical-rl transform rotate-180 mb-2">
          Share
        </div>
        <button
          onClick={handleInstagramClick}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-midnight-grove border-2 border-gray-700 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
          aria-label="Follow us on Instagram"
          data-testid="share-instagram"
        >
          <FaInstagram className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
        </button>
        <button
          onClick={handleCopyLink}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-midnight-grove border-2 border-gray-700 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
          aria-label="Copy link"
          data-testid="share-copy"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <FaLink className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-garden">Share:</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstagramClick}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
          aria-label="Follow us on Instagram"
          data-testid="share-instagram-inline"
        >
          <FaInstagram className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
        </button>
        <button
          onClick={handleCopyLink}
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-700 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
          aria-label="Copy link"
          data-testid="share-copy-inline"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <FaLink className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
}
