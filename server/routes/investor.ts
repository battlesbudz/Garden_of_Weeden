
import type { Express } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { insertInvestorMessageSchema, insertInvestorAccessRequestSchema } from "@shared/schema";
import { z } from "zod";
import { 
  sendInvestorMessageNotification, 
  sendInvestorReplyNotification, 
  sendInvestorAccessRequestNotification 
} from "../services/emailService";

export function registerInvestorRoutes(app: Express) {
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

  // Submit investor access request (requires authentication to link to user)
  app.post("/api/investor/access-request", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Add the userId to the request data
      const requestData = { ...req.body, userId };
      const validatedData = insertInvestorAccessRequestSchema.parse(requestData);
      const request = await storage.createInvestorAccessRequest(validatedData);
      
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
          const requestEmail = updatedRequest.email.toLowerCase();
          const requestName = `${updatedRequest.firstName} ${updatedRequest.lastName}`.toLowerCase();
          
          const existingUser = await storage.getUserByEmail(requestEmail);
          
          if (existingUser) {
            const existingAccess = await storage.getInvestorAccessByUserId(existingUser.id);
            
            if (!existingAccess) {
              await storage.createInvestorAccess({
                userId: existingUser.id,
                accessLevel: 'standard',
                companyName: updatedRequest.company || '',
                isActive: true
              });
            }
          }
        } catch (error) {
          console.error("Error creating investor access record:", error);
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
}
