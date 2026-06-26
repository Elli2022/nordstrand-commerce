import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();

describe("Products API", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    await prisma.product.create({
      data: {
        slug: "test-produkt",
        name: "Testprodukt",
        description: "En testprodukt",
        priceCents: 19900,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b8a2cf2?w=800",
        category: "Test"
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("lists products", async () => {
    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].slug).toBe("test-produkt");
  });

  it("returns a product by slug", async () => {
    const response = await request(app).get("/api/v1/products/test-produkt");

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Testprodukt");
  });

  it("returns 404 for unknown slug", async () => {
    const response = await request(app).get("/api/v1/products/unknown");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("PRODUCT_NOT_FOUND");
  });
});

describe("Checkout API", () => {
  let productId = "";

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    const product = await prisma.product.create({
      data: {
        slug: "checkout-test",
        name: "Checkout Test",
        description: "For checkout tests",
        priceCents: 9900,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b8a2cf2?w=800",
        category: "Test"
      }
    });

    productId = product.id;

    vi.resetModules();
    vi.doMock("../lib/stripe.js", () => ({
      stripe: {
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue({
              id: "cs_test_123",
              url: "https://checkout.stripe.com/test"
            })
          }
        },
        webhooks: {
          constructEvent: vi.fn()
        }
      }
    }));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects checkout when stock is insufficient", async () => {
    const response = await request(app)
      .post("/api/v1/checkout/sessions")
      .send({
        items: [{ productId, quantity: 10 }]
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INSUFFICIENT_STOCK");
  });

  it("validates checkout payload", async () => {
    const response = await request(app)
      .post("/api/v1/checkout/sessions")
      .send({ items: [] });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
