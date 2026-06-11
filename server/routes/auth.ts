import type { Express } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { isAuthenticated } from "../auth";
import { storage } from "../storage";
import { db } from "../db";
import { users } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateMeSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

function publicUser(user: any) {
  if (!user) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export function registerAuthRoutes(app: Express) {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await storage.getUser(userId);
      res.json(publicUser(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid login details" });

    passport.authenticate("local", (error: unknown, user: any) => {
      if (error) return next(error);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      req.login(user, async (loginError) => {
        if (loginError) return next(loginError);
        const dbUser = await storage.getUser(user.id);
        return res.json({ user: publicUser(dbUser) });
      });
    })(req, res, next);
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid registration details" });

      const { username, email, password, firstName, lastName } = parsed.data;
      const [existing] = await db
        .select()
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, email)))
        .limit(1);

      if (existing) return res.status(409).json({ message: "Username or email already exists" });

      const [created] = await db
        .insert(users)
        .values({
          id: `user_${nanoid(16)}`,
          username,
          email,
          passwordHash: await bcrypt.hash(password, 12),
          firstName,
          lastName,
          role: "customer",
        })
        .returning();

      req.login({ id: created.id }, (loginError) => {
        if (loginError) return next(loginError);
        return res.status(201).json({ user: publicUser(created) });
      });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/auth/me", isAuthenticated, async (req: any, res, next) => {
    try {
      const parsed = updateMeSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid account details" });

      const userId = req.user?.claims?.sub || req.user?.id;
      const current = userId ? await storage.getUser(userId) : undefined;
      if (!current) return res.status(401).json({ message: "Unauthorized" });

      const updates: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      for (const field of ["username", "email", "firstName", "lastName"] as const) {
        if (parsed.data[field] !== undefined) updates[field] = parsed.data[field] || null;
      }

      if (parsed.data.newPassword) {
        if (!current.passwordHash || !parsed.data.currentPassword) {
          return res.status(400).json({ message: "Current password is required" });
        }

        const valid = await bcrypt.compare(parsed.data.currentPassword, current.passwordHash);
        if (!valid) return res.status(403).json({ message: "Current password is incorrect" });

        updates.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
      }

      const [updated] = await db.update(users).set(updates).where(eq(users.id, current.id)).returning();
      res.json({ user: publicUser(updated) });
    } catch (error: any) {
      if (error?.code === "23505") {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => res.json({ ok: true }));
    });
  });
}
