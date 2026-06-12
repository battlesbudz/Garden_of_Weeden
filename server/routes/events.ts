
import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertEventBookingSchema } from "@shared/schema";
import { z } from "zod";
import { sendExperienceBookingConfirmation, sendExperienceBookingNotification } from "../services/emailService";

export function registerEventRoutes(app: Express) {
  const createBooking = async (req: Request, res: Response) => {
    try {
      const validatedData = insertEventBookingSchema.parse(req.body);
      const booking = await storage.createEventBooking(validatedData);
      
      const baseResponse = {
        booking: { id: booking.id },
      };

      if (req.path === "/api/event/book") {
        res.status(201).json({
          message: "Event booking submitted successfully",
          ...baseResponse,
        });
        return;
      }

      // Send confirmation and notification emails
      await Promise.all([
        sendExperienceBookingConfirmation(booking),
        sendExperienceBookingNotification(booking)
      ]);
      
      res.status(201).json({ 
        message: "Experience booking submitted successfully! Check your email for confirmation.",
        ...baseResponse,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: req.path === "/api/event/book" ? "Invalid event booking data" : "Invalid booking data",
          errors: error.errors 
        });
      }
      console.error("Event booking error:", error);
      res.status(500).json({ message: "Failed to submit booking request" });
    }
  };

  // Event booking endpoints (plural used by client; singular kept for compatibility)
  app.post("/api/events/book", createBooking);
  app.post("/api/event/book", createBooking);

  const getEventBookings = async (req: any, res: Response) => {
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
  };

  app.get("/api/event/bookings", isAuthenticated, getEventBookings);
  app.get("/api/events/bookings", isAuthenticated, getEventBookings);
}
