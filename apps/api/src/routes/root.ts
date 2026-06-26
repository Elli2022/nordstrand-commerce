import { Router, type Request, type Response } from "express";

export const rootRouter = Router();

rootRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    service: "nordstrand-api",
    status: "ok",
    message: "REST API — öppna butiken på http://localhost:3000",
    docs: {
      health: "GET /health",
      products: "GET /api/v1/products",
      product: "GET /api/v1/products/:slug",
      checkout: "POST /api/v1/checkout/sessions",
      order: "GET /api/v1/checkout/orders/:orderId"
    }
  });
});
