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
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz Admin</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

async function sendJobApplicationNotification(application: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: 'New Job Application - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💼 New Job Application
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Experience:</strong> ${application.experience}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `
    });
    console.log('Job application notification sent successfully');
  } catch (error) {
    console.error('Failed to send job application notification:', error);
  }
}

async function sendWelcomeEmail(subscriberEmail: string) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping welcome email');
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

async function sendMeetingRequestNotification(request: MeetingRequest) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: 'New Expert Session Request - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            📅 New Expert Session Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p><strong>Name:</strong> ${request.name}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Preferred Date:</strong> ${request.preferredDate}</p>
            <p><strong>Duration:</strong> ${request.duration} minutes</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            <br>
            <h3>Topic/Discussion:</h3>
            <p style="background-color: white; padding: 15px; border-left: 3px solid #FFD700;">
              ${request.topic}
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send meeting request notification:', error);
  }
}

// Experience booking email functions
async function sendExperienceBookingConfirmation(booking: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email confirmation');
    return;
  }

  try {
    // Send confirmation to customer
    await mailService.send({
      to: booking.email,
      from: 'Battlesbudz@gmail.com',
      subject: 'Experience Booking Confirmed - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🌿 Thank You for Your Booking!
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hi ${booking.name},</p>
            <p>Thank you for booking an experience with Battles Budz! We've received your request and will contact you within 24 hours to confirm availability and finalize the details.</p>
            
            <h3 style="color: #FFD700;">Your Booking Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Experience Type:</strong> ${booking.eventType}</p>
              <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.guestCount}</p>
              <p><strong>Contact Phone:</strong> ${booking.phone}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong> ${booking.message}</p>` : ''}
            </div>
            
            <p>We're excited to provide you with an exceptional cannabis tourism experience in New York's beautiful Mohawk Valley region!</p>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We'll call you within 24 hours to confirm availability</li>
              <li>Final pricing and scheduling will be discussed</li>
              <li>Payment details will be provided upon confirmation</li>
            </ul>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
            <p>Premium Cannabis Tourism • Gloversville, NY</p>
          </div>
        </div>
      `
    });
    console.log('Experience booking confirmation sent to:', booking.email);
  } catch (error) {
    console.error('Failed to send experience booking confirmation:', error);
  }
}

async function sendExperienceBookingNotification(booking: any) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping admin notification');
    return;
  }

  try {
    // Send notification to admin
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: 'New Experience Booking - Battles Budz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🎯 New Experience Booking Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            
            <h3>Booking Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Experience Type:</strong> ${booking.eventType}</p>
              <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.guestCount}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
              ${booking.message ? `<p><strong>Special Requests:</strong><br>${booking.message}</p>` : ''}
            </div>
            
            <p><strong>⏰ Action Required:</strong> Contact customer within 24 hours to confirm availability and pricing.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz Admin Dashboard</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Experience booking admin notification sent');
  } catch (error) {
    console.error('Failed to send experience booking admin notification:', error);
  }
}

// Investor access request email notifications
async function sendInvestorAccessRequestNotification(request: InvestorAccessRequest) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin about new investor access request
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com', 
      subject: `New Investor Access Request: ${request.firstName} ${request.lastName} - Battles Budz`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            🔑 New Investor Access Request
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Applicant Information:</h3>
            <p><strong>Name:</strong> ${request.firstName} ${request.lastName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Phone:</strong> ${request.phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${request.company || 'Not provided'}</p>
            <p><strong>Position:</strong> ${request.position || 'Not provided'}</p>
            
            <h3>Investment Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Investment Interest:</strong> ${request.investmentInterest}</p>
              <p><strong>Net Worth:</strong> ${request.netWorth || 'Not provided'}</p>
              <p><strong>Investment Experience:</strong> ${request.investmentExperience || 'Not provided'}</p>
              <p><strong>Reason for Interest:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${request.reasonForInterest}</p>
              <p><strong>Submitted:</strong> ${new Date(request.createdAt || new Date()).toLocaleString()}</p>
            </div>
            
            <p><strong>⏰ Action Required:</strong> Review and approve/deny this investor access request in the admin portal.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz Investor Admin</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Investor access request notification sent to admin');
  } catch (error) {
    console.error('Failed to send investor access request notification:', error);
  }
}

// Investor message email notifications
async function sendInvestorMessageNotification(message: InvestorMessage) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping email notification');
    return;
  }

  try {
    // Send notification to admin about new investor message
    await mailService.send({
      to: 'Battlesbudz@gmail.com',
      from: 'Battlesbudz@gmail.com',
      subject: `New Investor Message: ${message.subject} - Battles Budz`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💼 New Investor Portal Message
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Investor Information:</h3>
            <p><strong>Name:</strong> ${message.investorName}</p>
            <p><strong>Email:</strong> ${message.investorEmail}</p>
            <p><strong>Investor ID:</strong> ${message.investorId}</p>
            
            <h3>Message Details:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${message.message}</p>
              <p><strong>Received:</strong> ${new Date(message.createdAt || new Date()).toLocaleString()}</p>
            </div>
            
            <p><strong>⏰ Action Required:</strong> Respond to investor within 24 hours via portal admin or direct email.</p>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz Investor Portal</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
          </div>
        </div>
      `
    });
    console.log('Investor message notification sent to admin');
  } catch (error) {
    console.error('Failed to send investor message notification:', error);
  }
}

