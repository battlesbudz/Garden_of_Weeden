import { pgTable, text, varchar, serial, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./core";

export const investorMessages = pgTable("investor_messages", {
  id: serial("id").primaryKey(),
  investorId: varchar("investor_id").references(() => users.id),
  investorName: text("investor_name").notNull(),
  investorEmail: text("investor_email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread").notNull(), // "unread", "read", "replied"
  adminReply: text("admin_reply"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  repliedAt: timestamp("replied_at"),
});

// Investor portal tables
export const investorUpdates = pgTable("investor_updates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'financial', 'operational', 'milestone', 'general'
  quarter: varchar("quarter", { length: 10 }), // e.g., 'Q1 2025'
  year: integer("year").notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investorDocuments = pgTable("investor_documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // 'financial', 'legal', 'business_plan', 'reports'
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileData: text("file_data"), // Base64 encoded file data
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  isPublic: boolean("is_public").default(false), // Whether visible to all investors or admin only
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const investorAccess = pgTable("investor_access", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  accessLevel: varchar("access_level", { length: 50 }).notNull(), // 'investor', 'advisor', 'board_member'
  companyName: varchar("company_name", { length: 255 }),
  investmentAmount: decimal("investment_amount", { precision: 12, scale: 2 }),
  investmentDate: timestamp("investment_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// New table for investor access requests
export const investorAccessRequests = pgTable("investor_access_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Link to the logged-in user who submitted the request
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  investmentInterest: text("investment_interest").notNull(),
  netWorth: varchar("net_worth", { length: 100 }),
  investmentExperience: text("investment_experience"),
  reasonForInterest: text("reason_for_interest").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'approved', 'denied'
  adminNotes: text("admin_notes"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertInvestorMessageSchema = createInsertSchema(investorMessages).pick({
  investorId: true,
  investorName: true,
  investorEmail: true,
  subject: true,
  message: true,
});

export const insertInvestorUpdateSchema = createInsertSchema(investorUpdates).pick({
  title: true,
  content: true,
  type: true,
  quarter: true,
  year: true,
  isPublished: true,
  publishedAt: true,
});

export const insertInvestorDocumentSchema = createInsertSchema(investorDocuments).pick({
  title: true,
  description: true,
  category: true,
  fileName: true,
  fileData: true,
  fileSize: true,
  mimeType: true,
  isPublic: true,
});

export const insertInvestorAccessSchema = createInsertSchema(investorAccess).pick({
  userId: true,
  accessLevel: true,
  companyName: true,
  investmentAmount: true,
  investmentDate: true,
  isActive: true,
});

export const insertInvestorAccessRequestSchema = createInsertSchema(investorAccessRequests).pick({
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  position: true,
  investmentInterest: true,
  netWorth: true,
  investmentExperience: true,
  reasonForInterest: true,
});

// Types
export type InsertInvestorMessage = z.infer<typeof insertInvestorMessageSchema>;
export type InvestorMessage = typeof investorMessages.$inferSelect;
export type InsertInvestorUpdate = z.infer<typeof insertInvestorUpdateSchema>;
export type InvestorUpdate = typeof investorUpdates.$inferSelect;
export type InsertInvestorDocument = z.infer<typeof insertInvestorDocumentSchema>;
export type InvestorDocument = typeof investorDocuments.$inferSelect;
export type InsertInvestorAccess = z.infer<typeof insertInvestorAccessSchema>;
export type InvestorAccess = typeof investorAccess.$inferSelect;
export type InsertInvestorAccessRequest = z.infer<typeof insertInvestorAccessRequestSchema>;
export type InvestorAccessRequest = typeof investorAccessRequests.$inferSelect;