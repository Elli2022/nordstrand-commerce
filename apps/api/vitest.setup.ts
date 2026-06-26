import "dotenv/config";

process.env.DATABASE_URL ??=
  "postgresql://nordstrand:nordstrand@localhost:5432/nordstrand_test";
process.env.STRIPE_SECRET_KEY ??= "sk_test_ci_placeholder";
process.env.STRIPE_WEBHOOK_SECRET ??= "whsec_ci_placeholder";
process.env.CORS_ORIGIN ??= "http://localhost:3000";
