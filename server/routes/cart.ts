import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import crypto from "crypto";
import { getSessionUserId } from "../auth";

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
      const userId = getSessionUserId(req);
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
      const userId = getSessionUserId(req);
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
      
      // Check if sufficient stock is available
      const availableQty = shopItem.shopQuantity || 0;
      if (availableQty < quantity) {
        return res.status(400).json({ 
          message: availableQty === 0 
            ? `${product.name} is out of stock` 
            : `Only ${availableQty} units of ${product.name} available`,
          availableQuantity: availableQty,
        });
      }
      
      const price = shopItem.shopPrice || product.price;
      
      const cart = await storage.getOrCreateCart(userId, sessionId);
      
      // Check if updating would exceed available stock (for existing cart items)
      const existingCart = await storage.getCartWithItems(cart.id);
      const existingItem = existingCart?.items.find(item => item.productId === productId);
      const totalRequestedQty = (existingItem?.quantity || 0) + quantity;
      
      if (totalRequestedQty > availableQty) {
        return res.status(400).json({ 
          message: `Cannot add ${quantity} more. You already have ${existingItem?.quantity || 0} in cart, and only ${availableQty} total available.`,
          availableQuantity: availableQty,
          currentInCart: existingItem?.quantity || 0,
        });
      }
      
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
      if (Number.isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid cart item id" });
      }
      
      const parsed = updateQuantitySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request body", errors: parsed.error.errors });
      }
      
      const { quantity } = parsed.data;
      
      if (quantity === 0) {
        const userId = getSessionUserId(req);
        const sessionId = getCartSessionId(req, res);
        const cart = await storage.getOrCreateCart(userId, sessionId);
        const existingCart = await storage.getCartWithItems(cart.id);
        const cartItem = existingCart?.items.find(item => item.id === itemId);

        if (!cartItem) {
          return res.status(404).json({ message: "Cart item not found" });
        }

        await storage.removeFromCart(itemId);
      } else {
        // Get the cart item to check the product and shop item
        const userId = getSessionUserId(req);
        const sessionId = getCartSessionId(req, res);
        const cart = await storage.getOrCreateCart(userId, sessionId);
        const existingCart = await storage.getCartWithItems(cart.id);
        const cartItem = existingCart?.items.find(item => item.id === itemId);

        if (!cartItem) {
          return res.status(404).json({ message: "Cart item not found" });
        }
        
        if (cartItem) {
          // Check stock availability
          const shopItem = await storage.getShopItem(cartItem.shopItemId);
          const product = await storage.getProduct(cartItem.productId);
          const availableQty = shopItem?.shopQuantity || 0;
          
          if (quantity > availableQty) {
            return res.status(400).json({ 
              message: `Only ${availableQty} units of ${product?.name || 'this item'} available`,
              availableQuantity: availableQty,
            });
          }
        }
        
        await storage.updateCartItemQuantity(itemId, quantity);
      }
      
      // Get the user's cart and return it
      const userId = getSessionUserId(req);
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
      if (Number.isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid cart item id" });
      }
      
      const userId = getSessionUserId(req);
      const sessionId = getCartSessionId(req, res);
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const existingCart = await storage.getCartWithItems(cart.id);
      const cartItem = existingCart?.items.find(item => item.id === itemId);

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      await storage.removeFromCart(itemId);
      
      // Get the user's cart and return it
      const updatedCart = await storage.getOrCreateCart(userId, sessionId);
      const cartWithItems = await storage.getCartWithItems(updatedCart.id);
      
      res.json(cartWithItems);
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Clear cart
  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      const userId = getSessionUserId(req);
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
