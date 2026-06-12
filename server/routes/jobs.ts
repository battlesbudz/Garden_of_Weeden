
import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertJobApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { sendJobApplicationNotification } from "../services/emailService";

export function registerJobRoutes(app: Express) {
  const handleJobApplication = async (req: Request, res: Response) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      
      // Send notification email to admin
      await sendJobApplicationNotification(application);
      
      res.status(201).json({ 
        message: "Job application submitted successfully",
        application: { id: application.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid job application data",
          errors: error.errors 
        });
      }
      console.error("Job application error:", error);
      res.status(500).json({ message: "Failed to submit job application" });
    }
  };

  // Job application endpoints (plural used by client; singular kept for backwards compatibility)
  app.post("/api/job-applications", handleJobApplication);
  app.post("/api/job/apply", handleJobApplication);

  // Get job applications (admin only)
  app.get("/api/job/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const applications = await storage.getAllJobApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "Failed to fetch job applications" });
    }
  });
}
