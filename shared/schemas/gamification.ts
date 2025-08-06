import { pgTable, text, varchar, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./core";

// Gamification system tables
export const userPoints = pgTable("user_points", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  currentLevel: integer("current_level").default(1).notNull(),
  pointsToNextLevel: integer("points_to_next_level").default(100).notNull(),
  weeklyPoints: integer("weekly_points").default(0).notNull(),
  monthlyPoints: integer("monthly_points").default(0).notNull(),
  streak: integer("streak").default(0).notNull(), // Daily activity streak
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull(), // Can be positive or negative
  action: varchar("action", { length: 50 }).notNull(), // "post_created", "comment_added", "like_given", "daily_login", etc.
  relatedId: integer("related_id"), // ID of related post, comment, etc.
  relatedType: varchar("related_type", { length: 20 }), // "post", "comment", "booking", etc.
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  badgeIcon: varchar("badge_icon", { length: 50 }).notNull(), // Icon name for the badge
  badgeColor: varchar("badge_color", { length: 20 }).default("battles-gold").notNull(),
  category: varchar("category", { length: 30 }).notNull(), // "participation", "knowledge", "community", "milestone"
  requirement: jsonb("requirement").notNull(), // JSON defining the requirement (e.g., {type: "posts", count: 10})
  pointsReward: integer("points_reward").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weeklyRank: integer("weekly_rank"),
  monthlyRank: integer("monthly_rank"),
  allTimeRank: integer("all_time_rank"),
  weeklyPoints: integer("weekly_points").default(0),
  monthlyPoints: integer("monthly_points").default(0),
  allTimePoints: integer("all_time_points").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserPointsSchema = createInsertSchema(userPoints).pick({
  userId: true,
  totalPoints: true,
  currentLevel: true,
  pointsToNextLevel: true,
  weeklyPoints: true,
  monthlyPoints: true,
  streak: true,
  lastActivityDate: true,
});

export const insertPointTransactionSchema = createInsertSchema(pointTransactions).pick({
  userId: true,
  points: true,
  action: true,
  relatedId: true,
  relatedType: true,
  description: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  name: true,
  description: true,
  badgeIcon: true,
  badgeColor: true,
  category: true,
  requirement: true,
  pointsReward: true,
  isActive: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
});

// Types
export type InsertUserPoints = z.infer<typeof insertUserPointsSchema>;
export type UserPoints = typeof userPoints.$inferSelect;
export type InsertPointTransaction = z.infer<typeof insertPointTransactionSchema>;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Leaderboard = typeof leaderboard.$inferSelect;