"use client";

import { formatPrice } from "@nordstrand/shared";
import type { ProductDto } from "@nordstrand/shared";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";

export function CartPageClient() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`
      );
      const json = await response.json();
      setProducts(json.data);
    }

    load();
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
          lineTotal: product.priceCents * item.quantity
        };
      })
      .filter(Boolean);
  }, [items, products]);

  const totalCents = lines.reduce((sum, line) => sum + (line?.lineTotal ?? 0), 0);

  async function handleCheckout() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/checkout/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items })
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message ?? "Checkout misslyckades");
      }

      clearCart();
      window.location.href = json.data.checkoutUrl;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout misslyckades"
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display mb-4 text-4xl">Varukorg</h1>
        <p className="mb-6 text-[var(--muted)]">Din varukorg är tom.</p>
        <Link href="/" className="btn-primary">
          Fortsätt handla
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display mb-8 text-4xl">Varukorg</h1>

      <div className="space-y-4">
        {lines.map((line) =>
          line ? (
            <article
              key={line.productId}
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={line.product.imageUrl}
                  alt={line.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl">{line.product.name}</h2>
                  <p className="text-sm text-[var(--muted)]">
                    {formatPrice(line.product.priceCents)} / st
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={line.product.stock}
                    value={line.quantity}
                    onChange={(event) =>
                      updateQuantity(line.productId, Number(event.target.value))
                    }
                    className="w-16 rounded-lg border border-[var(--border)] px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    className="text-sm text-[var(--muted)] underline"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </article>
          ) : null
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Totalt att betala</p>
            <p className="text-3xl font-semibold">{formatPrice(totalCents)}</p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading || lines.length === 0}
            className="btn-primary min-w-[220px] disabled:opacity-50"
          >
            {loading ? "Öppnar betalning..." : "Gå till betalning"}
          </button>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Betala säkert med kort, Apple Pay eller Klarna via Stripe.
        </p>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
