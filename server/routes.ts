import type { Express } from "express";
import { createServer, type Server } from "http";
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { storage } from "./storage";
import { 
  insertNewsletterSubscriberSchema, 
  insertContactSubmissionSchema, 
  insertEventBookingSchema, 
  insertJobApplicationSchema,
  loginSchema,
  registerSchema,
  insertProductSchema,
  insertOrderSchema,
  type User
} from "@shared/schema";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';

// Session type declaration
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    user?: User;
  }
}

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
    // Send notification to admin
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com', // Use your verified email
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

// Send email notification for new job application
async function sendJobApplicationNotification(application: any) {
  if (!mailService) {
    return;
  }

  try {
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: 'New Job Application - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #FFD700;">
          <div style="text-align: center; padding: 20px; background-color: #FFD700; color: #000;">
            <h1 style="margin: 0;">🎖️ New Job Application Received</h1>
          </div>
          <div style="padding: 20px; background-color: #1a1a1a;">
            <h2 style="color: #FFD700;">Application Details:</h2>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Experience:</strong> ${application.experience}</p>
            <p><strong>Military Status:</strong> ${application.militaryStatus}</p>
            <p><strong>Cannabis Experience:</strong> ${application.cannabisExperience}</p>
            <p><strong>Why Battles Budz:</strong> ${application.whyBattlesBudz}</p>
            <p><strong>Availability:</strong> ${application.availability}</p>
            <p><strong>References:</strong> ${application.references}</p>
            <p><strong>Additional Info:</strong> ${application.additionalInfo}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p>Visit your admin portal to view all applications</p>
          </div>
        </div>
      `
    });
    console.log('Job application notification sent successfully');
  } catch (error) {
    console.error('Failed to send job application notification:', error);
  }
}

// Send welcome email to new subscriber
async function sendWelcomeEmail(subscriberEmail: string) {
  if (!mailService) {
    return;
  }

  try {
    await mailService.send({
      to: subscriberEmail,
      from: 'Battlesbudz@gmail.com', // Use your verified email
      subject: 'Welcome to Battles Budz Newsletter! 🌿',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            Welcome to Battles Budz! 🌿
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll receive updates about:</p>
            <ul>
              <li>New premium cannabis products</li>
              <li>Exclusive lounge events and tastings</li>
              <li>Educational content and industry news</li>
              <li>Company updates and community news</li>
            </ul>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz</strong></p>
            <p>Premium Cannabis Tourism Experience</p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
            <p>Instagram: @Battles_budz</p>
          </div>
        </div>
      `
    });
    console.log('Welcome email sent successfully to:', subscriberEmail);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        role: 'customer' // Default role
      });

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      res.status(201).json({ 
        message: "User registered successfully",
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid registration data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      res.json({ 
        message: "Login successful",
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid login data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({ 
      user: { 
        id: req.session.user.id, 
        username: req.session.user.username, 
        email: req.session.user.email,
        role: req.session.user.role 
      }
    });
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid product data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, customerInfo } = req.body;
      
      // Calculate total
      let total = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          total += parseFloat(product.price) * item.quantity;
        }
      }

      // Create order
      const order = await storage.createOrder({
        userId: req.session.userId || null,
        total: total.toString(),
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        shippingAddress: customerInfo.address,
      });

      // Create order items
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      res.status(201).json({ 
        message: "Order created successfully",
        order: { id: order.id, total: order.total }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/orders", requireAuth, requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

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
      
      // Send welcome email to subscriber
      await sendWelcomeEmail(subscriber.email);
      
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

  // Protected admin endpoints
  app.get("/api/admin/newsletter/subscribers", requireAuth, requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/contact/submissions", requireAuth, requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/event/bookings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/job/applications", requireAuth, requireAdmin, async (req, res) => {
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
      
      // Send email notification to admin
      await sendJobApplicationNotification(application);
      
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



  // Get all newsletter subscribers (admin only)
  app.get("/api/newsletter/subscribers", requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Get all contact submissions (admin only)
  app.get("/api/contact/submissions", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get all event bookings (admin only)
  app.get("/api/event/bookings", requireAdmin, async (req, res) => {
    try {
      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching event bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get all job applications (admin only)
  app.get("/api/job/applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Legacy event bookings endpoint (keeping for backward compatibility)
  app.get("/api/events/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllEventBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Investor Portal API Routes
  app.get("/api/investor/updates", requireAuth, async (req, res) => {
    try {
      // For now, return published updates for all authenticated users
      // In production, you might want to check investor access level
      const updates = await storage.getPublishedInvestorUpdates();
      res.json(updates);
    } catch (error) {
      console.error("Error fetching investor updates:", error);
      res.status(500).json({ message: "Failed to fetch updates" });
    }
  });

  app.get("/api/investor/documents", requireAuth, async (req, res) => {
    try {
      // For now, return public documents for all authenticated users
      // In production, you might want to check investor access level
      const documents = await storage.getPublicInvestorDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching investor documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Admin routes for managing investor content
  app.get("/api/admin/investor/updates", requireAdmin, async (req, res) => {
    try {
      const updates = await storage.getAllInvestorUpdates();
      res.json(updates);
    } catch (error) {
      console.error("Error fetching all investor updates:", error);
      res.status(500).json({ message: "Failed to fetch updates" });
    }
  });

  app.get("/api/admin/investor/documents", requireAdmin, async (req, res) => {
    try {
      const documents = await storage.getAllInvestorDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching all investor documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // CSV Download Endpoints for Admin
  app.get("/api/admin/newsletter-subscribers/download", requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      
      const csvHeader = "Email,Subscribed Date\n";
      const csvContent = subscribers
        .map(sub => `${sub.email},${new Date(sub.createdAt).toISOString()}`)
        .join("\n");
      
      const csv = csvHeader + csvContent;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Error downloading newsletter subscribers CSV:", error);
      res.status(500).json({ message: "Failed to download CSV" });
    }
  });

  app.get("/api/admin/job-applications/download", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      
      const csvHeader = "First Name,Last Name,Email,Phone,Position,Experience,Availability,Applied Date\n";
      const csvContent = applications
        .map(app => `${app.firstName},${app.lastName},${app.email},${app.phone || ''},${app.position},${app.experience},${app.availability},${new Date(app.createdAt).toISOString()}`)
        .join("\n");
      
      const csv = csvHeader + csvContent;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="job-applications.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Error downloading job applications CSV:", error);
      res.status(500).json({ message: "Failed to download CSV" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
