
import type { Express } from "express";
import { isAuthenticated } from "../authMiddleware";
import { storage } from "../storage";
import { ObjectStorageService, ObjectNotFoundError } from "../objectStorage";

export function registerDocumentRoutes(app: Express) {
  // Get upload URL for secure documents (investor upload)
  app.post("/api/investor-docs/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      
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
      const userId = (req.user?.claims?.sub || req.user?.id);
      
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
      const userId = (req.user?.claims?.sub || req.user?.id);
      
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
      const userId = (req.user?.claims?.sub || req.user?.id);
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

  // Admin upload URL
  app.post("/api/admin/investor-docs/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting admin upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL" });
    }
  });

  // Admin document upload completion with assignment
  app.post("/api/admin/investor-docs/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { title, description, fileName, filePath, fileSize, mimeType, assignedInvestorIds } = req.body;

      if (!title || !fileName || !fileSize || !mimeType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const objectStorageService = new ObjectStorageService();
      
      let normalizedPath;
      if (!filePath) {
        return res.status(400).json({ message: "File path is required for completion" });
      } else if (filePath.startsWith("https://storage.googleapis.com/")) {
        normalizedPath = objectStorageService.normalizeObjectEntityPath(filePath);
      } else {
        normalizedPath = filePath;
      }

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
      
      const document = await storage.createSecureDocument(documentData);

      // Assign permissions to selected investors
      if (assignedInvestorIds && Array.isArray(assignedInvestorIds)) {
        for (const requestId of assignedInvestorIds) {
          const investorRequests = await storage.getAllInvestorAccess();
          const investorRequest = investorRequests.find(inv => inv.id === requestId);
          
          if (investorRequest) {
            const user = await storage.getUserByEmail(investorRequest.email);
            
            if (user) {
              await storage.createDocumentPermission({
                documentId: document.id,
                investorId: user.id,
                canView: true,
                canDownload: true,
                grantedBy: userId,
              });
            }
          }
        }
      }

      res.json({ document });
    } catch (error) {
      console.error("Error creating admin document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Admin view all documents with filtering
  app.get("/api/admin/investor-docs/list", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
      const user = await storage.getUser(userId);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { investorId } = req.query;

      let documents;
      if (investorId) {
        documents = await storage.getSecureDocumentsByInvestor(investorId as string);
      } else {
        documents = await storage.getAllSecureDocuments();
      }

      res.json({ documents });
    } catch (error) {
      console.error("Error fetching admin documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Admin toggle document visibility
  app.patch("/api/admin/investor-docs/:id/visibility", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
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

  // Get all investors for admin assignment UI
  app.get("/api/admin/investors", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user?.claims?.sub || req.user?.id);
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
}
