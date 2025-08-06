
import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";

export function registerGamificationRoutes(app: Express) {
  // Get user points and stats (authenticated users only)
  app.get("/api/gamification/points", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Update user activity for daily login tracking
      await storage.updateUserActivity(userId);
      
      const userPoints = await storage.getUserPoints(userId);
      if (!userPoints) {
        return res.status(404).json({ message: "User points not found" });
      }
      
      res.json(userPoints);
    } catch (error) {
      console.error("Error fetching user points:", error);
      res.status(500).json({ message: "Failed to fetch user points" });
    }
  });

  // Get user point transactions history (authenticated users only)
  app.get("/api/gamification/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching point transactions:", error);
      res.status(500).json({ message: "Failed to fetch point transactions" });
    }
  });

  // Get all achievements
  app.get("/api/gamification/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user achievements (authenticated users only)
  app.get("/api/gamification/user-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Check and unlock achievements (authenticated users only)
  app.post("/api/gamification/check-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unlockedAchievements = await storage.checkAndUnlockAchievements(userId);
      res.json({ unlockedAchievements });
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Get leaderboard
  app.get("/api/gamification/leaderboard", async (req, res) => {
    try {
      const timeframe = req.query.timeframe as 'weekly' | 'monthly' | 'allTime' || 'allTime';
      const leaderboard = await storage.getLeaderboard(timeframe);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Initialize default achievements (admin only)
  app.post("/api/gamification/init-achievements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.initializeDefaultAchievements();
      res.json({ message: "Default achievements initialized successfully" });
    } catch (error) {
      console.error("Error initializing achievements:", error);
      res.status(500).json({ message: "Failed to initialize achievements" });
    }
  });
}
