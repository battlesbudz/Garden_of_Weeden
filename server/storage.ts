import { 
  users, 
  products,
  orders,
  orderItems,
  newsletterSubscribers, 
  contactSubmissions,
  eventBookings,
  jobApplications,
  investorUpdates,
  investorDocuments,
  investorAccess,
  forumCategories,
  forumPosts,
  forumComments,
  forumLikes,
  type User, 
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type ContactSubmission,
  type InsertContactSubmission,
  type EventBooking,
  type InsertEventBooking,
  type JobApplication,
  type InsertJobApplication,
  type InvestorUpdate,
  type InsertInvestorUpdate,
  type InvestorDocument,
  type InsertInvestorDocument,
  type InvestorAccess,
  type InsertInvestorAccess,
  type ForumCategory,
  type InsertForumCategory,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  type ForumLike,
  type InsertForumLike
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Orders  
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Newsletter subscribers
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Event bookings
  createEventBooking(booking: InsertEventBooking): Promise<EventBooking>;
  getAllEventBookings(): Promise<EventBooking[]>;
  
  // Job applications
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getAllJobApplications(): Promise<JobApplication[]>;
  
  // Investor portal
  getAllInvestorUpdates(): Promise<InvestorUpdate[]>;
  getPublishedInvestorUpdates(): Promise<InvestorUpdate[]>;
  createInvestorUpdate(update: InsertInvestorUpdate): Promise<InvestorUpdate>;
  updateInvestorUpdate(id: number, update: Partial<InsertInvestorUpdate>): Promise<InvestorUpdate>;
  deleteInvestorUpdate(id: number): Promise<void>;
  
  getAllInvestorDocuments(): Promise<InvestorDocument[]>;
  getPublicInvestorDocuments(): Promise<InvestorDocument[]>;
  createInvestorDocument(document: InsertInvestorDocument): Promise<InvestorDocument>;
  updateInvestorDocument(id: number, document: Partial<InsertInvestorDocument>): Promise<InvestorDocument>;
  deleteInvestorDocument(id: number): Promise<void>;
  
  getAllInvestorAccess(): Promise<InvestorAccess[]>;
  getInvestorAccessByUserId(userId: number): Promise<InvestorAccess | undefined>;
  createInvestorAccess(access: InsertInvestorAccess): Promise<InvestorAccess>;
  updateInvestorAccess(id: number, access: Partial<InsertInvestorAccess>): Promise<InvestorAccess>;
  
  // Forum operations
  getAllForumCategories(): Promise<ForumCategory[]>;
  getActiveForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  
  getAllForumPosts(): Promise<(ForumPost & { author: User; category?: ForumCategory })[]>;
  getForumPost(id: number): Promise<(ForumPost & { author: User; category?: ForumCategory }) | undefined>;
  getPostsByCategory(categoryId: number): Promise<(ForumPost & { author: User; category?: ForumCategory })[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, post: Partial<InsertForumPost>): Promise<ForumPost>;
  incrementPostViews(id: number): Promise<void>;
  
  getPostComments(postId: number): Promise<(ForumComment & { author: User })[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  
  togglePostLike(userId: string, postId: number): Promise<{ liked: boolean; likeCount: number }>;
  toggleCommentLike(userId: string, commentId: number): Promise<{ liked: boolean; likeCount: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private eventBookings: Map<number, EventBooking>;
  private jobApplications: Map<number, JobApplication>;
  private currentUserId: number;
  private currentSubscriberId: number;
  private currentSubmissionId: number;
  private currentBookingId: number;
  private currentApplicationId: number;

  constructor() {
    this.users = new Map();
    this.newsletterSubscribers = new Map();
    this.contactSubmissions = new Map();
    this.eventBookings = new Map();
    this.jobApplications = new Map();
    this.currentUserId = 1;
    this.currentSubscriberId = 1;
    this.currentSubmissionId = 1;
    this.currentBookingId = 1;
    this.currentApplicationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.currentSubscriberId++;
    const subscriber: NewsletterSubscriber = { 
      ...insertSubscriber, 
      id, 
      createdAt: new Date() 
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentSubmissionId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createEventBooking(insertBooking: InsertEventBooking): Promise<EventBooking> {
    const id = this.currentBookingId++;
    const booking: EventBooking = { 
      ...insertBooking, 
      message: insertBooking.message || null,
      id, 
      createdAt: new Date() 
    };
    this.eventBookings.set(id, booking);
    return booking;
  }

  async getAllEventBookings(): Promise<EventBooking[]> {
    return Array.from(this.eventBookings.values());
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const id = this.currentApplicationId++;
    const application: JobApplication = { 
      ...insertApplication,
      coverLetter: insertApplication.coverLetter || null,
      resumeFileName: insertApplication.resumeFileName || null,
      resumeFileData: insertApplication.resumeFileData || null,
      id, 
      createdAt: new Date() 
    };
    this.jobApplications.set(id, application);
    return application;
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values());
  }
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(insertOrderItem)
      .returning();
    return orderItem;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));
    return subscriber || undefined;
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  async createEventBooking(insertBooking: InsertEventBooking): Promise<EventBooking> {
    const [booking] = await db
      .insert(eventBookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getAllEventBookings(): Promise<EventBooking[]> {
    return await db.select().from(eventBookings);
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const [application] = await db
      .insert(jobApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications);
  }

  // Investor portal methods
  async getAllInvestorUpdates(): Promise<InvestorUpdate[]> {
    return await db.select().from(investorUpdates).orderBy(desc(investorUpdates.createdAt));
  }

  async getPublishedInvestorUpdates(): Promise<InvestorUpdate[]> {
    return await db
      .select()
      .from(investorUpdates)
      .where(eq(investorUpdates.isPublished, true))
      .orderBy(desc(investorUpdates.publishedAt));
  }

  async createInvestorUpdate(insertUpdate: InsertInvestorUpdate): Promise<InvestorUpdate> {
    const [update] = await db
      .insert(investorUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async updateInvestorUpdate(id: number, updateData: Partial<InsertInvestorUpdate>): Promise<InvestorUpdate> {
    const [update] = await db
      .update(investorUpdates)
      .set(updateData)
      .where(eq(investorUpdates.id, id))
      .returning();
    return update;
  }

  async deleteInvestorUpdate(id: number): Promise<void> {
    await db.delete(investorUpdates).where(eq(investorUpdates.id, id));
  }

  async getAllInvestorDocuments(): Promise<InvestorDocument[]> {
    return await db.select().from(investorDocuments).orderBy(desc(investorDocuments.uploadedAt));
  }

  async getPublicInvestorDocuments(): Promise<InvestorDocument[]> {
    return await db
      .select()
      .from(investorDocuments)
      .where(eq(investorDocuments.isPublic, true))
      .orderBy(desc(investorDocuments.uploadedAt));
  }

  async createInvestorDocument(insertDocument: InsertInvestorDocument): Promise<InvestorDocument> {
    const [document] = await db
      .insert(investorDocuments)
      .values(insertDocument)
      .returning();
    return document;
  }

  async updateInvestorDocument(id: number, updateData: Partial<InsertInvestorDocument>): Promise<InvestorDocument> {
    const [document] = await db
      .update(investorDocuments)
      .set(updateData)
      .where(eq(investorDocuments.id, id))
      .returning();
    return document;
  }

  async deleteInvestorDocument(id: number): Promise<void> {
    await db.delete(investorDocuments).where(eq(investorDocuments.id, id));
  }

  async getAllInvestorAccess(): Promise<InvestorAccess[]> {
    return await db.select().from(investorAccess);
  }

  async getInvestorAccessByUserId(userId: number): Promise<InvestorAccess | undefined> {
    const [access] = await db
      .select()
      .from(investorAccess)
      .where(eq(investorAccess.userId, userId));
    return access;
  }

  async createInvestorAccess(insertAccess: InsertInvestorAccess): Promise<InvestorAccess> {
    const [access] = await db
      .insert(investorAccess)
      .values(insertAccess)
      .returning();
    return access;
  }

  async updateInvestorAccess(id: number, updateData: Partial<InsertInvestorAccess>): Promise<InvestorAccess> {
    const [access] = await db
      .update(investorAccess)
      .set(updateData)
      .where(eq(investorAccess.id, id))
      .returning();
    return access;
  }

  // Forum methods
  async getAllForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(forumCategories.sortOrder);
  }

  async getActiveForumCategories(): Promise<ForumCategory[]> {
    return await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.isActive, true))
      .orderBy(forumCategories.sortOrder);
  }

  async createForumCategory(insertCategory: InsertForumCategory): Promise<ForumCategory> {
    const [category] = await db
      .insert(forumCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getAllForumPosts(): Promise<(ForumPost & { author: User; category?: ForumCategory })[]> {
    const posts = await db
      .select({
        post: forumPosts,
        author: users,
        category: forumCategories,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.authorId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .orderBy(desc(forumPosts.lastActivityAt));

    return posts.map(row => ({
      ...row.post,
      author: row.author!,
      category: row.category || undefined,
    }));
  }

  async getForumPost(id: number): Promise<(ForumPost & { author: User; category?: ForumCategory }) | undefined> {
    const [result] = await db
      .select({
        post: forumPosts,
        author: users,
        category: forumCategories,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.authorId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .where(eq(forumPosts.id, id));

    if (!result) return undefined;

    return {
      ...result.post,
      author: result.author!,
      category: result.category || undefined,
    };
  }

  async getPostsByCategory(categoryId: number): Promise<(ForumPost & { author: User; category?: ForumCategory })[]> {
    const posts = await db
      .select({
        post: forumPosts,
        author: users,
        category: forumCategories,
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.authorId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .where(eq(forumPosts.categoryId, categoryId))
      .orderBy(desc(forumPosts.lastActivityAt));

    return posts.map(row => ({
      ...row.post,
      author: row.author!,
      category: row.category || undefined,
    }));
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const [post] = await db
      .insert(forumPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateForumPost(id: number, updateData: Partial<InsertForumPost>): Promise<ForumPost> {
    const [post] = await db
      .update(forumPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(forumPosts.id, id))
      .returning();
    return post;
  }

  async incrementPostViews(id: number): Promise<void> {
    await db
      .update(forumPosts)
      .set({ 
        viewCount: sql`${forumPosts.viewCount} + 1`
      })
      .where(eq(forumPosts.id, id));
  }

  async getPostComments(postId: number): Promise<(ForumComment & { author: User })[]> {
    const comments = await db
      .select({
        comment: forumComments,
        author: users,
      })
      .from(forumComments)
      .leftJoin(users, eq(forumComments.authorId, users.id))
      .where(eq(forumComments.postId, postId))
      .orderBy(forumComments.createdAt);

    return comments.map(row => ({
      ...row.comment,
      author: row.author!,
    }));
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const [comment] = await db
      .insert(forumComments)
      .values(insertComment)
      .returning();

    // Update post reply count and last activity
    await db
      .update(forumPosts)
      .set({ 
        replyCount: sql`${forumPosts.replyCount} + 1`,
        lastActivityAt: new Date()
      })
      .where(eq(forumPosts.id, insertComment.postId));

    return comment;
  }

  async togglePostLike(userId: string, postId: number): Promise<{ liked: boolean; likeCount: number }> {
    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(forumLikes)
      .where(and(eq(forumLikes.userId, userId), eq(forumLikes.postId, postId)));

    if (existingLike) {
      // Remove like
      await db
        .delete(forumLikes)
        .where(and(eq(forumLikes.userId, userId), eq(forumLikes.postId, postId)));
      
      await db
        .update(forumPosts)
        .set({ likeCount: sql`${forumPosts.likeCount} - 1` })
        .where(eq(forumPosts.id, postId));

      const [post] = await db.select({ likeCount: forumPosts.likeCount }).from(forumPosts).where(eq(forumPosts.id, postId));
      return { liked: false, likeCount: post.likeCount };
    } else {
      // Add like
      await db
        .insert(forumLikes)
        .values({ userId, postId });
      
      await db
        .update(forumPosts)
        .set({ likeCount: sql`${forumPosts.likeCount} + 1` })
        .where(eq(forumPosts.id, postId));

      const [post] = await db.select({ likeCount: forumPosts.likeCount }).from(forumPosts).where(eq(forumPosts.id, postId));
      return { liked: true, likeCount: post.likeCount };
    }
  }

  async toggleCommentLike(userId: string, commentId: number): Promise<{ liked: boolean; likeCount: number }> {
    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(forumLikes)
      .where(and(eq(forumLikes.userId, userId), eq(forumLikes.commentId, commentId)));

    if (existingLike) {
      // Remove like
      await db
        .delete(forumLikes)
        .where(and(eq(forumLikes.userId, userId), eq(forumLikes.commentId, commentId)));
      
      await db
        .update(forumComments)
        .set({ likeCount: sql`${forumComments.likeCount} - 1` })
        .where(eq(forumComments.id, commentId));

      const [comment] = await db.select({ likeCount: forumComments.likeCount }).from(forumComments).where(eq(forumComments.id, commentId));
      return { liked: false, likeCount: comment.likeCount };
    } else {
      // Add like
      await db
        .insert(forumLikes)
        .values({ userId, commentId });
      
      await db
        .update(forumComments)
        .set({ likeCount: sql`${forumComments.likeCount} + 1` })
        .where(eq(forumComments.id, commentId));

      const [comment] = await db.select({ likeCount: forumComments.likeCount }).from(forumComments).where(eq(forumComments.id, commentId));
      return { liked: true, likeCount: comment.likeCount };
    }
  }
}

export const storage = new DatabaseStorage();
