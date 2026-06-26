"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductDto } from "@nordstrand/shared";
import { ShopCatalog } from "@/components/shop-catalog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchProductsWithRetry(
  retries = 5,
  delayMs = 6000
): Promise<ProductDto[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(`${API_URL}/api/v1/products`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const json = await response.json();
      return json.data as ProductDto[];
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Failed to load products");

      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError ?? new Error("Failed to load products");
}

export function ShopCatalogLoader() {
  const [products, setProducts] = useState<ProductDto[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await fetchProductsWithRetry();
      setProducts(data);
    } catch {
      setProducts(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts, attempt]);

  if (loading) {
    return (
      <p className="text-[var(--muted)]">
        Laddar produkter… (första besöket kan ta upp till en minut)
      </p>
    );
  }

  if (error || products === null) {
    return (
      <div className="max-w-xl rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="mb-2 text-[var(--foreground)]">
          Butiken kunde inte nå API:t just nu.
        </p>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Render gratisplan sover efter inaktivitet — vänta en stund och försök
          igen.
        </p>
        <button
          type="button"
          onClick={() => setAttempt((value) => value + 1)}
          className="btn-primary text-sm"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return <ShopCatalog products={products} />;
}
