import type { CartItem } from "@nordstrand/shared";
import type { Product } from "@prisma/client";
import { AppError } from "../middleware/error-handler.js";
import { prisma } from "../lib/prisma.js";

export type ResolvedCartLine = {
  product: Product;
  quantity: number;
  lineTotalCents: number;
};

export async function resolveCartItems(
  items: CartItem[]
): Promise<ResolvedCartLine[]> {
  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  return items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new AppError(404, `Product not found: ${item.productId}`, "PRODUCT_NOT_FOUND");
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        409,
        `Insufficient stock for ${product.name}`,
        "INSUFFICIENT_STOCK"
      );
    }

    return {
      product,
      quantity: item.quantity,
      lineTotalCents: product.priceCents * item.quantity
    };
  });
}

export function cartTotalCents(lines: ResolvedCartLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
}

export async function decrementStock(lines: ResolvedCartLine[]) {
  for (const line of lines) {
    const updated = await prisma.product.updateMany({
      where: {
        id: line.product.id,
        stock: { gte: line.quantity }
      },
      data: {
        stock: { decrement: line.quantity }
      }
    });

    if (updated.count === 0) {
      throw new AppError(
        409,
        `Insufficient stock for ${line.product.name}`,
        "INSUFFICIENT_STOCK"
      );
    }
  }
}

export async function restoreStock(lines: ResolvedCartLine[]) {
  for (const line of lines) {
    await prisma.product.update({
      where: { id: line.product.id },
      data: { stock: { increment: line.quantity } }
    });
  }
}
