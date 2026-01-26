
import type { Express } from "express";
import { isAdmin, isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import { insertBrandSchema, insertProductSchema } from "@shared/schema";
import { objectStorageClient } from "../objectStorage";
import multer from "multer";
import { randomUUID } from "crypto";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
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

      const publicPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
      const publicPath = publicPaths.split(",")[0]?.trim();
      
      if (!publicPath) {
        return res.status(500).json({ message: "Object storage not configured" });
      }

      // Parse bucket and path
      const pathParts = publicPath.split("/").filter(Boolean);
      const bucketName = pathParts[0];
      const basePath = pathParts.slice(1).join("/");
      
      // Generate unique filename
      const ext = req.file.originalname.split(".").pop() || "jpg";
      const filename = `brands/${randomUUID()}.${ext}`;
      const objectName = basePath ? `${basePath}/${filename}` : filename;

      // Upload to GCS
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      
      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      // Return the public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
      res.json({ url: publicUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
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
}
