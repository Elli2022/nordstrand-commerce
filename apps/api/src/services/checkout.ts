import { checkoutSessionSchema } from "@nordstrand/shared";
import Stripe from "stripe";
import { checkoutMode, env } from "../config.js";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../middleware/error-handler.js";
import {
  cartTotalCents,
  decrementStock,
  resolveCartItems,
  restoreStock
} from "./inventory.js";
import {
  attachStripeSession,
  createPendingOrder,
  getOrderByStripeSession,
  markOrderCancelled,
  markOrderPaid,
  markOrderPaidById
} from "./orders.js";

export async function createCheckoutSession(input: unknown) {
  const payload = checkoutSessionSchema.parse(input);
  const lines = await resolveCartItems(payload.items);
  const totalCents = cartTotalCents(lines);

  const order = await createPendingOrder(
    lines,
    totalCents,
    payload.customerEmail
  );

  try {
    await decrementStock(lines);
  } catch (error) {
    await markOrderCancelledById(order.id);
    throw error;
  }

  if (checkoutMode === "demo") {
    await markOrderPaidById(order.id);

    return {
      orderId: order.id,
      checkoutUrl: `${env.CORS_ORIGIN}/checkout/success?orderId=${order.id}`,
      mode: "demo" as const
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.customerEmail,
      success_url: `${env.CORS_ORIGIN}/checkout/success?orderId=${order.id}`,
      cancel_url: `${env.CORS_ORIGIN}/checkout/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id
      },
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "sek",
          unit_amount: line.product.priceCents,
          product_data: {
            name: line.product.name,
            description: line.product.description,
            images: [
              line.product.imageUrl.startsWith("http")
                ? line.product.imageUrl
                : `${env.CORS_ORIGIN}${line.product.imageUrl}`
            ]
          }
        }
      }))
    });

    if (!session.url) {
      throw new AppError(500, "Stripe session missing redirect URL");
    }

    await attachStripeSession(order.id, session.id);

    return {
      orderId: order.id,
      checkoutUrl: session.url,
      mode: "stripe" as const
    };
  } catch (error) {
    await restoreStock(lines);
    await markOrderCancelledById(order.id);

    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      throw new AppError(
        503,
        "Stripe är inte konfigurerat. Lägg in riktiga testnycklar i .env eller använd CHECKOUT_MODE=demo.",
        "STRIPE_NOT_CONFIGURED"
      );
    }

    throw error;
  }
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string) {
  if (checkoutMode === "demo") {
    throw new AppError(
      400,
      "Webhooks är avstängda i demo-läge",
      "WEBHOOKS_DISABLED_IN_DEMO"
    );
  }

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await getOrderByStripeSession(session.id);

    if (!order) {
      throw new AppError(404, "Order not found for Stripe session");
    }

    if (order.status !== "PAID") {
      await markOrderPaid(session.id);
    }

    return { received: true, type: event.type };
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const order = await getOrderByStripeSession(session.id);

    if (order && order.status === "PENDING") {
      const lines = order.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        lineTotalCents: item.unitPriceCents * item.quantity
      }));

      await restoreStock(lines);
      await markOrderCancelled(session.id);
    }

    return { received: true, type: event.type };
  }

  return { received: true, type: event.type };
}

async function markOrderCancelledById(orderId: string) {
  const { prisma } = await import("../lib/prisma.js");
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" }
  });
}
