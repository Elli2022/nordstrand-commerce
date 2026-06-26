import { Router } from "express";
import { createCheckoutSession } from "../services/checkout.js";
import { getOrderById } from "../services/orders.js";
import { AppError } from "../middleware/error-handler.js";

export const checkoutRouter = Router();

checkoutRouter.post("/sessions", async (req, res, next) => {
  try {
    const result = await createCheckoutSession(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
});

checkoutRouter.get("/orders/:orderId", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.orderId);

    if (!order) {
      throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    res.json({
      data: {
        id: order.id,
        status: order.status,
        totalCents: order.totalCents,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});
