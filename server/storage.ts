import { 
  users, 
  brands,
  products,
  orders,
  orderItems,
  carts,
  cartItems,
  newsletterSubscribers, 
  contactSubmissions,
  eventBookings,
  jobApplications,
  investorMessages,
  investorUpdates,
  investorDocuments,
  investorAccess,
  investorAccessRequests,
  forumCategories,
  forumPosts,
  forumComments,
  forumLikes,
  meetingRequests,
  userPoints,
  pointTransactions,
  achievements,
  userAchievements,
  leaderboard,
  secureDocuments,
  documentPermissions,
  blogPosts,
  siteSettings,
  shopItems,
  type User, 
  type UpsertUser,
  type SiteSetting,
  type InsertSiteSetting,
  type Brand,
  type InsertBrand,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Cart,
  type InsertCart,
  type CartItem,
  type InsertCartItem,
  type CartWithItems,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type ContactSubmission,
  type InsertContactSubmission,
  type EventBooking,
  type InsertEventBooking,
  type JobApplication,
  type InsertJobApplication,
  type InvestorMessage,
  type InsertInvestorMessage,
  type InvestorUpdate,
  type InsertInvestorUpdate,
  type InvestorDocument,
  type InsertInvestorDocument,
  type InvestorAccess,
  type InsertInvestorAccess,
  type InvestorAccessRequest,
  type InsertInvestorAccessRequest,
  type ForumCategory,
  type InsertForumCategory,
  type ForumPost,
  type InsertForumPost,
  type ForumComment,
  type InsertForumComment,
  type ForumLike,
  type InsertForumLike,
  type MeetingRequest,
  type InsertMeetingRequest,
  type UserPoints,
  type InsertUserPoints,
  type PointTransaction,
  type InsertPointTransaction,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type Leaderboard,
  type SecureDocument,
  type InsertSecureDocument,
  type DocumentPermission,
  type InsertDocumentPermission,
  type BlogPost,
  type InsertBlogPost,
  mediaItems,
  type MediaItem,
  type InsertMediaItem,
  type ShopItem,
  type InsertShopItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  
  // Brands
  getAllBrands(): Promise<Brand[]>;
  getActiveBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand>;
  deleteBrand(id: number): Promise<void>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsWithBrands(): Promise<(Product & { brand?: Brand })[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Shop Items
  getAllShopItems(): Promise<ShopItem[]>;
  getShopItemsWithProducts(): Promise<(ShopItem & { product: Product & { brand?: Brand } })[]>;
  getShopItem(id: number): Promise<ShopItem | undefined>;
  getShopItemByProductId(productId: number): Promise<ShopItem | undefined>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: number, item: Partial<InsertShopItem>): Promise<ShopItem>;
  deleteShopItem(id: number): Promise<void>;
  
  // Cart operations
  getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart>;
  getCartWithItems(cartId: number): Promise<CartWithItems | null>;
  addToCart(cartId: number, productId: number, shopItemId: number, quantity: number, priceAtAdd: string): Promise<CartItem>;
  updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
  removeFromCart(cartItemId: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;
  
  // Orders  
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  updateOrderPayment(id: number, paymentStatus: string, transactionId?: string, paidAt?: Date): Promise<Order>;
  
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
  
  // Investor messages
  createInvestorMessage(message: InsertInvestorMessage): Promise<InvestorMessage>;
  getAllInvestorMessages(): Promise<InvestorMessage[]>;
  
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
  getInvestorAccessByUserId(userId: string): Promise<InvestorAccess | undefined>;
  createInvestorAccess(access: InsertInvestorAccess): Promise<InvestorAccess>;
  updateInvestorAccess(id: number, access: Partial<InsertInvestorAccess>): Promise<InvestorAccess>;
  
  // Investor access requests
  createInvestorAccessRequest(request: InsertInvestorAccessRequest): Promise<InvestorAccessRequest>;
  getAllInvestorAccessRequests(): Promise<InvestorAccessRequest[]>;
  getInvestorAccessRequest(id: number): Promise<InvestorAccessRequest | undefined>;
  updateInvestorAccessRequestStatus(id: number, status: 'approved' | 'denied', adminNotes?: string, reviewedBy?: string): Promise<InvestorAccessRequest>;
  checkInvestorHasAccess(userId: string): Promise<boolean>;
  
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
  
  // Meeting requests
  createMeetingRequest(request: InsertMeetingRequest): Promise<MeetingRequest>;
  getAllMeetingRequests(): Promise<MeetingRequest[]>;
  
  // Gamification system
  getUserPoints(userId: string): Promise<UserPoints | undefined>;
  createUserPoints(userPoints: InsertUserPoints): Promise<UserPoints>;
  updateUserPoints(userId: string, updates: Partial<InsertUserPoints>): Promise<UserPoints>;
  addPointsToUser(userId: string, points: number, action: string, relatedId?: number, relatedType?: string, description?: string): Promise<{ userPoints: UserPoints; transaction: PointTransaction }>;
  getUserPointTransactions(userId: string): Promise<PointTransaction[]>;
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;
  getLeaderboard(timeframe: 'weekly' | 'monthly' | 'allTime'): Promise<(Leaderboard & { user: User })[]>;
  updateUserActivity(userId: string): Promise<UserPoints>;
  initializeDefaultAchievements(): Promise<void>;
  
  // Investor message operations
  createInvestorMessage(messageData: InsertInvestorMessage): Promise<InvestorMessage>;
  getAllInvestorMessages(): Promise<InvestorMessage[]>;
  replyToInvestorMessage(messageId: number, reply: string): Promise<InvestorMessage>;
  markInvestorMessageAsRead(messageId: number): Promise<InvestorMessage>;
  getInvestorMessagesByUserId(userId: string): Promise<InvestorMessage[]>;
  
  // Secure Document Management
  createSecureDocument(document: InsertSecureDocument): Promise<SecureDocument>;
  getSecureDocumentById(id: number): Promise<SecureDocument | undefined>;
  getSecureDocumentsByInvestor(investorId: string): Promise<SecureDocument[]>;
  getAllSecureDocuments(): Promise<SecureDocument[]>;
  updateSecureDocumentVisibility(id: number, isVisible: boolean): Promise<SecureDocument>;
  deleteSecureDocument(id: number): Promise<void>;
  
  // Document Permissions
  createDocumentPermission(permission: InsertDocumentPermission): Promise<DocumentPermission>;
  getDocumentPermissions(documentId: number): Promise<DocumentPermission[]>;
  checkDocumentAccess(documentId: number, investorId: string): Promise<boolean>;
  updateDocumentPermission(documentId: number, investorId: string, canView: boolean, canDownload: boolean): Promise<void>;
  removeDocumentPermission(documentId: number, investorId: string): Promise<void>;
  getInvestorDocumentsWithPermissions(investorId: string): Promise<(SecureDocument & { canView: boolean; canDownload: boolean })[]>;
  
  // Blog post operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Site settings operations
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  deleteSiteSetting(key: string): Promise<void>;
  
  // Media operations
  getAllMediaItems(): Promise<MediaItem[]>;
  getMediaItem(id: number): Promise<MediaItem | undefined>;
  createMediaItem(item: InsertMediaItem): Promise<MediaItem>;
  deleteMediaItem(id: number): Promise<void>;
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

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
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

  async createInvestorMessage(insertMessage: InsertInvestorMessage): Promise<InvestorMessage> {
    const id = this.currentApplicationId++; // reuse counter for now
    const message: InvestorMessage = { 
      ...insertMessage, 
      id,
      status: "unread" as const,
      adminReply: null,
      createdAt: new Date(),
      repliedAt: null,
      investorId: insertMessage.investorId || null
    };
    // Using in-memory storage for now - messages won't persist on restart
    return message;
  }

  async getAllInvestorMessages(): Promise<InvestorMessage[]> {
    // In-memory storage - return empty array for now
    return [];
  }

  async replyToInvestorMessage(messageId: number, reply: string): Promise<InvestorMessage> {
    // In-memory storage - placeholder implementation
    throw new Error("MemStorage not implemented for investor message replies");
  }

  async markInvestorMessageAsRead(messageId: number): Promise<InvestorMessage> {
    // In-memory storage - placeholder implementation
    throw new Error("MemStorage not implemented for marking messages as read");
  }

  async getInvestorMessagesByUserId(userId: string): Promise<InvestorMessage[]> {
    // In-memory storage - placeholder implementation
    throw new Error("MemStorage not implemented for getting user messages");
  }

  // Stub implementations for interface compliance - MemStorage doesn't implement these
  async updateUserRole(id: string, role: string): Promise<User> { throw new Error("Not implemented in MemStorage"); }
  async getAllBrands(): Promise<Brand[]> { return []; }
  async getActiveBrands(): Promise<Brand[]> { return []; }
  async getBrand(id: number): Promise<Brand | undefined> { return undefined; }
  async createBrand(brand: InsertBrand): Promise<Brand> { throw new Error("Not implemented in MemStorage"); }
  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand> { throw new Error("Not implemented in MemStorage"); }
  async deleteBrand(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getAllProducts(): Promise<Product[]> { return []; }
  async getProductsWithBrands(): Promise<(Product & { brand?: Brand })[]> { return []; }
  async getProduct(id: number): Promise<Product | undefined> { return undefined; }
  async createProduct(product: InsertProduct): Promise<Product> { throw new Error("Not implemented in MemStorage"); }
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> { throw new Error("Not implemented in MemStorage"); }
  async deleteProduct(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getAllShopItems(): Promise<ShopItem[]> { return []; }
  async getShopItemsWithProducts(): Promise<(ShopItem & { product: Product & { brand?: Brand } })[]> { return []; }
  async getShopItem(id: number): Promise<ShopItem | undefined> { return undefined; }
  async getShopItemByProductId(productId: number): Promise<ShopItem | undefined> { return undefined; }
  async createShopItem(item: InsertShopItem): Promise<ShopItem> { throw new Error("Not implemented in MemStorage"); }
  async updateShopItem(id: number, item: Partial<InsertShopItem>): Promise<ShopItem> { throw new Error("Not implemented in MemStorage"); }
  async deleteShopItem(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async createOrder(order: InsertOrder): Promise<Order> { throw new Error("Not implemented in MemStorage"); }
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> { throw new Error("Not implemented in MemStorage"); }
  async getAllOrders(): Promise<Order[]> { return []; }
  async getUserOrders(userId: number): Promise<Order[]> { return []; }
  async getOrder(id: number): Promise<Order | undefined> { return undefined; }
  async getAllInvestorUpdates(): Promise<InvestorUpdate[]> { return []; }
  async getPublishedInvestorUpdates(): Promise<InvestorUpdate[]> { return []; }
  async createInvestorUpdate(update: InsertInvestorUpdate): Promise<InvestorUpdate> { throw new Error("Not implemented in MemStorage"); }
  async updateInvestorUpdate(id: number, update: Partial<InsertInvestorUpdate>): Promise<InvestorUpdate> { throw new Error("Not implemented in MemStorage"); }
  async deleteInvestorUpdate(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getAllInvestorDocuments(): Promise<InvestorDocument[]> { return []; }
  async getPublicInvestorDocuments(): Promise<InvestorDocument[]> { return []; }
  async createInvestorDocument(document: InsertInvestorDocument): Promise<InvestorDocument> { throw new Error("Not implemented in MemStorage"); }
  async updateInvestorDocument(id: number, document: Partial<InsertInvestorDocument>): Promise<InvestorDocument> { throw new Error("Not implemented in MemStorage"); }
  async deleteInvestorDocument(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getAllInvestorAccess(): Promise<InvestorAccess[]> { return []; }
  async getInvestorAccessByUserId(userId: string): Promise<InvestorAccess | undefined> { return undefined; }
  async createInvestorAccess(access: InsertInvestorAccess): Promise<InvestorAccess> { throw new Error("Not implemented in MemStorage"); }
  async updateInvestorAccess(id: number, access: Partial<InsertInvestorAccess>): Promise<InvestorAccess> { throw new Error("Not implemented in MemStorage"); }
  async createInvestorAccessRequest(request: InsertInvestorAccessRequest): Promise<InvestorAccessRequest> { throw new Error("Not implemented in MemStorage"); }
  async getAllInvestorAccessRequests(): Promise<InvestorAccessRequest[]> { return []; }
  async getInvestorAccessRequest(id: number): Promise<InvestorAccessRequest | undefined> { return undefined; }
  async updateInvestorAccessRequestStatus(id: number, status: 'approved' | 'denied', adminNotes?: string, reviewedBy?: string): Promise<InvestorAccessRequest> { throw new Error("Not implemented in MemStorage"); }
  async checkInvestorHasAccess(userId: string): Promise<boolean> { return false; }
  async getAllForumCategories(): Promise<ForumCategory[]> { return []; }
  async getActiveForumCategories(): Promise<ForumCategory[]> { return []; }
  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> { throw new Error("Not implemented in MemStorage"); }
  async getAllForumPosts(): Promise<(ForumPost & { author: User; category?: ForumCategory })[]> { return []; }
  async getForumPost(id: number): Promise<(ForumPost & { author: User; category?: ForumCategory }) | undefined> { return undefined; }
  async getPostsByCategory(categoryId: number): Promise<(ForumPost & { author: User; category?: ForumCategory })[]> { return []; }
  async createForumPost(post: InsertForumPost): Promise<ForumPost> { throw new Error("Not implemented in MemStorage"); }
  async updateForumPost(id: number, post: Partial<InsertForumPost>): Promise<ForumPost> { throw new Error("Not implemented in MemStorage"); }
  async incrementPostViews(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getPostComments(postId: number): Promise<(ForumComment & { author: User })[]> { return []; }
  async createForumComment(comment: InsertForumComment): Promise<ForumComment> { throw new Error("Not implemented in MemStorage"); }
  async togglePostLike(userId: string, postId: number): Promise<{ liked: boolean; likeCount: number }> { throw new Error("Not implemented in MemStorage"); }
  async toggleCommentLike(userId: string, commentId: number): Promise<{ liked: boolean; likeCount: number }> { throw new Error("Not implemented in MemStorage"); }
  async createMeetingRequest(request: InsertMeetingRequest): Promise<MeetingRequest> { throw new Error("Not implemented in MemStorage"); }
  async getAllMeetingRequests(): Promise<MeetingRequest[]> { return []; }
  async getAllSiteSettings(): Promise<SiteSetting[]> { return []; }
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> { return undefined; }
  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> { throw new Error("Not implemented in MemStorage"); }
  async deleteSiteSetting(key: string): Promise<void> { throw new Error("Not implemented in MemStorage"); }
  async getAllMediaItems(): Promise<MediaItem[]> { return []; }
  async getMediaItem(id: number): Promise<MediaItem | undefined> { return undefined; }
  async createMediaItem(item: InsertMediaItem): Promise<MediaItem> { throw new Error("Not implemented in MemStorage"); }
  async deleteMediaItem(id: number): Promise<void> { throw new Error("Not implemented in MemStorage"); }
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First, check if a user with this email already exists
    if (userData.email) {
      const existingByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      
      // If user exists with this email but different ID, update by email
      if (existingByEmail.length > 0 && existingByEmail[0].id !== userData.id) {
        const [updated] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        return updated;
      }
    }
    
    // Otherwise, use normal upsert by ID
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

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Brand methods
  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(brands.sortOrder);
  }

  async getActiveBrands(): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.sortOrder);
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand || undefined;
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db
      .insert(brands)
      .values(insertBrand)
      .returning();
    return brand;
  }

  async updateBrand(id: number, updateData: Partial<InsertBrand>): Promise<Brand> {
    const [brand] = await db
      .update(brands)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(brands.id, id))
      .returning();
    return brand;
  }

  async deleteBrand(id: number): Promise<void> {
    await db.delete(brands).where(eq(brands.id, id));
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsWithBrands(): Promise<(Product & { brand?: Brand })[]> {
    const result = await db
      .select()
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id));
    
    return result.map(row => ({
      ...row.products,
      brand: row.brands || undefined
    }));
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

  // Shop Items methods
  async getAllShopItems(): Promise<ShopItem[]> {
    return await db.select().from(shopItems).orderBy(shopItems.sortOrder);
  }

  async getShopItemsWithProducts(): Promise<(ShopItem & { product: Product & { brand?: Brand } })[]> {
    const items = await db
      .select()
      .from(shopItems)
      .where(eq(shopItems.isActive, true))
      .orderBy(shopItems.sortOrder);

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId));
        
        let brand: Brand | undefined;
        if (product?.brandId) {
          const [b] = await db
            .select()
            .from(brands)
            .where(eq(brands.id, product.brandId));
          brand = b;
        }
        
        return {
          ...item,
          product: { ...product, brand }
        };
      })
    );

    return itemsWithProducts;
  }

  async getShopItem(id: number): Promise<ShopItem | undefined> {
    const [item] = await db.select().from(shopItems).where(eq(shopItems.id, id));
    return item;
  }

  async getShopItemByProductId(productId: number): Promise<ShopItem | undefined> {
    const [item] = await db.select().from(shopItems).where(eq(shopItems.productId, productId));
    return item;
  }

  async createShopItem(insertItem: InsertShopItem): Promise<ShopItem> {
    const [item] = await db.insert(shopItems).values(insertItem).returning();
    return item;
  }

  async updateShopItem(id: number, updateData: Partial<InsertShopItem>): Promise<ShopItem> {
    const [item] = await db
      .update(shopItems)
      .set(updateData)
      .where(eq(shopItems.id, id))
      .returning();
    return item;
  }

  async deleteShopItem(id: number): Promise<void> {
    await db.delete(shopItems).where(eq(shopItems.id, id));
  }

  // Cart methods
  async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
    let cart: Cart | undefined;
    
    if (userId) {
      const [existingCart] = await db.select().from(carts).where(eq(carts.userId, userId));
      cart = existingCart;
    } else if (sessionId) {
      const [existingCart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
      cart = existingCart;
    }
    
    if (!cart) {
      const [newCart] = await db.insert(carts).values({
        userId: userId || null,
        sessionId: sessionId || null,
      }).returning();
      return newCart;
    }
    
    return cart;
  }

  async getCartWithItems(cartId: number): Promise<CartWithItems | null> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, cartId));
    if (!cart) return null;

    const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
    
    const itemsWithProducts = await Promise.all(items.map(async (item) => {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      const [shopItem] = await db.select().from(shopItems).where(eq(shopItems.id, item.shopItemId));
      
      let brand: Brand | undefined;
      if (product?.brandId) {
        const [brandResult] = await db.select().from(brands).where(eq(brands.id, product.brandId));
        brand = brandResult;
      }
      
      return {
        ...item,
        product: { ...product, brand },
        shopItem,
      };
    }));

    const total = items.reduce((sum, item) => sum + (parseFloat(item.priceAtAdd) * item.quantity), 0);
    
    return {
      ...cart,
      items: itemsWithProducts,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: total.toFixed(2),
    };
  }

  async addToCart(cartId: number, productId: number, shopItemId: number, quantity: number, priceAtAdd: string): Promise<CartItem> {
    const [existingItem] = await db.select().from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));
    
    if (existingItem) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updated;
    }
    
    const [newItem] = await db.insert(cartItems).values({
      cartId,
      productId,
      shopItemId,
      quantity,
      priceAtAdd,
    }).returning();
    return newItem;
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId))
      .returning();
    return updated;
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  }

  async clearCart(cartId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
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
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updated] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async updateOrderPayment(id: number, paymentStatus: string, transactionId?: string, paidAt?: Date): Promise<Order> {
    const [updated] = await db.update(orders)
      .set({ 
        paymentStatus,
        paymentTransactionId: transactionId,
        paidAt: paidAt,
        status: paymentStatus === 'completed' ? 'paid' : undefined,
      })
      .where(eq(orders.id, id))
      .returning();
    return updated;
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

  async getAllInvestorAccess(): Promise<any[]> {
    // Get approved investor access requests 
    const approvedRequests = await db
      .select({
        id: investorAccessRequests.id,
        email: investorAccessRequests.email,
        firstName: investorAccessRequests.firstName,
        lastName: investorAccessRequests.lastName,
        status: investorAccessRequests.status,
        createdAt: investorAccessRequests.createdAt,
      })
      .from(investorAccessRequests)
      .where(eq(investorAccessRequests.status, "approved"));
    
    return approvedRequests;
  }

  async getInvestorAccessByUserId(userId: string): Promise<InvestorAccess | undefined> {
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

  // Investor access request methods
  async createInvestorAccessRequest(insertRequest: InsertInvestorAccessRequest): Promise<InvestorAccessRequest> {
    const [request] = await db
      .insert(investorAccessRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getAllInvestorAccessRequests(): Promise<InvestorAccessRequest[]> {
    return await db
      .select()
      .from(investorAccessRequests)
      .orderBy(desc(investorAccessRequests.createdAt));
  }

  async getInvestorAccessRequest(id: number): Promise<InvestorAccessRequest | undefined> {
    const [request] = await db
      .select()
      .from(investorAccessRequests)
      .where(eq(investorAccessRequests.id, id));
    return request;
  }

  async updateInvestorAccessRequestStatus(
    id: number, 
    status: 'approved' | 'denied', 
    adminNotes?: string, 
    reviewedBy?: string
  ): Promise<InvestorAccessRequest> {
    const [request] = await db
      .update(investorAccessRequests)
      .set({
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(investorAccessRequests.id, id))
      .returning();
    return request;
  }

  async checkInvestorHasAccess(userId: string): Promise<boolean> {
    // First get the user's email from their user record
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Check if user has an approved access request using their email
    const [request] = await db
      .select()
      .from(investorAccessRequests)
      .where(and(
        eq(investorAccessRequests.email, user.email),
        eq(investorAccessRequests.status, 'approved')
      ));
    
    // Also check the investorAccess table for any existing access records
    const [access] = await db
      .select()
      .from(investorAccess)
      .where(and(eq(investorAccess.userId, userId), eq(investorAccess.isActive, true)));
    
    return !!(request || access);
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

  async getAllForumPosts(): Promise<(ForumPost & { author: User; category?: ForumCategory; comments?: any[] })[]> {
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

    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (row) => {
        const comments = await this.getPostComments(row.post.id);
        return {
          ...row.post,
          author: row.author!,
          category: row.category || undefined,
          comments,
        };
      })
    );

    return postsWithComments;
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

  async createMeetingRequest(insertRequest: InsertMeetingRequest): Promise<MeetingRequest> {
    const [request] = await db
      .insert(meetingRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getAllMeetingRequests(): Promise<MeetingRequest[]> {
    return db
      .select()
      .from(meetingRequests)
      .orderBy(desc(meetingRequests.createdAt));
  }

  // Gamification system implementation
  async getUserPoints(userId: string): Promise<UserPoints | undefined> {
    const result = await db.select().from(userPoints).where(eq(userPoints.userId, userId));
    return result[0];
  }

  async createUserPoints(insertUserPoints: InsertUserPoints): Promise<UserPoints> {
    const result = await db.insert(userPoints).values(insertUserPoints).returning();
    return result[0];
  }

  async updateUserPoints(userId: string, updates: Partial<InsertUserPoints>): Promise<UserPoints> {
    const result = await db.update(userPoints)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPoints.userId, userId))
      .returning();
    return result[0];
  }

  async addPointsToUser(
    userId: string, 
    points: number, 
    action: string, 
    relatedId?: number, 
    relatedType?: string, 
    description?: string
  ): Promise<{ userPoints: UserPoints; transaction: PointTransaction }> {
    // Get or create user points
    let userPointsData = await this.getUserPoints(userId);
    if (!userPointsData) {
      userPointsData = await this.createUserPoints({
        userId,
        totalPoints: 0,
        currentLevel: 1,
        pointsToNextLevel: 100,
        weeklyPoints: 0,
        monthlyPoints: 0,
        streak: 0,
        lastActivityDate: new Date(),
      });
    }

    // Calculate new totals
    const newTotalPoints = userPointsData.totalPoints + points;
    const newWeeklyPoints = userPointsData.weeklyPoints + points;
    const newMonthlyPoints = userPointsData.monthlyPoints + points;
    
    // Calculate level progression
    let newLevel = userPointsData.currentLevel;
    let pointsToNext = userPointsData.pointsToNextLevel - points;
    
    while (pointsToNext <= 0 && newLevel < 50) { // Cap at level 50
      newLevel++;
      pointsToNext += 100 + (newLevel * 25); // Increasing difficulty
    }

    // Update user points
    const updatedUserPoints = await this.updateUserPoints(userId, {
      totalPoints: newTotalPoints,
      currentLevel: newLevel,
      pointsToNextLevel: Math.max(pointsToNext, 0),
      weeklyPoints: newWeeklyPoints,
      monthlyPoints: newMonthlyPoints,
      lastActivityDate: new Date(),
    });

    // Create transaction record
    const transaction = await db.insert(pointTransactions).values({
      userId,
      points,
      action,
      relatedId,
      relatedType,
      description,
    }).returning();

    return { userPoints: updatedUserPoints, transaction: transaction[0] };
  }

  async getUserPointTransactions(userId: string): Promise<PointTransaction[]> {
    return await db.select().from(pointTransactions)
      .where(eq(pointTransactions.userId, userId))
      .orderBy(desc(pointTransactions.createdAt));
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.isActive, true));
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return await db.select({
      id: userAchievements.id,
      userId: userAchievements.userId,
      achievementId: userAchievements.achievementId,
      unlockedAt: userAchievements.unlockedAt,
      achievement: achievements,
    })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId))
    .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(userId: string, achievementId: number): Promise<UserAchievement> {
    // Check if already unlocked
    const existing = await db.select().from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));
    
    if (existing.length > 0) {
      return existing[0];
    }

    // Get achievement details for points reward
    const achievement = await db.select().from(achievements)
      .where(eq(achievements.id, achievementId));
    
    if (achievement.length === 0) {
      throw new Error('Achievement not found');
    }

    // Award points for the achievement
    if (achievement[0].pointsReward > 0) {
      await this.addPointsToUser(
        userId, 
        achievement[0].pointsReward, 
        'achievement_unlocked', 
        achievementId, 
        'achievement',
        `Unlocked: ${achievement[0].name}`
      );
    }

    // Create user achievement record
    const result = await db.insert(userAchievements).values({
      userId,
      achievementId,
    }).returning();

    return result[0];
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const unlockedAchievements: UserAchievement[] = [];
    
    // Get user stats
    const userPointsData = await this.getUserPoints(userId);
    if (!userPointsData) return unlockedAchievements;

    // Get user's forum activity
    const userPosts = await db.select().from(forumPosts).where(eq(forumPosts.authorId, userId));
    const userComments = await db.select().from(forumComments).where(eq(forumComments.authorId, userId));
    const userLikes = await db.select().from(forumLikes).where(eq(forumLikes.userId, userId));

    // Get all achievements and check requirements
    const allAchievements = await this.getAllAchievements();
    const existingAchievements = await this.getUserAchievements(userId);
    const unlockedIds = existingAchievements.map(ua => ua.achievementId);

    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      const requirement = achievement.requirement as any;
      let shouldUnlock = false;

      switch (requirement.type) {
        case 'posts':
          shouldUnlock = userPosts.length >= requirement.count;
          break;
        case 'comments':
          shouldUnlock = userComments.length >= requirement.count;
          break;
        case 'likes':
          shouldUnlock = userLikes.length >= requirement.count;
          break;
        case 'points':
          shouldUnlock = userPointsData.totalPoints >= requirement.count;
          break;
        case 'level':
          shouldUnlock = userPointsData.currentLevel >= requirement.count;
          break;
        case 'streak':
          shouldUnlock = userPointsData.streak >= requirement.count;
          break;
      }

      if (shouldUnlock) {
        const newAchievement = await this.unlockAchievement(userId, achievement.id);
        unlockedAchievements.push(newAchievement);
      }
    }

    return unlockedAchievements;
  }

  async getLeaderboard(timeframe: 'weekly' | 'monthly' | 'allTime'): Promise<(Leaderboard & { user: User })[]> {
    // For now, return user points as leaderboard since leaderboard table needs to be populated
    let orderBy;
    let selectFields;
    
    switch (timeframe) {
      case 'weekly':
        orderBy = desc(userPoints.weeklyPoints);
        selectFields = {
          id: userPoints.id,
          userId: userPoints.userId,
          weeklyRank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${userPoints.weeklyPoints} DESC)`,
          monthlyRank: sql<number>`0`,
          allTimeRank: sql<number>`0`,
          weeklyPoints: userPoints.weeklyPoints,
          monthlyPoints: userPoints.monthlyPoints,
          allTimePoints: userPoints.totalPoints,
          lastUpdated: userPoints.updatedAt,
          user: users,
        };
        break;
      case 'monthly':
        orderBy = desc(userPoints.monthlyPoints);
        selectFields = {
          id: userPoints.id,
          userId: userPoints.userId,
          weeklyRank: sql<number>`0`,
          monthlyRank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${userPoints.monthlyPoints} DESC)`,
          allTimeRank: sql<number>`0`,
          weeklyPoints: userPoints.weeklyPoints,
          monthlyPoints: userPoints.monthlyPoints,
          allTimePoints: userPoints.totalPoints,
          lastUpdated: userPoints.updatedAt,
          user: users,
        };
        break;
      default:
        orderBy = desc(userPoints.totalPoints);
        selectFields = {
          id: userPoints.id,
          userId: userPoints.userId,
          weeklyRank: sql<number>`0`,
          monthlyRank: sql<number>`0`,
          allTimeRank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${userPoints.totalPoints} DESC)`,
          weeklyPoints: userPoints.weeklyPoints,
          monthlyPoints: userPoints.monthlyPoints,
          allTimePoints: userPoints.totalPoints,
          lastUpdated: userPoints.updatedAt,
          user: users,
        };
    }

    return await db.select(selectFields)
      .from(userPoints)
      .innerJoin(users, eq(userPoints.userId, users.id))
      .orderBy(orderBy)
      .limit(50);
  }

  async updateUserActivity(userId: string): Promise<UserPoints> {
    const userPointsData = await this.getUserPoints(userId);
    const today = new Date();

    if (!userPointsData) {
      // First time user - create points record and award daily login
      const newUserPoints = await this.createUserPoints({
        userId,
        totalPoints: 5,
        currentLevel: 1,
        pointsToNextLevel: 95,
        weeklyPoints: 5,
        monthlyPoints: 5,
        streak: 1,
        lastActivityDate: today,
      });

      await db.insert(pointTransactions).values({
        userId,
        points: 5,
        action: 'daily_login',
        description: 'Daily login bonus',
      });

      return newUserPoints;
    }

    let newStreak = userPointsData.streak;
    let shouldAwardDaily = false;

    if (userPointsData.lastActivityDate) {
      const lastActivity = new Date(userPointsData.lastActivityDate);
      const daysSinceLastActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastActivity === 1) {
        // Consecutive day - maintain streak
        newStreak++;
        shouldAwardDaily = true;
      } else if (daysSinceLastActivity === 0) {
        // Same day - no change
        return userPointsData;
      } else {
        // Broke streak
        newStreak = 1;
        shouldAwardDaily = true;
      }
    } else {
      shouldAwardDaily = true;
      newStreak = 1;
    }

    // Award daily login points if applicable
    if (shouldAwardDaily) {
      const dailyPoints = 5 + Math.min(newStreak, 7); // Bonus for streak, max 12 points
      await this.addPointsToUser(userId, dailyPoints, 'daily_login', undefined, undefined, `Daily login bonus (${newStreak} day streak)`);
    }

    return await this.updateUserPoints(userId, {
      streak: newStreak,
      lastActivityDate: today,
    });
  }

  async initializeDefaultAchievements(): Promise<void> {
    const defaultAchievements = [
      {
        name: "First Steps",
        description: "Create your first forum post",
        badgeIcon: "Trophy",
        badgeColor: "battles-gold",
        category: "participation",
        requirement: { type: "posts", count: 1 },
        pointsReward: 50,
        isActive: true,
      },
      {
        name: "Getting Social",
        description: "Add your first comment to a discussion",
        badgeIcon: "MessageCircle",
        badgeColor: "battles-gold",
        category: "participation",
        requirement: { type: "comments", count: 1 },
        pointsReward: 25,
        isActive: true,
      },
      {
        name: "Active Contributor",
        description: "Create 10 forum posts",
        badgeIcon: "Edit",
        badgeColor: "battles-gold",
        category: "participation",
        requirement: { type: "posts", count: 10 },
        pointsReward: 200,
        isActive: true,
      },
      {
        name: "Community Builder",
        description: "Leave 25 helpful comments",
        badgeIcon: "Users",
        badgeColor: "battles-gold",
        category: "community",
        requirement: { type: "comments", count: 25 },
        pointsReward: 150,
        isActive: true,
      },
      {
        name: "Cannabis Enthusiast",
        description: "Reach 500 total points",
        badgeIcon: "Star",
        badgeColor: "battles-gold",
        category: "milestone",
        requirement: { type: "points", count: 500 },
        pointsReward: 100,
        isActive: true,
      },
      {
        name: "Level Up",
        description: "Reach level 5",
        badgeIcon: "TrendingUp",
        badgeColor: "battles-gold",
        category: "milestone",
        requirement: { type: "level", count: 5 },
        pointsReward: 250,
        isActive: true,
      },
      {
        name: "Dedication",
        description: "Maintain a 7-day activity streak",
        badgeIcon: "Calendar",
        badgeColor: "battles-gold",
        category: "participation",
        requirement: { type: "streak", count: 7 },
        pointsReward: 300,
        isActive: true,
      },
    ];

    for (const achievement of defaultAchievements) {
      // Check if achievement already exists
      const existing = await db.select().from(achievements)
        .where(eq(achievements.name, achievement.name));
      
      if (existing.length === 0) {
        await db.insert(achievements).values(achievement);
      }
    }
  }

  // Investor message operations
  async createInvestorMessage(insertMessage: InsertInvestorMessage): Promise<InvestorMessage> {
    const [message] = await db
      .insert(investorMessages)
      .values({
        ...insertMessage,
        status: "unread" as const,
        adminReply: null,
        repliedAt: null
      })
      .returning();
    return message;
  }

  async getAllInvestorMessages(): Promise<InvestorMessage[]> {
    return db
      .select()
      .from(investorMessages)
      .orderBy(desc(investorMessages.createdAt));
  }

  async replyToInvestorMessage(messageId: number, reply: string): Promise<InvestorMessage> {
    const [updatedMessage] = await db
      .update(investorMessages)
      .set({
        adminReply: reply,
        status: "replied" as const,
        repliedAt: new Date()
      })
      .where(eq(investorMessages.id, messageId))
      .returning();
    return updatedMessage;
  }

  async markInvestorMessageAsRead(messageId: number): Promise<InvestorMessage> {
    const [updatedMessage] = await db
      .update(investorMessages)
      .set({
        status: "read" as const
      })
      .where(eq(investorMessages.id, messageId))
      .returning();
    return updatedMessage;
  }

  async getInvestorMessagesByUserId(userId: string): Promise<InvestorMessage[]> {
    return db
      .select()
      .from(investorMessages)
      .where(eq(investorMessages.investorId, userId))
      .orderBy(desc(investorMessages.createdAt));
  }

  // Secure Document Management
  async createSecureDocument(document: InsertSecureDocument): Promise<SecureDocument> {
    console.log("🔍 [STORAGE] Creating document with data:", JSON.stringify(document, null, 2));
    try {
      const [newDocument] = await db
        .insert(secureDocuments)
        .values(document)
        .returning();
      console.log("✅ [STORAGE] Document created successfully:", JSON.stringify(newDocument, null, 2));
      return newDocument;
    } catch (error) {
      console.error("❌ [STORAGE] Error creating document:", error);
      throw error;
    }
  }

  async getSecureDocumentById(id: number): Promise<SecureDocument | undefined> {
    const [document] = await db
      .select()
      .from(secureDocuments)
      .where(eq(secureDocuments.id, id));
    return document;
  }

  async getSecureDocumentsByInvestor(investorRequestId: string): Promise<SecureDocument[]> {
    // First, convert investor request ID to actual user ID
    const investorRequests = await this.getAllInvestorAccess();
    const investorRequest = investorRequests.find(inv => inv.id === parseInt(investorRequestId));
    
    if (!investorRequest) {
      console.log("⚠️ [STORAGE] Investor request not found for ID:", investorRequestId);
      return [];
    }
    
    const user = await this.getUserByEmail(investorRequest.email);
    if (!user) {
      console.log("⚠️ [STORAGE] User not found for email:", investorRequest.email);
      return [];
    }
    
    console.log("🔍 [STORAGE] Filtering documents for user ID:", user.id);
    
    // Get documents that the user has permission to access
    const documentsWithPermissions = await db
      .select({
        document: secureDocuments,
        permission: documentPermissions
      })
      .from(secureDocuments)
      .innerJoin(documentPermissions, eq(secureDocuments.id, documentPermissions.documentId))
      .where(and(
        eq(documentPermissions.investorId, user.id),
        eq(secureDocuments.isVisible, true)
      ))
      .orderBy(desc(secureDocuments.createdAt));
      
    console.log("✅ [STORAGE] Found", documentsWithPermissions.length, "documents with permissions for user:", user.id);
    return documentsWithPermissions.map(row => row.document);
  }

  async getAllSecureDocuments(): Promise<SecureDocument[]> {
    console.log("🔍 [STORAGE] Fetching all secure documents...");
    try {
      const documents = await db
        .select()
        .from(secureDocuments)
        .orderBy(desc(secureDocuments.createdAt));
      console.log("✅ [STORAGE] Found", documents.length, "documents");
      return documents;
    } catch (error) {
      console.error("❌ [STORAGE] Error fetching documents:", error);
      throw error;
    }
  }

  async updateSecureDocumentVisibility(id: number, isVisible: boolean): Promise<SecureDocument> {
    const [updatedDocument] = await db
      .update(secureDocuments)
      .set({ isVisible, updatedAt: new Date() })
      .where(eq(secureDocuments.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteSecureDocument(id: number): Promise<void> {
    // First delete all permissions for this document
    await db
      .delete(documentPermissions)
      .where(eq(documentPermissions.documentId, id));

    // Then delete the document
    await db
      .delete(secureDocuments)
      .where(eq(secureDocuments.id, id));
  }

  // Document Permissions
  async createDocumentPermission(permission: InsertDocumentPermission): Promise<DocumentPermission> {
    const [newPermission] = await db
      .insert(documentPermissions)
      .values(permission)
      .returning();
    return newPermission;
  }

  async getDocumentPermissions(documentId: number): Promise<DocumentPermission[]> {
    return db
      .select()
      .from(documentPermissions)
      .where(eq(documentPermissions.documentId, documentId));
  }

  async checkDocumentAccess(documentId: number, investorId: string): Promise<boolean> {
    const [permission] = await db
      .select()
      .from(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.investorId, investorId),
        eq(documentPermissions.canView, true)
      ));
    return !!permission;
  }

  async updateDocumentPermission(documentId: number, investorId: string, canView: boolean, canDownload: boolean, grantedBy: string): Promise<void> {
    // Try to update existing permission first
    const result = await db
      .update(documentPermissions)
      .set({ canView, canDownload })
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.investorId, investorId)
      ));

    // If no existing permission, create a new one
    if (result.rowCount === 0) {
      await db
        .insert(documentPermissions)
        .values({
          documentId,
          investorId,
          canView,
          canDownload,
          grantedBy
        });
    }
  }

  async removeDocumentPermission(documentId: number, investorId: string): Promise<void> {
    await db
      .delete(documentPermissions)
      .where(and(
        eq(documentPermissions.documentId, documentId),
        eq(documentPermissions.investorId, investorId)
      ));
  }

  async getInvestorDocumentsWithPermissions(investorId: string): Promise<(SecureDocument & { canView: boolean; canDownload: boolean })[]> {
    const results = await db
      .select({
        id: secureDocuments.id,
        title: secureDocuments.title,
        description: secureDocuments.description,
        fileName: secureDocuments.fileName,
        filePath: secureDocuments.filePath,
        fileSize: secureDocuments.fileSize,
        mimeType: secureDocuments.mimeType,
        uploadedBy: secureDocuments.uploadedBy,
        uploadedByRole: secureDocuments.uploadedByRole,
        ownerInvestorId: secureDocuments.ownerInvestorId,
        isVisible: secureDocuments.isVisible,
        createdAt: secureDocuments.createdAt,
        updatedAt: secureDocuments.updatedAt,
        canView: documentPermissions.canView,
        canDownload: documentPermissions.canDownload,
      })
      .from(secureDocuments)
      .innerJoin(documentPermissions, eq(secureDocuments.id, documentPermissions.documentId))
      .where(and(
        eq(documentPermissions.investorId, investorId),
        eq(secureDocuments.isVisible, true),
        eq(documentPermissions.canView, true)
      ))
      .orderBy(desc(secureDocuments.createdAt));

    // Also get documents owned by the investor
    const ownedDocuments = await db
      .select({
        id: secureDocuments.id,
        title: secureDocuments.title,
        description: secureDocuments.description,
        fileName: secureDocuments.fileName,
        filePath: secureDocuments.filePath,
        fileSize: secureDocuments.fileSize,
        mimeType: secureDocuments.mimeType,
        uploadedBy: secureDocuments.uploadedBy,
        uploadedByRole: secureDocuments.uploadedByRole,
        ownerInvestorId: secureDocuments.ownerInvestorId,
        isVisible: secureDocuments.isVisible,
        createdAt: secureDocuments.createdAt,
        updatedAt: secureDocuments.updatedAt,
        canView: sql<boolean>`true`,
        canDownload: sql<boolean>`true`,
      })
      .from(secureDocuments)
      .where(and(
        eq(secureDocuments.ownerInvestorId, investorId),
        eq(secureDocuments.isVisible, true)
      ))
      .orderBy(desc(secureDocuments.createdAt));

    // Combine results and remove duplicates
    const allDocuments = [...results, ...ownedDocuments];
    const uniqueDocuments = allDocuments.filter((doc, index, arr) => 
      arr.findIndex(d => d.id === doc.id) === index
    );

    return uniqueDocuments;
  }

  // Blog post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    return results[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return results[0];
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.category, category),
        eq(blogPosts.published, true)
      ))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const results = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return results[0];
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const results = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return results[0];
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
  }

  // Site settings operations
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const results = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    return results[0];
  }

  async upsertSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [result] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value: setting.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async deleteSiteSetting(key: string): Promise<void> {
    await db
      .delete(siteSettings)
      .where(eq(siteSettings.key, key));
  }

  async getAllMediaItems(): Promise<MediaItem[]> {
    return await db.select().from(mediaItems).orderBy(desc(mediaItems.createdAt));
  }

  async getMediaItem(id: number): Promise<MediaItem | undefined> {
    const [result] = await db
      .select()
      .from(mediaItems)
      .where(eq(mediaItems.id, id))
      .limit(1);
    return result;
  }

  async createMediaItem(item: InsertMediaItem): Promise<MediaItem> {
    const [result] = await db
      .insert(mediaItems)
      .values(item)
      .returning();
    return result;
  }

  async deleteMediaItem(id: number): Promise<void> {
    await db.delete(mediaItems).where(eq(mediaItems.id, id));
  }
}

export const storage = new DatabaseStorage();
