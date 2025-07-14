import { pgTable, text, varchar, serial, timestamp, decimal, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // "cannabis", "merchandise", "accessories"
  imageUrl: text("image_url"),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "shipped", "delivered"
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventBookings = pgTable("event_bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  eventType: text("event_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  guestCount: text("guest_count").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  experience: text("experience").notNull(),
  availability: text("availability").notNull(),
  coverLetter: text("cover_letter"),
  resumeFileName: text("resume_file_name"),
  resumeFileData: text("resume_file_data"), // Base64 encoded file data
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  userId: integer("user_id").references(() => users.id),
  accessLevel: varchar("access_level", { length: 50 }).notNull(), // 'investor', 'advisor', 'board_member'
  companyName: varchar("company_name", { length: 255 }),
  investmentAmount: decimal("investment_amount", { precision: 12, scale: 2 }),
  investmentDate: timestamp("investment_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community forum tables
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#FFD700"), // Hex color for category badge
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  parentId: integer("parent_id").references(() => forumComments.id), // For nested replies
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumLikes = pgTable("forum_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => forumPosts.id),
  commentId: integer("comment_id").references(() => forumComments.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  inStock: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  customerEmail: true,
  customerName: true,
  shippingAddress: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

export const insertEventBookingSchema = createInsertSchema(eventBookings).pick({
  name: true,
  email: true,
  phone: true,
  eventType: true,
  preferredDate: true,
  guestCount: true,
  message: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  position: true,
  experience: true,
  availability: true,
  coverLetter: true,
  resumeFileName: true,
  resumeFileData: true,
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

// Forum insert schemas
export const insertForumCategorySchema = createInsertSchema(forumCategories).pick({
  name: true,
  description: true,
  color: true,
  sortOrder: true,
  isActive: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  title: true,
  content: true,
  authorId: true,
  categoryId: true,
  isPinned: true,
  isLocked: true,
});

export const insertForumCommentSchema = createInsertSchema(forumComments).pick({
  content: true,
  postId: true,
  authorId: true,
  parentId: true,
});

export const insertForumLikeSchema = createInsertSchema(forumLikes).pick({
  userId: true,
  postId: true,
  commentId: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertEventBooking = z.infer<typeof insertEventBookingSchema>;
export type EventBooking = typeof eventBookings.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertInvestorUpdate = z.infer<typeof insertInvestorUpdateSchema>;
export type InvestorUpdate = typeof investorUpdates.$inferSelect;
export type InsertInvestorDocument = z.infer<typeof insertInvestorDocumentSchema>;
export type InvestorDocument = typeof investorDocuments.$inferSelect;
export type InsertInvestorAccess = z.infer<typeof insertInvestorAccessSchema>;
export type InvestorAccess = typeof investorAccess.$inferSelect;

// Forum types
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forumLikes.$inferSelect;
