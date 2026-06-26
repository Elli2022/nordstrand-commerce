import "./load-env.js";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_PORT: z.coerce
    .number()
    .default(Number(process.env.PORT ?? 4000)),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().default("whsec_pending"),
  API_BASE_URL: z.string().url().default("http://localhost:4000"),
  CHECKOUT_MODE: z.enum(["stripe", "demo"]).optional()
});

export const env = envSchema.parse(process.env);

const stripeKeyLooksReal = /^sk_(test|live)_[A-Za-z0-9]{16,}$/.test(
  env.STRIPE_SECRET_KEY
);

export const checkoutMode =
  env.CHECKOUT_MODE ?? (stripeKeyLooksReal ? "stripe" : "demo");
