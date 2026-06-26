"use client";

import { formatPrice } from "@nordstrand/shared";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/product-actions";
import { ProductImage } from "@/components/product-image";
import type { ProductDto } from "@nordstrand/shared";

export function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${slug}`
      );

      if (!response.ok) {
        setProduct(null);
      } else {
        const json = await response.json();
        setProduct(json.data);
      }

      setLoading(false);
    }

    load();
  }, [slug]);

  if (loading) {
    return <p className="text-[var(--muted)]">Laddar produkt...</p>;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--border)]">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          {product.category}
        </p>
        <h1 className="font-display mb-4 text-4xl sm:text-5xl">{product.name}</h1>
        <p className="mb-6 text-lg leading-relaxed text-[var(--muted)]">
          {product.description}
        </p>
        <p className="mb-2 text-3xl font-semibold">{formatPrice(product.priceCents)}</p>
        <p className="mb-8 text-sm font-medium text-[var(--success)]">
          {product.stock > 0 ? `${product.stock} i lager — skickas inom 1–2 vardagar` : "Slut i lager"}
        </p>
        <AddToCartButton productId={product.id} disabled={product.stock <= 0} />
        <div className="mt-8 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">
          <p>✓ Säker betalning med Stripe</p>
          <p>✓ Klarna och Apple Pay i checkout</p>
          <p>✓ 30 dagars öppet köp</p>
        </div>
      </div>
    </div>
  );
}
