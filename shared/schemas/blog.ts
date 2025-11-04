import { pgTable, text, serial, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    featuredImage: text("featured_image"),
    author: text("author").notNull(),
    category: text("category").notNull(),
    tags: text("tags").array().default([]),
    publishedAt: timestamp("published_at"),
    updatedAt: timestamp("updated_at").defaultNow(),
    published: boolean("published").default(false).notNull(),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords").array().default([]),
  },
  (table) => [
    index("idx_blog_posts_slug").on(table.slug),
    index("idx_blog_posts_published").on(table.published),
    index("idx_blog_posts_category").on(table.category),
  ]
);

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
