
import type { Express } from "express";
import { isAdmin, isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import { insertBrandSchema, insertProductSchema, insertSiteSettingSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for disk storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function registerAdminRoutes(app: Express) {
  // ========== FILE UPLOAD ==========
  
  // Upload image file
  app.post("/api/admin/upload", isAdmin, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const url = `/uploads/brands/${req.file.filename}`;
      
      const mediaItem = await storage.createMediaItem({
        filename: req.file.originalname,
        url: url,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });
      
      res.json({ url, id: mediaItem.id });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // ========== MEDIA LIBRARY ==========
  
  // Get all media items
  app.get("/api/admin/media", isAdmin, async (req: any, res) => {
    try {
      const items = await storage.getAllMediaItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  // Delete media item
  app.delete("/api/admin/media/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMediaItem(id);
      if (!item) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      // Delete from storage
      await storage.deleteMediaItem(id);
      
      // Try to delete file from disk
      const filePath = path.join(process.cwd(), "public", item.url);
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        // File may not exist, ignore
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // ========== BRAND MANAGEMENT ==========
  
  // Get all brands (admin)
  app.get("/api/admin/brands", isAdmin, async (req: any, res) => {
    try {
      const brands = await storage.getAllBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Create brand
  app.post("/api/admin/brands", isAdmin, async (req: any, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Update brand
  app.patch("/api/admin/brands/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(id, validatedData);
      res.json(brand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  // Delete brand
  app.delete("/api/admin/brands/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBrand(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // ========== PRODUCT MANAGEMENT ==========
  
  // Get all products (admin)
  app.get("/api/admin/products", isAdmin, async (req: any, res) => {
    try {
      const products = await storage.getProductsWithBrands();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Create product
  app.post("/api/admin/products", isAdmin, async (req: any, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product
  app.patch("/api/admin/products/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ========== EXISTING ADMIN ROUTES ==========

  // Download CSV endpoint (admin only)
  app.get("/api/admin/download/:type", isAdmin, async (req: any, res) => {
    try {
      const { type } = req.params;
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'subscribers':
          data = await storage.getAllNewsletterSubscribers();
          filename = 'newsletter-subscribers';
          break;
        case 'applications':
          data = await storage.getAllJobApplications();
          filename = 'job-applications';
          data = data.map(({ resumeFileData, ...rest }) => rest);
          break;
        case 'events':
          data = await storage.getAllEventBookings();
          filename = 'event-bookings';
          break;
        case 'contacts':
          data = await storage.getAllContactSubmissions();
          filename = 'contact-submissions';
          break;
        default:
          return res.status(400).json({ message: "Invalid download type" });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No data to export" });
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(','))
      ].join('\n');

      const dateStr = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}-${dateStr}.csv"`);
      res.send(csvContent);

    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ message: "Failed to generate CSV" });
    }
  });

  // Download resume endpoint (admin only)
  app.get("/api/admin/resume/:id", isAdmin, async (req: any, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      const application = applications.find(app => app.id === parseInt(req.params.id));

      if (!application || !application.resumeFileData) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const [mimeInfo, base64Data] = application.resumeFileData.split(',');
      const mimeType = mimeInfo.split(':')[1].split(';')[0];
      const buffer = Buffer.from(base64Data, 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${application.resumeFileName}"`);
      res.send(buffer);

    } catch (error) {
      console.error("Error downloading resume:", error);
      res.status(500).json({ message: "Failed to download resume" });
    }
  });

  // Check admin status endpoint
  app.get("/api/admin/check", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json({ isAdmin: user?.role === 'admin' });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Get all newsletter subscribers
  app.get("/api/admin/subscribers", isAdmin, async (req: any, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // ========== SITE SETTINGS MANAGEMENT ==========
  
  // Public endpoint to get site settings (for homepage, etc.)
  app.get("/api/site-settings", async (req: any, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      const settingsMap: Record<string, string | null> = {};
      settings.forEach(s => { settingsMap[s.key] = s.value; });
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching public settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get all site settings (admin)
  app.get("/api/admin/settings", isAdmin, async (req: any, res) => {
    try {
      const settings = await storage.getAllSiteSettings();
      const settingsMap: Record<string, string | null> = {};
      settings.forEach(s => { settingsMap[s.key] = s.value; });
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update site settings (batch)
  app.post("/api/admin/settings", isAdmin, async (req: any, res) => {
    try {
      const settings = req.body as Record<string, string>;
      const results: Record<string, string | null> = {};
      
      for (const [key, value] of Object.entries(settings)) {
        const validated = insertSiteSettingSchema.parse({ key, value });
        const result = await storage.upsertSiteSetting(validated);
        results[result.key] = result.value;
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Get a specific setting
  app.get("/api/admin/settings/:key", isAdmin, async (req: any, res) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // ========== USER MANAGEMENT ==========
  
  // Get all users
  app.get("/api/admin/users", isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update user role
  app.patch("/api/admin/users/:id/role", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!role || !['customer', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'customer' or 'admin'" });
      }
      
      const user = await storage.updateUserRole(id, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });
}
