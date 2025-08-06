import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./core";

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

// Calendar and meeting requests
export const meetingRequests = pgTable("meeting_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  topic: text("topic").notNull(),
  preferredDate: varchar("preferred_date", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 10 }).notNull(), // "30", "45", "60" minutes
  status: varchar("status", { length: 20 }).default("pending"), // "pending", "scheduled", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
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

export const insertMeetingRequestSchema = createInsertSchema(meetingRequests).pick({
  name: true,
  email: true,
  topic: true,
  preferredDate: true,
  duration: true,
});

// Types
export type InsertEventBooking = z.infer<typeof insertEventBookingSchema>;
export type EventBooking = typeof eventBookings.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertMeetingRequest = z.infer<typeof insertMeetingRequestSchema>;
export type MeetingRequest = typeof meetingRequests.$inferSelect;