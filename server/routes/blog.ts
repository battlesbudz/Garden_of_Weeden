import type { Express } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertBlogPostSchema } from "@shared/schema";
import { z } from "zod";

export function registerBlogRoutes(app: Express) {
  const normalizeBlogPostBody = (body: any) => ({
    ...body,
    publishedAt: body?.publishedAt ? new Date(body.publishedAt) : body?.publishedAt,
  });

  // Get all published blog posts (public)
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get all blog posts including drafts (admin only)
  app.get("/api/blog/admin/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get posts by category (public)
  app.get("/api/blog/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const posts = await storage.getBlogPostsByCategory(category);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      res.status(500).json({ message: "Failed to fetch posts by category" });
    }
  });

  // Get a single blog post by slug (public)
  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Only show published posts to non-admin users
      if (!post.published) {
        if (!(req as any).user) {
          return res.status(404).json({ message: "Blog post not found" });
        }
        const userId = ((req as any).user?.claims?.sub || (req as any).user?.id);
        const user = await storage.getUser(userId);
        if (!user || user.role !== 'admin') {
          return res.status(404).json({ message: "Blog post not found" });
        }
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get a single blog post by ID (public)
  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Only show published posts to non-admin users
      if (!post.published) {
        if (!(req as any).user) {
          return res.status(404).json({ message: "Blog post not found" });
        }
        const userId = ((req as any).user?.claims?.sub || (req as any).user?.id);
        const user = await storage.getUser(userId);
        if (!user || user.role !== 'admin') {
          return res.status(404).json({ message: "Blog post not found" });
        }
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Create a new blog post (admin only)
  app.post("/api/blog/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertBlogPostSchema.parse(normalizeBlogPostBody(req.body));
      const post = await storage.createBlogPost(validatedData);
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data",
          errors: error.errors 
        });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Update a blog post (admin only)
  app.put("/api/blog/posts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(normalizeBlogPostBody(req.body));
      const post = await storage.updateBlogPost(id, validatedData);
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data",
          errors: error.errors 
        });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete a blog post (admin only)
  app.delete("/api/blog/posts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
}
