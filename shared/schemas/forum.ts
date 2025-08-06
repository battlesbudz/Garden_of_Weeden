import { pgTable, text, varchar, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./core";

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
  videoUrl: text("video_url"), // YouTube or other video URLs
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumComments: any = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  parentId: integer("parent_id"), // Will reference forumComments.id after declaration
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

// Insert schemas
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
  videoUrl: true,
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

// Types
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forumLikes.$inferSelect;