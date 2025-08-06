import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
  insertNewsletterSubscriberSchema,
  insertContactSubmissionSchema,
  insertEventBookingSchema,
  insertJobApplicationSchema,
  insertForumCategorySchema,
  insertForumPostSchema,
  insertForumCommentSchema,
  insertMeetingRequestSchema,
  insertInvestorMessageSchema,
  insertInvestorAccessRequestSchema,
  insertUserPointsSchema,
  insertPointTransactionSchema,
  insertAchievementSchema,
  insertUserAchievementSchema,
  insertSecureDocumentSchema,
  insertDocumentPermissionSchema,
  type User,
  type MeetingRequest,
  type InvestorMessage,
  type InvestorAccessRequest,
  type UserPoints,
  type PointTransaction,
  type Achievement,
  type UserAchievement,
  type SecureDocument,
  type DocumentPermission
} from "@shared/schema";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';

// Import route modules
import { registerAuthRoutes } from "./routes/auth";
import { registerNewsletterRoutes } from "./routes/newsletter";
import { registerEventRoutes } from "./routes/events";
import { registerJobRoutes } from "./routes/jobs";
import { registerForumRoutes } from "./routes/forum";
import { registerGamificationRoutes } from "./routes/gamification";
import { registerInvestorRoutes } from "./routes/investor";
import { registerDocumentRoutes } from "./routes/documents";
import { registerAdminRoutes } from "./routes/admin";
import { registerCalendarRoutes } from "./routes/calendar";

// Initialize SendGrid (only if API key is available)
let mailService: MailService | null = null;
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email notification functions will be moved to their respective route modules

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth middleware
  await setupAuth(app);

  // Register all route modules
  registerAuthRoutes(app);
  registerNewsletterRoutes(app);
  registerEventRoutes(app);
  registerJobRoutes(app);
  registerForumRoutes(app);
  registerGamificationRoutes(app);
  registerInvestorRoutes(app);
  registerDocumentRoutes(app);
  registerAdminRoutes(app);
  registerCalendarRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}