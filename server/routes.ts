import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSubscriberSchema, insertContactSubmissionSchema, insertEventBookingSchema, insertJobApplicationSchema } from "@shared/schema";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';

// Initialize SendGrid (only if API key is available)
let mailService: MailService | null = null;
if (process.env.SENDGRID_API_KEY) {
  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email notification function
async function sendNewSubscriberNotification(subscriberEmail: string) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: 'New Newsletter Subscriber - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🌿 New Newsletter Subscriber
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Email:</strong> ${subscriberEmail}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p>Visit your admin portal to manage subscribers</p>
          </div>
        </div>
      `
    });
    console.log('New subscriber notification sent successfully');
  } catch (error) {
    console.error('Failed to send subscriber notification:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({ 
          message: "Email already subscribed to newsletter" 
        });
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      
      // Send notification email to admin
      await sendNewSubscriberNotification(subscriber.email);
      
      res.status(201).json({ 
        message: "Successfully subscribed to newsletter",
        subscriber: { id: subscriber.id, email: subscriber.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email format",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        submission: { 
          id: submission.id, 
          name: submission.name, 
          email: submission.email 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all newsletter subscribers (admin endpoint)
  app.get("/api/admin/newsletter/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all contact submissions (admin endpoint)
  app.get("/api/admin/contact/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all event bookings (admin endpoint)
  app.get("/api/admin/event/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all job applications (admin endpoint)
  app.get("/api/admin/job/applications", async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all contact submissions (admin endpoint)
  app.get("/api/contact/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Event booking endpoint
  app.post("/api/events/book", async (req, res) => {
    try {
      const validatedData = insertEventBookingSchema.parse(req.body);
      const booking = await storage.createEventBooking(validatedData);
      res.status(201).json({ 
        message: "Event booking submitted successfully",
        booking: { 
          id: booking.id, 
          name: booking.name, 
          email: booking.email,
          eventType: booking.eventType,
          preferredDate: booking.preferredDate
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid booking data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Job application endpoint
  app.post("/api/job-applications", async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      res.status(201).json({ 
        message: "Job application submitted successfully",
        application: { 
          id: application.id, 
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          position: application.position
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid application data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all event bookings (admin endpoint)
  app.get("/api/events/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
