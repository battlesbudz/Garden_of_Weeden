import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { paymentService } from "../payments/payment-service";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  billingAddress: z.string().optional(),
  paymentMethod: z.enum(["ach", "debit", "cash"]).default("ach"),
  notes: z.string().optional(),
});

// Helper to get cart session ID from cookie (consistent with cart.ts)
function getCartSessionId(req: Request): string | undefined {
  return req.cookies?.cartSessionId;
}

export function registerCheckoutRoutes(app: Express) {
  // Initialize payment service on startup
  paymentService.initialize().catch(console.error);

  // Get payment provider info (for frontend)
  app.get("/api/checkout/payment-info", async (req: Request, res: Response) => {
    try {
      res.json({
        provider: paymentService.getProviderName(),
        configured: paymentService.isConfigured(),
        methods: ["ach", "debit", "cash"],
      });
    } catch (error) {
      console.error("Error getting payment info:", error);
      res.status(500).json({ message: "Failed to get payment info" });
    }
  });

  // Process checkout
  app.post("/api/checkout", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const sessionId = getCartSessionId(req);
      
      // Validate checkout data
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid checkout data", errors: parsed.error.errors });
      }
      
      const checkoutData = parsed.data;
      
      // Get the cart
      const cart = await storage.getOrCreateCart(userId, sessionId);
      const cartWithItems = await storage.getCartWithItems(cart.id);
      
      if (!cartWithItems || cartWithItems.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Check stock availability before proceeding
      const stockCheck = await storage.checkStockAvailability(
        cartWithItems.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );
      
      if (!stockCheck.available) {
        const itemMessages = stockCheck.insufficientItems.map(item => 
          `${item.productName}: requested ${item.requested}, only ${item.available} available`
        );
        return res.status(400).json({ 
          message: "Insufficient stock for some items",
          insufficientItems: stockCheck.insufficientItems,
          details: itemMessages,
        });
      }
      
      // Calculate totals
      const subtotal = parseFloat(cartWithItems.total);
      const taxRate = 0.08; // 8% tax - adjust as needed for NY cannabis tax
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      
      // Create the order
      const order = await storage.createOrder({
        userId: userId || null,
        total: total.toFixed(2),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        customerName: checkoutData.customerName,
        customerEmail: checkoutData.customerEmail,
        customerPhone: checkoutData.customerPhone,
        shippingAddress: checkoutData.shippingAddress,
        billingAddress: checkoutData.billingAddress || checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        paymentProvider: paymentService.getProviderName(),
        notes: checkoutData.notes,
      });
      
      // Create order items
      for (const item of cartWithItems.items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: item.product?.name || "Product",
          quantity: item.quantity,
          price: item.priceAtAdd,
        });
      }
      
      // Process payment
      const paymentResult = await paymentService.createPayment({
        amount: Math.round(total * 100), // Convert to cents
        currency: "USD",
        customer: {
          email: checkoutData.customerEmail,
          name: checkoutData.customerName,
          phone: checkoutData.customerPhone,
          address: {
            street: checkoutData.shippingAddress,
            city: "",
            state: "",
            zipCode: "",
          },
        },
        orderId: order.id,
        lineItems: cartWithItems.items.map(item => ({
          productId: item.productId,
          name: item.product?.name || "Product",
          quantity: item.quantity,
          unitPrice: Math.round(parseFloat(item.priceAtAdd) * 100),
        })),
        paymentMethod: checkoutData.paymentMethod,
      });
      
      // Update order with payment result
      if (paymentResult.success) {
        // Only mark as paid if the payment is actually completed (verified by provider)
        // Pending payments remain pending until confirmed via webhook or status check
        const isPaid = paymentResult.status === "completed";
        
        await storage.updateOrderPayment(
          order.id,
          paymentResult.status,
          paymentResult.transactionId,
          isPaid ? new Date() : undefined
        );
        
        // Update order status based on payment status
        if (isPaid) {
          await storage.updateOrderStatus(order.id, "paid");
        } else {
          // Keep as pending - payment not yet verified
          await storage.updateOrderStatus(order.id, "pending");
        }
        
        // Deduct inventory from stock (order reserves the items)
        await storage.deductInventory(
          cartWithItems.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
        
        // Clear the cart after successful order placement
        await storage.clearCart(cart.id);
        
        res.json({
          success: true,
          orderId: order.id,
          paymentStatus: paymentResult.status,
          message: paymentResult.message,
          redirectUrl: paymentResult.redirectUrl,
        });
      } else {
        await storage.updateOrderStatus(order.id, "payment_failed");
        await storage.updateOrderPayment(order.id, "failed");
        
        res.status(400).json({
          success: false,
          orderId: order.id,
          message: paymentResult.error?.message || "Payment failed",
          error: paymentResult.error,
        });
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  // Get order details (for order confirmation page)
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only allow users to view their own orders (or if not logged in, by session match)
      const userId = (req as any).user?.claims?.sub;
      if (order.userId && order.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get order items with product details
      const items = await storage.getOrderItemsWithProducts(orderId);
      
      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get user's orders
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Payment webhook handler
  app.post("/api/webhooks/payment", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-payment-signature"] as string;
      const result = await paymentService.handleWebhook(req.body, signature);
      
      if (result.orderId && result.status) {
        const statusMap: Record<string, string> = {
          "completed": "completed",
          "failed": "failed",
          "refunded": "refunded",
          "pending": "processing",
        };
        
        await storage.updateOrderPayment(
          result.orderId,
          statusMap[result.status] || "processing",
          result.transactionId,
          result.status === "completed" ? new Date() : undefined
        );
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });
}
