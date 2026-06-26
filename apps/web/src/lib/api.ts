const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

import type { ProductDto } from "@nordstrand/shared";
import { catalogFallback } from "@/data/catalog-fallback";

const PRODUCTS_TIMEOUT_MS = 8_000;

export async function getProducts(): Promise<ProductDto[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/products`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(PRODUCTS_TIMEOUT_MS)
    });

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const json = await response.json();
    return json.data as ProductDto[];
  } catch {
    return catalogFallback;
  }
}

export async function getProduct(slug: string): Promise<ProductDto | null> {
  const response = await fetch(`${API_URL}/api/v1/products/${slug}`, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json.data;
}

export async function createCheckoutSession(items: {
  productId: string;
  quantity: number;
}[]) {
  const response = await fetch(`${API_URL}/api/v1/checkout/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error?.message ?? "Checkout failed");
  }

  return json.data as { orderId: string; checkoutUrl: string };
}

export async function getOrder(orderId: string) {
  const response = await fetch(`${API_URL}/api/v1/checkout/orders/${orderId}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json.data;
}
