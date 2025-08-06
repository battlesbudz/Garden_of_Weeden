import { pgTable, text, varchar, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./core";

// Secure Document Management System
export const secureDocuments = pgTable("secure_documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(), // Object storage path
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(), // User ID who uploaded
  uploadedByRole: varchar("uploaded_by_role", { length: 20 }).notNull(), // "admin" or "investor"
  ownerInvestorId: varchar("owner_investor_id").references(() => users.id), // Which investor owns this document (null for admin-only docs)
  isVisible: boolean("is_visible").default(true).notNull(), // Can be toggled by admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Document permissions table for fine-grained access control
export const documentPermissions = pgTable("document_permissions", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => secureDocuments.id).notNull(),
  investorId: varchar("investor_id").references(() => users.id).notNull(),
  canView: boolean("can_view").default(true).notNull(),
  canDownload: boolean("can_download").default(true).notNull(),
  grantedBy: varchar("granted_by").references(() => users.id).notNull(), // Admin who granted permission
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertSecureDocumentSchema = createInsertSchema(secureDocuments).pick({
  title: true,
  description: true,
  fileName: true,
  filePath: true,
  fileSize: true,
  mimeType: true,
  uploadedBy: true,
  uploadedByRole: true,
  ownerInvestorId: true,
  isVisible: true,
});

export const insertDocumentPermissionSchema = createInsertSchema(documentPermissions).pick({
  documentId: true,
  investorId: true,
  canView: true,
  canDownload: true,
  grantedBy: true,
});

// Types
export type InsertSecureDocument = z.infer<typeof insertSecureDocumentSchema>;
export type SecureDocument = typeof secureDocuments.$inferSelect;
export type InsertDocumentPermission = z.infer<typeof insertDocumentPermissionSchema>;
export type DocumentPermission = typeof documentPermissions.$inferSelect;