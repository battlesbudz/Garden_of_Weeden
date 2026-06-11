
import type { Express } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertEventBookingSchema } from "@shared/schema";
import { z } from "zod";
import { sendExperienceBookingConfirmation, sendExperienceBookingNotification } from "../services/emailService";

export function registerEventRoutes(app: Express) {
  // Event booking endpoint
  app.post("/api/event/book", async (req, res) => {
    try {
      const validatedData = insertEventBookingSchema.parse(req.body);
      const booking = await storage.createEventBooking(validatedData);
      
      res.status(201).json({ 
        message: "Event booking submitted successfully",
        booking: { id: booking.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid event booking data",
          errors: error.errors 
        });
      }
      console.error("Event booking error:", error);
      res.status(500).json({ message: "Failed to submit event booking" });
    }
  });

  // Experience booking endpoint (with email confirmation)
  app.post("/api/events/book", async (req, res) => {
    try {
      const validatedData = insertEventBookingSchema.parse(req.body);
      const booking = await storage.createEventBooking(validatedData);
      
      // Send confirmation and notification emails
      await Promise.all([
        sendExperienceBookingConfirmation(booking),
        sendExperienceBookingNotification(booking)
      ]);
      
      res.status(201).json({ 
        message: "Experience booking submitted successfully! Check your email for confirmation.",
        booking: { id: booking.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid booking data",
          errors: error.errors 
        });
      }
      console.error("Experience booking error:", error);
      res.status(500).json({ message: "Failed to submit booking request" });
    }
  });

  // Get event bookings (admin only)
  app.get("/api/event/bookings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching event bookings:", error);
      res.status(500).json({ message: "Failed to fetch event bookings" });
    }
  });
}
