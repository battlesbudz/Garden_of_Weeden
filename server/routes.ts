import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { setupAuth } from "./auth";
import { MailService } from '@sendgrid/mail';

// Import route modules
import { registerAuthRoutes } from "./routes/auth";
import { registerNewsletterRoutes } from "./routes/newsletter";
import { registerEventRoutes } from "./routes/events";
import { registerJobRoutes } from "./routes/jobs";
import { registerAdminRoutes } from "./routes/admin";
import { registerBlogRoutes } from "./routes/blog";
import { registerShopRoutes } from "./routes/shop";
import { registerCartRoutes } from "./routes/cart";
import { registerCheckoutRoutes } from "./routes/checkout";

// Initialize SendGrid (only if API key is available)
let mailService: MailService | null = null;
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email notification functions will be moved to their respective route modules

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads"), {
    setHeaders: (res, filePath) => {
      const extension = path.extname(filePath).toLowerCase();
      if (extension === ".svg") {
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", "attachment");
      }
    },
  }));

  // Public health endpoint for Railway. This must not require an auth session.
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Auth middleware
  await setupAuth(app);

  // Register all route modules
  registerAuthRoutes(app);
  registerNewsletterRoutes(app);
  registerEventRoutes(app);
  registerJobRoutes(app);
  registerAdminRoutes(app);
  registerBlogRoutes(app);
  registerShopRoutes(app);
  registerCartRoutes(app);
  registerCheckoutRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
