
import type { Express } from "express";
import { storage } from "../storage";
import { insertMeetingRequestSchema } from "@shared/schema";
import { z } from "zod";
import { sendMeetingRequestNotification } from "../services/emailService";

export function registerCalendarRoutes(app: Express) {
  // Calendar/Meeting request endpoint
  app.post("/api/calendar/request", async (req, res) => {
    try {
      const validatedData = insertMeetingRequestSchema.parse(req.body);
      const request = await storage.createMeetingRequest(validatedData);
      
      // Send notification email (optional)
      try {
        await sendMeetingRequestNotification(request);
      } catch (emailError) {
        console.warn("Failed to send meeting request notification:", emailError);
      }
      
      res.status(201).json({ message: "Meeting request submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      console.error("Error creating meeting request:", error);
      res.status(500).json({ message: "Failed to submit meeting request" });
    }
  });
}
