
import type { Express } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertForumCategorySchema, insertForumPostSchema, insertForumCommentSchema } from "@shared/schema";
import { z } from "zod";

export function registerForumRoutes(app: Express) {
  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getActiveForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  // Create forum category (admin only)
  app.post("/api/forum/categories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(validatedData);
      
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum category:", error);
      res.status(500).json({ message: "Failed to create forum category" });
    }
  });

  // Get all forum posts
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      let posts;
      
      if (category && !isNaN(Number(category))) {
        posts = await storage.getPostsByCategory(Number(category));
      } else {
        posts = await storage.getAllForumPosts();
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  // Get single forum post with comments
  app.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment view count
      await storage.incrementPostViews(postId);
      
      // Get comments
      const comments = await storage.getPostComments(postId);
      
      res.json({ 
        ...post, 
        viewCount: (post.viewCount || 0) + 1,
        comments 
      });
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  // Create forum post (authenticated users only)
  app.post("/api/forum/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        authorId: userId,
        isPinned: req.body.isPinned || false,
        isLocked: req.body.isLocked || false
      });
      
      const post = await storage.createForumPost(validatedData);
      
      // Award points for creating a post
      try {
        await storage.addPointsToUser(userId, 20, 'post_created', post.id, 'post', 'Created a forum post');
        await storage.checkAndUnlockAchievements(userId);
      } catch (pointsError) {
        console.warn("Failed to award points for post creation:", pointsError);
      }
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid post data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  // Create forum comment (authenticated users only)
  app.post("/api/forum/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const validatedData = insertForumCommentSchema.parse({
        ...req.body,
        authorId: userId
      });
      
      const comment = await storage.createForumComment(validatedData);
      
      // Award points for creating a comment
      try {
        await storage.addPointsToUser(userId, 10, 'comment_created', comment.id, 'comment', 'Added a comment');
        await storage.checkAndUnlockAchievements(userId);
      } catch (pointsError) {
        console.warn("Failed to award points for comment creation:", pointsError);
      }
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid comment data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum comment:", error);
      res.status(500).json({ message: "Failed to create forum comment" });
    }
  });

  // Toggle like on post (authenticated users only)
  app.post("/api/forum/posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const result = await storage.togglePostLike(userId, postId);
      
      // Award points for liking (only when actually liking, not unliking)
      if (result.liked) {
        try {
          await storage.addPointsToUser(userId, 5, 'like_given', postId, 'post', 'Liked a post');
          await storage.checkAndUnlockAchievements(userId);
        } catch (pointsError) {
          console.warn("Failed to award points for like:", pointsError);
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error toggling post like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Toggle like on comment (authenticated users only)
  app.post("/api/forum/comments/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const commentId = parseInt(req.params.id);
      
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const result = await storage.toggleCommentLike(userId, commentId);
      
      // Award points for liking (only when actually liking, not unliking)
      if (result.liked) {
        try {
          await storage.addPointsToUser(userId, 5, 'like_given', commentId, 'comment', 'Liked a comment');
          await storage.checkAndUnlockAchievements(userId);
        } catch (pointsError) {
          console.warn("Failed to award points for like:", pointsError);
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });
}
