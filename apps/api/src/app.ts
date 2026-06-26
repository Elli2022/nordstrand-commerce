import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config.js";
import { errorHandler } from "./middleware/error-handler.js";
import { checkoutRouter } from "./routes/checkout.js";
import { healthRouter } from "./routes/health.js";
import { productsRouter } from "./routes/products.js";
import { rootRouter } from "./routes/root.js";
import { webhooksRouter } from "./routes/webhooks.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"]
    })
  );

  app.use("/api/v1/webhooks/stripe", express.raw({ type: "application/json" }));
  app.use(express.json());

  app.use("/", rootRouter);
  app.use("/health", healthRouter);
  app.use("/api/v1/products", productsRouter);
  app.use("/api/v1/checkout", checkoutRouter);
  app.use("/api/v1/webhooks", webhooksRouter);

  app.use(errorHandler);

  return app;
}
