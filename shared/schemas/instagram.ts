import { z } from 'zod';

export const instagramMediaSchema = z.object({
  id: z.string(),
  media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
  media_url: z.string(),
  permalink: z.string(),
  caption: z.string().optional(),
  timestamp: z.string(),
  thumbnail_url: z.string().optional(),
});

export const instagramFeedResponseSchema = z.object({
  data: z.array(instagramMediaSchema),
  paging: z.object({
    cursors: z.object({
      before: z.string().optional(),
      after: z.string().optional(),
    }).optional(),
    next: z.string().optional(),
  }).optional(),
});

export type InstagramMedia = z.infer<typeof instagramMediaSchema>;
export type InstagramFeedResponse = z.infer<typeof instagramFeedResponseSchema>;
