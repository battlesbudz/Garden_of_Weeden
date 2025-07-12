import { 
  users, 
  newsletterSubscribers, 
  contactSubmissions,
  eventBookings,
  type User, 
  type InsertUser,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type ContactSubmission,
  type InsertContactSubmission,
  type EventBooking,
  type InsertEventBooking
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private eventBookings: Map<number, EventBooking>;
  private currentUserId: number;
  private currentSubscriberId: number;
  private currentSubmissionId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.newsletterSubscribers = new Map();
    this.contactSubmissions = new Map();
    this.eventBookings = new Map();
    this.currentUserId = 1;
    this.currentSubscriberId = 1;
    this.currentSubmissionId = 1;
    this.currentBookingId = 1;
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
}

export const storage = new MemStorage();
