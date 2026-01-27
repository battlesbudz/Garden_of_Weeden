import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import crypto from "crypto";

const addToCartSchema = z.object({
  productId: z.number(),
  shopItemId: z.number(),
  quantity: z.number().min(1).default(1),
});

const updateQuantitySchema = z.object({
  quantity: z.number().min(0),
});

// Helper to get or create a cart session ID for anonymous users
function getCartSessionId(req: Request, res: Response): string {
  let cartSessionId = req.cookies?.cartSessionId;
  
  if (!cartSessionId) {
    // Generate a new cart session ID
    cartSessionId = crypto.randomBytes(16).toString("hex");
    // Set cookie that lasts 30 days
    res.cookie("cartSessionId", cartSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
  
  return cartSessionId;
}

export function registerCartRoutes(app: Express) {
  // Get or create cart for current user/session
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const sessionId = getCartSessionId(req, res);
      
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const cartWithItems = await storage.getCartWithItems(cart.id);
      
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  // Add item to cart
  app.post("/api/cart/items", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const sessionId = getCartSessionId(req, res);
      
      const parsed = addToCartSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request body", errors: parsed.error.errors });
      }
      
      const { productId, shopItemId, quantity } = parsed.data;
      
      // Get the shop item to get the price
      const shopItem = await storage.getShopItem(shopItemId);
      if (!shopItem || !shopItem.isActive) {
        return res.status(404).json({ message: "Shop item not found or inactive" });
      }
      
      // Get the product to verify it exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const price = shopItem.shopPrice || product.price;
      
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const cartItem = await storage.addToCart(cart.id, productId, shopItemId, quantity, price);
      
      // Return updated cart
      const cartWithItems = await storage.getCartWithItems(cart.id);
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/items/:itemId", async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      
      const parsed = updateQuantitySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request body", errors: parsed.error.errors });
      }
      
      const { quantity } = parsed.data;
      
      if (quantity === 0) {
        await storage.removeFromCart(itemId);
      } else {
        await storage.updateCartItemQuantity(itemId, quantity);
      }
      
      // Get the user's cart and return it
      const userId = (req as any).user?.id;
      const sessionId = getCartSessionId(req, res);
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const cartWithItems = await storage.getCartWithItems(cart.id);
      
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/items/:itemId", async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      
      await storage.removeFromCart(itemId);
      
      // Get the user's cart and return it
      const userId = (req as any).user?.id;
      const sessionId = getCartSessionId(req, res);
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const cartWithItems = await storage.getCartWithItems(cart.id);
      
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Clear cart
  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const sessionId = getCartSessionId(req, res);
      
      const cart = await storage.getOrCreateCart(userId, sessionId);
      await storage.clearCart(cart.id);
      
      const cartWithItems = await storage.getCartWithItems(cart.id);
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
}
