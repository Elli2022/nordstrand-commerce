"use client";

import { useMemo, useState } from "react";
import type { ProductDto } from "@nordstrand/shared";
import { ProductCard } from "@/components/product-actions";

const categories = ["Alla", "Textil", "Keramik", "Hem", "Kök"] as const;

export function ShopCatalog({ products }: { products: ProductDto[] }) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Alla");

  const filtered = useMemo(() => {
    if (activeCategory === "Alla") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${activeCategory === category ? "chip-active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">Inga produkter i den här kategorin just nu.</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}
