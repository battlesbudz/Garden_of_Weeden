import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertNewsletterSubscriberSchema, 
  insertContactSubmissionSchema, 
  insertEventBookingSchema, 
  insertJobApplicationSchema,
  insertForumCategorySchema,
  insertForumPostSchema,
  insertForumCommentSchema,
  type User
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
        viewCount: post.viewCount + 1,
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
      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        authorId: userId
      });
      
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
      res.json(result);
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}