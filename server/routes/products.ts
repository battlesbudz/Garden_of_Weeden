import type { Express } from "express";
import { storage } from "../storage";

export function registerProductRoutes(app: Express) {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      // Calculate total first
      let total = 0;
      const items = req.body.items || [];
      
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          total += itemTotal;
        }
      }

      // Create order with calculated total
      const orderData = {
        customerEmail: req.body.customerInfo?.email || "guest@battlesbudz.com",
        customerName: req.body.customerInfo?.name || "Guest",
        shippingAddress: req.body.customerInfo?.address || "",
        total: total.toFixed(2),
        status: "pending" as const,
      };

      const order = await storage.createOrder(orderData);

      // Create order items
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          });
        }
      }

      res.json({ message: "Order placed successfully", orderId: order.id });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
}