async function sendInvestorReplyNotification(message: InvestorMessage) {
  if (!mailService) {
    console.log('SendGrid not configured - skipping reply notification');
    return;
  }

  try {
    // Send reply notification to investor
    await mailService.send({
      to: message.investorEmail,
      from: 'Battlesbudz@gmail.com',
      subject: `Reply to your message: ${message.subject} - Battles Budz`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFD700; background-color: #000; padding: 15px; text-align: center;">
            💬 Reply from Battles Budz Team
          </h2>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Your Original Message:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #ccc; margin: 15px 0;">
              <p><strong>Subject:</strong> ${message.subject}</p>
              <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">${message.message}</p>
            </div>
            
            <h3>Our Reply:</h3>
            <div style="background-color: white; padding: 15px; border-left: 3px solid #FFD700; margin: 15px 0;">
              <p style="white-space: pre-wrap; background-color: #fffef0; padding: 15px; border-radius: 5px; color: #333;">${message.adminReply}</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                <strong>Replied:</strong> ${new Date(message.repliedAt || new Date()).toLocaleString()}
              </p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>💡 Need to continue the conversation?</strong></p>
              <p>Log into the <a href="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'https://your-domain.replit.app'}/investor-portal" style="color: #FFD700; text-decoration: none;"><strong>Investor Portal</strong></a> to send a follow-up message or contact us directly.</p>
            </div>
          </div>
          <div style="padding: 20px; background-color: #000; color: #FFD700; text-align: center;">
            <p><strong>Battles Budz LLC - Investor Relations</strong></p>
            <p>📞 904-415-7635 | 📧 Battlesbudz@gmail.com</p>
            <p style="font-size: 11px; color: #ccc; margin-top: 10px;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Reply notification sent to investor: ${message.investorEmail}`);
  } catch (error) {
    console.error('Failed to send reply notification to investor:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email already subscribed to newsletter" });
      }

      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      
      // Send welcome email and admin notification
      await Promise.all([
        sendWelcomeEmail(subscriber.email),
        sendNewSubscriberNotification(subscriber.email)
      ]);

      res.status(201).json({ 
        message: "Successfully subscribed to newsletter",
        subscriber: { id: subscriber.id, email: subscriber.email }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email address",
          errors: error.errors 
        });
      }
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Get newsletter subscribers (admin only)
  app.get("/api/newsletter/subscribers", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact/submit", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        submission: { id: submission.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid contact form data",
          errors: error.errors 
        });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Get contact submissions (admin only)
  app.get("/api/contact/submissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

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
      const userId = req.user.claims.sub;
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

  // Job application endpoint
  app.post("/api/job/apply", async (req, res) => {
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
  });

  // Get job applications (admin only)
  app.get("/api/job/applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Download CSV endpoint (admin only)
  app.get("/api/admin/download/:type", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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
          // Remove resume data from CSV export
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

      // Generate CSV content
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(','))
      ].join('\n');

      // Set headers for file download
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
  app.get("/api/admin/resume/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const applications = await storage.getAllJobApplications();
      const application = applications.find(app => app.id === parseInt(req.params.id));

      if (!application || !application.resumeFileData) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Parse data URL to extract MIME type and base64 data
      const [mimeInfo, base64Data] = application.resumeFileData.split(',');
      const mimeType = mimeInfo.split(':')[1].split(';')[0];

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Set headers for file download
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${application.resumeFileName}"`);
      res.send(buffer);

    } catch (error) {
      console.error("Error downloading resume:", error);
      res.status(500).json({ message: "Failed to download resume" });
    }
  });

  // Forum API Routes
  
  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getActiveForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  // Create forum category (admin only)
  app.post("/api/forum/categories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(validatedData);
      
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum category:", error);
      res.status(500).json({ message: "Failed to create forum category" });
    }
  });

  // Get all forum posts
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      let posts;
      
      if (category && !isNaN(Number(category))) {
        posts = await storage.getPostsByCategory(Number(category));
      } else {
        posts = await storage.getAllForumPosts();
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  // Get single forum post with comments
  app.get("/api/forum/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getForumPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Increment view count
      await storage.incrementPostViews(postId);
      
      // Get comments
      const comments = await storage.getPostComments(postId);
      
      res.json({ 
        ...post, 
        viewCount: (post.viewCount || 0) + 1,
        comments 
      });
    } catch (error) {
      console.error("Error fetching forum post:", error);
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  // Create forum post (authenticated users only)
  app.post("/api/forum/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Creating post with data:", { ...req.body, authorId: userId });
      
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        authorId: userId,
        isPinned: req.body.isPinned || false,
        isLocked: req.body.isLocked || false
      });
      
      console.log("Validated data:", validatedData);
      const post = await storage.createForumPost(validatedData);
      
      // Award points for creating a post
      try {
        await storage.addPointsToUser(userId, 20, 'post_created', post.id, 'post', 'Created a forum post');
        await storage.checkAndUnlockAchievements(userId);
      } catch (pointsError) {
        console.warn("Failed to award points for post creation:", pointsError);
      }
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ 
          message: "Invalid post data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  // Create forum comment (authenticated users only)
  app.post("/api/forum/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumCommentSchema.parse({
        ...req.body,
        authorId: userId
      });
      
      const comment = await storage.createForumComment(validatedData);
      
      // Award points for creating a comment
      try {
        await storage.addPointsToUser(userId, 10, 'comment_created', comment.id, 'comment', 'Added a comment');
        await storage.checkAndUnlockAchievements(userId);
      } catch (pointsError) {
        console.warn("Failed to award points for comment creation:", pointsError);
      }
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid comment data",
          errors: error.errors 
        });
      }
      console.error("Error creating forum comment:", error);
      res.status(500).json({ message: "Failed to create forum comment" });
    }
  });

  // Toggle like on post (authenticated users only)
  app.post("/api/forum/posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const result = await storage.togglePostLike(userId, postId);
      
      // Award points for liking (only when actually liking, not unliking)
      if (result.liked) {
        try {
          await storage.addPointsToUser(userId, 5, 'like_given', postId, 'post', 'Liked a post');
          await storage.checkAndUnlockAchievements(userId);
        } catch (pointsError) {
          console.warn("Failed to award points for like:", pointsError);
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error toggling post like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Toggle like on comment (authenticated users only)
  app.post("/api/forum/comments/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentId = parseInt(req.params.id);
      
      if (isNaN(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }

      const result = await storage.toggleCommentLike(userId, commentId);
      
      // Award points for liking (only when actually liking, not unliking)
      if (result.liked) {
        try {
          await storage.addPointsToUser(userId, 5, 'like_given', commentId, 'comment', 'Liked a comment');
          await storage.checkAndUnlockAchievements(userId);
        } catch (pointsError) {
          console.warn("Failed to award points for like:", pointsError);
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

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

  // Gamification API endpoints
  
  // Get user points and stats (authenticated users only)
  app.get("/api/gamification/points", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Update user activity for daily login tracking
      await storage.updateUserActivity(userId);
      
      const userPoints = await storage.getUserPoints(userId);
      if (!userPoints) {
        return res.status(404).json({ message: "User points not found" });
      }
      
      res.json(userPoints);
    } catch (error) {
      console.error("Error fetching user points:", error);
      res.status(500).json({ message: "Failed to fetch user points" });
    }
  });

  // Get user point transactions history (authenticated users only)
  app.get("/api/gamification/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching point transactions:", error);
      res.status(500).json({ message: "Failed to fetch point transactions" });
    }
  });

  // Get all achievements
  app.get("/api/gamification/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user achievements (authenticated users only)
  app.get("/api/gamification/user-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Check and unlock achievements (authenticated users only)
  app.post("/api/gamification/check-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unlockedAchievements = await storage.checkAndUnlockAchievements(userId);
      res.json({ unlockedAchievements });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Get leaderboard
  app.get("/api/gamification/leaderboard", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as 'weekly' | 'monthly' | 'allTime' || 'allTime';
      const leaderboard = await storage.getLeaderboard(timeframe);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Initialize default achievements (admin only)
  app.post("/api/gamification/init-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.initializeDefaultAchievements();
      res.json({ message: "Default achievements initialized successfully" });
    } catch (error) {
      console.error("Error initializing achievements:", error);
      res.status(500).json({ message: "Failed to initialize achievements" });
    }
  });

  // Investor message endpoint
  app.post("/api/investor/message", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertInvestorMessageSchema.parse(req.body);
      const message = await storage.createInvestorMessage({
        ...validatedData,
        investorId: req.user.claims.sub
      });
      
      // Send email notification to admin
      await sendInvestorMessageNotification(message);
      
      res.status(201).json({ 
        message: "Message sent successfully",
        messageId: message.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid message data",
          errors: error.errors 
        });
      }
      console.error("Investor message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get all investor messages (admin only)
  app.get("/api/investor/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const messages = await storage.getAllInvestorMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching investor messages:", error);
      res.status(500).json({ message: "Failed to fetch investor messages" });
    }
  });

  // Reply to investor message (admin only)
  app.post("/api/investor/message/:id/reply", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const messageId = parseInt(req.params.id);
      const { reply } = req.body;
      
      if (!reply || reply.trim().length === 0) {
        return res.status(400).json({ message: "Reply message is required" });
      }

      const updatedMessage = await storage.replyToInvestorMessage(messageId, reply.trim());
      
      // Send email notification to investor
      await sendInvestorReplyNotification(updatedMessage);
      
      res.json({ 
        message: "Reply sent successfully",
        updatedMessage 
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ message: "Failed to send reply" });
    }
  });

  // Mark investor message as read (admin only)
  app.patch("/api/investor/message/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const messageId = parseInt(req.params.id);
      const updatedMessage = await storage.markInvestorMessageAsRead(messageId);
      
      res.json({ 
        message: "Message marked as read",
        updatedMessage 
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Get investor's own messages (authenticated investor)
  app.get("/api/investor/my-messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getInvestorMessagesByUserId(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching investor messages:", error);
      res.status(500).json({ message: "Failed to fetch your messages" });
    }
  });

  // Investor Access Request Routes

  // Submit investor access request (requires authentication to link to user)
  app.post("/api/investor/access-request", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("🔍 [ACCESS-REQUEST] Creating access request for user:", userId);
      
      // Add the userId to the request data
      const requestData = { ...req.body, userId };
      const validatedData = insertInvestorAccessRequestSchema.parse(requestData);
      const request = await storage.createInvestorAccessRequest(validatedData);
      
      console.log("✅ [ACCESS-REQUEST] Access request created:", request.id, "for user:", userId);
      
      // Send email notification to admin
      await sendInvestorAccessRequestNotification(request);
      
      res.status(201).json({ 
        message: "Access request submitted successfully. We'll review your application and get back to you within 48 hours.",
        requestId: request.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      console.error("Investor access request error:", error);
      res.status(500).json({ message: "Failed to submit access request" });
    }
  });

  // Get all investor access requests (admin only)
  app.get("/api/investor/access-requests", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const requests = await storage.getAllInvestorAccessRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching access requests:", error);
      res.status(500).json({ message: "Failed to fetch access requests" });
    }
  });

  // Approve or deny investor access request (admin only)
  app.patch("/api/investor/access-request/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const requestId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      
      if (!['approved', 'denied'].includes(status)) {
        return res.status(400).json({ message: "Status must be 'approved' or 'denied'" });
      }

      const updatedRequest = await storage.updateInvestorAccessRequestStatus(
        requestId, 
        status, 
        adminNotes, 
        userId
      );

      // If approved, create investor access record
      if (status === 'approved') {
        try {
          // Look for existing user with the same email as the request, or similar email variations
          const requestEmail = updatedRequest.email.toLowerCase();
          const requestName = `${updatedRequest.firstName} ${updatedRequest.lastName}`.toLowerCase();
          
          // First try exact email match
          let existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, requestEmail));
          
          // If no exact match, try to find users with similar names
          if (existingUsers.length === 0) {
            const allUsers = await db.select().from(users);
            existingUsers = allUsers.filter(user => {
              const userName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().trim();
              return userName === requestName && userName.length > 0;
            });
          }
          
          // If user exists, create access record immediately
          if (existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            
            // Check if access record already exists
            const existingAccess = await storage.getInvestorAccessByUserId(existingUser.id);
            
            if (!existingAccess) {
              await storage.createInvestorAccess({
                userId: existingUser.id,
                accessLevel: 'standard',
                companyName: updatedRequest.company || '',
                isActive: true
              });
              console.log(`✅ Created investor access for existing user: ${existingUser.email} (matched from request: ${requestEmail})`);
            }
          } else {
            console.log(`⚠️ No existing user found for request: ${requestEmail} (${requestName})`);
            console.log('User will need to create an account with the same email to gain access.');
          }
        } catch (error) {
          console.error("Error creating investor access record:", error);
          // Don't fail the approval if access creation fails
        }
      }
      
      res.json({ 
        message: `Access request ${status} successfully`,
        request: updatedRequest 
      });
    } catch (error) {
      console.error("Error updating access request:", error);
      res.status(500).json({ message: "Failed to update access request" });
    }
  });

  // Check if current user has investor access (authenticated users)
  app.get("/api/investor/check-access", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hasAccess = await storage.checkInvestorHasAccess(userId);
      res.json({ hasAccess });
    } catch (error) {
      console.error("Error checking investor access:", error);
      res.status(500).json({ message: "Failed to check access" });
    }
  });

  // =============================================================================
  // SECURE DOCUMENT MANAGEMENT ROUTES
  // =============================================================================

  // Get upload URL for secure documents (investor upload)
  app.post("/api/investor-docs/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user has investor access
      const hasAccess = await storage.checkInvestorHasAccess(userId);
      if (!hasAccess) {
        return res.status(403).json({ message: "Investor access required" });
      }

      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Upload secure document completion (investor)
  app.post("/api/investor-docs/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user has investor access
      const hasAccess = await storage.checkInvestorHasAccess(userId);
      if (!hasAccess) {
        return res.status(403).json({ message: "Investor access required" });
      }

      const { title, description, fileName, filePath, fileSize, mimeType } = req.body;

      if (!title || !fileName || !filePath || !fileSize || !mimeType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const objectStorageService = new ObjectStorageService();
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(filePath);

      const document = await storage.createSecureDocument({
        title,
        description: description || null,
        fileName,
        filePath: normalizedPath,
        fileSize,
        mimeType,
        uploadedBy: userId,
        uploadedByRole: "investor",
        ownerInvestorId: userId,
        isVisible: true,
      });

      res.json({ document });
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Get investor's personal document library
  app.get("/api/investor-docs/list", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user has investor access
      const hasAccess = await storage.checkInvestorHasAccess(userId);
      if (!hasAccess) {
        return res.status(403).json({ message: "Investor access required" });
      }

      const documents = await storage.getInvestorDocumentsWithPermissions(userId);
      res.json({ documents });
    } catch (error) {
      console.error("Error fetching investor documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Download secure document (investor)
  app.get("/api/investor-docs/:id/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documentId = parseInt(req.params.id);

      // Check if user has investor access
      const hasAccess = await storage.checkInvestorHasAccess(userId);
      if (!hasAccess) {
        return res.status(403).json({ message: "Investor access required" });
      }

      const document = await storage.getSecureDocumentById(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if user has access to this document
      const canAccess = document.ownerInvestorId === userId || 
                       await storage.checkDocumentAccess(documentId, userId);
      
      if (!canAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(document.filePath);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error downloading document:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // =============================================================================
  // ADMIN DOCUMENT MANAGEMENT ROUTES
  // =============================================================================

  // Admin upload URL
  app.post("/api/admin/investor-docs/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("🔍 [UPLOAD] Step 1: Getting upload URL for user:", userId);
      
      const user = await storage.getUser(userId);
      console.log("🔍 [UPLOAD] Step 2: User role:", user?.role);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        console.log("❌ [UPLOAD] Admin access denied for user:", userId);
        return res.status(403).json({ message: "Admin access required" });
      }

      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      console.log("✅ [UPLOAD] Step 3: Generated upload URL:", uploadURL.substring(0, 100) + "...");
      
      res.json({ uploadURL });
    } catch (error) {
      console.error("❌ [UPLOAD] Error getting admin upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Admin document upload completion with assignment
  app.post("/api/admin/investor-docs/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("🔍 [COMPLETE] Step 1: Processing document completion for user:", userId);
      console.log("🔍 [COMPLETE] Step 2: Request body:", JSON.stringify(req.body, null, 2));
      
      const user = await storage.getUser(userId);
      console.log("🔍 [COMPLETE] Step 3: User role:", user?.role);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        console.log("❌ [COMPLETE] Admin access denied for user:", userId);
        return res.status(403).json({ message: "Admin access required" });
      }

      const { title, description, fileName, filePath, fileSize, mimeType, assignedInvestorIds } = req.body;

      if (!title || !fileName || !fileSize || !mimeType) {
        console.log("❌ [COMPLETE] Missing required fields:", { title, fileName, fileSize, mimeType });
        return res.status(400).json({ message: "Missing required fields" });
      }

      const objectStorageService = new ObjectStorageService();
      
      // If filePath is empty or a full upload URL, handle appropriately
      let normalizedPath;
      if (!filePath) {
        console.log("❌ [COMPLETE] No filePath provided, cannot complete upload");
        return res.status(400).json({ message: "File path is required for completion" });
      } else if (filePath.startsWith("https://storage.googleapis.com/")) {
        console.log("🔍 [COMPLETE] Converting upload URL to object path");
        normalizedPath = objectStorageService.normalizeObjectEntityPath(filePath);
      } else {
        normalizedPath = filePath;
      }
      console.log("🔍 [COMPLETE] Step 4: Normalized path:", normalizedPath);

      // Create the document
      console.log("🔍 [COMPLETE] Step 5: Creating document in database...");
      const documentData = {
        title,
        description: description || null,
        fileName,
        filePath: normalizedPath,
        fileSize,
        mimeType,
        uploadedBy: userId,
        uploadedByRole: "admin",
        ownerInvestorId: null, // Admin-owned documents
        isVisible: true,
      };
      console.log("🔍 [COMPLETE] Document data:", JSON.stringify(documentData, null, 2));
      
      const document = await storage.createSecureDocument(documentData);
      console.log("✅ [COMPLETE] Step 6: Document created with ID:", document.id);

      // Assign permissions to selected investors
      if (assignedInvestorIds && Array.isArray(assignedInvestorIds)) {
        console.log("🔍 [COMPLETE] Step 7: Assigning permissions to investors:", assignedInvestorIds);
        for (const requestId of assignedInvestorIds) {
          // Get investor access request by ID
          const investorRequests = await storage.getAllInvestorAccess();
          const investorRequest = investorRequests.find(inv => inv.id === requestId);
          
          if (investorRequest) {
            console.log("🔍 [COMPLETE] Found investor request:", investorRequest);
            // Find the user by email from the investor request
            const user = await storage.getUserByEmail(investorRequest.email);
            
            if (user) {
              await storage.createDocumentPermission({
                documentId: document.id,
                investorId: user.id, // This is the actual user ID from users table
                canView: true,
                canDownload: true,
                grantedBy: userId,
              });
              console.log("✅ [COMPLETE] Permission granted to user ID:", user.id, "Email:", user.email);
            } else {
              console.log("⚠️ [COMPLETE] User not found for email:", investorRequest.email);
            }
          } else {
            console.log("⚠️ [COMPLETE] Investor access request not found for ID:", requestId);
          }
        }
      } else {
        console.log("🔍 [COMPLETE] No investors assigned to document");
      }

      console.log("✅ [COMPLETE] Step 8: Document completion successful, returning:", JSON.stringify(document, null, 2));
      res.json({ document });
    } catch (error) {
      console.error("❌ [COMPLETE] Error creating admin document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Admin view all documents with filtering
  app.get("/api/admin/investor-docs/list", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("🔍 [LIST] Fetching documents for admin user:", userId);
      
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        console.log("❌ [LIST] Admin access denied for user:", userId);
        return res.status(403).json({ message: "Admin access required" });
      }

      const { investorId } = req.query;
      console.log("🔍 [LIST] Filter by investor ID:", investorId || "none");

      let documents;
      if (investorId) {
        console.log("🔍 [LIST] Filtering documents for investor request ID:", investorId);
        documents = await storage.getSecureDocumentsByInvestor(investorId as string);
      } else {
        documents = await storage.getAllSecureDocuments();
      }

      console.log("✅ [LIST] Returning", documents.length, "documents");
      res.json({ documents });
    } catch (error) {
      console.error("❌ [LIST] Error fetching admin documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Admin toggle document visibility
  app.patch("/api/admin/investor-docs/:id/visibility", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const documentId = parseInt(req.params.id);
      const { isVisible } = req.body;

      const document = await storage.updateSecureDocumentVisibility(documentId, isVisible);
      res.json({ document });
    } catch (error) {
      console.error("Error updating document visibility:", error);
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  // Admin update document permissions
  app.patch("/api/admin/investor-docs/:id/permissions", isAuthenticated, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      console.log("🔍 [PERMISSIONS] Updating permissions for admin user:", adminUserId);
      
      const user = await storage.getUser(adminUserId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const documentId = parseInt(req.params.id);
      const { investorId, canView, canDownload } = req.body;
      console.log("🔍 [PERMISSIONS] Request data:", { documentId, investorId, canView, canDownload });

      // The investorId from the frontend is the investor access request ID
      // We need to find the request and use its linked userId
      const accessRequests = await storage.getAllInvestorAccessRequests();
      const investorRequest = accessRequests.find(req => req.id === parseInt(investorId));
      
      if (!investorRequest) {
        console.log("❌ [PERMISSIONS] Investor access request not found for ID:", investorId);
        return res.status(404).json({ message: "Investor request not found" });
      }

      console.log("🔍 [PERMISSIONS] Found investor request for user ID:", investorRequest.userId);
      
      // If the request has a userId, use that directly
      let investorUser;
      if (investorRequest.userId) {
        investorUser = await storage.getUser(investorRequest.userId);
        console.log("🔍 [PERMISSIONS] Found user via userId link:", investorUser?.email);
      }
      
      // Fallback to email matching if no userId link exists (for older requests)
      if (!investorUser) {
        console.log("🔍 [PERMISSIONS] No userId link, trying email match:", investorRequest.email);
        investorUser = await storage.getUserByEmail(investorRequest.email);
        
        // If still no match, try name matching
        if (!investorUser) {
          console.log("🔍 [PERMISSIONS] No exact email match, searching by name:", investorRequest.firstName, investorRequest.lastName);
          
          const allUsers = await storage.getAllUsers();
          investorUser = allUsers.find(user => 
            user.firstName?.toLowerCase().trim() === investorRequest.firstName.toLowerCase().trim() &&
            user.lastName?.toLowerCase().trim() === investorRequest.lastName.toLowerCase().trim()
          );
          
          if (investorUser) {
            console.log("🔍 [PERMISSIONS] Found user by name match:", investorUser.email);
          }
        }
      }
      
      if (!investorUser) {
        console.log("❌ [PERMISSIONS] User not found for request:", investorRequest.id);
        return res.status(404).json({ 
          message: `No user account found for ${investorRequest.firstName} ${investorRequest.lastName}. They may need to create an account first.` 
        });
      }

      console.log("🔍 [PERMISSIONS] Found investor user ID:", investorUser.id);
      
      // Update permissions using the actual user ID
      await storage.updateDocumentPermission(documentId, investorUser.id, canView, canDownload, adminUserId);
      console.log("✅ [PERMISSIONS] Permissions updated successfully");
      
      res.json({ message: "Permissions updated successfully" });
    } catch (error) {
      console.error("Error updating document permissions:", error);
      res.status(500).json({ message: "Failed to update permissions" });
    }
  });

  // Admin download document
  app.get("/api/admin/investor-docs/:id/download", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const documentId = parseInt(req.params.id);
      const document = await storage.getSecureDocumentById(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(document.filePath);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error downloading document:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // Admin delete document
  app.delete("/api/admin/investor-docs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const documentId = parseInt(req.params.id);
      await storage.deleteSecureDocument(documentId);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Get all investors for admin assignment UI
  app.get("/api/admin/investors", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const investors = await storage.getAllInvestorAccess();
      res.json({ investors });
    } catch (error) {
      console.error("Error fetching investors:", error);
      res.status(500).json({ message: "Failed to fetch investors" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}