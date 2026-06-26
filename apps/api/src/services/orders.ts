import type { Order, OrderItem, Product } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { ResolvedCartLine } from "./inventory.js";

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export async function createPendingOrder(
  lines: ResolvedCartLine[],
  totalCents: number,
  customerEmail?: string
) {
  return prisma.order.create({
    data: {
      status: "PENDING",
      customerEmail,
      totalCents,
      items: {
        create: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
          unitPriceCents: line.product.priceCents
        }))
      }
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

export async function attachStripeSession(orderId: string, sessionId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { stripeSessionId: sessionId }
  });
}

export async function markOrderPaid(sessionId: string) {
  return prisma.order.update({
    where: { stripeSessionId: sessionId },
    data: { status: "PAID" }
  });
}

export async function markOrderPaidById(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" }
  });
}

export async function markOrderCancelled(sessionId: string) {
  return prisma.order.update({
    where: { stripeSessionId: sessionId },
    data: { status: "CANCELLED" }
  });
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

export async function getOrderByStripeSession(
  sessionId: string
): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}
