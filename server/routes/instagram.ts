import type { Express, Request, Response } from 'express';

interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

export function registerInstagramRoutes(app: Express) {
  app.get('/api/instagram/feed', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      
      if (!accessToken) {
        // Return empty array if token not configured - graceful fallback
        return res.json({ data: [], error: 'Instagram access token not configured' });
      }

      // Fetch recent media from Instagram Graph API
      // Fields: id, media_type, media_url, permalink, caption, timestamp, thumbnail_url
      const fields = 'id,media_type,media_url,permalink,caption,timestamp,thumbnail_url';
      const limit = 6; // Fetch 6 recent posts
      
      const apiUrl = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error('Instagram API error:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Instagram API error details:', errorData);
        return res.json({ data: [], error: 'Failed to fetch Instagram posts' });
      }

      const data = await response.json();
      
      // Filter to only include images and videos (not carousel albums for simplicity)
      const posts = (data.data || []).filter((post: InstagramPost) => 
        post.media_type === 'IMAGE' || post.media_type === 'VIDEO'
      ).slice(0, 3); // Only return 3 posts for the footer

      res.json({ data: posts });
    } catch (error) {
      console.error('Error fetching Instagram feed:', error);
      res.json({ data: [], error: 'Failed to fetch Instagram posts' });
    }
  });
}
