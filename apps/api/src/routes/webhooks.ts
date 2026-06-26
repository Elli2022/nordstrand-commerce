import { Router } from "express";
import { handleStripeWebhook } from "../services/checkout.js";
import { AppError } from "../middleware/error-handler.js";

export const webhooksRouter = Router();

webhooksRouter.post("/stripe", async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      throw new AppError(400, "Missing Stripe signature");
    }

    const result = await handleStripeWebhook(req.body as Buffer, signature);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
