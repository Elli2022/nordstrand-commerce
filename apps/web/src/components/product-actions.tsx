"use client";

import { formatPrice } from "@nordstrand/shared";
import type { ProductDto } from "@nordstrand/shared";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

export function AddToCartButton({
  productId,
  disabled = false,
  label = "Lägg i varukorg",
  className = "btn-primary w-full sm:w-auto"
}: {
  productId: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={className}
    >
      {added ? "Tillagd i varukorg ✓" : label}
    </button>
  );
}

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          {product.category}
        </p>
        <h2 className="font-display mb-2 text-2xl">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h2>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
          <Link href={`/products/${product.slug}`} className="btn-secondary text-sm">
            Se produkt
          </Link>
        </div>
      </div>
    </article>
  );
}
